const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Utility function to convert 'px' to number
const pxToNumber = (px) => parseInt(px.replace('px', ''), 10);

// Load JSON file from the data folder
const tabData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/tabs.json'), 'utf-8'));

test.skip('Validate font size for tabs', async ({ page }) => {
  // Navigate to the page
  await page.goto('https://your-website-url.com');

  for (const tabText of tabData.tabs) {
    // Locate the tab using aria-label
    const tabLocator = page.locator(`*[aria-label="${tabText}"]`);

    // Ensure the tab is visible
    await expect(tabLocator).toBeVisible({ timeout: 5000 });

    // Get the computed font size
    const fontSize = await tabLocator.evaluate(el => getComputedStyle(el).fontSize);

    // Convert font size and validate it
    const fontSizeNumber = pxToNumber(fontSize);
    console.log(`Tab: "${tabText}", Font Size: ${fontSize}`);

    if (fontSizeNumber === 16) {
      console.log(`Font size for "${tabText}" is correct: 16px`);
    } else {
      console.error(`Font size mismatch for "${tabText}": Expected 16px, but found ${fontSizeNumber}px`);
    }

    // Assertion for test
    expect(fontSizeNumber).toBe(16);
  }
});
