const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require('../webpack.config.js');

const opts = {
  //chromeFlags: ['--headless'],
  logLevel: 'info',
  output: 'json',
};

async function startWebpackDevServer() {
  const compiler = webpack(config);
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

  await server.stop();
  await browser.disconnect();
  await chrome.kill();
}

main();
