import { test, expect } from "@playwright/test";

const cartProduct = {
  _id: "prod-1",
  title: "Camisa Urbana",
  price: 50,
  description: "Camisa premium",
  category: "apparel",
  image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  stock: 10,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

test("muestra items y total en carrito", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("accessToken", "test-token");
  });

  await page.route("**/api/refreshToken", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "Access-Control-Allow-Origin": "http://127.0.0.1:3000",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({ accessToken: "test-token" }),
    });
  });

  await page.route("**/api/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "Access-Control-Allow-Origin": "http://127.0.0.1:3000",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({ _id: "user-1", email: "test@example.com" }),
    });
  });

  await page.route("**/products/getCart", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "Access-Control-Allow-Origin": "http://127.0.0.1:3000",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({
        items: [
          {
            productId: cartProduct,
            quantity: 2,
            priceSnapShot: 50,
          },
        ],
      }),
    });
  });

  await page.goto("/cart");

  await expect(
    page.getByRole("main").getByRole("heading", { name: cartProduct.title })
  ).toBeVisible();
  await expect(
    page.getByRole("main").getByText("$100.00").first()
  ).toBeVisible();
});
