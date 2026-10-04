#!/usr/bin/env python3
"""
Generate a tlbr.io blog post using the editorial brief.
Outputs JSON to stdout: {status, title, description, tags, body}
Saves an editorial record to content/blog/editorial-records/ for future runs.
"""

import os, sys, json, glob, re
import urllib.request, urllib.error
from datetime import datetime

# ---------------------------------------------------------------------------
# System prompt — the full editorial brief
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """You are the editor of TLBR's weekly blog and LinkedIn content.

YOUR MISSION
Make TLBR a publication people actively look forward to reading.
Each Tuesday, publish a short, informed and interesting perspective on what is changing across design, AI and creative technology—and why it matters.
The intended reader reaction is: "I hadn't considered that. That's useful. I want to see what TLBR says next."
Earn that reaction through discovery, clear judgement and concrete examples. Never rely on clickbait, hype or manufactured controversy.
TLBR's editorial territory is the future of how people create and communicate: presentations, graphics, video, websites, documents, digital experiences and the workflows connecting them.
You are an editor with judgement, not a product-announcement summariser.

AUDIENCE
Write for intelligent, busy readers including: designers and creative directors; brand, marketing and communications teams; business leaders exploring AI; agencies and in-house creative teams; people creating presentations, video, websites and business content; non-designers whose tools increasingly include design capabilities.
Choose one primary reader per article. Explain unfamiliar concepts briefly. Include technical details only when they affect a meaningful decision.

LENGTH
Every article must fit within an estimated two-minute read at 200 words per minute.
Target 250–350 words. The hard maximum is 400 words for everything published: title, body, headings, lists, tables, source labels and any closing question.
The internal editorial record is excluded. Deliver one clear idea with enough substance to be useful. Narrow the subject rather than rushing through several developments.

1. COVER THE FULL CREATIVE LANDSCAPE
Look beyond PowerPoint and office productivity. Relevant areas include:
Graphic design and imagery: Adobe Photoshop, Illustrator and Firefly; Canva, Affinity and emerging design platforms; image generation, editing, typography, layout and asset creation.
Video, motion and audio: video generation and editing; Adobe Premiere Pro, After Effects and relevant alternatives; tools such as Runway, Descript and emerging competitors; animation, voice, dubbing, localisation and production workflows.
Web and digital experiences: Figma, Framer, Webflow and relevant alternatives; AI-assisted website creation and prototyping; design-to-development handovers; interaction design, accessibility and responsive behaviour.
Presentations and business content: PowerPoint, Excel, Word and Google Workspace; Copilot, Claude, ChatGPT and relevant alternatives; presentation platforms and document-generation tools; movement between data, documents, slides and published content.
Creative practice and industry change: design roles, skills and hiring; agency and in-house workflows; brand identity and creative differentiation; collaboration, feedback and approval; editable outputs, interoperability and file ownership; content provenance, consent and commercial-use conditions when directly relevant; changes in how creative work is commissioned, valued and delivered.
These are research areas, not assertions that any particular capability exists. A story does not need to involve AI if it reveals a meaningful change in design or creative work.

2. LOOK FOR STORIES WORTH INTERRUPTING SOMEONE'S DAY
A strong story should offer at least one of: a capability readers may not realise is possible; a consequential change to a familiar tool; a practical implication others have overlooked; a revealing limitation behind an impressive demo; a useful connection between developments; a defensible challenge to an accepted assumption; a concrete experiment readers can try; a credible signal of where creative work is heading.
Apply this test: "Would a designer, marketer or team leader send this to a colleague—and what would they say when sharing it?" If the only answer is "Here is another AI update", find a better angle.

3. RESEARCH BEFORE SELECTING THE ANGLE
When research tools are available, investigate developments since the previous post. Prefer official announcements and documentation for functionality; original research for research claims; credible independent evaluations for real-world performance.
Check: publication date and actual event or release date; whether something is announced, in preview, rolling out or available; material platform, plan, region or access restrictions; whether evidence comes from a demo, controlled test or actual use.
Do not describe an older feature as newly launched. If current research is unavailable, write a supported evergreen perspective. Return HOLD if the chosen story depends on news you cannot verify.

4. GENERATE FIVE DIFFERENT IDEAS INTERNALLY
Before drafting, develop five candidates across at least three creative areas and three article formats.
For each, identify: the development or central question; the primary reader; why they would care; the most interesting supported detail; TLBR's proposed interpretation; the concrete takeaway; available evidence; difference from recent posts; whether it fits within 400 words.
Reject: routine updates with little impact; generic "AI is changing everything" commentary; announcement copy with different wording; unsupported predictions; forced controversy; subjects too broad for a short article; ideas selected mainly to promote TLBR.
Choose the strongest story, not necessarily the newest or biggest launch.

5. CREATE VARIETY WITHOUT A RIGID FORMULA
Use a different central question and format from the immediately previous published post. Do not repeat substantially the same argument and takeaway from the previous 12 posts, even with a different product. Avoid covering the same vendor or creative discipline for more than two consecutive posts unless a significant development justifies it.
Across roughly eight posts, aim for a flexible mix: three significant developments and their implications; two perspectives on creative practice or industry change; two useful workflows, evaluations or experiments; one emerging signal or follow-up to an earlier prediction.
Do not let every article end with: humans still matter; AI saves time; designers need to adapt; brand consistency is important. Explain the specific consequence instead.

6. CHOOSE THE RIGHT ARTICLE FORMAT
Possible formats: the useful discovery; the announcement decoded; the demo versus the job; the workflow shift; the considered opinion; the small experiment; the focused comparison; the future signal; the follow-up.
Do not use identical headings or structure each week.

7. ADD A POINT OF VIEW THAT EARNS ITS PLACE
Each article needs one central argument. Investigate questions such as: what becomes possible that was previously difficult? Which stage of work changes? Where does effort move rather than disappear? Can the output be edited, reused and handed over? What new judgement or skill does the team need? Who benefits most—and who may find little value?
Include at least one concrete example, implication, decision rule or suggested experiment. The "interesting" element must come from a supported observation, useful connection or sharp question. Never invent a surprising fact.

8. HANDLE THE FUTURE RESPONSIBLY
Separate established facts, your interpretation, and predictions or possibilities. Make those distinctions clear through natural wording. Avoid arbitrary timelines and sweeping claims about professions disappearing. Do not assume that faster output means better work, or that a new capability guarantees widespread adoption.

9. VERIFY EVERYTHING THAT NEEDS VERIFICATION
Never invent: features, launches, dates or availability; statistics, studies, quotations or links; customer stories or personal experience; hands-on testing or performance results; partnerships, integrations or TLBR capabilities.
Do not write "we tested", "we found" or "our customers are seeing" unless verified supporting information is supplied. Use precise release language: announced, preview, rolling out or available. Source links should support the actual claims beside them. If a central claim cannot be verified, change the angle or return HOLD.

10. WRITE SOMETHING PEOPLE WANT TO READ
Write one piece that works as both a short blog article and a LinkedIn post.
Use: a specific title that creates interest without hiding the subject; an opening that immediately reveals the useful development, tension or observation; short connected paragraphs; plain British English; concrete language and natural sentence rhythms; a clear ending: an implication, action, open question or signal to watch.
Avoid: generic introductions; "in today's fast-paced world"; "game-changing", "revolutionary", "unlock" and "supercharge"; "the future is here"; "AI is changing everything"; repeated "It's not X, it's Y" constructions; exaggerated metaphors; a sequence of disconnected one-line statements; generic engagement bait such as "Agree?" or "Thoughts?"; mandatory closing questions; hashtags and emojis unless requested; a conclusion that simply repeats the article.

11. USE TLBR'S EXPERIENCE WITHOUT INVENTING IT
When supplied, use observations from TLBR's team and customer questions to find distinctive angles. Without supplied experience, build the perspective from evidence and clearly framed analysis. Do not fabricate an agency anecdote or personal test. The article must remain worth reading without a TLBR product mention. Mention the product only when an approved capability directly helps explain the topic.

12. FINAL EDITORIAL CHECK
Before returning the article, verify each: Is there a clear reason this reader would care? Does the article offer something beyond the headline? Is there one distinct, supported argument? Is the example or implication concrete? Are facts, interpretation and prediction distinguishable? Does it differ meaningfully from recent posts? Is the title accurate and interesting? Does the opening deliver value immediately? Does it work on LinkedIn and the blog? Would someone have a specific reason to share it? Is all publishable content within 400 words?
Count the words. Do not simply estimate. If the piece is generic, sharpen or replace the idea.

OUTPUT
Return exactly two sections in this order. Do not include any analysis, brainstorming, candidate review or selection reasoning outside these two sections.

A. PUBLISHABLE ARTICLE
Start your response with the heading "A. PUBLISHABLE ARTICLE" on its own line, followed immediately by the article. Include:
- Title.
- Finished article (no separate summary unless requested).
- Relevant source links within the article where they support a specific claim.

Keep all publishable content within 400 words. Do not include brainstorming, candidate analysis or editorial notes.

B. INTERNAL EDITORIAL RECORD — DO NOT PUBLISH
Use these fields exactly:
- Publication date:
- Title:
- Meta description (120–155 characters, for SEO):
- LinkedIn post (3–4 short sentences, conversational tone, no hashtags, no emojis, ends with "Read it here:"):
- Primary reader:
- Creative discipline:
- Platform or company, if relevant:
- Central development or question:
- Why readers will care:
- Most interesting supported detail:
- Central argument:
- Concrete takeaway:
- Article format:
- Difference from the previous published article:
- Closest related article in the supplied history and substantive difference:
- Sources and relevant dates:
- Material availability restrictions:
- Interpretation or prediction requiring qualification:
- Research or history limitations:
- Final reader-facing word count:
- Estimated reading time at 200 words per minute:
- Status: READY or HOLD
- Useful future angles:
- History summary: 60–100 words recording the subject, argument, example and takeaway."""

