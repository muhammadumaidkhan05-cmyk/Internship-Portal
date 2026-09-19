import { test, expect } from "@playwright/test";

test("Login page should load correctly", async ({ page }) => {
  await page.goto("/");

  // Verify login page is open
  await expect(page).toHaveURL(/\/$/);

  // Verify main branding
  await expect(
    page.getByText("MSN Academy", { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText("Internship Management Portal", { exact: true })
  ).toBeVisible();

  // Verify login fields
  await expect(
    page.getByText("Email", { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText("Password", { exact: true })
  ).toBeVisible();

  // Verify login button
  await expect(
    page.getByRole("button", { name: /login/i })
  ).toBeVisible();

  // Verify register link
  await expect(
    page.getByText("Register", { exact: true })
  ).toBeVisible();
});