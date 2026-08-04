import {
  EXTERNAL_LINKS,
  FEATURED_PROJECT_LINKS,
  PROFESSIONAL_DOCUMENTS,
  SITE_URL,
  WHATSAPP_CONTACTS,
  createWhatsappLink,
} from './config.js';

const whatsappDialog = document.querySelector('#whatsapp-dialog');
const whatsappOptions = document.querySelector('[data-whatsapp-options]');
const documentsDialog = document.querySelector('#documents-dialog');
const documentOptions = document.querySelector('[data-document-options]');
const openWhatsappButton = document.querySelector('[data-open-whatsapp]');
const openDocumentsButton = document.querySelector('[data-open-documents]');
const copyLinkButton = document.querySelector('[data-copy-link]');
const shareLinkButton = document.querySelector('[data-share-link]');
const toast = document.querySelector('[data-toast]');
const mobileViewport = window.matchMedia('(max-width: 760px)');
let toastTimer;

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3200);
}

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const fallback = document.createElement('textarea');
  fallback.value = text;
  fallback.setAttribute('readonly', '');
  fallback.style.position = 'fixed';
  fallback.style.opacity = '0';
  document.body.append(fallback);
  fallback.select();
  document.execCommand('copy');
  fallback.remove();
  return Promise.resolve();
}

function renderWhatsappOptions() {
  const options = WHATSAPP_CONTACTS.map((contact) => {
    const link = document.createElement('a');
    const content = document.createElement('span');
    const channel = document.createElement('span');
    const number = document.createElement('span');
    const hint = document.createElement('span');

    link.className = 'whatsapp-option';
    link.href = createWhatsappLink(contact.phone);
    link.target = '_blank';
    link.rel = 'noreferrer';
    content.className = 'whatsapp-option__content';
    channel.className = 'whatsapp-option__channel';
    number.className = 'whatsapp-option__number';
    channel.textContent = contact.channel;
    number.textContent = contact.label;
    content.append(channel, number);

    hint.className = 'whatsapp-option__hint';
    hint.textContent = 'Abrir WhatsApp ↗';
    link.append(content, hint);

    return link;
  });

  whatsappOptions.replaceChildren(...options);
}

function renderDocumentOptions() {
  const options = PROFESSIONAL_DOCUMENTS.map((documentItem) => {
    const link = document.createElement('a');
    const content = document.createElement('span');
    const title = document.createElement('span');
    const description = document.createElement('span');
    const hint = document.createElement('span');

    link.className = 'document-option';
    link.href = documentItem.href;
    link.target = '_blank';
    link.rel = 'noreferrer';

    content.className = 'document-option__content';
    title.className = 'document-option__title';
    description.className = 'document-option__description';
    hint.className = 'document-option__hint';
    title.textContent = documentItem.title;
    description.textContent = documentItem.description;
    hint.textContent = 'Abrir PDF ↗';
    content.append(title, description);
    link.append(content, hint);

    return link;
  });

  documentOptions.replaceChildren(...options);
}

function openWhatsappDialog() {
  if (typeof whatsappDialog.showModal === 'function') {
    whatsappDialog.showModal();
    return;
  }

  window.open(createWhatsappLink(WHATSAPP_CONTACTS[0].phone), '_blank', 'noreferrer');
}

function openDocumentsDialog() {
  if (typeof documentsDialog.showModal === 'function') {
    documentsDialog.showModal();
  }
}

function initializeExternalLinks() {
  document.querySelectorAll('[data-external-link]').forEach((link) => {
    const key = link.dataset.externalLink;
    const url = key === 'featuredProject'
      ? mobileViewport.matches
        ? FEATURED_PROJECT_LINKS.mobile
        : FEATURED_PROJECT_LINKS.desktop
      : EXTERNAL_LINKS[key];

    if (url) {
      link.href = url;
    }
  });
}

function initializePointerGlow() {
  if (!window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  document.querySelectorAll('.interactive-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
    });
  });
}

function initializeDesktopMotion() {
  const isDesktop = window.matchMedia('(min-width: 761px)');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!isDesktop.matches || prefersReducedMotion.matches) {
    return;
  }

  const conversationPanel = document.querySelector('.conversation-panel');

  window.requestAnimationFrame(() => {
    document.body.classList.add('has-desktop-motion');
  });

  if (!conversationPanel || !window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  conversationPanel.addEventListener('pointermove', (event) => {
    const bounds = conversationPanel.getBoundingClientRect();
    const offsetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
    const offsetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;

    conversationPanel.style.setProperty('--orbit-x', `${offsetX.toFixed(2)}px`);
    conversationPanel.style.setProperty('--orbit-y', `${offsetY.toFixed(2)}px`);
  });

  conversationPanel.addEventListener('pointerleave', () => {
    conversationPanel.style.removeProperty('--orbit-x');
    conversationPanel.style.removeProperty('--orbit-y');
  });
}

renderWhatsappOptions();
renderDocumentOptions();
initializeExternalLinks();
mobileViewport.addEventListener('change', initializeExternalLinks);
initializePointerGlow();
initializeDesktopMotion();

openWhatsappButton.addEventListener('click', openWhatsappDialog);
openDocumentsButton.addEventListener('click', openDocumentsDialog);

copyLinkButton.addEventListener('click', async () => {
  try {
    await copyText(SITE_URL);
    showToast('Acesso copiado.');
  } catch {
    showToast('Não foi possível copiar automaticamente.');
  }
});

if (navigator.share) {
  shareLinkButton.hidden = false;
  shareLinkButton.addEventListener('click', async () => {
    try {
      await navigator.share({
        title: 'João Victor Cruz | Software, Dados & Automação',
        text: 'Projetos, currículos e contato profissional de João Victor Cruz.',
        url: SITE_URL,
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        showToast('Não foi possível abrir o compartilhamento.');
      }
    }
  });
}
