import {
  EXTERNAL_LINKS,
  SITE_URL,
  WHATSAPP_CONTACTS,
  createWhatsappLink,
} from './config.js';

const whatsappDialog = document.querySelector('#whatsapp-dialog');
const whatsappOptions = document.querySelector('[data-whatsapp-options]');
const openWhatsappButton = document.querySelector('[data-open-whatsapp]');
const copyLinkButton = document.querySelector('[data-copy-link]');
const shareLinkButton = document.querySelector('[data-share-link]');
const toast = document.querySelector('[data-toast]');
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
    const hint = document.createElement('span');

    link.className = 'whatsapp-option';
    link.href = createWhatsappLink(contact.phone);
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = contact.label;

    hint.className = 'whatsapp-option__hint';
    hint.textContent = 'Abrir WhatsApp ↗';
    link.append(hint);

    return link;
  });

  whatsappOptions.replaceChildren(...options);
}

function openWhatsappDialog() {
  if (typeof whatsappDialog.showModal === 'function') {
    whatsappDialog.showModal();
    return;
  }

  window.open(createWhatsappLink(WHATSAPP_CONTACTS[0].phone), '_blank', 'noreferrer');
}

function initializeExternalLinks() {
  document.querySelectorAll('[data-external-link]').forEach((link) => {
    const key = link.dataset.externalLink;

    if (key in EXTERNAL_LINKS) {
      link.href = EXTERNAL_LINKS[key];
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

renderWhatsappOptions();
initializeExternalLinks();
initializePointerGlow();

openWhatsappButton.addEventListener('click', openWhatsappDialog);

copyLinkButton.addEventListener('click', async () => {
  try {
    await copyText(SITE_URL);
    showToast('Link copiado. Agora é só compartilhar.');
  } catch {
    showToast('Não foi possível copiar automaticamente.');
  }
});

if (navigator.share) {
  shareLinkButton.hidden = false;
  shareLinkButton.addEventListener('click', async () => {
    try {
      await navigator.share({
        title: 'João Victor Cruz | Cartão digital',
        text: 'Contato profissional de João Victor Cruz.',
        url: SITE_URL,
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        showToast('Não foi possível abrir o compartilhamento.');
      }
    }
  });
}
