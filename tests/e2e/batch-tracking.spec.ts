import { test, expect } from "@playwright/test";

test.describe("E2E User Journey: Batch Tracking & Timeline (Task 29)", () => {
  test("creates a new batch, logs observation, and checks metric updates", async ({ page }) => {
    // Navigate through wizard to generate recommendation
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

    // On Result page, click start active batch
    await expect(page).toHaveURL(/\/setup\/result/);
    await page.getByRole("button", { name: /start active batch with this setup/i }).click({ force: true });

    // Start batch modal
    await expect(page.getByText(/initialize active compost batch/i)).toBeVisible();
    await page.getByRole("button", { name: /start tracking batch/i }).click({ force: true });

    // Arrives at batch dashboard
    await expect(page).toHaveURL(/\/batches\/.+/);
    await expect(page.getByText(/total organic inputs/i)).toBeVisible();
    await expect(page.getByText(/readiness window/i)).toBeVisible();

    // Log first observation
    await page.getByRole("button", { name: /log observation|log first observation/i }).first().click({ force: true });
    await expect(page.getByText(/log batch observation/i)).toBeVisible();

    // Select ideal moisture and submit
    await page.getByRole("button", { name: /ideal/i }).click({ force: true });
    await page.getByRole("button", { name: /record observation/i }).click({ force: true });

    // Verify timeline card appears
    await expect(page.getByText(/batch observation timeline/i)).toBeVisible();
    await expect(page.getByText(/ideal \(damp sponge\)/i)).toBeVisible();
  });
});
