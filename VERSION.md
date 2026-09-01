# VERSION 2.2 — Click-to-Explore Selected Cases

Baseline: Version 2.1 final source, 2026-09-01

## Added in 2.2

- Rebuilt Selected Cases as one shared stage with four accessible tabs
- Added previous / next navigation and Arrow / Home / End keyboard support
- Added WHY IT MATTERS / HOW I ANALYZE / WHAT IT PRODUCES narratives to every case
- Added concrete output tags for Forecast, Profitability, Investment and Budget cases
- Preserved the four distinct data visuals while showing only the selected case
- Added responsive layouts for desktop, tablet and two-column mobile case selection

## Verified in 2.2

- Desktop: 1363×936 and 1024×768
- Mobile: 390×844 and 360×800
- No horizontal document overflow, duplicate IDs, broken local references or broken images
- One visible Case panel at a time, correct hash state and valid ARIA tab controls
- Mobile navigation open / Escape close, Case touch targets and representative Expertise / Writing screens

## Added in 2.1

- Consolidated the Writing taxonomy into READ / DECIDE / CONTROL
- Reclassified the first Rolling Forecast article as READ / 01 without changing its URL
- Added READ / 02: 원재료 가격이 내렸는데 원가는 왜 바로 낮아지지 않을까
- Added five editorial figures for market price, POC inventory, COGS timing and Price–Cost Lag
- Updated the Pages CMS series selector and future post template

## Preserved

- AFTER THE NUMBERS brand and editorial navy/ivory visual system
- INTRO → CAREER → SELECTED CASES → EXPERTISE → WRITING → ABOUT
- Selected Cases: SEE → EXPLAIN → DECIDE → CONTROL
- Desktop and mobile scene motion with reduced-motion support
- Anonymous portfolio positioning and `yjiness@gmail.com`

## Fixed

- Restored the real `/writing/` archive instead of the unstyled root fallback
- Restored Markdown → static article/index/feed/sitemap build pipeline
- Added Pages CMS source configuration and retained Admin redirect
- Converted all `[[FIGURE:TOKEN]]` blocks; fixed the exposed M1 token and sequential Figure 01–09 numbering
- Fixed hash navigation opening on near-transparent Career, Cases, Writing and About frames
- Changed Writing taxonomy to READ / DECIDE / CONTROL
- Hid redundant View All when all available stories already appear on the homepage
- Added skip link, menu Escape/labels, tab semantics, roving keyboard focus and selected-state ARIA
- Added canonical, Open Graph/X text metadata, JSON-LD, RSS, favicon, current robots/sitemap and a real 404 page
- Increased critical mobile microtype and removed fixed-height clipping from case pages
