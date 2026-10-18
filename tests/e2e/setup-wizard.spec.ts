import { test, expect } from "@playwright/test";

test.describe("E2E User Journey: Setup Wizard & Recommendation (Task 29)", () => {
  test("completes 5-step wizard from home to explainable recommendation", async ({ page }) => {
    // 1. Visit Landing Page
    await page.goto("/");
    await expect(page.getByText(/make room for better soil/i)).toBeVisible();

    // 2. Start Setup
    await page.getByRole("link", { name: /start a setup/i }).first().click();
    await expect(page).toHaveURL(/\/setup/);

    // Step 1: Space Profile
    await expect(page.getByText(/step 1: space profile/i)).toBeVisible();
    await page.getByText(/balcony/i).first().click();
    await page.locator('input[id*="length"]').fill("100");
    await page.locator('input[id*="width"]').fill("80");
    await page.locator('input[id*="maxHeight"]').fill("120");
    await page.getByRole("button", { name: /continue to container/i }).click();

    // Step 2: ContainerCheck
    await expect(page.getByText(/step 2: containercheck/i)).toBeVisible();
    await page.locator('input[id*="internalLength"]').fill("50");
    await page.locator('input[id*="internalWidth"]').fill("40");
    await page.locator('input[id*="internalHeight"]').fill("35");
    await expect(page.getByText(/70(\.0)?\s*l/i)).toBeVisible();
    await page.getByRole("button", { name: /continue to materials/i }).click();

    // Step 3: Waste Inputs
    await expect(page.getByText(/organic waste inputs/i)).toBeVisible();
    await page.getByRole("button", { name: /continue to preferences/i }).click();

    // Step 4: Preferences
    await expect(page.getByText(/maintenance & preferences/i)).toBeVisible();
    await page.getByRole("button", { name: /review setup summary/i }).click();

    // Step 5: Summary Review
    await expect(page.getByText(/setup summary review/i)).toBeVisible();
    await page.getByRole("button", { name: /generate recommendation/i }).click();

    // Recommendation Result Screen
    await expect(page).toHaveURL(/\/setup\/result/);
    await expect(page.getByText(/your container is ready|modifications required|unsuitable|more information/i)).toBeVisible();

    // Open Source Drawer
    await page.getByRole("button", { name: /why this recommendation\?/i }).click();
    await expect(page.getByText(/rule provenance & literature citations/i)).toBeVisible();
    await page.getByRole("button", { name: /done reading|close/i }).first().click();
  });
});
