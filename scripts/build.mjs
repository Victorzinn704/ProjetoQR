import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ASSETS,
  CONTACT_CONTENT,
  EXTERNAL_LINKS,
  FEATURED_PROJECT_LINKS,
  PORTFOLIO_CONTENT,
  PROFILE,
} from '../src/js/config.js';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, '..');
const sourceDirectory = resolve(projectRoot, 'src');
const outputDirectory = resolve(projectRoot, 'dist');
const pageTemplate = await readFile(resolve(sourceDirectory, 'index.html'), 'utf8');
const [roleLineOne, roleLineTwo] = PROFILE.roleLines;

const tokens = {
  SEO_DESCRIPTION: PROFILE.metadata.description,
  SEO_TITLE: PROFILE.metadata.title,
  OG_DESCRIPTION: PROFILE.metadata.socialDescription,
  PROFILE_NAME: PROFILE.name,
  PROFILE_INITIALS: PROFILE.initials,
  PROFILE_LOCATION: PROFILE.location,
  PROFILE_SPECIALTIES: PROFILE.specialties,
  PROFILE_SUMMARY: PROFILE.summary,
  ROLE_LINE_ONE: roleLineOne,
  ROLE_LINE_TWO: roleLineTwo,
  AVATAR_SRC: ASSETS.avatar.src,
  AVATAR_ALT: ASSETS.avatar.alt,
  AVATAR_WIDTH: ASSETS.avatar.width,
  AVATAR_HEIGHT: ASSETS.avatar.height,
  CONTACT_EYEBROW: CONTACT_CONTENT.eyebrow,
  CONTACT_HEADLINE: CONTACT_CONTENT.headline,
  CONTACT_SUMMARY: CONTACT_CONTENT.summary,
  CONTACT_ACTION_OVERLINE: CONTACT_CONTENT.actionOverline,
  CONTACT_ACTION_LABEL: CONTACT_CONTENT.actionLabel,
  CONTACT_ACTION_NOTE: CONTACT_CONTENT.actionNote,
  PORTFOLIO_EYEBROW: PORTFOLIO_CONTENT.eyebrow,
  PORTFOLIO_TITLE: PORTFOLIO_CONTENT.title,
  FEATURED_PROJECT_DESKTOP_URL: FEATURED_PROJECT_LINKS.desktop,
  FEATURED_PROJECT_EYEBROW: PORTFOLIO_CONTENT.featuredProject.eyebrow,
  FEATURED_PROJECT_TITLE: PORTFOLIO_CONTENT.featuredProject.title,
  FEATURED_PROJECT_DESCRIPTION: PORTFOLIO_CONTENT.featuredProject.description,
  LINKEDIN_URL: EXTERNAL_LINKS.linkedin,
  LINKEDIN_DESCRIPTION: PORTFOLIO_CONTENT.linkedinDescription,
  GITHUB_URL: EXTERNAL_LINKS.github,
  GITHUB_DESCRIPTION: PORTFOLIO_CONTENT.githubDescription,
  DOCUMENTS_ACTION_TITLE: PORTFOLIO_CONTENT.documents.title,
  DOCUMENTS_ACTION_DESCRIPTION: PORTFOLIO_CONTENT.documents.description,
  QR_EYEBROW: PORTFOLIO_CONTENT.qr.eyebrow,
  QR_TITLE: PORTFOLIO_CONTENT.qr.title,
  QR_ACTION_LABEL: PORTFOLIO_CONTENT.qr.actionLabel,
  QR_SRC: ASSETS.qr.src,
  QR_ALT: ASSETS.qr.alt,
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function renderPage(template) {
  const renderedPage = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, token) => {
    if (!Object.hasOwn(tokens, token)) {
      throw new Error(`Token de template não configurado: ${token}`);
    }

    return escapeHtml(tokens[token]);
  });

  if (/\{\{[A-Z0-9_]+\}\}/.test(renderedPage)) {
    throw new Error('O build deixou tokens sem preenchimento no HTML.');
  }

  return renderedPage;
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(sourceDirectory, outputDirectory, { recursive: true });
await writeFile(resolve(outputDirectory, 'index.html'), renderPage(pageTemplate), 'utf8');

console.log('Build estático criado em dist/.');
