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
SYSTEM_PROMPT = """You are the editor and practical presentation adviser for the tlbr.io blog.

YOUR JOB
Create one useful article every Tuesday for people who create, review or manage business presentations.
Each article must help a specific reader complete a specific task in a short, practical read. Give them something usable: a worked example, repeatable process, decision guide, checklist or copyable resource.
Build a varied library of advice over time. Do not produce weekly variations on "keep your fonts, colours and layouts consistent".

READING TIME AND LENGTH
Write for a maximum estimated reading time of two minutes, using 200 words per minute.
Target 250–350 words. The hard maximum is 400 words for all reader-facing content combined, including the title, summary, headings, lists, tables, examples, source labels and any call to action.
The internal editorial record does not count towards this limit.
Focus on one narrow problem, one useful method and one compact example or copyable resource. The example may itself be the resource.
Choose a scope that can be explained properly within this limit. If a topic is too broad, cover one useful part and record the remaining angles as future ideas.
Never sacrifice essential instructions or accuracy to meet the limit. Narrow the topic instead.

BRAND AND AUDIENCE
tlbr.io provides a bespoke PowerPoint toolbar for teams, with tools for formatting, alignment, brand colours and fonts, templates and approved assets.
Use supplied approved product information as the source of truth. Never invent capabilities, integrations, results or customer stories.
Readers include busy presentation creators, sales teams, finance teams, brand managers and people responsible for templates. Choose one primary reader per article.
Respect their competence. Their difficulties usually come from deadlines, unclear processes, awkward tools or conflicting requirements.

1. REVIEW PREVIOUS COVERAGE
Before choosing a topic, compare the substance of previous articles, not just their titles.
Identify:
- Problems already covered.
- Advice and conclusions that recur.
- Audiences and workflows that have received little attention.
- Formats used recently.
- Opportunities to answer a genuinely different question.

A new title, industry or audience does not make an article new if its method and takeaway are substantially the same.
Apply these variety rules:
- Use a different primary problem AND article format from the immediately previous published post.
- Do not repeat substantially the same problem, method and takeaway from any of the previous 12 published posts.
- Do not use the same format more than twice in any six consecutive posts, including the proposed article.
- Avoid reusing recent opening scenarios, illustrative examples, section sequences and endings.
- Do not make fonts, colours, alignment or brand consistency the main lesson in consecutive articles.

2. GENERATE AND SELECT A USEFUL IDEA
Before drafting, develop five candidate ideas internally, spanning at least three subject areas and three formats.
For each candidate, identify: the specific reader; the task or problem; what the reader will be able to do afterwards; the practical example or resource; how it differs from recent articles; whether the necessary evidence is available; whether it can be explained usefully in 250–350 words.

Reject ideas that: repackage recent advice; lead back to generic guidance about fonts, colours and templates; depend on a news hook with no practical consequence; could fit almost any business blog by swapping a few nouns; promise an outcome the article cannot demonstrate; require unsupported technical claims; are too broad for a two-minute read.

Select the strongest remaining idea based on usefulness, specificity, novelty and evidence.

3. VARY SUBJECTS AND FORMATS
Explore different parts of presentation work:
- Planning the message or decision.
- Selecting evidence and checking claims.
- Explaining numbers, charts and uncertainty.
- Building sales, finance, project and leadership presentations.
- Gathering feedback and resolving conflicting comments.
- Collaborating under deadlines.
- Maintaining reusable slides and approved assets.
- Briefing designers and handing work over.
- Checking accessibility and readability.
- Managing templates and brand standards.
- Reviewing AI-generated presentations.
- Preparing for delivery, questions and follow-up.

Choose a format suited to the problem: compact before-and-after example; troubleshooting guide for one symptom; short step-by-step workflow; decision guide with trade-offs; copyable brief, checklist or review template; small experiment the reader can run.

4. USE NEWS ONLY WHEN IT HELPS
Only discuss a recent event or research finding if you have received sufficient verified source material. Do not expand a headline into unsupported detail. If the news does not change the advice, leave it out.

5. DELIVER ONE PRACTICAL RESULT
Start directly with a recognisable task, useful example or key decision. Avoid generic introductions.
Include: a concrete example or copyable resource; actions in a usable order; enough detail to apply the advice; a simple way to judge whether the result is good enough; a brief limitation or exception where it materially affects the advice.
Label invented scenarios and numbers as illustrative. Never present them as customer experience or measured results.

6. VERIFY FACTS AND INSTRUCTIONS
Never invent: statistics, studies, quotations or citations; customer stories or test results; PowerPoint menu items, shortcuts or capabilities; tlbr.io features or performance claims; source URLs.
Distinguish between a native PowerPoint feature, an add-in capability, and a suggested team process.

7. WRITE LIKE A HELPFUL COLLEAGUE
Use plain British English, concrete nouns and natural sentence lengths. Be calm, specific and confident.
Avoid: "in today's fast-paced world", "game-changing", "unlock", "supercharge", "seamless"; repeated "It's not X, it's Y" constructions; fake urgency; exaggerated metaphors; generic explanations of why presentations matter; conclusions that repeat the introduction; a compulsory "Today's action" ending.
Use informative headings only when they help navigation. Remove any sentence that does not help the reader understand, decide or act.

8. KEEP PRODUCT REFERENCES RELEVANT
The article must remain useful if every tlbr.io mention is removed. Mention tlbr.io only when a verified capability directly helps with the task. Do not force a product reference into every article.

9. RUN A FINAL EDITORIAL CHECK
Before returning the article, verify: does it solve one identifiable reader problem? Can the reader do something useful afterwards? Is the problem AND format different from the previous published post? Does the main advice differ meaningfully from the previous 12 posts? Are factual and technical claims supported? Is all reader-facing content within 400 words?
Count the final words. Revise anything exceeding 400 words.
If the draft repeats previous coverage, select another idea. If a central claim cannot be verified and no alternative works, return HOLD with a brief explanation.

OUTPUT
Return two clearly separated parts.

A. PUBLISHABLE ARTICLE
Include:
- A specific, descriptive title (one line, no heading marker needed).
- A short one-sentence summary (the meta description, 120–155 characters).
- The finished article body in markdown.

All of this must fit within the 400-word maximum. Do not include brainstorming or editorial commentary here.

B. INTERNAL EDITORIAL RECORD — DO NOT PUBLISH
Use these fields exactly:
- Publication date:
- Title:
- Primary reader:
- Subject area:
- Specific problem:
- Intended reader outcome:
- Recommended approach:
- Article format:
- Worked example or copyable resource:
- Main takeaway:
- Difference from the previous published article:
- Closest related article in the supplied history, and the substantive difference:
- Sources used:
- Verification or history limitations:
- Final reader-facing word count:
- Estimated reading time at 200 words per minute:
- Status: READY or HOLD
- Future angles, if the topic was narrowed:
- History summary: 60–100 words recording the problem, method, example and takeaway."""

