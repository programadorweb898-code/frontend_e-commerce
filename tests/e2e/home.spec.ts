import { test, expect } from "@playwright/test";

const testProductTitle = "Mens Casual Slim Fit";

test("muestra hero y productos", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /ELEVA TU/i })).toBeVisible();
  await page.getByPlaceholder("Buscar productos...").fill(testProductTitle);
  await expect(
    page.getByRole("main").getByRole("heading", { name: testProductTitle })
  ).toBeVisible();
});
