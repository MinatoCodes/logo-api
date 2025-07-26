const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const chromium = require('@sparticuz/chromium');
const effects = require('../effects');

puppeteerExtra.use(StealthPlugin());

module.exports = async (req, res) => {
  const { text, id } = req.query;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "text" query.' });
  }

  const numericId = parseInt(id, 10);
  const effect = effects.find(e => e.id === numericId);

  if (!effect) {
    return res.status(400).json({ error: `Invalid effect ID. Try one from 0 to ${effects.length - 1}` });
  }

  let browser = null;

  try {
    browser = await puppeteerExtra.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(effect.url, { waitUntil: 'networkidle2' });

    await page.type('#text-0', text);
    await page.click('#create_effect');

    const resultSelector = '.share_image #link-image';
    await page.waitForFunction(
      selector => {
        const el = document.querySelector(selector);
        return el && el.textContent.includes('https://') && el.textContent.includes('.jpg');
      },
      { timeout: 45000 },
      resultSelector
    );

    const resultText = await page.$eval(resultSelector, el => el.textContent);
    const match = resultText.match(/(https?:\/\/\S+\.jpg)/);
    const imageUrl = match ? match[0] : null;

    if (!imageUrl) throw new Error('Failed to extract image URL.');

    res.status(200).json({
      success: true,
      author: 'Minato Namikaze',
      effect: {
        id: effect.id,
        title: effect.title,
        url: effect.url
      },
      image: imageUrl
    });

  } catch (err) {
    res.status(500).json({ error: err.message || 'Unknown error occurred.' });
  } finally {
    if (browser) await browser.close();
  }
};
  
