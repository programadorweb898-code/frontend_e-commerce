import { test, expect } from "@playwright/test";

const testPassword = "Gomito10$";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const createTestEmail = () =>
  `gomito724+${Date.now()}-${Math.random().toString(36).slice(2, 8)}@gmail.com`;

async function ensureTestUser(
  request: import("@playwright/test").APIRequestContext,
  email: string
) {
  const response = await request.post(`${apiBaseUrl}/api/register`, {
    data: {
      email,
      password: testPassword,
      confirmPassword: testPassword,
    },
  });

  if (![200, 403].includes(response.status())) {
    throw new Error(`Unexpected register status: ${response.status()}`);
  }
}

test("muestra items y total en carrito", async ({ page, request }) => {
  const testEmail = createTestEmail();
  await ensureTestUser(request, testEmail);
  await page.goto("/login");
  await page.getByPlaceholder("name@example.com").fill(testEmail);
  await page.getByPlaceholder("••••••••").fill(testPassword);
  await page.getByRole("button", { name: /Sign In Now/i }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("accessToken")))
    .not.toBeNull();

  const productHeading = page
    .getByRole("main")
    .getByRole("heading", { level: 3 })
    .first();
  await expect(productHeading).toBeVisible();
  const testProductTitle = (await productHeading.textContent())?.trim();
  if (!testProductTitle) {
    throw new Error("No product title found on home page");
  }

  const productCard = productHeading.locator("..").locator("..");
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/products/addProduct") && response.status() === 200
    ),
    productCard.getByRole("button").click(),
  ]);

  await page.getByRole("button", { name: /open cart/i }).click();

  const cartDrawer = page.locator("aside");
  await expect(
    cartDrawer.getByRole("heading", {
      name: /carrito de compras|shopping cart/i,
    })
  ).toBeVisible();

  const cartItemHeading = cartDrawer.getByRole("heading", { level: 3 }).first();
  await expect(cartItemHeading).toBeVisible();
  const cartItemTitle = (await cartItemHeading.textContent())?.trim();
  expect(cartItemTitle).toBeTruthy();
  expect([testProductTitle, "Product"]).toContain(cartItemTitle);
});
