# Playwright + TypeScript + POM Framework
**Production-Ready E2E Automation Template | SauceDemo**

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Playwright](https://img.shields.io/badge/Playwright-2C2C2C?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![GitHub Actions](https://github.com/jerryfinol17/playwright-typescript-saucedemo-pom-framework/actions/workflows/main.yml/badge.svg)](https://github.com/jerryfinol17/playwright-typescript-saucedemo-pom-framework/actions)
[![Coverage](https://img.shields.io/badge/Coverage-94%25-brightgreen?style=for-the-badge)](https://github.com/jerryfinol17/playwright-typescript-saucedemo-pom-framework)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE.md)

A **scalable, maintainable and production-ready** End-to-End automation framework built with **Playwright + TypeScript + Page Object Model**.

Designed for real enterprise projects: clean architecture, centralized configuration, high coverage, and zero-flakiness approach.

---

### ✨ Key Features

- **Robust Page Object Model** with `BasePage` inheritance
- **Centralized Configuration** using environment variables (`dotenv`) + strongly typed `config/`
- Locators and test data fully centralized (`locators.ts` + `CheckoutData.ts`)
- **Data-driven testing** (positive + negative scenarios)
- **94% code coverage** (V8 + monocart-reporter)
- Automatic evidence collection: videos, traces and screenshots **only on failure**
- Strict TypeScript + modern Playwright config (retries, parallel, multi-browser + mobile)
- Ready for CI/CD (GitHub Actions with browser & device matrix)
- Easily extensible for API Testing, Visual Testing, and custom reporters

---

### 🏗️ Project Structure

```bash
playwright-typescript-saucedemo-pom-framework/
├── config/              # ← Centralized config (env, locators, test data)
│   ├── env.ts
│   ├── locators.ts
│   ├── CheckoutData.ts
│   └── index.ts
├── pages/               # ← Page Objects (BasePage, LoginPage, InventoryPage...)
├── tests/               # ← Test suites and E2E flows
├── docs/
├── coverage-report/
├── playwright.config.ts
├── .env.example
└── package.json
```
### Quick Start (under 2 minutes)
```bash
git clone https://github.com/jerryfinol17/playwright-typescript-saucedemo-pom-framework.git
cd playwright-typescript-saucedemo-pom-framework

# Copy environment variables
cp .env.example .env

npm install
npx playwright install --with-deps

# Run tests
npx playwright test

# View beautiful HTML report
npx playwright show-report
```


### Reports & Evidence:
- **Beautiful HTML Report** → npx playwright show-report

- **Code Coverage Report** → 94% (V8 + monocart-reporter)

- Videos, traces, and screenshots are **automatically saved** only when tests fail
![newReport.png](docs/newReport.png)
[E2E.webm](videos/E2E.webm)

###  Code Example (POM)

```bash
// pages/LoginPage.ts
// Using centralized config
import { BASE_URL, CREDENTIALS, LOCATORS, CHECKOUT_DATA } from '../config';

await page.goto(BASE_URL);
await loginPage.login(CREDENTIALS.standard.username, CREDENTIALS.standard.password);

// Example in Page Object
export class LoginPage extends BasePage {
  async login(username: string, password: string) {
    await this.fillInput(LOCATORS.usernameInput, username);
    await this.fillInput(LOCATORS.passwordInput, password);
    await this.clickElement(LOCATORS.loginBtn);
  }
}
```

### Want to see more?
Explore the /pages and /tests folders.

###  Why This Framework Stands Out

This is **not** just another learning project.

It follows the **exact same architecture** I use when delivering automation frameworks to real clients: Easy to maintain by development and QA teams  
Scalable for large applications  
Ready for CI/CD pipelines (GitHub Actions, Jenkins, GitLab CI)  
Clean migration path from Python, Cypress, or Selenium

I use this as my **base template** for every new automation project.

 ### Services I Offer:
 As a **QA Automation Engineer**, I specialize in building **enterprise-grade automation frameworks**.
 ### Available services:
- Production-ready Playwright + TypeScript POM frameworks
- Framework migrations (Cypress → Playwright, Selenium → Playwright, Python → Playwright)
- CI/CD setup + advanced reporting & evidence
- Custom fixtures, API testing, Visual testing

Interested in a custom framework for your project?Contact me → jerrytareas17@gmail.com (mailto:jerrytareas17@gmail.com)


**Looking for a professional automation framework for your team or project?**

Feel free to reach out, and we’ll build one tailored to your needs.

**jerrytareas17@gmail.com (mailto:jerrytareas17@gmail.com)**

### Ready to use it in your next project?
Star the repository and clone it now.








