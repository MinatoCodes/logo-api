const express = require('express');
const router = express.Router();
const effects = require('../effects');

const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteerExtra.use(StealthPlugin());

router.get('/', async (req, res) => {
  const { id, text } = req.query;

  if (!text || !id) {
    return res.status(400).json({ error: 'Missing required query: id and text' });
  }

  const effect = effects.find(e => e.id === parseInt(id));
  if (!effect) {
    return res.status(404).json({ error: 'Invalid effect ID' });
  }

  let browser;

  try {
    browser = await puppeteerExtra.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(effect.url, { waitUntil: 'networkidle2' });

    await page.type('#text-0', text);
    await page.click('#create_effect');

    await page.waitForFunction(() => {
      const el = document.querySelector('.share_image #link-image');
      return el && el.textContent.includes('.jpg');
    }, { timeout: 45000 });

    const result = await page.$eval('.share_image #link-image', el => el.textContent);
    const match = result.match(/(https?:\/\/\S+\.jpg)/);
    const imageUrl = match ? match[0] : null;

    if (!imageUrl) throw new Error('Image generation failed.');

    res.json({
      success: true,
      author: 'Minato Namikaze',
      effect: effect.title,
      image: imageUrl
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

module.exports = router;
      
