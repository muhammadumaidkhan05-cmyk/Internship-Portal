# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.js >> Login page should load correctly
- Location: tests\login.spec.js:3:1

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/$/
Received string:  "http://localhost:5173/login"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × locator resolved to <html lang="en">…</html>
       - unexpected value "http://localhost:5173/login"

```

```yaml
- text: M
- heading "MSN Academy" [level=1]
- paragraph: Internship Management Portal
- text: Email
- textbox "Email":
  - /placeholder: name@example.com
- text: Password
- textbox "Password":
  - /placeholder: "********"
- text: Sign in as
- combobox "Sign in as":
  - option "Intern" [selected]
  - option "Project Manager"
  - option "Mentor"
  - option "Program Manager"
  - option "Super Admin"
- link "Forgot Password?":
  - /url: /forgot-password
- button "Login"
- paragraph:
  - text: Don't have an account?
  - link "Register":
    - /url: /register
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("Login page should load correctly", async ({ page }) => {
  4  |   await page.goto("/");
  5  | 
  6  |   // Verify login page is open
> 7  |   await expect(page).toHaveURL(/\/$/);
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  8  | 
  9  |   // Verify main branding
  10 |   await expect(
  11 |     page.getByText("MSN Academy", { exact: true })
  12 |   ).toBeVisible();
  13 | 
  14 |   await expect(
  15 |     page.getByText("Internship Management Portal", { exact: true })
  16 |   ).toBeVisible();
  17 | 
  18 |   // Verify login fields
  19 |   await expect(
  20 |     page.getByText("Email", { exact: true })
  21 |   ).toBeVisible();
  22 | 
  23 |   await expect(
  24 |     page.getByText("Password", { exact: true })
  25 |   ).toBeVisible();
  26 | 
  27 |   // Verify login button
  28 |   await expect(
  29 |     page.getByRole("button", { name: /login/i })
  30 |   ).toBeVisible();
  31 | 
  32 |   // Verify register link
  33 |   await expect(
  34 |     page.getByText("Register", { exact: true })
  35 |   ).toBeVisible();
  36 | });
```