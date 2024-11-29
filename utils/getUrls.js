// utils/urlUtils.js

/**
 * Fetches and processes unique service URLs from the provided page.
 * - Fetches all anchor links
 * - Filters URLs starting with 'https://virtuestech.com/services/'
 * - Removes URLs containing '#'
 * - Removes trailing slashes
 * - Removes duplicates
 * 
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @returns {Promise<string[]>} - A promise that resolves to an array of unique URLs
 */
const fetchUniqueServiceUrls = async (page) => {
  await page.goto("https://virtuestech.com/");

  // Fetch all anchor tags' href attributes
  const anchors = await page.$$eval('a', (links) =>
    links.map((link) => link.href)
  );

  // Filter URLs that start with 'https://virtuestech.com/services/' and exclude those containing '#'
  const serviceUrls = anchors.filter(href =>
    href.startsWith('https://virtuestech.com/services/') && !href.includes('#')
  );

  // Remove trailing slashes and remove duplicates
  const cleanedServiceUrls = serviceUrls.map(url => url.replace(/\/$/, ''));

  // Remove duplicates by converting to a Set and then back to an array
  return [...new Set(cleanedServiceUrls)];
};

module.exports = { fetchUniqueServiceUrls };
