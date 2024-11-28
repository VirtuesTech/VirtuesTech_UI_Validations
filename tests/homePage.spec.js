const { test } = require('@playwright/test');

// Allowed heading sizes and colors
const headingValidationMap = {
  'h1': { size: '36px', allowedColors: ['#0369BA', '#FF963F', '#333333'] },
  'h2': { size: '26px', allowedColors: ['#0369BA', '#FF963F', '#333333'] },
  'h3': { size: '20px', allowedColors: ['#0369BA', '#FF963F', '#333333'] }
};

// Allowed button colors and hover mappings
const buttonColorMap = {
  '#0369BA': '#024A86',
  '#FF963F': '#E57B28'
};

// Utility function to convert RGB to Hex
const rgbToHex = (rgb) => {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

// Helper function to trim long text
const trimText = (text, maxLength = 50) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

// Function to validate elements (headings and buttons)
const validateElements = async (page, selector, validationMap = {}) => {
  const elements = await page.locator(selector);
  const count = await elements.count();

  const results = [];

  for (let i = 0; i < count; i++) {
    const element = elements.nth(i);
    let textContent = await element.innerText();
    textContent = textContent.replace(/\s+/g, ' ').trim();  // Clean up text

    // Trim long text content
    textContent = trimText(textContent);

    const fontSize = await element.evaluate(el => getComputedStyle(el).fontSize);
    const color = await element.evaluate(el => getComputedStyle(el).color);
    const hexColor = rgbToHex(color);

    // Validation for headings
    if (validationMap.size) {
      const sizeResult = fontSize === validationMap.size ? 'PASS' : `FAIL (Expected: ${validationMap.size}, Found: ${fontSize})`;
      const colorResult = validationMap.allowedColors.includes(hexColor) ? 'PASS' : `FAIL (Expected: one of ${validationMap.allowedColors.join(', ')}, Found: ${hexColor})`;

      results.push({
        'Element': selector.toUpperCase(),
        'Text': textContent || '(No Text)',
        'Font Size': fontSize,
        'Font Size Result': sizeResult,
        'Color': hexColor,
        'Color Result': colorResult
      });
    } else {
      // Validation for buttons
      const hoverColor = buttonColorMap[hexColor] || 'INVALID COLOR';
      let hoverHexColor = 'N/A';
      let hoverResult = 'N/A';

      if (hoverColor !== 'INVALID COLOR') {
        await element.hover();
        const hoverColorActual = await element.evaluate(el => getComputedStyle(el).backgroundColor);
        hoverHexColor = rgbToHex(hoverColorActual);
        hoverResult = hoverHexColor === hoverColor ? 'PASS' : `FAIL (Expected: ${hoverColor}, Found: ${hoverHexColor})`;
      }

      results.push({
        'Element': 'BUTTON',
        'Text': textContent || '(No Text)',
        'Font Size': fontSize,
        'Font Size Result': fontSize === '16px' ? 'PASS' : `FAIL (Expected: 16px, Found: ${fontSize})`,
        'Color': hexColor,
        'Color Result': hoverColor !== 'INVALID COLOR' ? 'PASS' : `FAIL (Expected one of ${Object.keys(buttonColorMap).join(', ')}, Found: ${hexColor})`,
        'Hover Color': hoverHexColor,
        'Hover Result': hoverResult
      });
    }
  }

  return results;
};

test('Validate headings and buttons in home page', async ({ page }) => {
  await page.goto('https://virtuestech.com');

  let allResults = [];

  // Validate headings
  for (const [tag, validation] of Object.entries(headingValidationMap)) {
    const headingResults = await validateElements(page, tag, validation);
    allResults = allResults.concat(headingResults);
  }

  // Validate buttons
  const buttonResults = await validateElements(page, 'button');
  allResults = allResults.concat(buttonResults);

  console.log('\nValidation Results:\n');
  // Log the results as normal output (no table)
  allResults.forEach(result => {
    console.log(`Element: ${result.Element}`);
    console.log(`Text: ${result.Text}`);
    console.log(`Font Size: ${result['Font Size']}`);
    console.log(`Font Size Result: ${result['Font Size Result']}`);
    console.log(`Color: ${result.Color}`);
    console.log(`Color Result: ${result['Color Result']}`);
    console.log(`Hover Color: ${result['Hover Color']}`);
    console.log(`Hover Result: ${result['Hover Result']}`);
    console.log('--------------------');
  });
});
