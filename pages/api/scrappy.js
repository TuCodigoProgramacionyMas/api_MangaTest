import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer";

async function getBrowserInstance() {
  const executablePath = await chromium.executablePath;

  if (!executablePath) {
    return puppeteer.launch({
      args: chromium.args,
      headless: true,
      ignoreHTTPSErrors: true,
    });
  }

  return chromium.puppeteer.launch({
    args: chromium.args,
    executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
}


export default async function getCombustibles(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

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
    page.on("request", (request) =>
      ["image", "stylesheet"].includes(request.resourceType())
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
