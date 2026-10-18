import { test, expect } from "@playwright/test";

test.describe("E2E User Journey: Guided Troubleshooter (Task 29)", () => {
  test("diagnoses odor symptom and applies resolution to batch log", async ({ page }) => {
    // Navigate through wizard to create a batch
    await page.goto("/setup");
    await page.getByText(/balcony/i).first().click();
    await page.locator('input[id*="length"]').fill("100");
    await page.locator('input[id*="width"]').fill("80");
    await page.locator('input[id*="maxHeight"]').fill("120");
    await page.getByRole("button", { name: /continue to container/i }).click();

    await page.locator('input[id*="internalLength"]').fill("50");
    await page.locator('input[id*="internalWidth"]').fill("40");
    await page.locator('input[id*="internalHeight"]').fill("35");
    await page.getByRole("button", { name: /continue to materials/i }).click();
    await page.getByRole("button", { name: /continue to preferences/i }).click();
    await page.getByRole("button", { name: /review setup summary/i }).click();
    await page.getByRole("button", { name: /generate recommendation/i }).click();

    await page.getByRole("button", { name: /start active batch with this setup/i }).click();
    await page.getByRole("button", { name: /start tracking batch/i }).click();

    // From dashboard, click Troubleshoot Issue
    await expect(page).toHaveURL(/\/batches\/.+/);
    await page.getByRole("link", { name: /troubleshoot issue/i }).click();

    // On Troubleshoot page
    await expect(page.getByText(/interactive troubleshooting assistant/i)).toBeVisible();
    await page.getByText(/foul rotten egg or ammonia odor/i).click();

    // Verify resolution view
    await expect(page.getByText(/what to inspect/i)).toBeVisible();
    await expect(page.getByText(/what to do immediately/i)).toBeVisible();
    await expect(page.getByText(/EPA Composting at Home/i)).toBeVisible();

    // Apply & Record in Batch Log
    await page.getByRole("button", { name: /apply & record in batch log/i }).click();

    // Redirected back to dashboard with updated timeline
    await expect(page).toHaveURL(/\/batches\/[^\/]+$/);
    await expect(page.getByText(/troubleshoot applied/i)).toBeVisible();
  });
});
