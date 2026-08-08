import { readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ASSETS,
  FEATURED_PROJECT_LINKS,
  PROFESSIONAL_DOCUMENTS,
  PROFILE,
} from '../src/js/config.js';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, '..');
const sourcePath = (...segments) => resolve(projectRoot, 'src', ...segments);
const failures = [];
const assetPath = (relativePath) => sourcePath(...relativePath.split('/'));

function expect(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

const [html, styles, app, config] = await Promise.all([
  readFile(sourcePath('index.html'), 'utf8'),
  readFile(sourcePath('css', 'styles.css'), 'utf8'),
  readFile(sourcePath('js', 'app.js'), 'utf8'),
  readFile(sourcePath('js', 'config.js'), 'utf8'),
]);

await Promise.all([
  stat(assetPath(ASSETS.qr.src)),
  stat(assetPath(ASSETS.avatar.src)),
  ...PROFESSIONAL_DOCUMENTS.map((documentItem) => stat(assetPath(documentItem.href))),
]);

expect(html.includes('<html lang="pt-BR">'), 'O documento deve declarar o idioma pt-BR.');
expect(html.includes('meta name="viewport"'), 'O viewport responsivo está ausente.');
expect(html.includes('data-open-whatsapp'), 'O CTA de WhatsApp está ausente.');
expect(html.includes('id="whatsapp-dialog"'), 'O diálogo de WhatsApp está ausente.');
expect(html.includes('id="documents-dialog"'), 'O diálogo de currículos e portfólio está ausente.');
expect(html.includes('{{QR_SRC}}'), 'A imagem QR não está conectada à configuração.');
expect(html.includes('{{AVATAR_SRC}}'), 'A foto profissional não está conectada à configuração.');
expect(html.includes('data-open-documents'), 'O acesso aos documentos profissionais está ausente.');
expect(html.includes('class="contact-os"'), 'A interface centralizada está ausente.');
expect(styles.includes(':focus-visible'), 'Estados de foco visíveis são obrigatórios.');
expect(styles.includes('prefers-reduced-motion'), 'A redução de movimento deve ser respeitada.');
expect(styles.includes('overflow: hidden'), 'A interface deve controlar a rolagem no viewport.');
expect(app.includes('navigator.share'), 'O compartilhamento nativo deve ser tratado.');
expect(config.includes('https://wa.me/'), 'Os links de WhatsApp devem usar wa.me.');
expect(PROFILE.roleLines.length === 2, 'O cargo deve ter duas linhas para preservar o enquadramento.');
expect(PROFILE.metadata.title.length > 0, 'O título de compartilhamento está ausente.');
expect(FEATURED_PROJECT_LINKS.desktop.startsWith('https://'), 'O destino desktop precisa usar HTTPS.');
expect(FEATURED_PROJECT_LINKS.mobile.startsWith('https://'), 'O destino mobile precisa usar HTTPS.');
expect(config.includes('PROFESSIONAL_DOCUMENTS'), 'Os documentos profissionais devem ser centralizados na configuração.');

if (failures.length > 0) {
  console.error('Falhas de verificação:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log('Verificações estáticas concluídas com sucesso.');
}
