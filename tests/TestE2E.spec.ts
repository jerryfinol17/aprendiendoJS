import { test, expect } from './fixtures';
import { BASE_URL, CREDENTIALS, CHECKOUT_DATA } from '../pages/config';
const itemsToAdd = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie',
    'Test.allTheThings() T-Shirt (Red)',
] as const;
const itemsToRemove = ['Test.allTheThings() T-Shirt (Red)', 'Sauce Labs Onesie'];
const finalItems = itemsToAdd.filter((item) => !itemsToRemove.includes(item));
test('E2E Happy Path', async ({ page, loginPage, inventoryPage, cartPage, checkoutPage }) => {
    const cred = CREDENTIALS;
    const data = CHECKOUT_DATA;
    await page.goto(BASE_URL);
    await loginPage.login(cred.standard.username, cred.standard.password);
    await expect(inventoryPage.isOnInventoryPage()).resolves.toBe(true);
    for (const item of itemsToAdd) {
        await inventoryPage.addItemToCart(item);
    }
    await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(itemsToAdd.length);
    const itemPrices = await inventoryPage.getInventoryItemsWithPrices();
    await inventoryPage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);
    await expect(cartPage.getCartBadgeCount()).resolves.toBe(itemsToAdd.length);
    for (const item of itemsToRemove) {
        await cartPage.removeItemFromCart(item);
    }
    await expect(cartPage.getCartBadgeCount()).resolves.toBe(finalItems.length);
    const cartNames = await cartPage.getCartItemNames();
    expect(cartNames).toEqual(finalItems);
    await cartPage.proceedToCheckout();
    await expect(checkoutPage.isOnCheckoutStepOne()).resolves.toBe(true);
    const { valid } = data;
    await checkoutPage.fillPersonalInfo(valid.firstName, valid.lastName, valid.zipCode);
    await checkoutPage.continueToOverview();
    const overviewNames = await checkoutPage.getOverviewItemNames();
    expect(overviewNames).toEqual(finalItems);
    const expectedSubTotal = finalItems.reduce((sum, item) => {
        const price = itemPrices.get(item);
        if (price === undefined) {
            throw new Error(`Precio no encontrado para "${item}" en itemPrices (Map)`);
        }
        return sum + price;
    }, 0)
    await expect(checkoutPage.getSubtotal()).resolves.toBe(expectedSubTotal);
    const expectedTax = Number((expectedSubTotal * 0.08).toFixed(2));
    await expect(checkoutPage.getTax()).resolves.toBe(expectedTax);
    const expectedTotal = Number(expectedSubTotal + expectedTax);
    await expect(checkoutPage.getTotal()).resolves.toBeCloseTo(expectedTotal, 2);
    await checkoutPage.finishPurchase();
    await expect(checkoutPage.isCompletePage()).resolves.toBe(true);
    await checkoutPage.backToProducts();
    await expect(inventoryPage.isOnInventoryPage()).resolves.toBe(true);
    await loginPage.logout();
    await expect(loginPage.isOnBasePage()).resolves.toBe(true);
});