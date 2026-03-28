import { test, expect } from './fixtures';
import {BASE_URL,CREDENTIALS} from "../pages/config";
const itemsToAdd = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie',
    'Test.allTheThings() T-Shirt (Red)',
] as const;

test('Test Cart E2E', async ({loginPage, inventoryPage, cartPage, page}) => {
    await page.goto(BASE_URL);
    await  expect(loginPage.isOnBasePage()).resolves.toBe(true);
    await loginPage.login(CREDENTIALS.standard.username, CREDENTIALS.standard.password);
    await expect(loginPage.isLoginOk()).resolves.toBe(true);
    const prices = await inventoryPage.getProductPrices();
    for(const item of itemsToAdd) {
        await inventoryPage.addItemToCart(item);
    }
    await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(itemsToAdd.length);
    await inventoryPage.goToCart()
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);
    await expect(cartPage.getPageTitle()).resolves.toBe('Your Cart');
    await expect(cartPage.getCartBadgeCount()).resolves.toBe(itemsToAdd.length);
    const cartItemsNames = await cartPage.getCartItemNames()
    expect(cartItemsNames).toEqual([...itemsToAdd]);
    const cartItemPrices = await cartPage.getCartItemPrices()
    expect(cartItemPrices).toEqual(prices);
    for(const item of itemsToAdd) {
        await expect(cartPage.getCartItemQuantity(item)).resolves.toBe(1)
    }
    for(const item of itemsToAdd) {
        await cartPage.removeItemFromCart(item);
    }
    await expect(cartPage.isCartEmpty()).resolves.toBe(true);
    await cartPage.clickAllItemsLink()
    await expect(inventoryPage.isOnInventoryPage()).resolves.toBe(true);
})