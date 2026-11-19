# Web QA Practice: build acceptance tests with Playwright's AI agents

[![build acceptance tests](https://github.com/ellnika/web-qa-practice/actions/workflows/bat.yml/badge.svg)](https://github.com/ellnika/web-qa-practice/actions/workflows/bat.yml)

QA practice project: define the build acceptance tests (BAT) for an online shop, automate them with Playwright's AI test agents (planner, generator, healer), and check whether the AI's tests can be trusted by planting defects they must catch.

The shop under test is [OWASP Juice Shop](https://github.com/juice-shop/juice-shop) v20.4.0, run locally.

## Contents

| Path | What it is |
|---|---|
| [docs/test-plan.md](docs/test-plan.md) | Test plan: user journeys, P0 build acceptance scenarios, planted defects, approach, criteria and roles |
| [tests/](tests/) | Playwright tests. `bat-01-shop-opens.spec.ts` is written by hand as the reference for judging AI-generated tests |
| [specs/](specs/) | Test plans written by the AI planner agent, after review |
| [.github/workflows/bat.yml](.github/workflows/bat.yml) | CI: downloads the Juice Shop release, starts it, runs the tests on every push and pull request |

## How to run

**Requirements:** Node.js 22 to 26 (`node --version`).

1. Get Juice Shop v20.4.0 into a folder **next to** this repo, named `juice-shop-src`:
   ```
   git clone --depth 1 --branch v20.4.0 https://github.com/juice-shop/juice-shop.git juice-shop-src
   cd juice-shop-src && npm install && cd ..
   ```
   (A different folder works too: set `JUICE_SHOP_DIR` to its path.)
2. Install and run the tests:
   ```
   git clone https://github.com/ellnika/web-qa-practice.git
   cd web-qa-practice
   npm ci
   npx playwright install chromium
   npm test
   ```
   Playwright starts Juice Shop by itself if it isn't already running at http://localhost:3000.
3. After a failure, `npm run report` opens the report with screenshots and a step-by-step trace.

## Status

| BAT | Scenario | Written by | Status |
|---|---|---|---|
| BAT-01 | Shop opens | Hand-written reference | Passing; checked against two simulated defects (empty product list, wrong price) |
| BAT-02 to BAT-07 | Register, log in, search, basket, checkout, wrong password | AI agents, reviewed by the test owner | Not started |
