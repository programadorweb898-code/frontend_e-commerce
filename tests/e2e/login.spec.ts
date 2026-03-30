import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "Access-Control-Allow-Origin": "http://127.0.0.1:3000",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({ accessToken: "test-token", message: "ok" }),
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
});

test("login redirige al home", async ({ page }) => {
  await page.goto("/login");

  await page.getByPlaceholder("name@example.com").fill("test@example.com");
  await page.getByPlaceholder("••••••••").fill("password123");
  await page.getByRole("button", { name: /Sign In Now/i }).click();

  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("accessToken")))
    .toBe("test-token");
});
