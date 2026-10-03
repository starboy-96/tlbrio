import os

template = open('scripts/newsletter-email.html').read()
template = template.replace('{{BLOG_TITLE}}',  os.environ.get('BLOG_TITLE', ''))
template = template.replace('{{IMAGE_BLOCK}}', os.environ.get('IMAGE_BLOCK', ''))
template = template.replace('{{HTML_BODY}}',   os.environ.get('HTML_BODY', ''))
template = template.replace('{{BLOG_URL}}',    os.environ.get('BLOG_URL', ''))
print(template, end='')
