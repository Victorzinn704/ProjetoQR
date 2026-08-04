export const SITE_URL = 'https://victorzinn704.github.io/ProjetoQR/';

export const IDENTITY = {
  name: 'João Victor Cruz',
  role: 'Engenharia de Software',
  location: 'Rio de Janeiro, Brasil',
};

export const WHATSAPP_MESSAGE =
  'Olá, João, peguei o seu contato pelo QR code, gostaria de conversar.';

export const WHATSAPP_CONTACTS = [
  {
    phone: '5522991014343',
    label: '+55 22 99101-4343',
  },
  {
    phone: '5522992023641',
    label: '+55 22 99202-3641',
  },
];

export const EXTERNAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/jo%C3%A3ovictorcruz2000/',
  github: 'https://github.com/Victorzinn704',
};

export const FEATURED_PROJECT_LINKS = {
  desktop: 'https://app.deskimperial.online/design-lab/overview',
  mobile: 'https://app.deskimperial.online/app/owner',
};

export function createWhatsappLink(phone) {
  const contact = WHATSAPP_CONTACTS.find((item) => item.phone === phone);

  if (!contact) {
    throw new Error('Número de WhatsApp não configurado.');
  }

  return `https://wa.me/${contact.phone}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}
