import { defineConfig, devices } from '@playwright/test';

// Juice Shop runs from its own folder, outside this repo.
// Locally: ../juice-shop-src (built from source). In CI: the release package.
const JUICE_SHOP_DIR = process.env.JUICE_SHOP_DIR ?? '../juice-shop-src';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0, // a BAT failure must mean a broken build, so no automatic retries
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm start',
    cwd: JUICE_SHOP_DIR,
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
