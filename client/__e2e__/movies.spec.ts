import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('search', { tag: '@test-db' }, async ({ page }) => {
  await page.getByPlaceholder('Search by title...').click();
  await page.getByPlaceholder('Search by title...').fill('let');
  await page.getByLabel('Movie: Let Her Kill You').click();
  await page.waitForURL('**/movie/852436');
  await expect(page.getByRole('heading', { name: 'Let Her Kill You (2023)' })).toBeVisible();
});

test('filtering', { tag: '@test-db' }, async ({ page }) => {
  // Filtering Action movies
  await page.getByTestId('category-filter').click();
  await page.getByRole('option', { name: 'Action' }).click();
  const movieCards = page.locator('[data-testid="movie-card"]');
  await expect(movieCards).toHaveCount(16);

  // Expect page 2 to be visible
  await expect(page.locator('button:has-text("2")').first()).toBeVisible();
  await page.getByTestId('pagination-container').getByLabel('Go to page 2').click();
  const movieCards2 = page.locator('[data-testid="movie-card"]');
  await expect(movieCards2).toHaveCount(2);

  // Continuing filtering on Drama
  await page.getByLabel('Category').click();
  await page.getByRole('option', { name: 'Drama' }).click();
  const movieCards3 = page.locator('[data-testid="movie-card"]');
  await expect(movieCards3).toHaveCount(5);
});

test('sorting alphabetically', { tag: '@test-db' }, async ({ page }) => {
  const movieCards = page.locator('[data-testid="movie-card"]');
  await expect(movieCards.first()).toContainText('Blue Beetle');

  // Sorting by A-Z
  await page.getByTestId('sort').click();
  await page.getByRole('option', { name: 'A-Z' }).click();
  const movieCards2 = page.locator('[data-testid="movie-card"]');
  await expect(movieCards2.first()).toContainText('After Everything');

  // Sorting by Z-A
  await page.getByTestId('sort').click();
  await page.getByRole('option', { name: 'Z-A' }).click();
  const movieCards3 = page.locator('[data-testid="movie-card"]');
  await expect(movieCards3.first()).toContainText('Transformers: Rise of the Beasts');
});

test('sorting by rating', { tag: '@test-db' }, async ({ page }) => {
  const movieCards = page.locator('[data-testid="movie-card"]');
  await expect(movieCards.first()).toContainText('Blue Beetle');

  // Sorting by High to Low
  await page.getByTestId('sort').click();
  await page.getByRole('option', { name: 'Rating: High to Low' }).click();
  const movieCards2 = page.locator('[data-testid="movie-card"]');
  await expect(movieCards2.first()).toContainText('Spider-Man: Across the Spider-Verse');

  // Sorting by Low to High
  await page.getByTestId('sort').click();
  await page.getByRole('option', { name: 'Rating: Low to High' }).click();
  const movieCards3 = page.locator('[data-testid="movie-card"]');
  await expect(movieCards3.first()).toContainText('Let Her Kill You');
});

test('sorting & filtering', { tag: '@test-db' }, async ({ page }) => {
  const movieCards = page.locator('[data-testid="movie-card"]');
  await expect(movieCards.first()).toContainText('Blue Beetle');

  // Filtering on Drama
  await page.getByLabel('Category').click();
  await page.getByRole('option', { name: 'Drama' }).click();
  const movieCards2 = page.locator('[data-testid="movie-card"]');
  await expect(movieCards2).toHaveCount(5);
  await expect(movieCards2.first()).toContainText('Gran Turismo');

  // Sorting by High to Low
  await page.getByTestId('sort').click();
  await page.getByRole('option', { name: 'Rating: High to Low' }).click();
  const movieCards3 = page.locator('[data-testid="movie-card"]');
  await expect(movieCards3).toHaveCount(5);
  await expect(movieCards3.first()).toContainText('Oppenheimer');

  // Sorting by Low to High
  await page.getByTestId('sort').click();
  await page.getByRole('option', { name: 'Rating: Low to High' }).click();
  const movieCards4 = page.locator('[data-testid="movie-card"]');
  await expect(movieCards4).toHaveCount(5);
  await expect(movieCards4.first()).toContainText('Mondocane');
});

