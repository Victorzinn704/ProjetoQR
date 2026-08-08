export const SITE_URL = 'https://victorzinn704.github.io/ProjetoQR/';

export const PROFILE = {
  name: 'João Victor Cruz',
  initials: 'JV',
  roleLines: ['Software', 'Engineer'],
  specialties: 'Backend | Dados | Automação',
  location: 'Rio de Janeiro | Brasil',
  summary:
    'Desenvolvo APIs, integrações, automações e pipelines de dados para extrair, tratar e disponibilizar informações, conectando backend aos processos operacionais.',
  metadata: {
    title: 'João Victor Cruz | Software, Dados & Automação',
    description:
      'Portfólio profissional de João Victor Cruz com projetos em software, backend, APIs, dados, BI e automação.',
    socialDescription:
      'Projetos, currículos e contato profissional nas áreas de software, dados e automação.',
  },
};

export const ASSETS = {
  avatar: {
    src: 'assets/profile-photo.png',
    alt: 'Retrato profissional de João Victor Cruz',
    width: 768,
    height: 768,
  },
  qr: {
    src: 'assets/profile-qr.svg',
    alt: 'QR code para abrir o cartão digital de João Victor Cruz',
  },
};

export const CONTACT_CONTENT = {
  eyebrow: 'Contato profissional',
  headline: 'Software, dados e automação aplicados a problemas reais.',
  summary: 'Conheça meus projetos, currículos e experiência técnica ou entre em contato diretamente.',
  actionOverline: 'Contato direto',
  actionLabel: 'Falar pelo WhatsApp',
  actionNote: 'Mensagem pré-preenchida',
};

export const PORTFOLIO_CONTENT = {
  eyebrow: 'Portfólio profissional',
  title: 'Projetos e referências.',
  featuredProject: {
    eyebrow: 'Projeto em destaque',
    title: 'Desk Imperial',
    description: 'Produto | Backend | Dados | Operação',
  },
  linkedinDescription: 'Experiência | Formação | Atuação',
  githubDescription: 'APIs | Dados | Automação | Projetos',
  documents: {
    title: 'Currículos & Portfólio',
    description: 'Dados | Software | Portfólio Técnico',
  },
  qr: {
    eyebrow: 'Acesso rápido',
    title: 'Salve este perfil.',
    actionLabel: 'Copiar acesso',
  },
};

export const WHATSAPP_MESSAGE =
  'Olá, João, peguei o seu contato pelo QR code, gostaria de conversar.';

export const WHATSAPP_CONTACTS = [
  {
    phone: '5522991014343',
    label: '+55 22 99101-4343',
    channel: 'Principal',
  },
  {
    phone: '5522992023641',
    label: '+55 22 99202-3641',
    channel: 'Alternativo',
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

export const PROFESSIONAL_DOCUMENTS = [
  {
    title: 'Currículo de Dados',
    description: 'Analista de Dados | BI | Analytics Engineering | Automação',
    href: 'assets/cv-data-bi.pdf',
  },
  {
    title: 'Currículo de Software',
    description: 'Backend | APIs | Dados | Automação',
    href: 'assets/cv-software-engineer.pdf',
  },
  {
    title: 'Portfólio Técnico',
    description: 'Software | Dados | Automação | Projetos',
    href: 'assets/technical-portfolio.pdf',
  },
];

export function createWhatsappLink(phone) {
  const contact = WHATSAPP_CONTACTS.find((item) => item.phone === phone);

  if (!contact) {
    throw new Error('Número de WhatsApp não configurado.');
  }

  return `https://wa.me/${contact.phone}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}
