// // const express = require('express');
// // const chromium = require('chrome-aws-lambda');

// // const app = express();
// // const port = 3000;

// // app.get('/scrape', async (req, res) => {
// //   let url = req.query.url;

// //   url='https://leermanga.net/';
// //   if (!url) {
// //     return res.json({ error: 'Missing URL parameter' });
// //   }

// //   const browser = await chromium.puppeteer.launch({
// //     args: chromium.args,
// //     defaultViewport: chromium.defaultViewport,
// //     executablePath: await chromium.executablePath,
// //     headless: false, // Modificar esta línea
// //   });

// //   const webPage = await browser.newPage();

// //   // Bloquear las solicitudes CSS
// //   await webPage.setRequestInterception(true);
// //   webPage.on('request', (request) => {
// //     if (request.resourceType() === 'stylesheet') {
// //       request.abort();
// //     } else {
// //       request.continue();
// //     }
// //   });

// //   await webPage.goto(url);

// //   const pageContent = await webPage.content();

// //   await browser.close();

// //   res.setHeader('Content-Type', 'application/json');
// //   res.send(JSON.stringify({ html: pageContent }));
// // });

// // app.listen(port, () => {
// //   console.log(`App running on http://localhost:${port}`);
// // });

// const chromium = require("chrome-aws-lambda");
// const express = require("express");
// const puppeteer = require("puppeteer");

// const app = express();
// const port = 3000;

// app.get("/scrape", async (req, res) => {
//   const url = req.query.url;

//   if (!url) {
//     return res.json({ error: "Missing URL parameter" });
//   }
 
//   // const executablePath = await chromium.executablePath;
//   // if (!executablePath) {
//   //   return puppeteer.launch({
//   //     args: chromium.args,
//   //     headless: chromium.headless,
//   //     ignoreHTTPSErrors: true,
//   //   });
//   // }
  
//   const browser = await puppeteer.launch({
//     args: chromium.args,
//     headless: true,  // <-- Configura esto en true para ocultar la ventana del navegador
//     ignoreHTTPSErrors: true,
//   });

//   const webPage = await browser.newPage();

//   // Bloquear las solicitudes CSS
//   // await webPage.setRequestInterception(true);
//   // webPage.on("request", (request) => {
//   //   if (request.resourceType() === "stylesheet") {
//   //     request.abort();
//   //   } else {
//   //     request.continue();
//   //   }
//   // });

//   await webPage.goto(url);

//   const pageContent = await webPage.content();

//   await browser.close();

//   res.setHeader("Content-Type", "application/json");
//   res.send(JSON.stringify({ html: pageContent }));
// });

// app.listen(port, () => {
//   console.log(`App running on http://localhost:${port}`);
// });

const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async function(event, context) {
  const browser = process.env.CHROME_EXECUTABLE_PATH || await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto('https://spacejelly.dev/');

  const title = await page.title();
  const description = await page.$eval('meta[name="description"]', element => element.content);

  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'Ok',
      page: {
        title,
        description
      }
    })
  };
}