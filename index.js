const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  let browser = null;
  
  try {
    const executablePath = await chromium.executablePath;

    // Configuración de lanzamiento del navegador
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.goto('https://spacejelly.dev/');

    const title = await page.title();
    const description = await page.$eval(
      'meta[name="description"]',
      (element) => element.content
    );

    await browser.close();

    res.status(200).json({
      status: 'Ok',
      page: {
        title,
        description,
      },
    });
  } catch (error) {
    console.error(error);
    
    res.status(500).json({
      error: 'Error al lanzar el navegador o al extraer los datos',
    });
    
    if (browser) {
      await browser.close();
    }
  }
};
