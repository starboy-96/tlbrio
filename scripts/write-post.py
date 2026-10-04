#!/usr/bin/env python3
"""Write the blog post markdown file from environment variables."""
import os, json

title      = os.environ["TITLE"]
description = os.environ["DESCRIPTION"]
today      = os.environ["TODAY"]
tags_json  = os.environ["TAGS_JSON"]
image_url  = os.environ["IMAGE_URL"]
body       = os.environ["BODY"]
file_path  = os.environ["FILE_PATH"]

content = (
    "---\n"
    f"title: {json.dumps(title)}\n"
    f"description: {json.dumps(description)}\n"
    f"date: {json.dumps(today)}\n"
    f"tags: {tags_json}\n"
    "author: \"tlbr.io team\"\n"
    f"image: {json.dumps(image_url)}\n"
    "---\n\n"
    + body + "\n"
)

with open(file_path, "w") as f:
    f.write(content)

print(f"Post written to {file_path}")
