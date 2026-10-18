import { test, expect } from "@playwright/test";

test.describe("E2E User Journey: Batch Tracking & Timeline (Task 29)", () => {
  test("creates a new batch, logs observation, and checks metric updates", async ({ page }) => {
    // Navigate through wizard to generate recommendation
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

    // On Result page, click start active batch
    await expect(page).toHaveURL(/\/setup\/result/);
    await page.getByRole("button", { name: /start active batch with this setup/i }).click();

    // Start batch modal
    await expect(page.getByText(/initialize active compost batch/i)).toBeVisible();
    await page.getByRole("button", { name: /start tracking batch/i }).click();

    // Arrives at batch dashboard
    await expect(page).toHaveURL(/\/batches\/.+/);
    await expect(page.getByText(/total organic inputs/i)).toBeVisible();
    await expect(page.getByText(/readiness window/i)).toBeVisible();

    // Log first observation
    await page.getByRole("button", { name: /log observation|log first observation/i }).first().click();
    await expect(page.getByText(/log batch observation/i)).toBeVisible();

    // Select ideal moisture and submit
    await page.getByRole("button", { name: /ideal/i }).click();
    await page.getByRole("button", { name: /record observation/i }).click();

    // Verify timeline card appears
    await expect(page.getByText(/batch observation timeline/i)).toBeVisible();
    await expect(page.getByText(/ideal \(damp sponge\)/i)).toBeVisible();
  });
});
