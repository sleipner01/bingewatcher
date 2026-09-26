import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './__e2e__',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  // The tests share one database, so run them one at a time in CI to keep the data predictable
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: [
    {
      command: 'bun run dev',
      url: 'http://localhost:5173',
      env: { VITE_SERVER_URI: 'http://localhost:4000' },
      reuseExistingServer: !isCI,
    },
    {
      command: isCI ? 'bun run start "$DB_URI"' : 'bun run start',
      cwd: '../server',
      url: 'http://localhost:4000',
      reuseExistingServer: !isCI,
    },
  ],
});
