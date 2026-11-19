import { test } from '@playwright/test';
import { openShop } from './helpers';

// Starting point for Playwright's AI agents (planner, generator, healer):
// the shop is open and the welcome banner and cookie notice are closed.
test.describe('Juice Shop', () => {
  test('seed', async ({ page }) => {
    await openShop(page);
  });
});
