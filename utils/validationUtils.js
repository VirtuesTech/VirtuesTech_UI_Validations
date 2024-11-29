
// Helper function to convert RGB to Hex
const rgbToHex = (rgb) => {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  };
  
  // Utility function to trim long text
  const trimText = (text, maxLength = 50) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };
  
  // Function to validate elements (headings and buttons)
  const validateElements = async (page, selector, validationMap = {}, buttonColorMap = {}) => {
    const elements = await page.locator(selector);
    const count = await elements.count();
    const results = [];
  
    for (let i = 0; i < count; i++) {
      const element = elements.nth(i);
      let textContent = await element.innerText({ timeout: 10000 }); // Increase timeout
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
  
  module.exports = { validateElements, rgbToHex, trimText };
  