import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  ASSETS,
  EXTERNAL_LINKS,
  FEATURED_PROJECT_LINKS,
  PROFESSIONAL_DOCUMENTS,
  PROFILE,
  SITE_URL,
  WHATSAPP_CONTACTS,
  WHATSAPP_MESSAGE,
  createWhatsappLink,
} from '../src/js/config.js';

const testDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(testDirectory, '..');

test('gera o link de WhatsApp com a mensagem configurada', () => {
  const link = createWhatsappLink(WHATSAPP_CONTACTS[0].phone);

  assert.equal(
    link,
    `https://wa.me/${WHATSAPP_CONTACTS[0].phone}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
  );
});

test('rejeita números que não pertencem ao perfil', () => {
  assert.throws(() => createWhatsappLink('5500000000000'), /não configurado/i);
});

test('mantém o destino publicado e os canais externos válidos', () => {
  assert.match(SITE_URL, /^https:\/\//);
  assert.match(EXTERNAL_LINKS.github, /^https:\/\/github\.com\//);
  assert.match(EXTERNAL_LINKS.linkedin, /^https:\/\/www\.linkedin\.com\//);
  assert.match(FEATURED_PROJECT_LINKS.desktop, /^https:\/\//);
  assert.match(FEATURED_PROJECT_LINKS.mobile, /^https:\/\//);
  assert.equal(PROFILE.roleLines.length, 2);
  assert.ok(PROFILE.metadata.title.length > 0);
});

test('configura os documentos e assets profissionais com caminhos locais', async () => {
  const html = await readFile(resolve(projectRoot, 'src', 'index.html'), 'utf8');

  assert.equal(PROFESSIONAL_DOCUMENTS.length, 3);
  await Promise.all([
    stat(resolve(projectRoot, 'src', ASSETS.avatar.src)),
    stat(resolve(projectRoot, 'src', ASSETS.qr.src)),
    ...PROFESSIONAL_DOCUMENTS.map((documentItem) =>
      stat(resolve(projectRoot, 'src', documentItem.href)),
    ),
  ]);
  assert.ok(
    PROFESSIONAL_DOCUMENTS.every((documentItem) => documentItem.href.startsWith('assets/')),
  );
  assert.match(html, /data-open-documents/);
  assert.match(html, /id="documents-dialog"/);
  assert.match(html, /\{\{PROFILE_NAME\}\}/);
});
