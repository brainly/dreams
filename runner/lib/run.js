const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require('../webpack.config.js');

const saveToJson = require('../lib/save');

const opts = {
  //chromeFlags: ['--headless'],
  logLevel: 'info',
  output: 'json',
};

const outputDir = path.join(__dirname, '../../output');
const outputFilename = path.join(outputDir, 'figma-document.json');

async function startWebpackDevServer() {
  const configuration = { ...config, mode: 'development' };
  const compiler = webpack(configuration);
  const server = new webpackDevServer(compiler, config.devServer);
  await server.start();
  return server;
}

async function main() {
  const chrome = await chromeLauncher.launch(opts);

  const response = await fetch(`http://localhost:${chrome.port}/json/version`);
  const data = await response.json();

  console.log(data);

  const { webSocketDebuggerUrl } = data;
  const browser = await puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl,
  });

  const server = await startWebpackDevServer();

  const page = await browser.newPage();
  await page.goto(`http://localhost:${config.devServer.port}`, {
    waitUntil: 'networkidle2',
  });

  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio,
    };
  });

  console.log('Dimensions:', dimensions);

  const figmaDocument = await page.evaluate(() => {
    return driver.getFigmaDocument();
  });

  console.log('Figma document:', figmaDocument);

  saveToJson(outputFilename, figmaDocument);

  await server.stop();
  await browser.disconnect();
  await chrome.kill();
}

main();
