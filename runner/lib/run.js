const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const opts = {
  //chromeFlags: ['--headless'],
  logLevel: 'info',
  output: 'json',
};

async function main() {
  const chrome = await chromeLauncher.launch(opts);

  const response = await fetch(`http://localhost:${chrome.port}/json/version`);
  const data = await response.json();

  console.log(data);

  const { webSocketDebuggerUrl } = data;
  const browser = await puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl,
  });

  const page = await browser.newPage();
  await page.goto('https://news.ycombinator.com', {
    waitUntil: 'networkidle2',
  });

  await browser.disconnect();
  await chrome.kill();
}

main();
