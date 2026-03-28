import { test, expect } from './fixtures';
import {BASE_URL, CHECKOUT_DATA, CREDENTIALS} from "../pages/config";
interface CheckoutDataCase {
    firstName: string;
    lastName: string;
    zipCode: string;
    expectedError?: string;
}
const requiredFieldsCases: CheckoutDataCase[] = [
    {
        firstName: CHECKOUT_DATA.invalidName.firstName,
        lastName: CHECKOUT_DATA.invalidName.lastName,
        zipCode: CHECKOUT_DATA.invalidName.zipCode,
        expectedError: CHECKOUT_DATA.invalidName.expectedError,
    },
    {
        firstName: CHECKOUT_DATA.invalidLastname.firstName,
        lastName: CHECKOUT_DATA.invalidLastname.lastName,
        zipCode: CHECKOUT_DATA.invalidLastname.zipCode,
        expectedError: CHECKOUT_DATA.invalidLastname.expectedError,
    },
    {
        firstName: CHECKOUT_DATA.invalidZipCode.firstName,
        lastName: CHECKOUT_DATA.invalidZipCode.lastName,
        zipCode: CHECKOUT_DATA.invalidZipCode.zipCode,
        expectedError: CHECKOUT_DATA.invalidZipCode.expectedError,
    },
    {
        firstName: CHECKOUT_DATA.allBlankCheckout.firstName,
        lastName: CHECKOUT_DATA.allBlankCheckout.lastName,
        zipCode: CHECKOUT_DATA.allBlankCheckout.zipCode,
        expectedError: CHECKOUT_DATA.allBlankCheckout.expectedError,
    },
];
test.beforeEach(async ({page, loginPage}) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle')
    await expect(loginPage.isOnBasePage()).resolves.toBe(true);
    await loginPage.login(CREDENTIALS.standard.username, CREDENTIALS.standard.password);
    await expect(loginPage.isLoginOk()).resolves.toBe(true);
})
test('Checkout Happy Path', async ({ inventoryPage, cartPage, checkoutPage}) => {
    const itemsToAdd = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'] as const;
    await expect(inventoryPage.isOnInventoryPage()).resolves.toBe(true);
    for(const item of itemsToAdd){
        await inventoryPage.addItemToCart(item);
    }
    await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(itemsToAdd.length);
    const itemPrices = await inventoryPage.getInventoryItemsWithPrices();
    await inventoryPage.goToCart()
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);
    await cartPage.proceedToCheckout()
    await expect(checkoutPage.isOnCheckoutStepOne()).resolves.toBe(true);
    const {valid} = CHECKOUT_DATA;
    await checkoutPage.fillPersonalInfo(valid.firstName, valid.lastName, valid.zipCode);
    await checkoutPage.continueToOverview();
    const names = await checkoutPage.getOverviewItemNames()
    expect(names).toEqual(itemsToAdd);
    const expectedSubTotal = itemsToAdd.reduce((sum, item)=> {
        const price = itemPrices.get(item);
        if(price === undefined){
            throw new Error(`Precio no encontrado para "${item}" en itemsPrices (Map)`);
        }
        return sum + price;
    }, 0);
    await expect(checkoutPage.getSubtotal()).resolves.toEqual(expectedSubTotal);
    const expectedTax = Number((expectedSubTotal * 0.08).toFixed(2));
    await expect(checkoutPage.getTax()).resolves.toEqual(expectedTax);
    const expectedTotal = Number( expectedSubTotal + expectedTax );
    await expect(checkoutPage.getTotal()).resolves.toEqual(expectedTotal);
    await checkoutPage.finishPurchase();
    await expect(checkoutPage.isCompletePage()).resolves.toBe(true);
    await checkoutPage.backToProducts();
    await expect(inventoryPage.isOnInventoryPage()).resolves.toBe(true);
})
test.describe('Checkout step one required fields',()=>{
    for(const {firstName, lastName, zipCode, expectedError} of requiredFieldsCases){
        test(`Shows ${expectedError} when: ${firstName} , ${lastName} , ${zipCode}`, async ({inventoryPage, cartPage, checkoutPage}) => {
            await inventoryPage.addItemToCart("Sauce Labs Backpack");
            await inventoryPage.goToCart();
            await expect(cartPage.isOnCartPage()).resolves.toBe(true);
            await cartPage.proceedToCheckout();
            await expect(checkoutPage.isOnCheckoutStepOne()).resolves.toBe(true);
            await checkoutPage.fillPersonalInfo(firstName, lastName, zipCode);
            await checkoutPage.continueToOverview();
            const error = await checkoutPage.getErrorMessage()
            expect(error).toBe(expectedError);
        })
    }
});
test('Checkout Cancel from step one', async ({inventoryPage, cartPage, checkoutPage}) => {
    await inventoryPage.addItemToCart("Sauce Labs Backpack");
    await inventoryPage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);
    await cartPage.proceedToCheckout();
    await expect(checkoutPage.isOnCheckoutStepOne()).resolves.toBe(true);
    await checkoutPage.cancelFromStepOne()
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);
});
test('Checkout cancel from step two', async ({inventoryPage, cartPage, checkoutPage}) => {
    await inventoryPage.addItemToCart("Sauce Labs Backpack");
    await inventoryPage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);
    await cartPage.proceedToCheckout();
    await expect(checkoutPage.isOnCheckoutStepOne()).resolves.toBe(true);
    const {valid} = CHECKOUT_DATA;
    await checkoutPage.fillPersonalInfo(valid.firstName, valid.lastName, valid.zipCode);
    await checkoutPage.continueToOverview();
    await checkoutPage.cancelFromOverview()
    await expect(inventoryPage.isOnInventoryPage()).resolves.toBe(true);
})
test('Items on Overview are correct', async ({inventoryPage,cartPage, checkoutPage}) => {
    const itemsToAdd = ['Sauce Labs Backpack',
        'Sauce Labs Onesie',
        'Sauce Labs Fleece Jacket',
        'Sauce Labs Bolt T-Shirt',] as const;
    for(const item of itemsToAdd){
        await inventoryPage.addItemToCart(item);
    }
    await expect(inventoryPage.getCartBadgeCount()).resolves.toEqual(itemsToAdd.length);
    const inventoryPrices = await inventoryPage.getInventoryItemsWithPrices()
    await inventoryPage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);
    await expect(cartPage.getCartBadgeCount()).resolves.toEqual(itemsToAdd.length);
    await cartPage.proceedToCheckout();
    await expect(checkoutPage.isOnCheckoutStepOne()).resolves.toBe(true);
    const {valid} = CHECKOUT_DATA;
    await checkoutPage.fillPersonalInfo(valid.firstName, valid.lastName, valid.zipCode);
    await checkoutPage.continueToOverview();
    const overviewItemCount = await checkoutPage.getOverviewItemCount();
    expect(overviewItemCount).toBe(itemsToAdd.length);
    const overviewNames = await checkoutPage.getOverviewItemNames()
    expect(overviewNames).toEqual(itemsToAdd);
    const overviewPrices = await checkoutPage.getOverviewItemWithPrices()
    for(const name of itemsToAdd){
        expect(name in overviewPrices, `Item '${name}' does not appear in overview.`).toBe(true);
        expect(inventoryPrices.has(name), `Item '${name}' does not appear in Inventory (bug?).`).toBe(true);
        expect(
            overviewPrices[name],
            `Precio de '${name}' no coincide: inventory $${inventoryPrices.get(name)} vs overview $${overviewPrices[name]}`
        ).toBeCloseTo(inventoryPrices.get(name)!,2);
    }
    const expectedSubtotal = itemsToAdd.reduce((sum,item)=>{
        const price = inventoryPrices.get(item);
        if(price === undefined){
            throw new Error(`Precio no encontrado para "${item}"`);
        }
        return sum+price;
    },0);
    await expect(checkoutPage.getSubtotal()).resolves.toBe(expectedSubtotal);
    const expectedTax = Number((expectedSubtotal * 0.08).toFixed(2))
    await expect(checkoutPage.getTax()).resolves.toBe(expectedTax);
    const expectedTotal  = Number(expectedSubtotal + expectedTax);
    await expect(checkoutPage.getTotal()).resolves.toBe(expectedTotal);
    await checkoutPage.finishPurchase()
    await expect(checkoutPage.isCompletePage()).resolves.toBe(true);
    await checkoutPage.backToProducts()
    await expect(inventoryPage.isOnInventoryPage()).resolves.toBe(true);
});
test.fail('Checkout without items in Cart (Known bug)', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await expect(inventoryPage.isOnInventoryPage()).resolves.toBe(true);
    await inventoryPage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);
    await cartPage.proceedToCheckout();
    await expect(checkoutPage.isOnCheckoutStepOne()).resolves.toBe(true);
    const {valid} = CHECKOUT_DATA;
    await checkoutPage.fillPersonalInfo(valid.firstName, valid.lastName, valid.zipCode);
    await checkoutPage.continueToOverview();
    await expect(checkoutPage.getSubtotal()).resolves.toBe(0);
    await checkoutPage.finishPurchase()
    await expect(checkoutPage.isCompletePage()).resolves.toBe(false);
    //This tests should fail because in a regular shopping web you can't make the checkout
    //without items in the shopping cart, but this page let you make the checkout.
});