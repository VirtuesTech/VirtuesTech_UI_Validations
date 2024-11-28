const { test } = require('@playwright/test');

// Utility function to convert RGB to Hex
const rgbToHex = (rgb) => {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

test('Form validation with error and success messages', async ({ page }) => {
  // Navigate to the form page
  await page.goto('https://virtuestech.com/');

  // Click on Submit to trigger error validation
  await page.click('input[value="Submit"]');
  await page.waitForTimeout(2000); // Wait for the data to be filled

  // Validate error messages for required fields
  const errorMessages = await page.locator('//span[contains(text(), "The field is required")]');
  const errorCount = await errorMessages.count();

  if (errorCount > 0) {
    console.log(`Found ${errorCount} error message(s) for required fields.`);

    for (let i = 0; i < errorCount; i++) {
      const errorText = await errorMessages.nth(i).innerText();
      const errorColor = await errorMessages.nth(i).evaluate(el => getComputedStyle(el).color);
      const hexColor = rgbToHex(errorColor);
      console.log(`Error Message: "${errorText}", Color: ${hexColor}`);

      // Check if the error color is correct (#DC3545)
      if (hexColor === '#DC3545') {
        console.log('Error color is correct (#DC3545)');
      } else {
        console.log(`Error color mismatch: Expected #DC3545, but found ${hexColor}`);
        console.log('----------------------------------------------------------------');

      }
    }
  } else {
    console.log('No error messages found.');
  }

  // Reload the page and fill all inputs for successful submission
  await page.reload();
  await page.waitForTimeout(2000); // Wait for the data to be filled

  // Fill the form with test data
  await page.fill('input[placeholder="First Name*"]', 'John');
  await page.fill('input[placeholder="Last Name"]', 'Doe');
  await page.fill('input[placeholder="Work Email*"]', 'john.doe@example.com');
  await page.fill('input[placeholder="Contact Number*"]', '1234567890');
  await page.fill('textarea[placeholder="Tell Us More*"]', 'This is additional information.');
  await page.waitForTimeout(2000); // Wait for the data to be filled

  // Click on the Submit button
  await page.dblclick('input[value="Submit"]');

  // Wait for the success message to appear
  const successMessageLocator = await page.locator('//div[contains(text(), "Thank you for contacting us.")]');

  // Ensure only one success message is found
  const successMessageText = await successMessageLocator.innerText();
  console.log('Success Message:', successMessageText);

  // Validate the success message border color
  const successMessageBorderColor = await successMessageLocator.evaluate(el => getComputedStyle(el).borderColor);
  const successMessageColorHex = rgbToHex(successMessageBorderColor);

  if (successMessageColorHex === '#28A745') {
    console.log('Success message border color is correct (#28A745)');
  } else {
    console.log(`Success message border color mismatch: Expected #28A745, but found ${successMessageColorHex}`);
  }
});
