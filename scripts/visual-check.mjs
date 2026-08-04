import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputDirectory = resolve(projectRoot, 'dist');
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
};

const server = createServer(async (request, response) => {
  const requestedPath = new URL(request.url, 'http://127.0.0.1').pathname;
  const relativePath = requestedPath === '/' ? 'index.html' : requestedPath.replace(/^\/+/, '');
  const filePath = resolve(outputDirectory, relativePath);

  if (!filePath.startsWith(`${outputDirectory}${sep}`) && filePath !== resolve(outputDirectory, 'index.html')) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    const content = await readFile(filePath);
    response.writeHead(200, { 'content-type': mimeTypes[extname(filePath)] ?? 'application/octet-stream' });
    response.end(content);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});

await new Promise((resolveServer) => server.listen(0, '127.0.0.1', resolveServer));
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({ headless: true });

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const desktopErrors = [];
  desktop.on('console', (message) => {
    if (message.type() === 'error') {
      desktopErrors.push(message.text());
    }
  });

  await desktop.goto(baseUrl, { waitUntil: 'networkidle' });
  await expectPageStructure(desktop, 1440);
  await desktop.locator('[data-open-whatsapp]').click();
  await assert.equal(await desktop.locator('#whatsapp-dialog').evaluate((dialog) => dialog.open), true);
  await assert.equal(await desktop.locator('.whatsapp-option').count(), 2);
  await desktop.locator('.dialog-close').click();
  await desktop.screenshot({ path: 'test-results/desktop.png', fullPage: true });
  assert.deepEqual(desktopErrors, []);

  const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await mobile.emulateMedia({ reducedMotion: 'reduce' });
  await mobile.goto(baseUrl, { waitUntil: 'networkidle' });
  await expectPageStructure(mobile, 375);
  const transitionDuration = await mobile.locator('.action-card').first().evaluate((card) => getComputedStyle(card).transitionDuration);
  assert.ok(parseFloat(transitionDuration) <= 0.00001);
  await mobile.screenshot({ path: 'test-results/mobile.png', fullPage: true });

  console.log('Validação de navegador concluída em desktop e mobile.');
} finally {
  await browser.close();
  await new Promise((resolveServer) => server.close(resolveServer));
}

async function expectPageStructure(page, viewportWidth) {
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('.action-card').count(), 5);
  assert.equal(await page.locator('img[alt*="QR code"]').count(), 1);
  assert.equal(await page.locator('.action-card--disabled').isDisabled(), true);
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    true,
    `A página excede a largura do viewport de ${viewportWidth}px.`,
  );
}
