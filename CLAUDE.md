# Project context for Claude Code

## What this project is

Build acceptance tests (BAT) for OWASP Juice Shop v20.4.0, automated with Playwright's AI test agents (planner, generator, healer). The goal is to judge whether the AI's tests can be trusted. **Read [docs/test-plan.md](docs/test-plan.md) first**: it defines the journeys, the P0 scenarios BAT-01 to BAT-07, the planted defects PD-01 to PD-05, and the AI scorecard.

## Roles

- **Ewa is the test owner.** She defines scope, scenarios and acceptance criteria, reviews every agent's output, and decides. Present agent output (planner plans in `specs/`, generated tests) for her review **before** committing. Don't record a review she hasn't explicitly given.
- Claude Code sets up the project, runs the agents, plants defects and drafts documents. Explain CI and tooling steps in plain words.

## Where things are

- Juice Shop source: `../juice-shop-src` (outside this repo). Start it with `npm start` in that folder, at http://localhost:3000. Playwright also starts it itself through `webServer` in playwright.config.ts. Data resets on every restart.
- `tests/helpers.ts`: `openShop(page)` closes the welcome banner and cookie notice. `tests/seed.spec.ts` is the agents' starting point.
- `tests/bat-01-shop-opens.spec.ts` is hand-written and reviewed by Ewa. It is the reference for judging the AI-generated tests.
- CI: `.github/workflows/bat.yml` downloads the Juice Shop release package and runs `npx playwright test` on every push and pull request.

## Rules for tests

- Each test asserts its "pass when" criteria from the test plan, not only that a page loaded.
- Locators use roles, labels or test IDs, not CSS positions.
- Each test must fail on a planted or simulated defect before it counts.
- No automatic retries: a BAT failure must mean a broken build.
- BAT-06 (checkout) must use a paid delivery method (One Day 0.99¤ or Fast 0.50¤; Standard is free), so the total check means something.
- Security vulnerabilities are out of scope: Juice Shop is deliberately insecure.
- Classify every failure: product defect, test problem, deliberate app behaviour, or environment.

## Progress (Notion "Career Dashboard", Tasks database)

- Done: "Web | Choose app and scope" (test plan approved 2026-11-18, commit 24f69ef).
- Done: "Web | Baseline and smoke test" (commit e97d057, CI green; BAT-01 reviewed by Ewa).
- **Next: "Web | Review planner agent output"** (due Dec 3). Run the planner on BAT-02 to BAT-07, save the plan to `specs/`, and have Ewa review it. Start an AI scorecard: what the planner got right, missed, or got vague.
- Later tickets: Generate and review tests (Dec 6), Investigate failures with the planted defects (Dec 9), Evaluate healer (Dec 12), Selenium comparison (Dec 15), Finish web showcase (Dec 18).
- When a ticket is finished, post a comment with evidence links (commit, CI run, files) on its Notion page, then set Status to Done. Show the comment wording to Ewa first if she hasn't seen that kind of comment before.

## Git

- Commits use the GitHub no-reply email `12519178+ellnika@users.noreply.github.com` (set in this repo's git config).
- Commit or push only when Ewa asks. Push with `GIT_TERMINAL_PROMPT=0 GIT_ASKPASS= git push`. If a login is needed, ask her to push from the Terminal app.
- `gh` is not installed. Check CI with `curl https://api.github.com/repos/ellnika/web-qa-practice/actions/runs`.

## Related

The firmware project, `../firmware-qa-practice`, is finished. It uses the same roles and rules.
