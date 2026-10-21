import { test, expect } from "@playwright/test";

test.describe("E2E User Journey: Setup Wizard & Recommendation (Task 29)", () => {
  test("completes 5-step wizard from home to explainable recommendation", async ({ page }) => {

    await page.goto("/");
    await expect(page.getByText(/make room for better soil/i)).toBeVisible();

    await page.getByRole("link", { name: /start a setup/i }).first().click({ force: true });
    await expect(page).toHaveURL(/\/setup/);

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
    await expect(page.getByText(/70(\.0)?\s*l/i)).toBeVisible();
    await page.getByRole("button", { name: /continue to materials/i }).click({ force: true });

    await expect(page.getByText(/what organic waste do you have\?/i)).toBeVisible();
    await page.getByRole("button", { name: /continue to preferences/i }).click({ force: true });

    await expect(page.getByText(/maintenance & preferences/i)).toBeVisible();
    await page.getByRole("button", { name: /review setup summary/i }).click({ force: true });

    await expect(page.getByText(/setup summary review/i)).toBeVisible();
    await page.getByRole("button", { name: /generate recommendation/i }).click({ force: true });

    await expect(page).toHaveURL(/\/setup\/result/);
    await expect(page.getByText(/your container is ready|modifications required|unsuitable|more information/i)).toBeVisible();

    await page.getByRole("button", { name: /why this recommendation\?/i }).click({ force: true });
    await expect(page.getByText(/rule provenance & literature citations/i)).toBeVisible();
    await page.getByRole("button", { name: /close|done reading/i }).first().click({ force: true });
  });
});
