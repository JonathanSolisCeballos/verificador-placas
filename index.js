const puppeteer = require("puppeteer");
const express = require("express");
var cors = require("cors");

const PORT = 5500;
const app = express();
app.use(cors());

var page;
var browser = false;

app.get("/consulta-placa/:numero", async (req, res) => {
  try {
    console.log("request recieved for placa: ", req.params?.numero || "nva6181");
    if (!browser) {
      await openPage();
      console.log("browser was closed");
    }
    console.log("browser opened: ", { browser });
    const input = await page.$("#inputPlaca");
    await input.click({ clickCount: 3 });
    await page.type("#inputPlaca", req.params?.numero || "nva6181");
    await page.click("button.btn-cdmx");
    await page.waitForSelector("div#divMensajeVerificacion .alert");
    const text = await page.evaluate(() => {
      const element = document.querySelector("div#divMensajeVerificacion .alert");
      return element.textContent;
    });
    await page.click("button.close");
    res.json({ text: text.trim() });
    console.log("response sent: ", text.trim());
    setTimeout(async () => {
      if (!browser) return;
      await browser.close();
      browser = false;
      console.log("browser closed");
    }, 60000);
  } catch (e) {
    console.log("error: ", e);
    res.json({ text: "error" });
  }
});

async function openPage() {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("https://data.finanzas.cdmx.gob.mx/consulta_adeudos");
  console.log("browser opened");
}

app.get("/abrir-pagina", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
