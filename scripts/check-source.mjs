import { readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, '..');
const sourcePath = (...segments) => resolve(projectRoot, 'src', ...segments);
const failures = [];

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

await stat(sourcePath('assets', 'qr-projetoqr.svg'));
await stat(sourcePath('assets', 'joao-victor-cruz.png'));
await stat(sourcePath('assets', 'joao-victor-cruz-cv-dados-bi.pdf'));
await stat(sourcePath('assets', 'joao-victor-cruz-cv-software-engineer.pdf'));
await stat(sourcePath('assets', 'joao-victor-cruz-portfolio-tecnico.pdf'));

expect(html.includes('<html lang="pt-BR">'), 'O documento deve declarar o idioma pt-BR.');
expect(html.includes('meta name="viewport"'), 'O viewport responsivo está ausente.');
expect(html.includes('data-open-whatsapp'), 'O CTA de WhatsApp está ausente.');
expect(html.includes('id="whatsapp-dialog"'), 'O diálogo de WhatsApp está ausente.');
expect(html.includes('id="documents-dialog"'), 'O diálogo de currículos e portfólio está ausente.');
expect(html.includes('assets/qr-projetoqr.svg'), 'A imagem QR não está conectada ao layout.');
expect(html.includes('assets/joao-victor-cruz.png'), 'A foto profissional não está conectada ao avatar.');
expect(html.includes('data-open-documents'), 'O acesso aos documentos profissionais está ausente.');
expect(!html.includes('em preparação'), 'O currículo não deve permanecer em estado fictício de indisponibilidade.');
expect(html.includes('class="contact-os"'), 'A interface centralizada está ausente.');
expect(styles.includes(':focus-visible'), 'Estados de foco visíveis são obrigatórios.');
expect(styles.includes('prefers-reduced-motion'), 'A redução de movimento deve ser respeitada.');
expect(styles.includes('overflow: hidden'), 'A interface deve controlar a rolagem no viewport.');
expect(app.includes('navigator.share'), 'O compartilhamento nativo deve ser tratado.');
expect(config.includes('https://wa.me/'), 'Os links de WhatsApp devem usar wa.me.');
expect(config.includes('https://app.deskimperial.online/design-lab/overview'), 'O destino do projeto para desktop está ausente.');
expect(config.includes('https://app.deskimperial.online/app/owner'), 'O destino do projeto para mobile está ausente.');
expect(config.includes('PROFESSIONAL_DOCUMENTS'), 'Os documentos profissionais devem ser centralizados na configuração.');

if (failures.length > 0) {
  console.error('Falhas de verificação:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log('Verificações estáticas concluídas com sucesso.');
}
