import { test, expect } from './fixtures';
import { BASE_URL, CREDENTIALS } from '../pages/config';
const nameAndBriefDescription = [
    { name: 'Sauce Labs Backpack', description: 'Sly Pack' },
    { name: 'Sauce Labs Bike Light', description: 'AAA battery included' },
    { name: 'Sauce Labs Bolt T-Shirt', description: 'American Apparel' },
    { name: 'Sauce Labs Fleece Jacket', description: 'quarter-zip fleece jacket' },
    { name: 'Sauce Labs Onesie', description: 'two-needle hemmed' },
    { name: 'Test.allTheThings() T-Shirt (Red)', description: 'Super-soft and comfy' },
] as const;
test.describe('Inventory page Tests - Standard User', () => {
    test.beforeEach(async ({page, loginPage}) => {
        const cred = CREDENTIALS;
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        await loginPage.login(cred.standard.username, cred.standard.password);
        await expect(loginPage.isLoginOk()).resolves.toBe(true);
    });

    test('Add one product', async ({inventoryPage}) => {
        await expect(inventoryPage.isOnInventoryPage()).resolves.toBe(true);
        await inventoryPage.addItemToCart('Sauce Labs Backpack');
        await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(1);
        await expect(inventoryPage.isRemoveButtonVisible('Sauce Labs Backpack')).resolves.toBe(true);
    });
    test('Add Multiple products', async ({inventoryPage}) => {
        const itemsToAdd = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Onesie'] as const;
        for(const item of itemsToAdd) {
            await inventoryPage.addItemToCart(item);
        }
        await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(itemsToAdd.length);
        for(const item of itemsToAdd) {
            await expect(inventoryPage.isRemoveButtonVisible(item)).resolves.toBe(true);
        }
    })
    test("Add products remove one", async ({inventoryPage}) => {
        const itemsToAdd = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'] as const;
        for(const item of itemsToAdd) {
            await inventoryPage.addItemToCart(item);
        }
        await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(itemsToAdd.length);
        for (const item of itemsToAdd) {
            await expect(inventoryPage.isRemoveButtonVisible(item)).resolves.toBe(true);
        }
        await inventoryPage.removeItemFromCart('Sauce Labs Backpack')
        await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(itemsToAdd.length - 1);
        await expect(inventoryPage.isAddButtonVisible('Sauce Labs Backpack')).resolves.toBe(true);
    })
    test('Add/Remove All products', async ({inventoryPage}) => {
        const itemsToAdd = [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)',
        ] as const;
        for(const item of itemsToAdd) {
            await inventoryPage.addItemToCart(item);
        }
        await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(itemsToAdd.length);
        for (const item of itemsToAdd) {
            await expect(inventoryPage.isRemoveButtonVisible(item)).resolves.toBe(true);
            await inventoryPage.removeItemFromCart(item);
        }
        await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(0);
    })
    test('Consistency across pages', async ({inventoryPage, cartPage}) => {
        const itemsToAdd = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'] as const;
        for(const item of itemsToAdd) {
            await inventoryPage.addItemToCart(item);
        }
        await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(itemsToAdd.length);
        await inventoryPage.goToCart()
        await expect(cartPage.isOnCartPage()).resolves.toBe(true);
        await expect(cartPage.getCartBadgeCount()).resolves.toBe(itemsToAdd.length)
        const names = await cartPage.getCartItemNames();
        expect(names).toEqual(itemsToAdd);
        await cartPage.continueShopping()
        for (const item of itemsToAdd) {
            await inventoryPage.removeItemFromCart(item);
        }
        await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(0);
        await inventoryPage.goToCart();
        const updatedNames = await cartPage.getCartItemNames();
        expect(updatedNames).not.toEqual(itemsToAdd);

    })
    test('Product Description is Correct',async ({inventoryPage}) => {
        const desc = await inventoryPage.getProductDescription("Sauce Labs Backpack");
        expect(desc).toContain('Sly Pack');
    })
    test.describe('All Product Description is Correct', () => {
        for (const { name, description } of nameAndBriefDescription) {
            test(`Shows "${description}" on "${name}"`, async ({ inventoryPage }) => {
                const desc = await inventoryPage.getProductDescription(name);
                expect(desc).toContain(description);
            });
        }
    });
    test('Inventory sorting - Name(A to Z)',async ({inventoryPage}) => {
        await inventoryPage.selectSortOption('az')
        const actualNames = await inventoryPage.getProductNames();
        const expectedNames = [...actualNames].sort();
        expect(actualNames).toEqual(expectedNames);
    })
    test('Inventory Sorting - Name (Z to A) works correctly', async ({ inventoryPage }) => {
        await expect(inventoryPage.isOnInventoryPage()).resolves.toBe(true);
        await inventoryPage.selectSortOption('za');
        const actualNames = await inventoryPage.getProductNames();
        const expectedNames = [...actualNames].sort((a, b) => b.localeCompare(a));
        expect(actualNames).toEqual(expectedNames);
    });
    test('Inventory Sorting - Price (Low to High) works correctly', async ({ inventoryPage }) => {
        await expect(inventoryPage.isOnInventoryPage()).resolves.toBe(true);
        await inventoryPage.selectSortOption('lohi');
        const prices = await inventoryPage.getProductPrices();
        const expectedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(expectedPrices);
    });
    test('Inventory Sorting - Price (High to Low) works correctly', async ({ inventoryPage }) => {
        await expect(inventoryPage.isOnInventoryPage()).resolves.toBe(true);
        await inventoryPage.selectSortOption('hilo');
        const prices = await inventoryPage.getProductPrices();
        const expectedPrices = [...prices].sort((a, b) => b - a);
        expect(prices).toEqual(expectedPrices);
    });
    test('Sorting preserve Items Names and Prices', async ({ inventoryPage }) => {
        await expect(inventoryPage.isOnInventoryPage()).resolves.toBe(true);
        const initial = await inventoryPage.getInventoryItemsWithPrices();
        for (const opt of ['az', 'za', 'lohi', 'hilo'] as const) {
            await inventoryPage.selectSortOption(opt);
            const current = await inventoryPage.getInventoryItemsWithPrices();
            expect(current.size).toBe(initial.size);
            const namesBefore = Array.from(initial.keys()).sort();
            const namesAfter = Array.from(current.keys()).sort();
            expect(namesAfter).toEqual(namesBefore);
            for (const [name, price] of initial) {
                expect(current.get(name)).toBe(price);
            }
        }
    });
    test('Sorting preserves cart status and add/remove button', async ({ inventoryPage }) => {
        await expect(inventoryPage.isOnInventoryPage()).resolves.toBe(true);
        await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(0);
        await inventoryPage.addItemToCart('Sauce Labs Backpack');
        await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(1);
        await inventoryPage.selectSortOption('za');
        const names = await inventoryPage.getProductNames();
        await expect(inventoryPage.isRemoveButtonVisible('Sauce Labs Backpack')).resolves.toBe(true);
        const expectedNames = [...names].sort((a, b) => b.localeCompare(a));
        expect(names, `Z to A Fallo: ${names} != ${expectedNames}`).toEqual(expectedNames);
        await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(1);
        await expect(inventoryPage.isRemoveButtonVisible('Sauce Labs Backpack')).resolves.toBe(true);
        await inventoryPage.removeItemFromCart('Sauce Labs Backpack');
        await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(0);
        await inventoryPage.selectSortOption('az');
        const expectedNamesP2 = [...names].sort();
        expect(names).not.toEqual(expectedNamesP2);
        await inventoryPage.selectSortOption('za');
        const expectedNamesP3 = [...names].sort((a, b) => b.localeCompare(a));
        expect(names).toEqual(expectedNamesP3);
        await expect(inventoryPage.isAddButtonVisible('Sauce Labs Backpack')).resolves.toBe(true);
    });
    test('Reset App Happy Path', async ({ inventoryPage, cartPage }) => {
        const itemsToAdd = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'] as const;
        await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(0);
        for (const item of itemsToAdd) {
            await inventoryPage.addItemToCart(item);
        }
        await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(itemsToAdd.length);
        for (const item of itemsToAdd) {
            await expect(inventoryPage.isRemoveButtonVisible(item)).resolves.toBe(true);
        }
        await inventoryPage.resetApp();
        await expect(inventoryPage.getCartBadgeCount(), 'Reset does not change status on cart badge').resolves.toBe(0);
        await inventoryPage.goToCart();
        await expect(cartPage.isOnCartPage()).resolves.toBe(true);
        await expect(cartPage.isCartEmpty()).resolves.toBe(true);
        const cartNames = await cartPage.getCartItemNames();
        expect(cartNames).toEqual([]);
        await cartPage.continueShopping();
        await expect(inventoryPage.isOnInventoryPage()).resolves.toBe(true);
        for (const item of itemsToAdd) {
            await expect(inventoryPage.isRemoveButtonVisible(item)).resolves.toBe(false);
        }
    });
    test.fail('Reset App (Known bug)', async ({ inventoryPage }) => {
        const itemsToAdd = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'] as const;
        await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(0);
        for (const item of itemsToAdd) {
            await inventoryPage.addItemToCart(item);
        }
        await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(itemsToAdd.length);
        await inventoryPage.resetApp();
        await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(0);
        for (const item of itemsToAdd) {
            await expect(inventoryPage.isRemoveButtonVisible(item)).resolves.toBe(false);
        }
        // Nota: Este test falla porque el bug conocido no actualiza los botones remove en inventory
    });
    test('About Link Works', async ({ inventoryPage }) => {
        const success = await inventoryPage.goToAboutPage();
        expect(success).toBe(true);
    });
})
test.fail('Add/Remove On Problem User (Known bug)',async ({ page, loginPage, inventoryPage, cartPage }) => {
    const cred = CREDENTIALS;
    const allItems = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Bolt T-Shirt',
        'Sauce Labs Fleece Jacket',
        'Sauce Labs Onesie',
        'Test.allTheThings() T-Shirt (Red)',
    ] as const;
    const addableItems = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Onesie'];
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle');
    await loginPage.login(cred.problem.username, cred.problem.password);
    await expect(loginPage.isLoginOk()).resolves.toBe(true);
    for(const item of allItems) {
        const wasAddBtnBefore = await inventoryPage.isAddButtonVisible(item);
        expect(wasAddBtnBefore).toBe(true);
        await inventoryPage.addItemToCart(item);
        await page.waitForTimeout(1500)
        const isRemoveNow = await inventoryPage.isRemoveButtonVisible(item);
        const isAddStill = await inventoryPage.isAddButtonVisible(item);
        if (addableItems.includes(item)) {
            await expect(isRemoveNow).resolves.toBe(true);
            expect(isAddStill).toBe(false);
        }else{await expect(isRemoveNow).rejects.toBe(false);
        expect(isAddStill).toBe(true);}
    }
    await expect(inventoryPage.getCartBadgeCount()).resolves.toBe(addableItems.length);
    for(const item of addableItems) {
        await inventoryPage.removeItemFromCart(item);
        await expect(inventoryPage.isAddButtonVisible(item)).resolves.toBe(true);
    }
    await inventoryPage.goToCart();
    const cartNames = await cartPage.getCartItemNames();
    expect(cartNames).toEqual(addableItems);
    // Expected bugs in problem_user: limited add, no remove from inventory
})
test('Sorting in Visual User (Known bug)', async ({ page, loginPage, inventoryPage }) => {
    const cred = CREDENTIALS;
    await page.goto(BASE_URL);
    await loginPage.login(cred.visual.username, cred.visual.password);
    await expect(inventoryPage.isOnInventoryPage()).resolves.toBe(true);
    const initialData = await inventoryPage.getInventoryItemsWithPrices();
    const initialPriceList = await inventoryPage.getProductPrices();
    const sortOptions = ['az', 'za', 'lohi', 'hilo'] as const;
    for (const opt of sortOptions) {
        await inventoryPage.selectSortOption(opt);
        const currentData = await inventoryPage.getInventoryItemsWithPrices();
        const currentPriceList = await inventoryPage.getProductPrices();
        const initialKeys = new Set(initialData.keys());
        const currentKeys = new Set(currentData.keys());
        if (initialKeys.size !== currentKeys.size || !setsAreEqual(initialKeys, currentKeys)) {
            const missing = difference(initialKeys, currentKeys);
            const extra = difference(currentKeys, initialKeys);
            if (missing.size > 0) {
                console.log(`  → Items LOST after sort: ${Array.from(missing).join(', ')}`);
            }
            if (extra.size > 0) {
                console.log(`  → Extra items appeared: ${Array.from(extra).join(', ')}`);
            }
        }

        let changesFound = false;
        console.log('  Cambios detectados en precios:');
        for (const name of initialKeys) {
            const initialPrice = initialData.get(name);
            const currentPrice = currentData.get(name);
            if (initialPrice !== currentPrice) {
                changesFound = true;
                console.log(`    - ${name}: ${initialPrice} → ${currentPrice}  (has changed!)`);
            }
        }
        if (!changesFound) {
            console.log('    (Ningún precio cambió en este sort – inesperado si es bug)');
        }

        if (opt === 'lohi' || opt === 'hilo') {
            const expectedSortedPrices =
                opt === 'lohi'
                    ? [...initialPriceList].sort((a, b) => a - b)
                    : [...initialPriceList].sort((a, b) => b - a);

            const pricesMatch = arraysAreEqual(currentPriceList, expectedSortedPrices);

            if (pricesMatch) {
                console.log('  → Precios se ordenaron correctamente (NO esperado en visual_user)');
            } else {
                console.log('  → Precios NO se ordenaron correctamente (expected bug)');
                console.log(`     Lista actual:   ${currentPriceList.join(', ')}`);
                console.log(`     Lista esperada: ${expectedSortedPrices.join(', ')}`);
            }
        }
    }

    console.log('\nTest finalizado. En visual_user se esperan cambios/rupturas en precios con cada sort.');
});
function setsAreEqual(setA: Set<string>, setB: Set<string>): boolean {
    if (setA.size !== setB.size) return false;
    for (const item of setA) {
        if (!setB.has(item)) return false;
    }
    return true;
}
function difference(setA: Set<string>, setB: Set<string>): Set<string> {
    const diff = new Set(setA);
    for (const elem of setB) {
        diff.delete(elem);
    }
    return diff;
}
function arraysAreEqual(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}