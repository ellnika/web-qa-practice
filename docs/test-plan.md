# Test plan: build acceptance tests for an online shop, automated with AI

| | |
|---|---|
| Application under test | [OWASP Juice Shop](https://github.com/juice-shop/juice-shop) v20.4.0, an online shop, run locally at http://localhost:3000 |
| Test level | Build acceptance tests (BAT): a short automated suite that decides whether a new build is accepted for further testing |
| Tools | Playwright with its AI test agents (planner, generator, healer); GitHub Actions |
| Test owner | Ewa |
| Version | 1.0, 2026-11-18 |
| Status | Approved by the test owner, 2026-11-18 |

---

## 1. Goal

1. Define the build acceptance tests for the shop: the P0 scenarios that must pass before any build is tested further.
2. Automate them using Playwright's AI agents, and judge whether the AI's tests can be trusted: do they check the right things, and do they catch real defects?

## 2. What a build acceptance test is

A BAT suite runs on every new build. It answers one question: **can a customer still do the essential things?** If any BAT test fails, the build is rejected and goes back to development. Detailed testing (edge cases, other browsers, regression) only starts on a build that passed.

So BAT tests must be:
- **Few and essential:** only P0 scenarios.
- **Fast:** the whole suite runs in under 5 minutes.
- **Reliable:** a failure means the build is broken, not that the test is flaky.

## 3. How the scenarios were derived

| Step | Output |
|---|---|
| 1. List the user journeys: what a customer must be able to do in a shop | 4 journeys (section 4) |
| 2. Ask of each step: "if this breaks, can the shop still operate?" If not, it is P0 | P0 scenarios (section 5) |
| 3. Write acceptance criteria for each P0 scenario: what exactly must be true | Section 5, "Pass when" column |
| 4. Give the scenarios to the AI planner, which explores the app and writes detailed steps | Reviewed and corrected by the test owner |
| 5. The AI generator turns the reviewed plan into automated tests | Reviewed by the test owner |

**Priority levels**
- **P0:** the customer cannot register, log in, find, buy or pay, or a wrong charge is possible. Part of BAT; a failure rejects the build.
- **P1:** a main feature is wrong but the customer can still buy. Regression suite, not BAT.
- **P2:** minor or cosmetic.

## 4. User journeys

| ID | Journey |
|---|---|
| UJ-1 | A new customer creates an account and logs in |
| UJ-2 | A customer finds a product and puts it in the basket |
| UJ-3 | A customer pays and receives an order confirmation |
| UJ-4 | The shop rejects someone who uses the wrong password |

## 5. P0 build acceptance scenarios

| ID | Journey | Scenario | Pass when |
|---|---|---|---|
| BAT-01 | — | Shop opens | Home page loads and shows a list of products with names and prices |
| BAT-02 | UJ-1 | Register a new account | Registration succeeds with a new email and valid password |
| BAT-03 | UJ-1 | Log in and log out | After login the account menu shows the user's email; after logout it doesn't |
| BAT-04 | UJ-2 | Search for a product | Searching "apple" shows "Apple Juice (1000ml)" in the results |
| BAT-05 | UJ-2 | Add to basket | The basket shows the product, quantity 1, and its correct price as the total |
| BAT-06 | UJ-3 | Checkout | With a new address, a delivery method and a new card, the order is placed. The confirmation shows the product and a total equal to price + delivery cost |
| BAT-07 | UJ-4 | Wrong password rejected | Login with a wrong password shows an error, and the user is not logged in |

**Not in BAT (P1, for the regression suite later):** changing quantity and removing items, order history, product reviews, registration field errors, saved addresses and cards.

## 6. Approach

**Automation with AI agents**

| Agent | What it does | What the test owner checks |
|---|---|---|
| Planner | Explores the running shop and writes detailed steps for each BAT scenario | Steps match the scenario; nothing important missed; expected results are specific |
| Generator | Writes Playwright test code from the reviewed plan | Each test asserts the "pass when" criteria, not only that a page loaded; stable locators (roles, labels, test IDs) |
| Healer | Repairs tests broken by a change in the app | The repair fixes the test without weakening it; the test still catches the planted defect |

**Planted defects.** To prove the tests catch real failures, defects are planted on purpose in our local copy of the shop, each on its own branch. Each defect must make at least one BAT test fail, in CI as well as locally.

| ID | Planted defect | Should be caught by |
|---|---|---|
| PD-01 | Basket total ignores the product price (shows 0) | BAT-05, BAT-06 |
| PD-02 | Delivery cost not added to the order total | BAT-06 |
| PD-03 | Login accepts any password for a known email | BAT-07 |
| PD-04 | Search returns no results | BAT-04 |
| PD-05 | UI change: the "Add to Basket" button is renamed | Breaks BAT-05; used to evaluate the healer |

**AI scorecard.** For each agent and scenario, record what the AI got right, what it missed, and what the test owner corrected. This is the main result of the project.

## 7. Scope

**In scope:** the 7 BAT scenarios, in Chromium, on a local build of Juice Shop.

**Out of scope**
- **Security.** Juice Shop is deliberately insecure for security training. Its vulnerabilities are intended and are not reported as defects.
- Hacking challenges, the score board and admin pages.
- P1 and P2 scenarios (regression testing).
- Performance, accessibility, mobile layouts, and browsers other than Chromium.

## 8. Environment

| Item | Detail |
|---|---|
| App | Juice Shop v20.4.0 from source, `npm start`, Node 22–26. Data is in memory and resets on restart, so every run starts clean |
| Tests | Playwright, Chromium, run locally and in GitHub Actions on every push and pull request |
| First visit | A welcome banner and a cookie notice appear; tests close them before starting |
| Test data | Each run registers its own new user, so tests don't depend on each other or on existing accounts |

## 9. Entry and exit criteria

| | Criteria |
|---|---|
| Entry (BAT run on a build) | The build installs and the shop starts |
| Build accepted | All 7 BAT tests pass; suite finishes in under 5 minutes |
| Build rejected | Any BAT test fails. The failure is classified: product defect, test problem, or environment |
| Project exit | Every BAT scenario is automated and reviewed. Every planted defect is caught. The AI scorecard is complete. CI is green on `main` |

## 10. Roles and use of AI

| Role | Who | Responsibilities |
|---|---|---|
| Test owner | Ewa | Defines the journeys, P0 scenarios and acceptance criteria. Approves this plan. Reviews every agent's output before it counts. Decides which planted defects to use and classifies failures |
| AI test agents | Playwright planner, generator, healer | Write detailed steps, write test code, repair broken tests |
| Implementation assistant | Claude Code | Sets up the project, CI and planted defects; runs the agents; drafts documents |

**Rules for AI output**
- Nothing counts as done until the test owner has reviewed it.
- A test must assert its "pass when" criteria and must fail on a planted defect.
- A healer repair that weakens an assertion is rejected.

## 11. Schedule

| Due | Milestone (Notion ticket) |
|---|---|
| Nov 27 | App chosen; this test plan approved (Choose app and scope) |
| Nov 30 | Shop runs; one reviewed smoke test (BAT-01) in CI (Baseline and smoke test) |
| Dec 3 | Planner output for BAT-02 to BAT-07 reviewed and corrected (Review planner agent output) |
| Dec 6 | Generated tests reviewed and passing (Generate and review tests) |
| Dec 9 | Planted defects PD-01 to PD-04 caught; failures classified (Investigate failures) |
| Dec 12 | PD-05 and healer evaluated (Evaluate healer agent) |
| Dec 15 | Two BAT scenarios also written in Selenium and compared (Selenium comparison) |
| Dec 18 | README, results, AI scorecard (Finish web showcase) |
