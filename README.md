# ProjetoQR

Cartão digital profissional, estático e responsivo para GitHub Pages. Reúne contato direto, projetos, documentos e QR code em uma única interface.

[Ver demonstração](https://victorzinn704.github.io/ProjetoQR/) · [Usar como template](https://github.com/Victorzinn704/ProjetoQR/generate) · [Personalizar o perfil](docs/CUSTOMIZATION.md)

![Prévia do ProjetoQR em desktop](docs/images/preview.png)

## Recursos

- Layout em viewport único, adaptado para desktop, tablet e celular.
- QR code gerado localmente a partir da URL pública.
- WhatsApp com seleção de canais e mensagem inicial configurável.
- Links de projeto, LinkedIn, GitHub e documentos profissionais.
- Foto de perfil, compartilhamento nativo, foco visível e suporte a movimento reduzido.
- Build estático, sem dependências em runtime e pronto para GitHub Pages.

## Use como template

1. Clique em **Use this template** no GitHub ou abra o link acima.
2. Crie seu repositório e clone-o localmente.
3. Edite `src/js/config.js` com nome, textos, links, WhatsApp e URL publicada.
4. Substitua foto e documentos em `src/assets/`, mantendo os nomes configurados.
5. Gere o QR code, valide e publique.

```bash
npm install
npm run generate:qr
npm run check
npm test
npm run build
npm run test:ui
```

O guia completo de configuração, fotos, documentos e GitHub Pages está em `docs/CUSTOMIZATION.md`.

## Estrutura

```text
ProjetoQR/
├── src/
│   ├── assets/       # Foto, QR code e documentos publicados
│   ├── css/          # Sistema visual e responsividade
│   ├── js/           # Configuração do perfil e interações
│   └── index.html    # Template HTML renderizado no build
├── docs/             # Prévia e guia de personalização
├── scripts/          # Geração do QR, build e verificações
├── tests/            # Testes de configuração
└── .github/workflows # Deploy contínuo para GitHub Pages
```

## Publicação

O workflow `.github/workflows/deploy-pages.yml` executa geração do QR, verificações, build e testes de interface em cada push na branch `main`.

Em **Settings → Pages**, selecione **Source: GitHub Actions**. A URL padrão é `https://<usuario>.github.io/<repositorio>/`; atualize `SITE_URL` antes de gerar o QR quando a conta ou repositório mudar.

## Qualidade

`npm run check` valida estrutura, assets e acessibilidade básica. `npm test` valida a configuração. `npm run test:ui` abre o build em múltiplos viewports e testa os fluxos essenciais.

## Licença

Distribuído sob a [licença MIT](LICENSE).
