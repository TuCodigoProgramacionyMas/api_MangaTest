import puppeteer from 'puppeteer';

async function getBrowserInstance() {
  return puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
}

export default async function getCombustibles(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Check if url query parameter is available
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL not provided' });
  }

  let browser = null;

  try {
    browser = await getBrowserInstance();

    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (request) =>
      ['image', 'stylesheet'].includes(request.resourceType())
        ? request.abort()
        : request.continue()
    );

    await page.goto(targetUrl);

    const htmlContent = await page.content();

    await browser.close();

    res.json({ htmlContent });
  } catch (error) {
    res.status(400).json({ error: error.toString() });
    console.error(error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}