import { test, expect } from '@playwright/test'

const BREAKPOINTS = [
  { name: 'mobile-sm', width: 320 },
  { name: 'mobile', width: 480 },
  { name: 'tablet-sm', width: 640 },
  { name: 'tablet', width: 768 },
  { name: 'desktop-sm', width: 1024 },
  { name: 'desktop', width: 1280 },
] as const

// Section labels (English) mapped to sidebar nav button text
const SECTIONS = [
  'Overview',
  'Colors',
  'Surfaces',
  'Typography',
  'Spacing',
  'Utilities',
  'Buttons',
  'Inputs',
  'Data Display',
  'Feedback',
  'Overlays',
  'Navigation',
  'Layout',
  'CSS Classes',
] as const

for (const bp of BREAKPOINTS) {
  test.describe(`${bp.name} (${bp.width}px)`, () => {
    test.use({ viewport: { width: bp.width, height: 800 } })

    for (const section of SECTIONS) {
      test(`${section} - no horizontal overflow`, async ({ page }) => {
        await page.goto('/')
        await page.waitForSelector('.ds-main')

        // Navigate to section via sidebar button
        // Use JS click to bypass display:none on mobile viewports
        await page.evaluate((label) => {
          const btn = Array.from(document.querySelectorAll('button.ds-nav-item'))
            .find(el => el.textContent?.trim() === label) as HTMLElement | undefined
          btn?.click()
        }, section)

        // Wait for content to render after section switch
        await page.waitForTimeout(300)

        // Check document-level horizontal overflow
        const docOverflow = await page.evaluate(() => {
          const { scrollWidth, clientWidth } = document.documentElement
          return { scrollWidth, clientWidth, overflows: scrollWidth > clientWidth }
        })
        expect(
          docOverflow.overflows,
          `Document overflow at ${bp.width}px in "${section}": scrollWidth=${docOverflow.scrollWidth} > clientWidth=${docOverflow.clientWidth}`,
        ).toBe(false)

        // Check .ds-main content overflow
        const mainOverflow = await page.evaluate(() => {
          const main = document.querySelector('.ds-main')
          if (!main) return { scrollWidth: 0, clientWidth: 0, overflows: false }
          return {
            scrollWidth: main.scrollWidth,
            clientWidth: main.clientWidth,
            overflows: main.scrollWidth > main.clientWidth,
          }
        })
        expect(
          mainOverflow.overflows,
          `.ds-main overflow at ${bp.width}px in "${section}": scrollWidth=${mainOverflow.scrollWidth} > clientWidth=${mainOverflow.clientWidth}`,
        ).toBe(false)
      })
    }

    // Mobile navigation: at <=768px sidebar is hidden, hamburger in navbar is visible
    if (bp.width <= 768) {
      test('navbar hamburger is visible and sidebar is hidden', async ({ page }) => {
        await page.goto('/')
        await page.waitForSelector('.ds-main')

        await expect(page.locator('.ds-sidebar')).not.toBeVisible()
        await expect(page.locator('.ds-navbar .ds-hamburger')).toBeVisible()
      })

      test('hamburger opens drawer and nav item closes it', async ({ page }) => {
        await page.goto('/')
        await page.waitForSelector('.ds-main')

        // Open drawer via navbar hamburger
        await page.locator('.ds-navbar .ds-hamburger').click()
        await expect(page.locator('.drawer-backdrop')).toBeVisible()
        await expect(page.locator('.drawer.drawer-left')).toBeVisible()

        // Drawer has nav items
        const navItems = page.locator('.drawer .ds-nav-item')
        expect(await navItems.count()).toBeGreaterThan(0)

        // Click a nav item closes the drawer
        await navItems.nth(1).click()
        await expect(page.locator('.drawer-backdrop')).not.toBeVisible()
      })
    }

    // Desktop: sidebar must be visible, hamburger must be hidden
    if (bp.width > 768) {
      test('sidebar is visible and hamburger is hidden', async ({ page }) => {
        await page.goto('/')
        await page.waitForSelector('.ds-main')

        await expect(page.locator('.ds-sidebar')).toBeVisible()
        await expect(page.locator('.ds-navbar .ds-hamburger')).not.toBeVisible()
      })
    }
  })
}
