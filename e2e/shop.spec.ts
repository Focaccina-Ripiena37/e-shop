import { test, expect, type Page } from '@playwright/test';

const USER = { email: 'marco.rossi@email.it', password: 'password123' };

const cartLink = () => 'a[aria-label="Shopping cart"]';

async function clearAuth(page: Page): Promise<void> {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('unimart_guest_cart');
    sessionStorage.clear();
  });
}

async function addFirstProduct(page: Page): Promise<void> {
  await page.goto('/products');
  const firstCard = page.locator('.product-card').first();
  await expect(firstCard).toBeVisible();
  await firstCard.getByRole('button', { name: 'Add' }).click();
  await expect(page.locator(`${cartLink()} .mat-badge-content`)).toHaveText('1');
}

test.describe('catalog', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
  });

  test('loads seeded products and filters by search', async ({ page }) => {
    await page.goto('/products');
    const cards = page.locator('.product-card');
    await expect(cards.first()).toBeVisible();
    const total = await cards.count();
    expect(total).toBeGreaterThan(0);

    await page.getByPlaceholder('Search by title...').fill('MacBook');
    await expect(cards).toHaveCount(1);

    await page.getByPlaceholder('Search by title...').fill('zzz-no-match');
    await expect(page.getByText('No products found matching your filters.')).toBeVisible();
  });

  test('opens product detail from the grid', async ({ page }) => {
    await page.goto('/products');
    const firstCard = page.locator('.product-card').first();
    await expect(firstCard).toBeVisible();
    await firstCard.getByRole('button', { name: 'Details' }).click();
    await expect(page).toHaveURL(/\/products\/\d+$/);
    await expect(page.locator('.product-main-card')).toBeVisible();
  });
});

test.describe('theme', () => {
  test('toggles dark theme on the body', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const initialDark = await page.evaluate(() => document.body.classList.contains('dark-theme'));
    await page.getByLabel('Toggle theme').click();
    await expect
      .poll(() => page.evaluate(() => document.body.classList.contains('dark-theme')))
      .toBe(!initialDark);
  });
});

test.describe('guest cart', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
  });

  test('adds a product and keeps it after reload (localStorage persistence)', async ({ page }) => {
    await addFirstProduct(page);

    await page.reload();
    await expect(page.locator(`${cartLink()} .mat-badge-content`)).toHaveText('1');

    await page.goto('/cart');
    await expect(page.locator('.cart-item')).toHaveCount(1);
  });

  test('removes items and shows the empty state', async ({ page }) => {
    await addFirstProduct(page);

    await page.goto('/cart');
    await page.locator('.cart-item').getByRole('button', { name: 'Remove' }).click();
    await expect(page.getByText('Your cart is empty')).toBeVisible();
    await expect(page.locator(`${cartLink()} .mat-badge-content`)).toBeHidden();
  });

  test('updates quantity with + / - controls', async ({ page }) => {
    await addFirstProduct(page);

    await page.goto('/cart');
    await page.locator('.quantity-controls').getByRole('button', { name: '+' }).click();
    await expect(page.locator('.quantity-controls span')).toHaveText('2');
    await page.locator('.quantity-controls').getByRole('button', { name: '-' }).click();
    await expect(page.locator('.quantity-controls span')).toHaveText('1');
  });
});

test.describe('route guards', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
  });

  test('redirects guests from /checkout to the login page', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects guests from /orders to the login page', async ({ page }) => {
    await page.goto('/orders');
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('guest cart sync on login', () => {
  test('moves the localStorage guest cart to the server cart after login', async ({ page }) => {
    await clearAuth(page);
    await addFirstProduct(page);

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByLabel('Email').fill(USER.email);
    await page.getByLabel('Password').fill(USER.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByLabel('User menu')).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      localStorage.getItem('unimart_guest_cart')
    )).toBe('[]');
    await page.goto('/cart');
    await expect(page.locator('.cart-item')).toHaveCount(1);
    await expect(page.locator('.quantity-controls span')).toHaveText('1');
  });
});

test.describe('admin guard', () => {
  test('redirects non-admin users away from /admin', async ({ page }) => {
    await clearAuth(page);

    await page.goto('/login');
    await page.getByLabel('Email').fill(USER.email);
    await page.getByLabel('Password').fill(USER.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByLabel('User menu')).toBeVisible();

    await page.goto('/admin');
    await expect(page).not.toHaveURL(/\/admin/);
    await expect(page).toHaveURL(/\/products|\/login/);
  });
});
