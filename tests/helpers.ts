import { expect, Page } from '@playwright/test';

/** Opens the shop and closes the welcome banner and cookie notice shown on a first visit. */
export async function openShop(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
  await page.getByRole('button', { name: 'dismiss cookie message' }).click();
  await expect(page.getByRole('main')).toBeVisible();
}
