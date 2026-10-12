#!/usr/bin/env python3
"""
Pick a safe, on-topic Unsplash cover image for a blog post.

Reads IMAGE_QUERY, TITLE, DESCRIPTION, UNSPLASH_ACCESS_KEY and ANTHROPIC_API_KEY
from the environment. Prints the chosen image URL to stdout; logs go to stderr.

Searching on the raw post title produced literal mismatches ("deck" -> house
decks, "slide" -> playground slides) and photos containing non-English text, so
candidates are filtered on their metadata, de-duplicated against images already
on the blog, then checked visually by Claude before one is used.
"""

import glob
import json
import os
import re
import sys
import urllib.parse
import urllib.request

BLOG_DIR = "content/blog"

# Hand-vetted images: business context, no visible non-English text.
SAFE_FALLBACKS = [
    "photo-1556155092-490a1ba16284",
    "photo-1499750310107-5fef28a66643",
    "photo-1533750516457-a7f992034fec",
    "photo-1512758017271-d7b84c2113f1",
    "photo-1561489413-985b06da5bee",
    "photo-1454165804606-c3d57bc86b40",
    "photo-1521737852567-6949f3f9f2b5",
    "photo-1568992687947-868a62a9f521",
    "photo-1541746972996-4e0b0f43e02a",
    "photo-1444653389962-8149286c578a",
]

GENERIC_QUERIES = [
    "business team meeting laptop office",
    "professional working on laptop desk",
    "colleagues reviewing documents meeting room",
]

# Words whose photo meaning has nothing to do with presentation work.
BANNED_WORDS = [
    "deck chair", "decking", "patio", "porch", "terrace", "backyard", "garden",
    "house", "home exterior", "cabin", "boat", "ship", "yacht", "sailing",
    "playground", "water slide", "slide park", "children", "kids", "child",
    "pool", "beach", "cards", "playing card", "tarot", "skateboard", "deck of",
    "wedding", "bedroom", "kitchen", "food", "pet", "dog", "cat",
]

# Scripts other than Latin in metadata usually mean visible foreign text in the photo.
NON_LATIN = re.compile(
    r"[Ѐ-ӿ֐-׿؀-ۿऀ-ॿ฀-๿"
    r"぀-ヿ㐀-䶿一-鿿가-힯]"
)

PHOTO_ID = re.compile(r"photo-[0-9a-f]+-[0-9a-f]+")

MODEL = "claude-opus-5-5"


def log(msg):
    print(msg, file=sys.stderr)


def to_url(photo_id):
    return f"https://images.unsplash.com/{photo_id}?w=1200&auto=format&q=80"


def used_photo_ids():
    ids = set()
    for path in glob.glob(f"{BLOG_DIR}/*.md"):
        with open(path, encoding="utf-8") as fp:
            for line in fp:
                if line.startswith("image:"):
                    m = PHOTO_ID.search(line)
                    if m:
                        ids.add(m.group(0))
                    break
    return ids


def http_json(url, headers=None, data=None, timeout=30):
    req = urllib.request.Request(url, data=data, headers=headers or {})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read())


def search_unsplash(query, key):
    params = urllib.parse.urlencode({
        "query": query,
        "per_page": 20,
        "orientation": "landscape",
        "content_filter": "high",
    })
    try:
        data = http_json(
            f"https://api.unsplash.com/search/photos?{params}",
            headers={"Authorization": f"Client-ID {key}", "Accept-Version": "v1"},
        )
        return data.get("results", [])
    except Exception as e:
        log(f"Unsplash search failed for '{query}': {e}")
        return []


def metadata_text(photo):
    parts = [photo.get("alt_description") or "", photo.get("description") or ""]
    parts += [t.get("title", "") for t in photo.get("tags", []) if isinstance(t, dict)]
    return " ".join(parts).lower()


def rejection_reason(photo, used):
    raw = (photo.get("urls") or {}).get("raw", "")
    if photo.get("premium") or "plus.unsplash.com" in raw:
        return "Unsplash+ premium image"
    m = PHOTO_ID.search(raw)
    if not m:
        return "unrecognised image URL"
    if m.group(0) in used:
        return "already used on the blog"
    text = metadata_text(photo)
    if NON_LATIN.search(text):
        return "non-English text in metadata"
    for word in BANNED_WORDS:
        if re.search(rf"\b{re.escape(word)}\b", text):
            return f"off-topic subject ({word})"
    return None


def gather_candidates(queries, key, used, limit=8):
    seen, candidates = set(), []
    for query in queries:
        for photo in search_unsplash(query, key):
            pid = photo.get("id")
            if pid in seen:
                continue
            seen.add(pid)
            reason = rejection_reason(photo, used)
            if reason:
                log(f"  skip {pid}: {reason}")
                continue
            candidates.append(photo)
            if len(candidates) >= limit:
                return candidates
    return candidates


