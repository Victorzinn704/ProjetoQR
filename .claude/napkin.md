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
1. **[2026-08-04] Keep the profile honest while assets are pending**
   Do instead: show a monogram avatar and a clear resume-unavailable state until the user supplies a photo or PDF.
2. **[2026-08-04] Treat ProjetoQR as a separate product**
   Do instead: keep source, Git history, documentation, CI, and deployment independent from Desk Imperial.
