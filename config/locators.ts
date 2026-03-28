export const LOCATORS = {
    // GENERAL LOCATORS
    title: '[data-test="title"]',
    productItem: '.inventory_item',
    productName: '.inventory_item_name',
    productPrice: '.inventory_item_price',
    cartBadge: '[data-test="shopping-cart-badge"]',
    removeBtnPrefix: '[data-test^="remove-"]',
    errorMsg: '[data-test="error"]',
    cartItem: '[data-test="inventory-item"]',
    cartQuantity: '[data-test="item-quantity"]',
    cancelBtn: '[data-test="cancel"]',

    // LOGIN / LOGOUT
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginBtn: '[data-test="login-button"]',
    swagLabsLogo: '.login_logo',
    burgerMenuBtn: '#react-burger-menu-btn',
    logoutLink: '[data-test="logout-sidebar-link"]',

    // INVENTORY
    inventoryTitle: '.title',
    primaryHeader: '[data-test="primary-header"]',
    crossBurgerBtn: '#react-burger-cross-btn',
    aboutLink: '[data-test="about-sidebar-link"]',
    resetLink: '[data-test="reset-sidebar-link"]',
    sortDropdown: '.product_sort_container',
    productDescription: '[data-test="inventory-item-desc"]',
    addBtnPrefix: '[data-test^="add-to-cart-"]',
    cartLink: '[data-test="shopping-cart-link"]',

    // CART
    continueShoppingBtn: '[data-test="continue-shopping"]',
    checkoutBtn: '[data-test="checkout"]',
    allItemsLink: '[data-test="inventory-sidebar-link"]',

    // CHECKOUT
    // Step one
    firstNameInput: '[data-test="firstName"]',
    lastNameInput: '[data-test="lastName"]',
    zipCodeInput: '[data-test="postalCode"]',
    continueButton: '[data-test="continue"]',

    // Step two
    paymentInfoLabel: '[data-test="payment-info-label"]',
    paymentInfoValue: '[data-test="payment-info-value"]',
    shippingInfoLabel: '[data-test="shipping-info-label"]',
    shippingInfoValue: '[data-test="shipping-info-value"]',
    totalInfoLabel: '[data-test="total-info-label"]',
    subtotalLabel: '.summary_subtotal_label',
    taxLabel: '.summary_tax_label',
    totalLabel: '.summary_total_label',
    finishBtn: '[data-test="finish"]',

    // Complete
    completeHeader: '[data-test="complete-header"]',
    completeText: '[data-test="complete-text"]',
    backHomeBtn: '[data-test="back-to-products"]',
} as const;
