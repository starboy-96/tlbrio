---
title: "Seven things your design file isn't telling your developer"
description: "A design file shows how a page looks. The build asks how it behaves. Seven handover gaps to close before your developer, or a tool, decides for you."
date: "2026-10-20"
tags: ["workflow","video","brand","presentations"]
author: "tlbr.io team"
image: "https://images.unsplash.com/photo-1702301266409-ed1bfe210971?w=1200&auto=format&q=80"
---

It is late afternoon, the homepage design was signed off last week, and a message arrives from the developer: "What happens to these three cards on a tablet?" Nobody drew a tablet. The desktop and mobile frames are immaculate, every colour is on palette, and the question still has no answer.

Most handover friction looks like this. A design file is good at showing how a page looks at a few fixed sizes with ideal content. A website has to decide how it behaves at every size, with real content, for people using it in very different ways. Someone eventually makes those decisions. As more building is done by site builders and AI tools that can turn a layout into working code quickly, the risk is that they are made by default, without anyone noticing a decision was taken at all.

1. **The sizes in between.** Desktop and mobile frames show two points on a continuous range. Say what should happen as the screen narrows: which elements stack, shrink, wrap or disappear, and at roughly what width.

2. **Content that misbehaves.** Mock-ups tend to use a tidy headline and a perfectly cropped photo. Show the longest realistic product name, a translated label, a missing image and a list with only one item, because those are what break layouts once real content arrives.

3. **Empty, loading and error states.** A search page needs a version with no results, a dashboard needs something to show while data loads, and a form needs a version where something went wrong. If these screens aren't designed, they will still exist, just with whatever wording and styling the build happened to produce.

4. **Keyboard focus.** People who navigate with a keyboard need to see where they are on the page, and WCAG asks for a [visible focus indicator](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html). The browser's default outline rarely suits a carefully designed interface, so design one rather than inheriting it.

5. **Text at larger sizes.** People enlarge text, and WCAG expects text to [resize up to 200 per cent](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) without loss of content or functionality. A button whose label fits perfectly at the default size is often the first thing to clip.

6. **Contrast where it is hardest.** Checking text against a flat background is easy. The trouble starts with text over photographs, video or gradients. WCAG's Level AA minimum for normal-sized text is a [contrast ratio of 4.5:1](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), so decide whether that text sits on an overlay, a solid panel or somewhere else entirely.

7. **Motion, and how to turn it down.** Prototype animations show intent but rarely specify duration, easing or what triggers them. Browsers can also tell a site when someone has [asked their device to reduce motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion), so note what the calmer version should look like.

None of this needs new software. Add one page to every handover that answers these seven questions before anyone has to ask them, and the decisions stay with the person who understands what the design is meant to do. Try it on the next page you hand over: for each point, ask whether a developer could find the answer without messaging you. The page matters more as building becomes more automated, because a tool will fill any gap you leave: confidently, consistently and without checking whether that is what you meant.
