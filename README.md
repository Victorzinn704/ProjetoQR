# ProjetoQR

Cartão digital profissional de **João Victor Cruz**, pensado para QR code,
eventos, networking e apresentações rápidas. A página transforma um scan em um
contato por WhatsApp ou em uma visita aos canais profissionais relevantes.

![Status](https://img.shields.io/badge/status-pronto%20para%20GitHub%20Pages-4A8CFF?style=flat-square)
![Stack](https://img.shields.io/badge/stack-HTML%20%2B%20CSS%20%2B%20JS-0C182C?style=flat-square)

## Princípios do projeto

- **Direto ao ponto:** um único cartão, com ações reconhecíveis e hierarquia clara.
- **Honesto:** usa monograma enquanto a foto não existe e informa que o currículo será publicado depois.
- **Rápido:** é um site estático, sem framework, rastreador ou dependência em runtime.
- **Acessível:** possui foco visível, HTML semântico, contraste alto e suporte a movimento reduzido.

## Canais disponíveis

| Ação | Destino |
| --- | --- |
| WhatsApp | Escolha entre os dois números, com mensagem pronta. |
| LinkedIn | Perfil profissional. |
| GitHub | Repositórios e contribuições. |
| Projeto em destaque | Design Lab da Desk Imperial. |
| Currículo | Indicador explícito de disponibilidade futura. |

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

Para adicionar os ativos que ainda não existem:

1. Troque o monograma em `src/index.html` pela foto final, mantendo um `alt` descritivo.
2. Publique o PDF do currículo em `src/assets/`.
3. Converta o card de currículo em link apenas depois de testar o PDF publicado.

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
