import { test, expect } from "@playwright/test";

const products = [
  {
    _id: "prod-1",
    title: "Camisa Urbana",
    price: 50,
    description: "Camisa premium",
    category: "apparel",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    stock: 10,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

test.beforeEach(async ({ page }) => {
  await page.route("**/products/getProducts**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "Access-Control-Allow-Origin": "http://127.0.0.1:3000",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({ productos: products }),
    });
  });
});

test("muestra hero y productos", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /ELEVA TU/i })).toBeVisible();
  await expect(
    page.getByRole("main").getByRole("heading", { name: products[0].title })
  ).toBeVisible();
});
