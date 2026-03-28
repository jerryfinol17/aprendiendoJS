import { test, expect } from './fixtures';
import {BASE_URL, CREDENTIALS, CREDENTIALS as cred} from '../pages/config';
interface PositiveUser {
    key: keyof typeof cred;
    shouldMeasureTime: boolean;
}
interface NegativeUser {
    key: keyof typeof cred;
    expectedError: string;
}
const positiveUsers = [
    { key: 'performanceGlitch', shouldMeasureTime: true },
    { key: 'standard', shouldMeasureTime: false },
    { key: 'problem', shouldMeasureTime: false },
    { key: 'error', shouldMeasureTime: false },
    { key: 'visual', shouldMeasureTime: false },
] as const satisfies readonly PositiveUser[];
const negativeUsers = [
    { key: 'lockedOut', expectedError: 'locked out' },
    { key: 'invalidUser', expectedError: 'do not match' },
    { key: 'invalidPassword', expectedError: 'do not match' },
    { key: 'blankUser', expectedError: 'username is required' },
    { key: 'blankPassword', expectedError: 'password is required' },
    { key: 'allBlank', expectedError: 'username is required' },
] as const satisfies readonly NegativeUser[];
for (const { key: userKey, shouldMeasureTime } of positiveUsers) {
    test(`Login Positivo -> ${userKey} user`, async ({ page, loginPage }) => {
        const creds = cred[userKey];
        if (!creds) {
            throw new Error(`No se encontraron las credenciales para: ${userKey}`);
        }
        let startTime: number | null = null;

        if (shouldMeasureTime) {
            startTime = performance.now();
        }
        await page.goto(BASE_URL);
        await loginPage.login(creds.username, creds.password);
        await expect(loginPage.isInventoryTitleVisible()).resolves.toBe(true);
        await expect(loginPage.isLoginOk()).resolves.toBe(true);

        if (shouldMeasureTime && startTime !== null) {
            const durationMs = performance.now() - startTime;
            const durationSec = durationMs / 1000;

            console.log(`${userKey} login + carga: ${durationSec.toFixed(2)} segundos`);

            expect(
                durationSec,
                `${userKey} demasiado lento`
            ).toBeGreaterThanOrEqual(1.0);

            expect(
                durationSec,
                `${userKey} demasiado lento`
            ).toBeLessThan(12.0);
        }
        if (['standard', 'visual', 'performanceGlitch'].includes(userKey)) {
            await page.screenshot({
                path: `screenshots/login_${userKey}_success.png`,
                fullPage: true,
            });
        }
    });
}

for (const { key: userKey, expectedError } of negativeUsers) {
    test(`Login Negativo - ${userKey} user`, async ({ page, loginPage }) => {
        const creds = cred[userKey];
        if (!creds) {
            throw new Error(`Credenciales no encontradas: ${userKey}`);
        }

        await page.goto(BASE_URL);
        await loginPage.login(creds.username, creds.password);

        await expect(loginPage.isErrorVisible()).resolves.toBe(true);

        const errorMsg = await loginPage.getErrorMessageOrEmpty();
        if (!errorMsg) {
            throw new Error(`No apareció mensaje de error para ${userKey}`);
        }

        const errorLower = errorMsg.toLowerCase();

        expect(
            errorLower,
            `Se esperaba que contuviera "${expectedError}", pero se obtuvo: "${errorMsg}"`
        ).toContain(expectedError.toLowerCase());
    });
}
test("Logout and clean fields", async ({ page, loginPage }) => {
    const creds = CREDENTIALS;
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await expect(loginPage.isOnBasePage()).resolves.toBe(true);
    await loginPage.login(creds.lockedOut.username, creds.lockedOut.password);
    await expect(loginPage.isErrorVisible()).resolves.toBe(true);
    await loginPage.cleanLoginFields()
    await loginPage.login(creds.standard.username, creds.standard.password);
    await expect(loginPage.isLoginOk()).resolves.toBe(true);
    await loginPage.logout()
    await expect(loginPage.isOnBasePage()).resolves.toBe(true);
})