# Playwright + POM + TypeScript QA Journey

[![Playwright](https://img.shields.io/badge/Playwright-1.45+-45ba75?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**My active learning journey migrating from Python to TypeScript + Playwright for modern QA Automation.**  

Started from zero in JS → built vanilla interactions → implemented full **Page Object Model (POM)** → migrating everything to **TypeScript** with strong typing and best practices.  

This repo is proof of consistent daily effort: in just a few weeks, I went from basic scripts to a maintainable E2E framework on SauceDemo — the same dedication and structured learning I bring to every real-world project and team.

### Why This Repo Matters (My Real Effort)
- **From Python roots** (my main stack: Playwright/Selenium/Pytest) to JS/TS ecosystem  
- **Daily commits** and progressive improvements: simple navigation → full POM → TS migration  
- **Focus on clean, scalable code**: POM with inheritance, centralized config, async/await everywhere  
- **Built-in reliability**: auto videos/traces/screenshots on failure, HTML reporter  
- **Honest roadmap**: not finished yet — actively adding fixtures, CI, Allure, API/visual testing  

This is not a "copy-paste tutorial". It's **my hands-on grind**, with real mistakes fixed, concepts internalized, and code that I would confidently extend or hand over in a freelance gig or job.

### Key Features & Achievements
- ✅ Full **Page Object Model** (BasePage + Login/Inventory/Cart/Checkout pages)  
- ✅ Centralized config (credentials, locators, test data)  
- ✅ Complete SauceDemo E2E flows: login (positive/negative), inventory actions, cart consistency, checkout validation  
- ✅ Modern Playwright setup: async/await, `test.describe()`, `beforeEach()`, HTML reporter, video/trace on failure  
- ✅ **TypeScript migration in progress** (83%+ TS already — strong typing, interfaces, better refactoring)  
- ✅ Evidence folders: `videos/` for recordings, HTML reports generated  

### Project Structure

``` bash
playwright-ts-qa-journey/
├── firststepsonJS/              # Vanilla JS basics (navigation, forms, simple SauceDemo)
├── learningPOMonJS/             # Full POM implementation
│   ├── pages/                   # Core POM
│   │   ├── basePage.ts
│   │   ├── loginPage.ts
│   │   ├── inventoryPage.ts
│   │   ├── cartPage.ts
│   │   ├── checkoutPage.ts
│   │   └── config.ts            # Centralized data & locators
│   └── tests/                   # Test suites
│       ├── loginTest.spec.ts
│       ├── inventoryTest.spec.ts
│       ├── cartTest.spec.ts
│       ├── checkoutTest.spec.ts
│       └── testE2E.spec.ts      # Full purchase flow
├── videos/                      # Auto-recorded videos on failure
├── playwright.config.ts         # Pro config: reporter, video, trace, slowMo
├── tsconfig.json                # TypeScript compiler options
├── package.json                 # Dependencies (@playwright
/test, typescript)
└── README.md
```


### Quick Start
```bash
git clone https://github.com/jerryfinol17/playwright-ts-qa-journey.git
cd playwright-ts-qa-journey
npm install
npx playwright install --with-deps
```

### Run All Tests:

``` bash
npx playwright test
```
### View HTML report

``` bash
npx playwright show-report
```
### Run specific suite

``` bash
npx playwright test loginTest.spec.ts
```
### Current Status & Roadmap
**Done**: Vanilla JS → POM → E2E flows → TS migration started  
**In Progress**: Full TS conversion + custom fixtures  
**Next**: Allure reporting + API testing + visual assertions + data-driven (CSV/JSON)


### Why Hire Me? (The Real Value)


This repo shows **my learning style**: structured, persistent, self-driven. I don't stop at "works" — I refactor, add typing, automate evidences, plan CI/CD. The same energy goes into client projects: clean code, reliable tests, quick adaptation to new stacks, and constant improvement.Open to freelance/contract QA Automation roles (Playwright, TypeScript, Python, Selenium, API, CI/CD).  → DM me on X @GordoRelig3d

→ Email: jerrytareas17@gmail.com¡From Python dev to TS QA learner — tests always green, skills always growing! 







