import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('generates a user', async ({ page }) => {
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('user-name')).toBeVisible();
});

test('watchlist toggles appear/disappear', async ({ page }) => {
  await expect(page.getByTestId('watchlist-toggle-button')).not.toBeVisible();
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('watchlist-toggle-button')).toHaveCount(16);
});

test('logs out and into the same user', async ({ page }) => {
  // Logging in
  await expect(page.getByTestId('login-button')).toBeVisible();
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('menu')).toBeVisible();
  await expect(page.getByTestId('user-name')).toBeVisible();
  const username = await page.getByTestId('user-name').textContent();

  // Logging out
  await page.getByTestId('menu').click();
  await page.getByTestId('logout').click();
  await expect(page.getByTestId('menu')).toBeHidden();
  await expect(page.getByTestId('user-name')).toBeHidden();
  await expect(page.getByTestId('login-button')).toBeVisible();

  // Logging in again
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('menu')).toBeVisible();
  await expect(page.getByTestId('user-name')).toBeVisible();
  expect(await page.getByTestId('user-name').textContent()).toBe(username);
});

test('generates a completely new user', async ({ page }) => {
  // Logging in
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('user-name')).toBeVisible();
  const username = await page.getByTestId('user-name').textContent();

  // Deleting user
  await page.getByTestId('menu').click();
  await page.getByTestId('delete-user').click();
  await expect(page.getByTestId('user-name')).toBeHidden();
  await expect(page.getByTestId('login-button')).toBeVisible();

  // Logging in again
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('user-name')).toBeVisible();
  expect(await page.getByTestId('user-name').textContent()).not.toBe(username);
});

test('toggles dark mode', async ({ page }) => {
  await page.getByTestId('login-button').click();
  await page.getByTestId('menu').click();
  await page.getByTestId('dark-mode-toggle').click();
  expect(await page.getAttribute('html', 'data-theme')).toBe('dark');
  await page.getByTestId('dark-mode-toggle').click();
  expect(await page.getAttribute('html', 'data-theme')).toBe('light');
});

test('persistent dark mode', async ({ page }) => {
  await page.getByTestId('login-button').click();
  await page.getByTestId('menu').click();
  await page.getByTestId('dark-mode-toggle').click();
  expect(await page.getAttribute('html', 'data-theme')).toBe('dark');
  await page.reload();
  expect(await page.getAttribute('html', 'data-theme')).toBe('dark');
});

test('dark mode persistent when user logs out', async ({ page }) => {
  await page.getByTestId('login-button').click();
  await page.getByTestId('menu').click();
  await page.getByTestId('dark-mode-toggle').click();
  expect(await page.getAttribute('html', 'data-theme')).toBe('dark');
  await page.getByTestId('logout').click();
  expect(await page.getAttribute('html', 'data-theme')).toBe('dark');
  await page.reload();
  expect(await page.getAttribute('html', 'data-theme')).toBe('dark');
});

test('dark mode reset when user is deleted', async ({ page }) => {
  await page.getByTestId('login-button').click();
  await page.getByTestId('menu').click();
  await page.getByTestId('dark-mode-toggle').click();
  expect(await page.getAttribute('html', 'data-theme')).toBe('dark');
  await page.getByTestId('delete-user').click();
  expect(await page.getAttribute('html', 'data-theme')).toBe('light');
});