test('global state of sorting & filtering', { tag: '@test-db' }, async ({ page }) => {
  // Filtering on Drama
  await page.getByLabel('Category').click();
  await page.getByRole('option', { name: 'Drama' }).click();

  // Sorting by High to Low
  await page.getByTestId('sort').click();
  await page.getByRole('option', { name: 'Rating: High to Low' }).click();
  const movieCards1 = page.locator('[data-testid="movie-card"]');
  await expect(movieCards1.first()).toContainText('Oppenheimer');
  await movieCards1.first().click();

  // Go back to searches
  await page.getByLabel('link back to movie page').click();
  await expect(page.getByTestId('sort')).toHaveText('Rating: High to Low');
  await expect(page.getByTestId('category-filter')).toHaveText('Drama');
});

test('movie added to watchlist', { tag: '@test-db' }, async ({ page }) => {
  await page.getByTestId('login-button').click();
  await page.getByTestId('menu').click();
  await page.getByTestId('watchlist-link').click();
  await expect(page.locator('[data-testid="movies-list-container"]')).toHaveCount(0);

  // Add movie to watchlist
  await page.getByTestId('home-link').click();
  await page.getByRole('link', { name: 'Blue Beetle poster. title: Blue Beetle.' }).click();
  await page.getByTestId('watchlist-toggle-button').click();

  // Check watchlist
  await page.getByTestId('menu').click();
  await page.getByTestId('watchlist-link').click();
  await expect(page.locator('[data-testid="movies-list-container"]')).toHaveCount(1);

  // Remove movie from watchlist
  await page.getByTestId('watchlist-toggle-button').click();
  // First toggle button in case of mis-click
  await expect(page.getByTestId('watchlist-toggle-button')).toHaveAttribute('aria-label', 'Add movie to watchlist');
  await page.reload();
  await expect(page.locator('[data-testid="movies-list-container"]')).toHaveCount(0);
});

test('reset filter', { tag: '@test-db' }, async ({ page }) => {
  // Filtering on Drama
  await page.getByLabel('Category').click();
  await page.getByRole('option', { name: 'Drama' }).click();
  const movieCards = page.locator('[data-testid="movie-card"]');
  await expect(movieCards).toHaveCount(5);

  // Reset filter
  await page.getByTestId('reset-filter-button').click();
  await expect(movieCards).toHaveCount(16);
});

test('movie added to watchlist from icon on moviecard in movielist', { tag: '@test-db' }, async ({ page }) => {
  await page.getByTestId('login-button').click();

  // Add movie to watchlist
  await page.getByTestId('home-link').click();
  const buttons = page.locator('[data-testid="watchlist-toggle-button"]');
  await buttons.first().click();

  // Go to movie page
  const movieCards = page.locator('[data-testid="movie-card"]');
  await movieCards.first().click();

  // Check watchlist button
  await expect(page.getByTestId('watchlist-toggle-button')).toHaveAttribute(
    'aria-label',
    'Remove movie from watchlist',
  );

  // Check watchlist
  await page.getByTestId('menu').click();
  await page.getByTestId('watchlist-link').click();
  await expect(page.locator('[data-testid="movie-card"]')).toHaveCount(1);

  // Remove movie from watchlist
  await page.getByTestId('watchlist-toggle-button').click();
  await expect(page.getByTestId('watchlist-toggle-button')).toHaveAttribute('aria-label', 'Add movie to watchlist');
  await page.reload();
});

test('reviews affect score', { tag: '@test-db' }, async ({ page }) => {
  // Login
  await page.getByTestId('login-button').click();

  // Using a movie with bad reviews to ensure the sorting tests stays the same
  await page.goto('/movie/852436');
  const firstCount = Number(await page.getByTestId('vote-count').innerText());
  await page
    .locator('label')
    .filter({ hasText: /^4 Stars$/ })
    .click();

  // Give the page time to update
  await page.waitForTimeout(1000);
  const secondCount = Number(await page.getByTestId('vote-count').innerText());
  expect(secondCount).toBeGreaterThan(firstCount);

  // Check that the the count stays the same if clicking again
  await page
    .locator('label')
    .filter({ hasText: /^3 Stars$/ })
    .click();
  // Give the page time to update
  await page.waitForTimeout(1000);
  const thirdCount = Number(await page.getByTestId('vote-count').innerText());
  expect(thirdCount).toBe(secondCount);

  // Check that the count stays the same after reloading the page and clicking again
  await page.reload();
  const fourthCount = Number(await page.getByTestId('vote-count').innerText());
  expect(fourthCount).toBe(secondCount);
  // Give the page time to update
  await page
    .locator('label')
    .filter({ hasText: /^4 Stars$/ })
    .click();
  await page.waitForTimeout(1000);
  const fifthCount = Number(await page.getByTestId('vote-count').innerText());
  expect(fifthCount).toBe(secondCount);
});
