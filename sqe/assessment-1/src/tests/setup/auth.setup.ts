import { test as setup, expect } from "@playwright/test";
import { config } from "../../utils/config";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  // Sign-in journey
  await page.goto("/");

  // 1. Visit sign-in page
  await page.getByRole("link", { name: "Sign in" }).click();

  // 2. Fill-in auth credentials
  await page
    .getByRole("textbox", { name: "Username or email address" })
    .fill(config.email);
  await page.getByRole("textbox", { name: "Password" }).fill(config.password);
  await page.getByRole("button", { name: "Sign in" }).click();

  // 3. Confirm signed in
  await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();

  // 4. Save state for other tests
  await page.context().storageState({ path: authFile });
});