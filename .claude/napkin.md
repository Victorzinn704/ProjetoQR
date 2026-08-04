# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Execution & Validation (Highest Priority)
1. **[2026-08-04] Preserve the static GitHub Pages delivery model**
   Do instead: keep the landing self-contained in `src/`, publish only `dist/`, and validate links plus build output before deployment.
2. **[2026-08-04] QR destination must match the published Pages URL**
   Do instead: update `src/js/config.js`, regenerate the QR asset, and verify both whenever repository ownership or name changes.

## User Directives
1. **[2026-08-04] Favor a single-viewport contact interface over stacked cards**
   Do instead: use the centered three-surface composition on desktop and compact it into fixed-height regions on mobile; never reintroduce page scrolling for the primary contact flow.
2. **[2026-08-04] Preserve approved interface regions during iterations**
   Do instead: treat user-marked green areas as locked and confine redesigns to the marked problem region unless a dependency requires a wider change.
3. **[2026-08-04] Keep the profile honest while assets are pending**
   Do instead: use `src/assets/joao-victor-cruz.png` for the current portrait and keep the resume-unavailable state until the user supplies a PDF.
4. **[2026-08-04] Treat ProjetoQR as a separate product**
   Do instead: keep source, Git history, documentation, CI, and deployment independent from Desk Imperial.
5. **[2026-08-04] Keep professional copy factual and evidence-led**
   Do instead: prefer specific responsibilities and use ` | ` between categories; avoid generic marketing language and decorative status labels.
