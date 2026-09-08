import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/specs',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: false,
      },
    ],
  ],

  use: {
    baseURL: 'http://127.0.0.1:8080',

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  webServer: {
    command: 'npm start',
    url: 'http://127.0.0.1:8080/todo',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});