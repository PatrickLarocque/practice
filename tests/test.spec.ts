import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Test Project/);
});

test('should display correct message in mat-card', async ({ page }) => {
  await page.goto('/');

  // Using text content directly
  await expect(page.getByText('Hello from the internet')).toBeVisible();

  // More specific using material card selectors
  await expect(page.locator('mat-card mat-card-content p')).toHaveText('Hello from the internet');

  // Test if it's inside a mat-card (more strict)
  const matCard = page.locator('mat-card');
  await expect(matCard).toBeVisible();
  await expect(matCard.locator('mat-card-content p')).toContainText('Hello from the internet');
});
