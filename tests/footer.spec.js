const { test } = require('@playwright/test');

// Function to validate font size for elements within the footer
const validateFooterElements = async (page, footerSelector, expectedFontSize) => {
  // Locate the footer by id="footer"
  const footer = await page.locator(footerSelector);
  
  // Define a list of tags to check (a, p, b, span)
  const tagsToCheck = ['a', 'p', 'b', 'span'];
  
  const results = [];

  // Loop through each tag type and validate font size
  for (let tag of tagsToCheck) {
    const elements = footer.locator(tag);
    const count = await elements.count();

    // Check each element of the given tag in the footer
    for (let i = 0; i < count; i++) {
      const element = elements.nth(i);
      const textContent = await element.innerText();
      const fontSize = await element.evaluate(el => getComputedStyle(el).fontSize);

      const fontSizeResult = fontSize === expectedFontSize ? 'PASS' : `FAIL (Expected: ${expectedFontSize}, Found: ${fontSize})`;

      // Trim long text content for better output
      const trimmedText = textContent.length > 50 ? textContent.slice(0, 50) + '...' : textContent;

      // Collect results for each element
      results.push({
        'Element': tag.toUpperCase(),
        'Text': trimmedText || '(No Text)',
        'Font Size': fontSize,
        'Font Size Result': fontSizeResult
      });
    }
  }

  return results;
};

test('Validate footer text elements on virtuestech.com', async ({ page }) => {
  await page.goto('https://virtuestech.com');

  // Validate font size for each element inside the footer
  const footerResults = await validateFooterElements(page, '#footer', '14px');

  console.log('\nFooter Validation Results:\n');
  footerResults.forEach(result => {
    console.log(`Element: ${result.Element}`);
    console.log(`Text: ${result.Text}`);
    console.log(`Font Size: ${result['Font Size']}`);
    console.log(`Font Size Result: ${result['Font Size Result']}`);
    console.log('--------------------');
  });
});
