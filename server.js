const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post("/fetch-review", async (req, res) => {
  try {
    const { productUrl, reviewerName } = req.body;

    if (!productUrl || !reviewerName) {
      return res.json({ success: false, error: "Missing data" });
    }

    const pidMatch = productUrl.match(/pid=([A-Z0-9]+)/i);

    if (!pidMatch) {
      return res.json({ success: false, error: "Invalid Flipkart URL" });
    }

    const pid = pidMatch[1];

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true
    });

    const page = await browser.newPage();

    for (let i = 1; i <= 20; i++) {
      const reviewUrl = `https://www.flipkart.com/reviews/${pid}:${i}`;

      await page.goto(reviewUrl, {
        waitUntil: "domcontentloaded",
        timeout: 15000
      });

      const content = await page.content();

      if (content.toLowerCase().includes(reviewerName.toLowerCase())) {
        await browser.close();
        return res.json({
          success: true,
          permalink: reviewUrl
        });
      }
    }

    await browser.close();

    res.json({
      success: false,
      error: "Review not found"
    });

  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      error: "Server error"
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
