import { test, expect } from "@playwright/test";

const testProductTitle = "Mens Casual Slim Fit";

test("muestra hero y productos", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /ELEVA TU/i })).toBeVisible();
  await page.getByPlaceholder("Buscar productos...").fill(testProductTitle);

  const productHeadings = page.getByRole("main").getByRole("heading", { level: 3 });
  await expect(productHeadings.first()).toBeVisible();
  await expect(productHeadings).toHaveCount(1);
  await expect(productHeadings.first()).toContainText(/mens|slim fit/i);
});
