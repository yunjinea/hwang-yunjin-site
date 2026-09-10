# VERSION 3.0 — Editorial Rebuild

Baseline: user-supplied after-the-numbers-v2.3-full-source.zip
Date: 2026-09-09

## Changes
- Replaced accumulated homepage CSS and JavaScript with one responsive layout and explicit controls.
- Restored ordinary document scrolling; removed wheel/swipe-driven content replacement and pinned chapters.
- Home order: Intro → Cases → Latest Writing → Experience/Expertise → Contact.
- Four independently addressable case study pages under /cases/.
- Forecast stage tabs work by click and keyboard; every stage remains readable without JavaScript.
- Latest writing is rendered at build time; no fetch is required to see published posts.
- Shared navigation, typography, color tokens and footer across home, cases, archive and articles.
- Larger article type and figures constrained to the reading column.
- READ / DECIDE / CONTROL filters with clear empty states and working pagination.
- Preserved existing post URLs, both Markdown post sources and CMS configuration.
- Included new cases in sitemap and strengthened build validation for internal anchors.

## Validation
See README.md for the checks completed and the remaining device/CMS verification limits.
