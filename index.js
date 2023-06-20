const express = require('express');
const chromium = require('chrome-aws-lambda');

const app = express();
const port = 3000;

app.get('/scrape', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.json({ error: 'Missing URL parameter' });
  }

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: false, // Modificar esta línea
  });

  const webPage = await browser.newPage();

  // Bloquear las solicitudes CSS
  await webPage.setRequestInterception(true);
  webPage.on('request', (request) => {
    if (request.resourceType() === 'stylesheet') {
      request.abort();
    } else {
      request.continue();
    }
  });

  await webPage.goto(url);

  const pageContent = await webPage.content();

  await browser.close();

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ html: pageContent }));
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
