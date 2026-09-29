# Contributing to BPM

Thanks for considering a contribution. This is a small, single-file static
site plus a Google Apps Script backend, so the process is intentionally
lightweight.

## Before you start

- For anything beyond a small fix (typo, copy tweak, CSS nudge), open an
  issue first describing what you want to change and why. Saves everyone a
  wasted PR.
- Keep the project dependency-free. No build step, no npm packages, no
  frameworks. If a change would require adding tooling, discuss it in an
  issue first.

## Making a change

1. Fork the repo and create a branch off `main`.
2. `index.html` is the entire front end — HTML, CSS, and JS all live in that
   one file. Keep it that way unless a change is discussed and agreed on
   first.
3. Match the existing code style:
   - CSS custom properties (`--signal`, `--cyan`, `--amber`, etc.) for
     colors — don't hardcode hex values inline.
   - Vanilla JS, no arrow-function-only style requirement, but keep it
     consistent with what's already there.
4. If your change touches the signup form or its JS, test it against a real
   (or throwaway) Apps Script deployment — see the README for setup. Confirm:
   - The Sheet receives a new row
   - The welcome email sends
   - Required-field validation still works
5. If your change touches `backend/bpm-signup-backend.gs`, note that pushing
   to this repo does **not** auto-deploy the script — Apps Script deployments
   are managed separately through the Apps Script editor. Mention in your PR
   description that the deployed script will need to be manually updated to
   match.

## Design direction

The site follows a consistent cyberpunk/CRT aesthetic (scanlines, signal
magenta + cold cyan accents, Chakra Petch/Share Tech Mono typography). New UI
should fit that direction rather than introducing a different visual style.
If you're proposing a visual change, a screenshot or short screen recording
in the PR helps a lot.

## Submitting

Open a PR against `main` with a clear description of what changed and why.
Small, focused PRs are easier to review than large ones.
