import { test, expect } from "@playwright/test";

test.describe("E2E User Journey: Guided Troubleshooter (Task 29)", () => {
  test("diagnoses odor symptom and applies resolution to batch log", async ({ page }) => {
    // Navigate through wizard to create a batch
    await page.goto("/setup");
    await expect(page.getByText(/where will you compost\?/i)).toBeVisible();
    await page.getByText(/balcony/i).first().click({ force: true });
    await page.getByLabel(/available length/i).fill("100");
    await page.getByLabel(/available width/i).fill("80");
    await page.getByLabel(/maximum height/i).fill("120");
    await page.getByRole("button", { name: /continue to container/i }).click({ force: true });

    await expect(page.getByText(/check your container/i)).toBeVisible();
    await page.getByLabel(/internal length/i).fill("50");
    await page.getByLabel(/internal width/i).fill("40");
    await page.getByLabel(/internal height/i).fill("35");
    await page.getByRole("button", { name: /continue to materials/i }).click({ force: true });

    await expect(page.getByText(/what organic waste do you have\?/i)).toBeVisible();
    await page.getByRole("button", { name: /continue to preferences/i }).click({ force: true });

    await expect(page.getByText(/maintenance & preferences/i)).toBeVisible();
    await page.getByRole("button", { name: /review setup summary/i }).click({ force: true });

    await expect(page.getByText(/setup summary review/i)).toBeVisible();
    await page.getByRole("button", { name: /generate recommendation/i }).click({ force: true });

    await page.getByRole("button", { name: /start active batch with this setup/i }).click({ force: true });
    await page.getByRole("button", { name: /start tracking batch/i }).click({ force: true });

    // From dashboard, click Troubleshoot Issue
    await expect(page).toHaveURL(/\/batches\/.+/);
    await page.getByRole("link", { name: /troubleshoot issue/i }).click({ force: true });

    // On Troubleshoot page
    await expect(page.getByText(/interactive troubleshooting assistant/i)).toBeVisible();
    await page.getByText(/foul rotten egg or ammonia odor/i).click({ force: true });

    // Verify resolution view
    await expect(page.getByText(/what to inspect/i)).toBeVisible();
    await expect(page.getByText(/what to do immediately/i)).toBeVisible();
    await expect(page.getByText(/EPA Composting at Home/i)).toBeVisible();

    // Apply & Record in Batch Log
    await page.getByRole("button", { name: /apply & record in batch log/i }).click({ force: true });

    // Redirected back to dashboard with updated timeline
    await expect(page).toHaveURL(/\/batches\/[^\/]+$/);
    await expect(page.getByText(/troubleshoot applied/i)).toBeVisible();
  });
});
