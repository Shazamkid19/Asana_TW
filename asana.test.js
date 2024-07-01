const { test, expect } = require('@playwright/test');
const fs = require('fs');

// Read the test cases from the JSON file
const testCases = JSON.parse(fs.readFileSync('testCases.json', 'utf8'));

test.describe('Asana Data-Driven Tests', () => {
  testCases.forEach((data) => {
    test(data.name, async ({ page }) => {

      // Step 1: Login to Asana
      await test.step('Login to Asana', async () => {
        await page.goto('https://app.asana.com/-/login');
        await page.fill('//input[@name="e"]', 'ben+pose@workwithloop.com');
        await page.click('//div[contains(.,"Continue")])[7]');
        await page.fill('//input[@name="p"]', 'Password123');
        await page.click('(//div[contains(.,"Log in")])[5]');
        await page.waitForNavigation();
      });

      // Step 2: Navigate to the project page
      await test.step('Navigate to the project page', async () => {
        const leftNavItems = data.leftNav.split(', ');
        for (const item of leftNavItems) {
          await page.click(`text=${item}`);
        }
      });

      // Step 3: Verify the card is within the right column
      await test.step('Verify the card is within the right column', async () => {
        const column = await page.locator(`.column:has-text("${data.column}")`);
        const card = await column.locator(`.card-title:has-text("${data.card_title}")`);
        await expect(card).toBeVisible();
      });
    });
  });
});