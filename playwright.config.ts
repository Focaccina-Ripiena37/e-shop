import { defineConfig, devices } from '@playwright/test';

/**
 * E2E configuration - runs against the app served on :4200 with the real
 * Rails API on :3001 (docker compose or local dev servers). By default the
 * config starts `ng serve`; set E2E_NO_WEBSERVER=1 to reuse an external
 * server (e.g. the docker compose frontend in CI).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:4200',
    trace: 'on-first-retry'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.E2E_NO_WEBSERVER
    ? undefined
    : {
        command: 'npm start -- --port 4200',
        url: 'http://localhost:4200',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000
      }
});