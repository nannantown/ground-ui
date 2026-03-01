import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL: 'http://localhost:6100',
  },
  webServer: {
    command: 'npm run catalog',
    port: 6100,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { channel: 'chromium' } },
  ],
})
