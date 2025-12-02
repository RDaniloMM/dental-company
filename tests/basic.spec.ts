import { test, expect } from "@playwright/test";

test("basic test", async ({ page }) => {
  await page.goto("https://dental-company-tacna.vercel.app");
  await expect(page).toHaveTitle(/Dental|Company/i);
});
