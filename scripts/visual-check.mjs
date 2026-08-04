import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputDirectory = resolve(projectRoot, 'dist');
const testResultsDirectory = resolve(projectRoot, 'test-results');
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.pdf': 'application/pdf',
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
await mkdir(testResultsDirectory, { recursive: true });
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({ headless: true });

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  await desktop.emulateMedia({ reducedMotion: 'no-preference' });
  const desktopErrors = [];
  desktop.on('console', (message) => {
    if (message.type() === 'error') {
      desktopErrors.push(message.text());
    }
  });

  await desktop.goto(baseUrl, { waitUntil: 'networkidle' });
  await expectPageStructure(desktop, 1440);
  await desktop.waitForFunction(() => document.body.classList.contains('has-desktop-motion'));
  assert.equal(
    await desktop.locator('[data-external-link="featuredProject"]').getAttribute('href'),
    'https://app.deskimperial.online/design-lab/overview',
  );
  assert.notEqual(
    await desktop.locator('.conversation-panel').evaluate((panel) => getComputedStyle(panel).animationName),
    'none',
    'O motion de entrada do desktop não foi ativado.',
  );
  await desktop.locator('[data-open-whatsapp]').click();
  await assert.equal(await desktop.locator('#whatsapp-dialog').evaluate((dialog) => dialog.open), true);
  await assert.equal(await desktop.locator('.whatsapp-option').count(), 2);
  await desktop.keyboard.press('Escape');
  await assert.equal(await desktop.locator('#whatsapp-dialog').evaluate((dialog) => dialog.open), false);
  await desktop.locator('[data-open-documents]').click();
  await assert.equal(await desktop.locator('#documents-dialog').evaluate((dialog) => dialog.open), true);
  await assert.equal(await desktop.locator('.document-option').count(), 3);
  await assert.equal(
    await desktop.locator('.document-option').first().getAttribute('href'),
    'assets/joao-victor-cruz-cv-dados-bi.pdf',
  );
  await desktop.keyboard.press('Escape');
  await assert.equal(await desktop.locator('#documents-dialog').evaluate((dialog) => dialog.open), false);
  const documentResponse = await desktop.request.get(`${baseUrl}/assets/joao-victor-cruz-cv-dados-bi.pdf`);
  assert.equal(documentResponse.status(), 200);
  await desktop.screenshot({ path: 'test-results/desktop.png', fullPage: true });
  assert.deepEqual(desktopErrors, []);

  const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await mobile.emulateMedia({ reducedMotion: 'reduce' });
  await mobile.goto(baseUrl, { waitUntil: 'networkidle' });
  await expectPageStructure(mobile, 375);
  assert.equal(
    await mobile.locator('[data-external-link="featuredProject"]').getAttribute('href'),
    'https://app.deskimperial.online/app/owner',
  );
  await mobile.locator('[data-open-documents]').click();
  await assert.equal(await mobile.locator('#documents-dialog').evaluate((dialog) => dialog.open), true);
  await mobile.locator('#documents-dialog .dialog-close').click();
  const transitionDuration = await mobile.locator('.action-card').first().evaluate((card) => getComputedStyle(card).transitionDuration);
  assert.ok(parseFloat(transitionDuration) <= 0.00001);
  await mobile.screenshot({ path: 'test-results/mobile.png', fullPage: true });

  for (const viewport of [
    { width: 320, height: 812 },
    { width: 360, height: 812 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
    { width: 1024, height: 900 },
    { width: 1440, height: 960 },
  ]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });

    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await expectPageStructure(page, viewport.width);
    assert.equal(
      await page.locator('[data-external-link="featuredProject"]').getAttribute('href'),
      viewport.width <= 860
        ? 'https://app.deskimperial.online/app/owner'
        : 'https://app.deskimperial.online/design-lab/overview',
    );
    assert.deepEqual(errors, []);
    await page.close();
  }

  console.log('Validação de navegador concluída em desktop e mobile.');
} finally {
  await browser.close();
  await new Promise((resolveServer) => server.close(resolveServer));
}

async function expectPageStructure(page, viewportWidth) {
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('.action-card').count(), 5);
  assert.equal(await page.locator('img[alt*="QR code"]').count(), 1);
  assert.equal(await page.locator('[data-open-documents]').count(), 1);
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    true,
    `A página excede a largura do viewport de ${viewportWidth}px.`,
  );
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight),
    true,
    `A página excede a altura do viewport de ${viewportWidth}px.`,
  );

  if (viewportWidth <= 860) {
    const actionCardSizes = await page.locator('.portal-actions .action-card').evaluateAll((cards) =>
      cards.map((card) => {
        const bounds = card.getBoundingClientRect();
        return { width: bounds.width, height: bounds.height };
      }),
    );

    actionCardSizes.forEach((size) => {
      assert.ok(size.width >= 44 && size.height >= 44, 'Os cards mobile precisam manter área de toque confortável.');
    });
  }
}
