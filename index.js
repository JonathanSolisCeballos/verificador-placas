const puppeteer = require("puppeteer");
const express = require("express");
var cors = require("cors");

const PORT = 5500;
const app = express();
app.use(cors());

app.get("/consulta-placa/:numero", async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://data.finanzas.cdmx.gob.mx/consulta_adeudos");
  await page.type("#inputPlaca", req.params?.numero || "nva6181");
  await page.click("button.btn-cdmx");
  await page.waitForSelector("div#divMensajeVerificacion .alert");
  const text = await page.evaluate(() => {
    const element = document.querySelector("div#divMensajeVerificacion .alert");
    return element.textContent;
  });

  res.json({ text: text.trim() });

  await browser.close();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