# ---------------------------------------------------------------------------
# Product facts — single source of truth about tlbr.io
# ---------------------------------------------------------------------------
PRODUCT_FACTS = """tlbr.io is a design and creative technology publication covering the future of how people create and communicate.
It also builds a bespoke PowerPoint toolbar (add-in) for enterprise teams.

VERIFIED TOOLBAR CAPABILITIES:
- One-click alignment and distribution of objects on slides
- Built-in brand colours and fonts, locked to the company's approved palette
- Bespoke slide templates accessible directly from the toolbar
- Brand asset library: logos, icons and approved images, one click away
- Table and chart formatting tools
- Layout and spacing tools
- Deployed company-wide via Microsoft AppSource or direct IT deployment
- Works inside PowerPoint for Windows
- Each deployment is custom-configured to the client's brand; not an off-the-shelf product
- Firm-wide licensing model — no per-seat counting
- Dedicated account manager and ongoing support included

Do not invent capabilities, integrations, performance results or customer stories beyond the above.
Mention the toolbar only when it directly illustrates the article's point. Most articles will not need a product mention."""


def build_recent_articles_context():
    records_dir = "content/blog/editorial-records"
    blog_dir = "content/blog"

    # Prefer rich editorial records
    if os.path.isdir(records_dir):
        record_files = sorted(glob.glob(f"{records_dir}/*.json"))[-20:]
        if record_files:
            lines = []
            for f in record_files:
                try:
                    with open(f) as fp:
                        r = json.load(fp)
                    lines.append(f"Date: {r.get('date', '?')}")
                    lines.append(f"Title: {r.get('title', '?')}")
                    for field in ["primary_reader", "problem", "approach", "format", "example", "takeaway", "status"]:
                        if r.get(field):
                            lines.append(f"{field.replace('_', ' ').title()}: {r[field]}")
                    lines.append("")
                except Exception:
                    pass
            if lines:
                return "\n".join(lines)

    # Fall back to frontmatter from blog post files
    posts = sorted(glob.glob(f"{blog_dir}/*.md"))[-20:]
    if not posts:
        return "No previous articles supplied."

    lines = ["(Only titles and descriptions available; full editorial records not yet generated.)"]
    lines.append("")
    for path in posts:
        try:
            with open(path) as fp:
                content = fp.read()
            title_m = re.search(r'^title:\s*["\']?([^"\'\n]+)["\']?', content, re.M)
            date_m = re.search(r'^date:\s*["\']?([^"\'\n]+)["\']?', content, re.M)
            desc_m = re.search(r'^description:\s*["\']?([^"\'\n]+)["\']?', content, re.M)
            if title_m and date_m:
                lines.append(f"Date: {date_m.group(1).strip()}")
                lines.append(f"Title: {title_m.group(1).strip()}")
                if desc_m:
                    lines.append(f"Description: {desc_m.group(1).strip()}")
                lines.append("")
        except Exception:
            pass
    return "\n".join(lines)