VISION_PROMPT = """You are choosing the cover photo for a short article on a professional B2B website.
The company makes a bespoke PowerPoint toolbar for firms of 100 to 1,500 people. Its readers are business, marketing and design professionals.

Article title: {title}
Article summary: {description}

Below are {n} candidate photos, numbered 0 to {last} in order.

Reject any photo that:
- shows any visible writing that is not in English (for example Chinese, Japanese, Korean, Arabic or Cyrillic text);
- contains profanity, jokes, memes, or anything unprofessional;
- matches a different meaning of a word in the title, e.g. a house or garden deck, a boat deck, a playground or water slide, a deck of playing cards;
- shows children, homes, holidays, food or pets;
- is a screenshot of software or a slide with unreadable, foreign or nonsensical content;
- would look odd or off-topic to a business reader of this article.

Prefer photos of people at work, meetings, presentations, desks with laptops, or design and planning work, that fit the article.

Reply with JSON only, no other text: {{"index": <number of the best acceptable photo, or null if none are acceptable>, "reason": "<one short sentence>"}}"""


def choose_with_claude(candidates, title, description, api_key):
    content = []
    for photo in candidates:
        content.append({"type": "image", "source": {"type": "url", "url": photo["urls"]["small"]}})
    content.append({"type": "text", "text": VISION_PROMPT.format(
        title=title, description=description or "Not supplied.", n=len(candidates), last=len(candidates) - 1,
    )})
    payload = {
        "model": MODEL,
        "max_tokens": 4000,
        "output_config": {"effort": "low"},
        "fallbacks": "default",
        "messages": [{"role": "user", "content": content}],
    }
    try:
        result = http_json(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "anthropic-beta": "server-side-fallback-2026-07-01",
                "content-type": "application/json",
            },
            data=json.dumps(payload).encode(),
            timeout=120,
        )
    except Exception as e:
        log(f"Image check failed: {e}")
        return None

    if result.get("stop_reason") == "refusal":
        log("Image check was declined.")
        return None
    text = "".join(b.get("text", "") for b in result.get("content", []) if b.get("type") == "text")
    m = re.search(r"\{.*\}", text, re.S)
    if not m:
        log(f"Image check returned no JSON: {text[:200]}")
        return None
    try:
        verdict = json.loads(m.group(0))
    except json.JSONDecodeError:
        log(f"Image check returned invalid JSON: {m.group(0)[:200]}")
        return None
    log(f"Image check: {verdict}")
    index = verdict.get("index")
    if isinstance(index, int) and 0 <= index < len(candidates):
        return candidates[index]
    return None


def track_download(photo, key):
    # Unsplash API guidelines ask for a download event when a photo is used.
    location = (photo.get("links") or {}).get("download_location")
    if not location:
        return
    try:
        http_json(location, headers={"Authorization": f"Client-ID {key}"}, timeout=10)
    except Exception:
        pass


def fallback_url(used):
    for pid in SAFE_FALLBACKS:
        if pid not in used:
            return to_url(pid)
    return to_url(SAFE_FALLBACKS[0])


def main():
    title = os.environ.get("TITLE", "")
    description = os.environ.get("DESCRIPTION", "")
    query = os.environ.get("IMAGE_QUERY", "").strip()
    unsplash_key = os.environ.get("UNSPLASH_ACCESS_KEY", "")
    anthropic_key = os.environ.get("ANTHROPIC_API_KEY", "")
    used = used_photo_ids()

    if not unsplash_key or not anthropic_key:
        log("Missing Unsplash or Anthropic key, using a vetted fallback image.")
        print(fallback_url(used))
        return

    queries = [q for q in [query] if q] + GENERIC_QUERIES
    log(f"Image queries: {queries}")
    candidates = gather_candidates(queries, unsplash_key, used)
    log(f"{len(candidates)} candidates passed the metadata filters.")

    chosen = choose_with_claude(candidates, title, description, anthropic_key) if candidates else None
    if not chosen:
        url = fallback_url(used)
        log(f"No candidate approved, using vetted fallback: {url}")
        print(url)
        return

    track_download(chosen, unsplash_key)
    photo_id = PHOTO_ID.search(chosen["urls"]["raw"]).group(0)
    url = to_url(photo_id)
    log(f"Chosen image: {url} ({chosen.get('alt_description')})")
    print(url)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log(f"Image picker crashed ({e}), using a vetted fallback image.")
        print(fallback_url(used_photo_ids()))
