import {test,expect} from "@playwright/test";
import {LoginPage} from "../pages/loginpage.js";
import {BASE_URL,CREDENTIALS as cred} from "../pages/config.js";
const positiveUsers = [
    {key: "standard", shouldMeasureTime: true},
    {key: "performanceGlitch", shouldMeasureTime: true},
    {key: "problem", shouldMeasureTime: false},
    {key: "error", shouldMeasureTime: false},
    {key: "visual", shouldMeasureTime: false},
]
const negativeUsers = [
    { key: "lockedOut",       expectedError: "locked out" },
    { key: "invalidUser",     expectedError: "do not match" },
    { key: "invalidPassword", expectedError: "do not match" },
    { key: "blankUser",       expectedError: "username is required" },
    { key: "blankPassword",   expectedError: "password is required" },
    { key: "allBlank",        expectedError: "username is required" },
];
for(const {key: userKeys, shouldMeasureTime} of positiveUsers) {
    test(`Login Positivo -> ${userKeys} user`, async({page}) => {
        const creds = cred[userKeys];
        if (!creds) {
            throw new Error (`No se encontraron las credenciales para: ${userKeys}`);
        }
        const login = new LoginPage(page);
        let startTime = null;
        if(shouldMeasureTime){
            startTime = performance.now();
        }
        await page.goto(BASE_URL)
        await login.login(creds.username, creds.password);
        expect(await login.isInventoryTitleVisible()).toBe(true);
        expect(await login.isLoginOk()).toBe(true);
        if(shouldMeasureTime && startTime !== null){
            const durationMs = performance.now() - startTime;
            const durationSec = durationMs / 1000;
            console.log(`${userKeys} login + carga: ${durationSec.toFixed(2)} segundos`);
            expect(durationSec,`${userKeys} demasiado lento`).toBeGreaterThanOrEqual(1.0);
            expect(durationSec, `${userKeys} demasiado lento`).toBeLessThan(12.0);
        }
        if(["standard", "visual", "performance"].includes(userKeys)){
            await page.screenshot({
                path: `screenshots/login_${userKeys}_success.png`,
                fullPage: true,
            })
        }

    })
}
for (const { key: userKey, expectedError } of negativeUsers) {
    test(`Login Negativo - ${userKey} user`, async ({ page }) => {
        const creds = cred[userKey];
        if (!creds) throw new Error(`Credenciales no encontradas: ${userKey}`);

        const login = new LoginPage(page);
        await page.goto(BASE_URL);
        await login.login(creds.username, creds.password);
        expect(await login.isErrorVisible()).toBe(true);
        const errorMsg = await login.getErrorMessageOrEmpty();
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