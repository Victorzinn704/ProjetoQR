# ProjetoQR

Interface profissional compacta de **João Victor Cruz** para acesso por QR code,
com projetos, currículos, portfólio técnico e contato direto.

![Status](https://img.shields.io/badge/status-pronto%20para%20GitHub%20Pages-4A8CFF?style=flat-square)
![Stack](https://img.shields.io/badge/stack-HTML%20%2B%20CSS%20%2B%20JS-0C182C?style=flat-square)

## Princípios do projeto

- **Direto ao ponto:** um único cartão, com ações reconhecíveis e hierarquia clara.
- **Específico:** posiciona software, backend, dados e automação com links de evidência.
- **Rápido:** é um site estático, sem framework, rastreador ou dependência em runtime.
- **Acessível:** possui foco visível, HTML semântico, contraste alto e suporte a movimento reduzido.

## Canais disponíveis

| Ação | Destino |
| --- | --- |
| WhatsApp | Escolha entre os dois números, com mensagem pronta. |
| LinkedIn | Perfil profissional. |
| GitHub | Repositórios e contribuições. |
| Projeto principal | Desk Imperial: produto, backend, dados e operação. |
| Currículos & Portfólio | Currículo de Dados, Currículo de Software e Portfólio Técnico. |

## Estrutura

```text
ProjetoQR/
├── src/
│   ├── assets/       # QR code gerado localmente
│   ├── css/          # Sistema visual e responsividade
│   ├── js/           # Configuração e interações
│   └── index.html    # Estrutura semântica da página
├── scripts/          # Build, QR e verificações estáticas
├── tests/            # Testes de configuração e conteúdo
└── .github/workflows # Deploy contínuo para GitHub Pages
```

## Desenvolvimento local

Requer Node.js 22 ou superior.

```bash
npm install
npm run generate:qr
npm run check
npm test
npm run build
npm run test:ui
npm run preview
```

`npm run preview` serve a versão final na pasta `dist/`. O QR deve apontar para
`https://victorzinn704.github.io/ProjetoQR/` quando o repositório público se
chamar `ProjetoQR` na conta `Victorzinn704`.

## Configuração

Os links, os dois números de WhatsApp e a mensagem estão centralizados em
`src/js/config.js`. Se o nome do repositório, a conta do GitHub ou a URL final
mudar, altere `SITE_URL` e execute novamente:

```bash
npm run generate:qr
```

Os documentos e links estão centralizados em `src/js/config.js`. Os três PDFs
publicados ficam em `src/assets/` e são abertos pelo modal **Currículos & Portfólio**.
Para substituir uma versão, mantenha o nome do ativo ou atualize somente o
respectivo `href` em `PROFESSIONAL_DOCUMENTS`.

## Publicação no GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` gera o QR, executa as
verificações, cria `dist/` e publica cada push para `main`.

1. Crie um repositório público chamado `ProjetoQR` em `Victorzinn704`.
2. Envie este projeto para a branch `main`.
3. Em **Settings → Pages**, confirme **Source: GitHub Actions** se o GitHub ainda não tiver selecionado isso automaticamente.
4. Acompanhe a execução em **Actions → Deploy GitHub Pages**.

## Qualidade

Antes de publicar, o projeto executa:

```bash
npm run check
npm test
npm run build
npm run test:ui
```

Os testes validam os links de WhatsApp, a mensagem inicial, os destinos externos e o estado honesto do currículo. As verificações estáticas confirmam a presença do QR, do diálogo de contato, de foco visível e de respeito à preferência de movimento reduzido.
