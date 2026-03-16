/**
 * i18n — Internationalization module
 * Supports: English (en), Vietnamese (vi)
 */

const translations = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.hi': 'Hi',
    'nav.logout': 'Logout',
    'nav.signIn': 'Sign In',

    // Footer
    'footer.brand': 'Premium food & beverages crafted with passion. From artisan coffee to freshly baked goods — we deliver quality to your door.',
    'footer.menu': 'Menu',
    'footer.company': 'Company',
    'footer.support': 'Support',
    'footer.aboutUs': 'About Us',
    'footer.careers': 'Careers',
    'footer.contact': 'Contact',
    'footer.faq': 'FAQ',
    'footer.shipping': 'Shipping',
    'footer.returns': 'Returns',
    'footer.copyright': 'Brewly. All rights reserved.',

    // Home
    'home.heroBadge': '✨ Crafted with Passion',
    'home.heroTitle': 'Discover the Finest',
    'home.heroHighlight': 'Food & Beverages',
    'home.heroDesc': 'From artisan coffee and premium teas to freshly baked pastries — every sip and bite is an experience worth savoring.',
    'home.exploreMenu': 'Explore Menu',
    'home.joinBrewly': 'Join Brewly',
    'home.categories': 'Our Categories',
    'home.categoriesDesc': 'Explore our carefully curated selection of premium food and beverages',
    'home.popular': 'Popular Right Now',
    'home.popularDesc': 'Trending items loved by our customers',
    'home.loadingCategories': 'Loading categories...',
    'home.loadingProducts': 'Loading products...',
    'home.errorCategories': 'Unable to load categories',
    'home.errorProducts': 'Unable to load products',
    'home.addedToCart': '✅ Added to cart!',

    // Products
    'products.title': 'Our Menu',
    'products.subtitle': 'Browse our full collection of premium food & beverages',
    'products.search': 'Search',
    'products.searchPlaceholder': 'Search products...',
    'products.categories': 'Categories',
    'products.all': 'All',
    'products.loading': 'Loading products...',
    'products.loadingShort': 'Loading...',
    'products.noProducts': 'No products found',
    'products.noProductsDesc': 'Try adjusting your search or filter criteria',
    'products.error': 'Failed to load products',
    'products.addedToCart': '✅ Added to cart!',

    // Product Card
    'card.soldOut': 'Sold Out',
    'card.bestSeller': '⭐ Best Seller',
    'card.addToCart': 'Add to Cart',
    'card.outOfStock': 'Out of Stock',

    // Product Detail
    'detail.backToMenu': '← Back to Menu',
    'detail.rating': 'rating',
    'detail.inStock': 'In Stock',
    'detail.outOfStock': 'Out of Stock',
    'detail.addToCart': 'Add to Cart',
    'detail.notFound': 'Product not found',
    'detail.notFoundDesc': "The product you're looking for doesn't exist or has been removed.",
    'detail.browseMenu': 'Browse Menu',
    'detail.addedToCart': 'added to cart!',
    'detail.loadingProduct': 'Loading product...',

    // Cart
    'cart.title': 'Your Cart',
    'cart.loading': 'Loading cart...',
    'cart.signInRequired': 'Sign in to view your cart',
    'cart.signInRequiredDesc': 'You need to be logged in to add items and view your cart',
    'cart.signIn': 'Sign In',
    'cart.empty': 'Your cart is empty',
    'cart.emptyDesc': 'Add some delicious items from our menu',
    'cart.browseMenu': 'Browse Menu',
    'cart.orderSummary': 'Order Summary',
    'cart.subtotal': 'Subtotal',
    'cart.items': 'items',
    'cart.delivery': 'Delivery',
    'cart.free': 'Free',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.clearCart': 'Clear Cart',
    'cart.remove': 'Remove',
    'cart.itemRemoved': '🗑️ Item removed',
    'cart.cartCleared': '🗑️ Cart cleared',
    'cart.error': 'Failed to load cart',

    // Login
    'login.title': 'Welcome Back',
    'login.subtitle': 'Sign in to your Brewly account',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.signIn': 'Sign In',
    'login.noAccount': "Don't have an account?",
    'login.createOne': 'Create one',
    'login.demoAccount': 'Demo account',

    // Register
    'register.title': 'Join Brewly',
    'register.subtitle': 'Create your account and start ordering',
    'register.fullName': 'Full Name',
    'register.email': 'Email',
    'register.password': 'Password',
    'register.confirmPassword': 'Confirm Password',
    'register.createAccount': 'Create Account',
    'register.hasAccount': 'Already have an account?',
    'register.signIn': 'Sign in',
    'register.passwordMismatch': 'Passwords do not match',
    'register.successEmail': '📧 Welcome email sent! Check your inbox.',

    // 404
    'notFound.title': 'Page not found',
    'notFound.desc': "The page you're looking for doesn't exist",
    'notFound.goHome': 'Go Home',
  },

  vi: {
    // Navbar
    'nav.home': 'Trang chủ',
    'nav.menu': 'Thực đơn',
    'nav.hi': 'Xin chào',
    'nav.logout': 'Đăng xuất',
    'nav.signIn': 'Đăng nhập',

    // Footer
    'footer.brand': 'Thực phẩm & đồ uống cao cấp được chế biến với đam mê. Từ cà phê thủ công đến bánh nướng tươi — chúng tôi mang chất lượng đến tận nhà bạn.',
    'footer.menu': 'Thực đơn',
    'footer.company': 'Công ty',
    'footer.support': 'Hỗ trợ',
    'footer.aboutUs': 'Về chúng tôi',
    'footer.careers': 'Tuyển dụng',
    'footer.contact': 'Liên hệ',
    'footer.faq': 'Câu hỏi thường gặp',
    'footer.shipping': 'Vận chuyển',
    'footer.returns': 'Đổi trả',
    'footer.copyright': 'Brewly. Bảo lưu mọi quyền.',

    // Home
    'home.heroBadge': '✨ Chế biến bằng Đam mê',
    'home.heroTitle': 'Khám phá những',
    'home.heroHighlight': 'Đồ ăn & Thức uống',
    'home.heroDesc': 'Từ cà phê thủ công và trà cao cấp đến bánh ngọt nướng tươi — mỗi ngụm và mỗi miếng đều là trải nghiệm đáng thưởng thức.',
    'home.exploreMenu': 'Khám phá thực đơn',
    'home.joinBrewly': 'Tham gia Brewly',
    'home.categories': 'Danh mục',
    'home.categoriesDesc': 'Khám phá bộ sưu tập thực phẩm và đồ uống cao cấp được tuyển chọn kỹ lưỡng',
    'home.popular': 'Phổ biến ngay bây giờ',
    'home.popularDesc': 'Những món được yêu thích bởi khách hàng',
    'home.loadingCategories': 'Đang tải danh mục...',
    'home.loadingProducts': 'Đang tải sản phẩm...',
    'home.errorCategories': 'Không thể tải danh mục',
    'home.errorProducts': 'Không thể tải sản phẩm',
    'home.addedToCart': '✅ Đã thêm vào giỏ hàng!',

    // Products
    'products.title': 'Thực đơn',
    'products.subtitle': 'Duyệt bộ sưu tập đầy đủ thực phẩm & đồ uống cao cấp',
    'products.search': 'Tìm kiếm',
    'products.searchPlaceholder': 'Tìm kiếm sản phẩm...',
    'products.categories': 'Danh mục',
    'products.all': 'Tất cả',
    'products.loading': 'Đang tải sản phẩm...',
    'products.loadingShort': 'Đang tải...',
    'products.noProducts': 'Không tìm thấy sản phẩm',
    'products.noProductsDesc': 'Thử điều chỉnh tìm kiếm hoặc bộ lọc',
    'products.error': 'Không thể tải sản phẩm',
    'products.addedToCart': '✅ Đã thêm vào giỏ hàng!',

    // Product Card
    'card.soldOut': 'Hết hàng',
    'card.bestSeller': '⭐ Bán chạy',
    'card.addToCart': 'Thêm vào giỏ',
    'card.outOfStock': 'Hết hàng',

    // Product Detail
    'detail.backToMenu': '← Quay lại thực đơn',
    'detail.rating': 'đánh giá',
    'detail.inStock': 'Còn hàng',
    'detail.outOfStock': 'Hết hàng',
    'detail.addToCart': 'Thêm vào giỏ',
    'detail.notFound': 'Không tìm thấy sản phẩm',
    'detail.notFoundDesc': 'Sản phẩm bạn đang tìm không tồn tại hoặc đã bị xóa.',
    'detail.browseMenu': 'Xem thực đơn',
    'detail.addedToCart': 'đã thêm vào giỏ!',
    'detail.loadingProduct': 'Đang tải sản phẩm...',

    // Cart
    'cart.title': 'Giỏ hàng',
    'cart.loading': 'Đang tải giỏ hàng...',
    'cart.signInRequired': 'Đăng nhập để xem giỏ hàng',
    'cart.signInRequiredDesc': 'Bạn cần đăng nhập để thêm sản phẩm và xem giỏ hàng',
    'cart.signIn': 'Đăng nhập',
    'cart.empty': 'Giỏ hàng trống',
    'cart.emptyDesc': 'Thêm một vài món ngon từ thực đơn của chúng tôi',
    'cart.browseMenu': 'Xem thực đơn',
    'cart.orderSummary': 'Tóm tắt đơn hàng',
    'cart.subtotal': 'Tạm tính',
    'cart.items': 'sản phẩm',
    'cart.delivery': 'Giao hàng',
    'cart.free': 'Miễn phí',
    'cart.total': 'Tổng cộng',
    'cart.checkout': 'Thanh toán',
    'cart.clearCart': 'Xóa giỏ hàng',
    'cart.remove': 'Xóa',
    'cart.itemRemoved': '🗑️ Đã xóa sản phẩm',
    'cart.cartCleared': '🗑️ Đã xóa giỏ hàng',
    'cart.error': 'Không thể tải giỏ hàng',

    // Login
    'login.title': 'Chào mừng trở lại',
    'login.subtitle': 'Đăng nhập vào tài khoản Brewly',
    'login.email': 'Email',
    'login.password': 'Mật khẩu',
    'login.signIn': 'Đăng nhập',
    'login.noAccount': 'Chưa có tài khoản?',
    'login.createOne': 'Tạo tài khoản',
    'login.demoAccount': 'Tài khoản thử',

    // Register
    'register.title': 'Tham gia Brewly',
    'register.subtitle': 'Tạo tài khoản và bắt đầu đặt hàng',
    'register.fullName': 'Họ và tên',
    'register.email': 'Email',
    'register.password': 'Mật khẩu',
    'register.confirmPassword': 'Xác nhận mật khẩu',
    'register.createAccount': 'Tạo tài khoản',
    'register.hasAccount': 'Đã có tài khoản?',
    'register.signIn': 'Đăng nhập',
    'register.passwordMismatch': 'Mật khẩu không khớp',
    'register.successEmail': '📧 Email chào mừng đã gửi! Kiểm tra hộp thư nhé.',

    // 404
    'notFound.title': 'Không tìm thấy trang',
    'notFound.desc': 'Trang bạn đang tìm không tồn tại',
    'notFound.goHome': 'Về trang chủ',
  },
};

const STORAGE_KEY = 'brewly_lang';

/** Get current language */
export function getLang() {
  return localStorage.getItem(STORAGE_KEY) || 'en';
}

/** Set language and re-render */
export function setLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
  // Trigger re-render via hashchange
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

/** Translate a key */
export function t(key) {
  const lang = getLang();
  return translations[lang]?.[key] || translations['en']?.[key] || key;
}
