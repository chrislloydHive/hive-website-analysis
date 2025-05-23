const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

app.post('/render', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL' });
  }

  try {
    const browser = await chromium.launch({
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    const html = await page.content();
    await browser.close();

    res.json({ html });
  } catch (error) {
    console.error('Render error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Renderer running on port ${PORT}`));
