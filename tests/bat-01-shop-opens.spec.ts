import { test, expect } from '@playwright/test';
import { openShop } from './helpers';

/**
 * BAT-01 | UJ: all | P0
 * Shop opens: the home page loads and shows a list of products with names and prices.
 * Written by hand, as the reference for judging the AI-generated tests.
 */
test('BAT-01 shop opens and lists products with names and prices', async ({ page, request }) => {
  await openShop(page);

  const products = page.getByRole('main').getByRole('article');
  await expect(products.first()).toBeVisible();
  const count = await products.count();
  expect(count, 'at least one product is listed').toBeGreaterThan(0);

  // Every product on the page has a name and a price like "1.99¤" or "5000¤".
  for (let i = 0; i < count; i++) {
    const card = products.nth(i);
    await expect(card.getByRole('img')).toHaveAttribute('alt', /\S/);
    await expect(card).toContainText(/\d+(\.\d{1,2})?¤/);
  }

  // The price shown matches the shop's product data, not just any number.
  const api = await request.get('/rest/products/search?q=Apple Juice');
  const apple = (await api.json()).data.find((p: { name: string }) => p.name === 'Apple Juice (1000ml)');
  const appleCard = products.filter({ has: page.getByRole('img', { name: 'Apple Juice (1000ml)' }) });
  await expect(appleCard).toContainText(`${apple.price}¤`);
});
