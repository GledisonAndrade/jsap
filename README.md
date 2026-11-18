# Trilha Web

Aplicação estática para aprender JavaScript e fundamentos de desenvolvimento web com 50 lições interativas, liberadas em sequência. As lições 38–42 guiam a construção de uma calculadora e de um catálogo de site; a lição 50 apresenta a plataforma integrada funcionando. O laboratório independente fica dedicado ao automatizador de tarefas. O dashboard acompanha o progresso e registra código aprovado, saída, data e tentativas no armazenamento local do navegador. A trilha de carreira apresenta marcos Junior, Pleno, Senior e Engenheiro de Desenvolvimento Web e Plataforma.

A interface usa apenas HTML, CSS e JavaScript nativo; não precisa de backend, dependências ou etapa de compilação. Os scripts são carregados sem módulos para funcionar tanto ao abrir `index.html` diretamente quanto por um servidor local.

O progresso é local ao navegador e não é sincronizado entre dispositivos. É possível resetar uma lição individualmente ou apagar todo o progresso.

O editor salva rascunhos automaticamente e permite inserir comentários JavaScript (`//`). Cada lição também possui um campo de anotações pessoais salvo automaticamente e consultável no Dashboard. O logotipo da plataforma é servido em `assets/trilha-web-logo.png`.

## Usar no XAMPP

1. Coloque a pasta `jsap` em `htdocs`.
2. Inicie o Apache pelo painel do XAMPP.
3. Acesse `http://localhost/jsap/`.

Também é possível abrir o arquivo `index.html` diretamente no navegador. As alterações nos arquivos são carregadas diretamente pelo navegador. Se uma versão antiga continuar aparecendo, atualize a página sem usar o cache.

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
