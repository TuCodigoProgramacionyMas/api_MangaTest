// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// npm i puppeteer
// npm i chrome-aws-lambda
import chromium from "chrome-aws-lambda";

const token =
  "dfsdfdfsdfwetf345dsfudf234234234udsfnsjdn3242uheirfnjidfijdbfuhsdunfkenrdnsfinds";
async function getBrowserInstance() {
  const executablePath = await chromium.executablePath;
  const puppeteer = require("puppeteer-core");
  if (!executablePath) {
    // running locally

    return puppeteer.launch({
      args: chromium.args,
      headless: true,
      ignoreHTTPSErrors: true,
    });
  }

  return chromium.puppeteer.launch({
    args: chromium.args,
    executablePath,
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

  // if (req.method === 'POST') {

  // if (req.body.token === token) {
  // if(req.body.opcion==='consultar'){
  let browser = null;
  let result = null;
  var comb = [];
  var fecha = [];

  try {
    browser = await getBrowserInstance();
    let page = await browser.newPage();
    // Deshabilitar la carga de imágenes y hojas de estilo
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (["image", "stylesheet"].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });
   
    await page.goto(
      "https://www.leercapitulo.com/leer/or1iu9/one-punch-man/182/"
    );
    page = await page.waitForSelector("#arraydata");
    // const htmlContent = await page.content();

    // Imprimir el contenido HTML en la consola
    // console.log(htmlContent);
    result = await page.evaluate(() => {
      const div = document.querySelector("div.select_page_2");
      const tds = Array.from(div.querySelectorAll("option"));
      //      log(tds[0]);
      return tds.map((td) => td.value);

      //   tds.map(td => td.innerText)
    });

    //  console.log(result);
    // Cerrar el navegador
    await browser.close();
    res.json(result);
    // const data = await page.evaluate(() => {
    //     // Aquí puedes utilizar diferentes tipos de selectores: CSS, XPath, ID, class, etc.
    //     // Ejemplo utilizando selectores CSS
    //     const tds = document.querySelector('#arraydata')

    //     console.log(tds);

    //   });

    // result = await page.evaluate(() => {

    //      const tds = Array.from(document.querySelectorAll('.comic_wraCon a img'))
    //      log(tds[0]);
    //     //  return tds.map(td => td.innerText)
    //  });

    //  for (let i = 0; i < 35; i = i + 5) {

    //      comb.push({
    //          Combustible: result[i],
    //          PrecioAnterior: result[i + 1],
    //          PrecioActual: result[i + 2],
    //          Diferencia: result[i + 3],
    //          EstadoAlsa: result[i + 4]
    //      });
    //  }

    // let result2 = null;

    // result2 = await page.evaluate(() => {

    //     const tds = Array.from(document.querySelectorAll('table tr th'))
    //     return tds.map(td => td.innerText)
    // });

    // fecha.push({
    //     SemanaAnterior: result2[1],
    //     SemanaActual: result2[2]
    // });

    // res.json({ fecha,comb });
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
  //     res.json({ fecha,comb });
  // }
  // if(req.body.opcion==='version')
  // {
  //     res.status(200).json({ Version: '0.5' })
  // }

  //     }
  // }
  // else {
  //     res.status(200).json({ Error: 'Error' })
  // }
}
