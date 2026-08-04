import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  EXTERNAL_LINKS,
  SITE_URL,
  WHATSAPP_CONTACTS,
  WHATSAPP_MESSAGE,
  createWhatsappLink,
} from '../src/js/config.js';

const testDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(testDirectory, '..');

test('gera o link de WhatsApp com a mensagem fornecida', () => {
  const link = createWhatsappLink(WHATSAPP_CONTACTS[0].phone);

  assert.equal(
    link,
    `https://wa.me/5522991014343?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
  );
});

test('rejeita números que não pertencem ao cartão', () => {
  assert.throws(() => createWhatsappLink('5500000000000'), /não configurado/i);
});

test('mantém o destino publicado e os canais externos configurados', () => {
  assert.equal(SITE_URL, 'https://victorzinn704.github.io/ProjetoQR/');
  assert.match(EXTERNAL_LINKS.github, /^https:\/\/github\.com\//);
  assert.match(EXTERNAL_LINKS.linkedin, /^https:\/\/www\.linkedin\.com\//);
  assert.match(EXTERNAL_LINKS.featuredProject, /^https:\/\/app\.deskimperial\.online\//);
});

test('mantém o currículo em estado explícito de indisponibilidade', async () => {
  const html = await readFile(resolve(projectRoot, 'src', 'index.html'), 'utf8');

  assert.match(html, /Currículo/);
  assert.match(html, /Disponível em breve/);
  assert.doesNotMatch(html, /curriculo\.pdf/i);
});
