# Personalização do ProjetoQR

## 1. Configure o perfil

Edite somente `src/js/config.js` para atualizar identidade, metadados, texto principal, canais de WhatsApp, links externos, projeto em destaque e documentos.

| Área | Exportação |
| --- | --- |
| Nome, cargo, localização, resumo e SEO | `PROFILE` |
| Foto e QR code | `ASSETS` |
| Texto e CTA central | `CONTACT_CONTENT` |
| Cards, projeto e painel de QR | `PORTFOLIO_CONTENT` |
| WhatsApp | `WHATSAPP_CONTACTS` e `WHATSAPP_MESSAGE` |
| LinkedIn e GitHub | `EXTERNAL_LINKS` |
| Projeto por dispositivo | `FEATURED_PROJECT_LINKS` |
| PDFs | `PROFESSIONAL_DOCUMENTS` |

Mantenha `PROFILE.roleLines` com duas linhas. Isso preserva o enquadramento do painel de identidade em telas menores.

## 2. Troque foto e documentos

Substitua os arquivos abaixo pelos seus materiais e mantenha os caminhos alinhados a `ASSETS` e `PROFESSIONAL_DOCUMENTS`.

| Arquivo padrão | Uso | Recomendação |
| --- | --- | --- |
| `src/assets/profile-photo.png` | Avatar | Foto quadrada, ao menos 768 × 768 px |
| `src/assets/cv-data-bi.pdf` | Currículo de dados | PDF final revisado |
| `src/assets/cv-software-engineer.pdf` | Currículo de software | PDF final revisado |
| `src/assets/technical-portfolio.pdf` | Portfólio técnico | PDF navegável e leve |

Para usar apenas um currículo, remova os itens extras de `PROFESSIONAL_DOCUMENTS`. O modal será montado com os documentos restantes.

## 3. Defina a URL e gere o QR

Atualize `SITE_URL` para a URL pública do novo repositório. Em seguida, gere novamente o QR code:

```bash
npm run generate:qr
```

O comando atualiza `src/assets/profile-qr.svg`. Não reutilize o QR de outro perfil.

## 4. Valide localmente

```bash
npm run check
npm test
npm run build
npm run test:ui
npm run preview
```

`npm run preview` serve o conteúdo renderizado de `dist/`. Abra a URL indicada no terminal e valide seus links, foto e documentos.

## 5. Publique no GitHub Pages

1. Envie as alterações para a branch `main`.
2. Em **Settings → Pages**, escolha **GitHub Actions** como fonte.
3. Acompanhe o workflow **Deploy GitHub Pages** em **Actions**.
4. Faça um teste final pelo QR code publicado.

O workflow usa Node.js 22 e não publica variáveis de ambiente nem serviços externos.
