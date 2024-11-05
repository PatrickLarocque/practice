import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npm run serve:e2e',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },
  use: {
    baseURL: 'http://localhost:4200',
  },
  testDir: './tests'
});