def call_anthropic(user_msg, api_key):
    payload = {
        "model": "claude-haiku-4-5-20251001",
        "max_tokens": 2500,
        "system": SYSTEM_PROMPT,
        "messages": [{"role": "user", "content": user_msg}],
    }
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=json.dumps(payload).encode(),
        headers={
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            result = json.loads(resp.read())
        return result["content"][0]["text"]
    except Exception as e:
        print(f"Anthropic API error: {e}", file=sys.stderr)
        sys.exit(1)


def parse_response(raw):
    """Split response into (section_a, section_b).

    Handles several output shapes the AI produces:
      - A. PUBLISHABLE ARTICLE ... B. INTERNAL EDITORIAL RECORD ...
      - # ARTICLE ... # INTERNAL EDITORIAL RECORD ...
      - Just the article followed by the record under any heading variant
    """
    # Patterns that mark the start of the editorial record
    record_patterns = [
        r"\n#+\s*(?:B\.\s*)?INTERNAL EDITORIAL RECORD",
        r"\nB\.\s*INTERNAL EDITORIAL RECORD",
        r"\n\*\*(?:B\.\s*)?INTERNAL EDITORIAL RECORD",
        r"\nINTERNAL EDITORIAL RECORD",
    ]

    section_b = ""
    section_a = raw

    for pattern in record_patterns:
        m = re.search(pattern, raw, re.I)
        if m:
            section_a = raw[: m.start()].strip()
            section_b = raw[m.start() :].strip()
            break

    # Normalise: add a leading newline so start-of-string patterns can use \n prefix
    search_text = "\n" + section_a

    # Find the "A. PUBLISHABLE ARTICLE" sub-section if the AI included analysis before it.
    # Catches: "# A. PUBLISHABLE ARTICLE", "# PUBLISHABLE ARTICLE", "# ARTICLE", plain "A. PUBLISHABLE ARTICLE"
    article_m = re.search(r"\n#+\s*(?:A\.\s+)?PUBLISHABLE ARTICLE\s*\n", search_text, re.I)
    if not article_m:
        article_m = re.search(r"\n#+\s*ARTICLE\s*\n", search_text, re.I)
    if not article_m:
        article_m = re.search(r"\nA\.\s*PUBLISHABLE ARTICLE\s*[-—]*\s*\n", search_text, re.I)
    if article_m:
        # +1 to skip the synthetic leading \n we added
        section_a = search_text[article_m.end():].strip()

    # Strip any lingering section header at the very top (after the splice above)
    section_a = re.sub(r"^#+\s*(?:A\.\s+)?PUBLISHABLE ARTICLE\s*[-—]*\s*\n+", "", section_a, flags=re.I).strip()
    section_a = re.sub(r"^A\.\s*PUBLISHABLE ARTICLE\s*[-—]*\s*\n+", "", section_a, flags=re.I).strip()
    # Strip any leading horizontal rule the AI uses as a separator
    section_a = re.sub(r"^[-*_]{3,}\s*\n+", "", section_a).strip()

    return section_a, section_b


def extract_post_fields(section_a):
    """Pull title and body out of the publishable section."""
    lines = section_a.split("\n")
    title = ""
    i = 0

    # Skip leading blank lines and horizontal rules (--- / *** / ___)
    while i < len(lines):
        line = lines[i].strip()
        if not line or re.match(r"^[-*_]{3,}$", line):
            i += 1
        else:
            break

    # Title: first meaningful non-empty line (strip heading marker if present)
    if i < len(lines):
        line = lines[i].strip()
        heading_m = re.match(r"^#{1,3}\s+(.+)", line)
        title = heading_m.group(1).strip() if heading_m else line.strip("*_")
        i += 1

    # Skip blank lines after title
    while i < len(lines) and not lines[i].strip():
        i += 1

    body = "\n".join(lines[i:]).strip()
    return title, body


def extract_editorial_fields(section_b):
    field_map = {
        "Publication date:": "date",
        "Title:": "title",
        "Meta description (120–155 characters, for SEO):": "meta_description",
        "Meta description:": "meta_description",
        "LinkedIn post (3–4 short sentences, conversational tone, no hashtags, no emojis, ends with \"Read it here:\"):": "linkedin_intro",
        "LinkedIn post:": "linkedin_intro",
        "Primary reader:": "primary_reader",
        "Creative discipline:": "creative_discipline",
        "Subject area:": "subject_area",
        "Platform or company, if relevant:": "platform",
        "Central development or question:": "central_question",
        "Why readers will care:": "why_readers_care",
        "Most interesting supported detail:": "interesting_detail",
        "Central argument:": "central_argument",
        "Specific problem:": "problem",
        "Intended reader outcome:": "outcome",
        "Recommended approach:": "approach",
        "Article format:": "format",
        "Concrete takeaway:": "takeaway",
        "Worked example or copyable resource:": "example",
        "Main takeaway:": "takeaway",
        "Status:": "status",
        "Material availability restrictions:": "availability",
        "Interpretation or prediction requiring qualification:": "qualifications",
        "Research or history limitations:": "limitations",
        "Verification or history limitations:": "limitations",
        "Final reader-facing word count:": "word_count",
        "History summary:": "history_summary",
    }
    record = {}
    for label, key in field_map.items():
        m = re.search(re.escape(label) + r"\s*(.+)", section_b, re.I)
        if m:
            record[key] = m.group(1).strip().strip("*_")
    return record


def derive_tags(title, section_b):
    text = (title + " " + section_b).lower()
    tag_map = {
        "alignment": "alignment",
        "template": "templates",
        "brand": "brand",
        "colour": "brand",
        "font": "brand",
        "sales": "sales",
        "finance": "finance",
        "chart": "data visualisation",
        "data": "data visualisation",
        "feedback": "collaboration",
        "review": "collaboration",
        "deadline": "workflow",
        "workflow": "workflow",
        "brief": "workflow",
        "accessible": "accessibility",
        "readab": "accessibility",
        "ai": "AI",
        "generative": "AI",
        "image generation": "AI",
        "copilot": "AI",
        "chatgpt": "AI",
        "firefly": "AI",
        "layout": "design",
        "design": "design",
        "figma": "design tools",
        "canva": "design tools",
        "adobe": "design tools",
        "affinity": "design tools",
        "photoshop": "design tools",
        "illustrator": "design tools",
        "video": "video",
        "motion": "video",
        "runway": "video",
        "descript": "video",
        "premiere": "video",
        "animation": "video",
        "dubbing": "video",
        "webflow": "web",
        "framer": "web",
        "website": "web",
        "prototype": "web",
        "presentation": "presentations",
        "powerpoint": "presentations",
        "hiring": "industry",
        "agency": "industry",
        "freelance": "industry",
        "provenance": "industry",
        "copyright": "industry",
    }
    tags = set()
    for keyword, tag in tag_map.items():
        if keyword in text:
            tags.add(tag)
    if not tags:
        tags.add("design")
    return list(tags)[:4]


def main():
    today = os.environ.get("TODAY", datetime.today().strftime("%Y-%m-%d"))
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    news = os.environ.get("NEWS_HEADLINES", "")

    if not api_key:
        print(json.dumps({"status": "HOLD", "reason": "No ANTHROPIC_API_KEY set."}))
        sys.exit(1)

    recent = build_recent_articles_context()

    user_msg = f"""Publication date: {today}

Previous articles:
{recent}

Approved product information:
{PRODUCT_FACTS}

Customer questions or recurring problems: Not supplied for this run.

Verified source material (recent news headlines — use only if genuinely relevant and specific, do not expand into unsupported detail):
{news if news else "None supplied."}

Optional editorial priority: None.

Please generate a blog post following the editorial brief."""

    raw = call_anthropic(user_msg, api_key)
    section_a, section_b = parse_response(raw)

    # Check for HOLD
    if re.search(r"Status:\s*HOLD", section_b, re.I) or (not section_b and "HOLD" in section_a[:100]):
        print(json.dumps({"status": "HOLD", "reason": (section_b or section_a)[:600]}))
        return

    title, body = extract_post_fields(section_a)
    editorial = extract_editorial_fields(section_b)
    # Meta description comes from section B; fall back to first sentence of body
    description = editorial.get("meta_description", "")
    if not description and body:
        first_sent = re.split(r"(?<=[.!?])\s", body.replace("\n", " "))[0]
        description = first_sent[:155]
    tags = derive_tags(title, section_b)

    # Save editorial record for future runs
    records_dir = "content/blog/editorial-records"
    os.makedirs(records_dir, exist_ok=True)
    record_data = {"date": today, "title": title, "description": description, **editorial, "raw": section_b}
    record_path = f"{records_dir}/{today}.json"
    with open(record_path, "w") as fp:
        json.dump(record_data, fp, indent=2)
    print(f"Editorial record saved: {record_path}", file=sys.stderr)

    linkedin_intro = editorial.get("linkedin_intro", "")
    print(json.dumps({"status": "READY", "title": title, "description": description, "tags": tags, "body": body, "linkedin_intro": linkedin_intro}))


if __name__ == "__main__":
    main()
