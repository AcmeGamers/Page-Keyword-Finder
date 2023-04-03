// Author: Acme Gamers
// ----------------
// Table of Content
// ----------------
// @Imports
// @Variables
// @Scrape function
// -- @Remove all script + style tags
// -- @Removes injected styles + scripts from cleaned html
// -- @Removes all classes and ids from cleaned html
// -- @Removes all sizes, nitro-lazy-srcset, nitro-lazy-src, nitro-lazy-empty, height and width from img elements
// -- @Removes all data-settings, data-element_type, data-widget_type from divs
// -- @Output
// ----------------

// @Imports
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const urls = require("../../data/json/url-scrapper.json");

// @Variables
const date = new Date();
const { month, day, year } = {
  month: date.getMonth() + 1,
  day: date.getDate(),
  year: date.getFullYear(),
};

// @Scrape function
async function scrape() {
  // Makes the cache directory if it doesn't already exist
  if (!fs.existsSync(".cache")) {
    fs.mkdirSync(".cache");
  }
  if (!fs.existsSync(".cache/url-scrapper")) {
    fs.mkdirSync(".cache/url-scrapper");
  }

  // Loops through the urls and scrapes them
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const response = await axios.get(url);
    const html = response.data;

    // Loads the HTML into Cheerio
    const $ = cheerio.load(html);

    // @Remove all script + style tags
    $("script").remove();
    $("style").remove();
    $("noscript").remove();
    $("template").remove();
    $("link").remove();
    $("svg").remove();
    let cleanedHtml = $.html();

    // @Removes injected styles + scripts from cleaned html
    cleanedHtml = cleanedHtml.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );
    cleanedHtml = cleanedHtml.replace(
      /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
      ""
    );

    // @Removes all classes and ids from cleaned html
    cleanedHtml = cleanedHtml.replace(/class="[^"]*"/g, "");
    cleanedHtml = cleanedHtml.replace(/id="[^"]*"/g, "");

    // @Removes all sizes, nitro-lazy-srcset, nitro-lazy-src, nitro-lazy-empty, height and width from img elements
    cleanedHtml = cleanedHtml.replace(/sizes="[^"]*"/g, "");
    cleanedHtml = cleanedHtml.replace(/nitro-lazy-srcset="[^"]*"/g, "");
    cleanedHtml = cleanedHtml.replace(/nitro-lazy-src="[^"]*"/g, "");
    cleanedHtml = cleanedHtml.replace(/nitro-lazy-empty="[^"]*"/g, "");
    cleanedHtml = cleanedHtml.replace(/height="[^"]*"/g, "");
    cleanedHtml = cleanedHtml.replace(/width="[^"]*"/g, "");

    // @Removes all data-settings, data-element_type, data-widget_type from divs
    cleanedHtml = cleanedHtml.replace(/data-settings="[^"]*"/g, "");
    cleanedHtml = cleanedHtml.replace(/data-element_type="[^"]*"/g, "");
    cleanedHtml = cleanedHtml.replace(/data-widget_type="[^"]*"/g, "");

    // @Add page url and title to the top of the file for reference
    cleanedHtml = `<!-- URL: ${url} -- Page Title: ${$(
      "title"
    ).text()} -->\n${cleanedHtml}`;

    // changes url name to file name + removes https prefix
    const fileName = url.replace("https://", "").replace(/\//g, "-");

    // Save the cleaned HTML to a file
    // @Output
    fs.writeFileSync(
      `.cache/url-scrapper/${day}-${month}-${year}-${fileName}.html`,
      cleanedHtml
    );
  }
}

scrape();
