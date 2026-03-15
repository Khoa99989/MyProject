# Page Object Model (POM) — Playwright Automation

Automation được viết theo **Page Object Model**: mỗi màn hình có một class (Page Object) chứa **locators** và **actions**, test chỉ gọi actions và assert, không dùng trực tiếp `page.locator()` trong spec.

## Cấu trúc thư mục

```
pages/
  BasePage.ts        # Base class: navigate, fillInput, clickElement, wait, clearAuthStorage...
  HomePage.ts        # Trang chủ: navBar, userMenu, search, logout...
  LoginPage.ts       # Đăng nhập: emailInput, passwordInput, login()
  RegisterPage.ts    # Đăng ký: register(), getErrorMessage...
  ProductListPage.ts # Danh sách sản phẩm: productCards, search, filterByCategory, clickFirstProductCard, addFirstProductToCart
  ProductDetailPage.ts # Chi tiết sản phẩm: addToCart, getQuantity, goBack...
  CartPage.ts        # Giỏ hàng: cartItems, getTotal, clearCart, isEmpty...
  index.ts           # Export tất cả page objects

fixtures/
  base.fixture.ts    # Extend Playwright test: inject loginPage, homePage, cartPage, ...

tests/
  *.spec.ts          # Chỉ dùng page objects từ fixture, không dùng page.locator() trực tiếp
```

## Quy tắc

1. **Locators** — Khai báo trong constructor của từng Page Object (readonly).
2. **Actions** — Method async (ví dụ: `login()`, `goto()`, `addFirstProductToCart()`) gọi `clickElement`, `fillInput` từ BasePage.
3. **Tests** — Import `test, expect` từ `fixtures/base.fixture`, dùng fixture `loginPage`, `cartPage`, ...; không truy cập `page` trừ khi thật cần (ưu tiên thêm method vào Page Object).
4. **Chờ** — Ưu tiên `waitForPageLoad()`, `waitForLoginSuccess()`, `waitForCartLoaded()`, `waitForProductsLoaded()` và `expect(locator).toBeVisible()`. Tránh `wait(ms)`; chỉ dùng khi không có tín hiệu ổn định.

## Ví dụ

**Trong test — chỉ dùng page objects:**

```ts
import { test, expect } from '../fixtures/base.fixture';

test('user can login and see cart', async ({ loginPage, cartPage, productListPage }) => {
  await loginPage.goto();
  await loginPage.login('demo@fnb.com', 'password123');
  await loginPage.waitForPageLoad();

  await productListPage.goto();
  await productListPage.waitForProductsLoaded();
  await productListPage.addFirstProductToCart();

  await cartPage.goto();
  await expect(cartPage.cartTotal).toBeVisible();
});
```

**Trong Page Object — chứa locators và actions:**

```ts
// ProductListPage.ts
async addFirstProductToCart(): Promise<boolean> {
  const addBtn = this.page.locator('.add-to-cart-btn[data-product-id]').first();
  if (!(await addBtn.isVisible())) return false;
  await this.clickElement(addBtn);
  await this.wait(500);
  return true;
}
```

## Chạy test

```bash
npm test
# hoặc
npx playwright test
```
