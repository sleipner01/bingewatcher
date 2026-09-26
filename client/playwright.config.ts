import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

// Tests tagged @test-db expect the movies in the shared test database, and only run when its URI is set.
// Without it, the server runs against an in-memory database with a small seeded dataset.
const testDbUri = process.env.E2E_TEST_DB_URI;

// Separate ports from the dev servers, so the tests never reuse a server pointing at another database
const clientPort = 5174;
const serverPort = 4100;

export default defineConfig({
  testDir: './__e2e__',
  grepInvert: testDbUri ? undefined : /@test-db/,
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  // The tests share one database, so run them one at a time in CI to keep the data predictable
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'html',
  use: {
    baseURL: `http://localhost:${clientPort}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: [
    {
      command: `bun run dev --port ${clientPort} --strictPort`,
      url: `http://localhost:${clientPort}`,
      env: { VITE_SERVER_URI: `http://localhost:${serverPort}` },
      reuseExistingServer: !isCI,
    },
    {
      command: testDbUri ? 'bun run start' : 'bun run start:e2e',
      cwd: '../server',
      url: `http://localhost:${serverPort}`,
      env: { PORT: String(serverPort), ...(testDbUri && { URI: testDbUri }) },
      reuseExistingServer: !isCI,
    },
  ],
});
