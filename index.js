const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async function(req, res) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  await page.goto('https://spacejelly.dev/');

  const title = await page.title();
  const description = await page.$eval('meta[name="description"]', element => element.content);

  await browser.close();

  res.status(200).send({
    status: 'Ok',
    page: {
      title,
      description
    }
  });
};
