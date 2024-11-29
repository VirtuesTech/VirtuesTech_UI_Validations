// tests/validation.spec.js

const { test } = require('@playwright/test');
const { fetchUniqueServiceUrls } = require('../utils/getUrls'); 
const { validateElements, rgbToHex } = require('../utils/validationUtils');

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

test.only('Validate headings and buttons for unique service URLs', async ({ page }) => {
  // Fetch unique service URLs dynamically
  const serviceUrls = await fetchUniqueServiceUrls(page);

  let allResults = [];

  // Iterate over each service URL
  for (const url of serviceUrls) {
    console.log(`\nValidating URL: ${url}`);  // Log the URL first

    // Navigate to the service URL
    await page.goto(url, { waitUntil: 'networkidle' });

    // Validate headings
    console.log(`Validating headings on ${url}`);
    for (const [tag, validation] of Object.entries(headingValidationMap)) {
      const headingResults = await validateElements(page, tag, validation, buttonColorMap);
      
      // Log validation results for headings
      headingResults.forEach(result => {
        console.log(`Heading Validation for <${tag}>:`);
        console.log(`Element: ${result.Element}`);
        console.log(`Text: ${result.Text}`);
        console.log(`Font Size: ${result['Font Size']}`);
        console.log(`Font Size Result: ${result['Font Size Result']}`);
        console.log(`Color: ${result.Color}`);
        console.log(`Color Result: ${result['Color Result']}`);
        console.log('--------------------');
      });
      
      allResults = allResults.concat(headingResults);
    }

    // Validate buttons
    console.log(`Validating buttons on ${url}`);
    const buttonResults = await validateElements(page, 'button', {}, buttonColorMap);
    
    // Log validation results for buttons
    buttonResults.forEach(result => {
      console.log(`Button Validation:`);
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

    allResults = allResults.concat(buttonResults);
  }

  console.log('\nFinal Validation Results:\n');
  // Log all accumulated results
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
