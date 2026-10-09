# Caça aos Bugs JS

Aplicação estática para praticar JavaScript com 35 desafios interativos. A interface usa apenas HTML, CSS e JavaScript nativo; não precisa de backend, dependências ou etapa de compilação. O progresso fica salvo no armazenamento local do navegador.

## Usar no XAMPP

1. Coloque a pasta `jsap` em `htdocs`.
2. Inicie o Apache pelo painel do XAMPP.
3. Acesse `http://localhost/jsap/`.

As alterações nos arquivos são carregadas diretamente pelo navegador. Se uma versão antiga continuar aparecendo, atualize a página sem usar o cache.

## Estrutura

- `index.html`: página inicial.
- `src/index.css`: estilos e regras responsivas.
- `src/main.js`: interface e lógica da aplicação.
- `src/data/challenges.js`: conteúdo dos desafios.

## Publicar no GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` publica diretamente os arquivos estáticos quando há um push para `main`.

1. Em **Settings > Pages**, escolha **GitHub Actions** como origem.
2. Envie as alterações para a branch `main`.
3. Acompanhe a publicação em **Actions**.
