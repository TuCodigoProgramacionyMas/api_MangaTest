// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// npm i puppeteer
// npm i chrome-aws-lambda
import chromium from "chrome-aws-lambda";

async function getBrowserInstance() {
  const executablePath = await chromium.executablePath;
  const puppeteer = require("puppeteer-core");

  return puppeteer.launch({
    args: [
      ...chromium.args,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process',
    ],
    executablePath: executablePath || undefined,
    headless: true,
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

  let browser = null;
  let result = null;

  try {
    browser = await getBrowserInstance();
    let page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (["image", "stylesheet"].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.setJavaScriptEnabled(false);

    await page.goto(
      "https://www.leercapitulo.com/leer/or1iu9/one-punch-man/182/",
      { waitUntil: "domcontentloaded" }
    );

    await page.waitForSelector("#arraydata");

    result = await page.evaluate(() => {
      const div = document.querySelector("div.select_page_2");
      const tds = Array.from(div.querySelectorAll("option"));
      return tds.map((td) => td.value);
    });

    await browser.close();
    res.json(result);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
}
