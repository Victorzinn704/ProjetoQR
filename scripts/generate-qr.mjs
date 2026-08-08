import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import { ASSETS, SITE_URL } from '../src/js/config.js';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const outputDirectory = resolve(scriptDirectory, '..', 'src', 'assets');
const outputFile = resolve(outputDirectory, ASSETS.qr.src.replace(/^assets\//, ''));

const qrMarkup = await QRCode.toString(SITE_URL, {
  type: 'svg',
  errorCorrectionLevel: 'M',
  margin: 4,
  color: {
    dark: '#07111F',
    light: '#FFFFFF',
  },
});

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputFile, qrMarkup, 'utf8');

console.log(`QR code atualizado para ${SITE_URL}`);