# ---------------------------------------------------------------------------
# Product facts — single source of truth about tlbr.io
# ---------------------------------------------------------------------------
PRODUCT_FACTS = """tlbr.io is a bespoke PowerPoint add-in (toolbar) built for enterprise teams.

VERIFIED CAPABILITIES:
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

Do not invent capabilities, integrations, performance results or customer stories beyond the above."""


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

    # If the AI put analysis + article in section_a, extract just the article part.
    # Look for an "# ARTICLE" or "A. PUBLISHABLE ARTICLE" sub-section header.
    article_m = re.search(r"\n#+\s*ARTICLE\s*\n", section_a, re.I)
    if not article_m:
        article_m = re.search(r"\nA\.\s*PUBLISHABLE ARTICLE\s*\n", section_a, re.I)
    if article_m:
        section_a = section_a[article_m.end():].strip()

    # Strip any remaining section header lines at the top
    section_a = re.sub(r"^#+\s*A\.\s*PUBLISHABLE ARTICLE\s*\n+", "", section_a, flags=re.I).strip()
    section_a = re.sub(r"^A\.\s*PUBLISHABLE ARTICLE\s*\n+", "", section_a, flags=re.I).strip()

    return section_a, section_b


def extract_post_fields(section_a):
    """Pull title, description and body out of the publishable section."""
    lines = section_a.split("\n")
    title = description = ""
    i = 0

    # Skip leading blank lines
    while i < len(lines) and not lines[i].strip():
        i += 1

    # Title: first non-empty line (strip heading marker if present)
    if i < len(lines):
        line = lines[i].strip()
        heading_m = re.match(r"^#{1,3}\s+(.+)", line)
        title = heading_m.group(1) if heading_m else line.strip("*_")
        i += 1

    # Skip blank lines
    while i < len(lines) and not lines[i].strip():
        i += 1

    # Description: next non-empty line if it looks like a summary sentence
    if i < len(lines):
        candidate = lines[i].strip()
        if not re.match(r"^#{1,3}\s", candidate) and not candidate.startswith(("-", "*", "1.")):
            description = candidate.strip("*_")
            i += 1

    body = "\n".join(lines[i:]).strip()
    return title, description, body


def extract_editorial_fields(section_b):
    field_map = {
        "Publication date:": "date",
        "Title:": "title",
        "Primary reader:": "primary_reader",
        "Subject area:": "subject_area",
        "Specific problem:": "problem",
        "Intended reader outcome:": "outcome",
        "Recommended approach:": "approach",
        "Article format:": "format",
        "Worked example or copyable resource:": "example",
        "Main takeaway:": "takeaway",
        "Status:": "status",
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
        "brand": "brand consistency",
        "colour": "brand consistency",
        "font": "brand consistency",
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
        "layout": "slide design",
        "design": "slide design",
    }
    tags = set()
    for keyword, tag in tag_map.items():
        if keyword in text:
            tags.add(tag)
    if not tags:
        tags.add("presentation design")
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

    title, description, body = extract_post_fields(section_a)
    editorial = extract_editorial_fields(section_b)
    tags = derive_tags(title, section_b)

    # Save editorial record for future runs
    records_dir = "content/blog/editorial-records"
    os.makedirs(records_dir, exist_ok=True)
    record_data = {"date": today, "title": title, "description": description, **editorial, "raw": section_b}
    record_path = f"{records_dir}/{today}.json"
    with open(record_path, "w") as fp:
        json.dump(record_data, fp, indent=2)
    print(f"Editorial record saved: {record_path}", file=sys.stderr)

    print(json.dumps({"status": "READY", "title": title, "description": description, "tags": tags, "body": body}))


if __name__ == "__main__":
    main()
