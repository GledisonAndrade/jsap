const ALL_CHALLENGES = window.ALL_CHALLENGES;
const root = document.querySelector("#root");
const progressKey = "js_bugs_progresso";
const lastResolvedKey = "last_resolved_date";
const state = {
  currentIndex: 0,
  editorCode: ALL_CHALLENGES[0]?.code ?? "",
  terminalLogs: [],
  terminalError: "",
  testResult: { tested: false, success: false, message: "" },
  resolvedIds: [],
  attemptsMap: {},
  recordsMap: {},
  draftsMap: {},
  studyNotesMap: {},
  streak: 1,
  aiTip: "",
  copied: false,
  showCelebration: false,
  view: "licoes",
  martExplain: null,
  martAnswer: "",
  lockedMessage: "",
  projectSearch: "",
  calculatorResult: "Preencha os valores para começar.",
  automationIndex: 0,
  automationLogs: [],
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(progressKey);
    if (!saved) return;

    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed.resolvedIds)) {
      state.resolvedIds = parsed.resolvedIds.filter((id) =>
        ALL_CHALLENGES.some((challenge) => challenge.id === id)
      );
    }
    if (parsed.attemptsMap && typeof parsed.attemptsMap === "object") {
      state.attemptsMap = parsed.attemptsMap;
    }
    if (parsed.recordsMap && typeof parsed.recordsMap === "object") {
      state.recordsMap = parsed.recordsMap;
    }
    if (parsed.draftsMap && typeof parsed.draftsMap === "object") {
      state.draftsMap = parsed.draftsMap;
    }
    if (parsed.studyNotesMap && typeof parsed.studyNotesMap === "object") {
      state.studyNotesMap = parsed.studyNotesMap;
    }
    if (typeof parsed.streak === "number") state.streak = parsed.streak;
  } catch (error) {
    console.error("Não foi possível carregar o progresso salvo:", error);
  }

  state.currentIndex = getNextLessonIndex();
  const challenge = ALL_CHALLENGES[state.currentIndex];
  state.editorCode = state.recordsMap[challenge.id]?.code
    ?? state.draftsMap[challenge.id]
    ?? challenge.code;
}

function saveProgress() {
  try {
    localStorage.setItem(progressKey, JSON.stringify({
      resolvedIds: state.resolvedIds,
      attemptsMap: state.attemptsMap,
      recordsMap: state.recordsMap,
      draftsMap: state.draftsMap,
      studyNotesMap: state.studyNotesMap,
      streak: state.streak,
    }));
  } catch (error) {
    console.error("Não foi possível salvar o progresso:", error);
  }
}

function getActiveChallenge() {
  return ALL_CHALLENGES[state.currentIndex] ?? ALL_CHALLENGES[0];
}

function getNextLessonIndex() {
  const nextIndex = ALL_CHALLENGES.findIndex((challenge) => !state.resolvedIds.includes(challenge.id));
  return nextIndex < 0 ? ALL_CHALLENGES.length - 1 : nextIndex;
}

function isLessonAccessible(index) {
  return index >= 0 && index <= getNextLessonIndex();
}

function renderChallengeList() {
  return ALL_CHALLENGES.map((challenge, index) => {
    const isActive = index === state.currentIndex;
    const isResolved = state.resolvedIds.includes(challenge.id);
    const isLocked = !isLessonAccessible(index);
    const attempts = state.attemptsMap[challenge.id] || 0;

    return `
      <button class="challenge-item${isActive ? " is-active" : ""}${isLocked ? " is-locked" : ""}" type="button"
        data-action="select-challenge" data-index="${index}"${isActive ? ' aria-current="true"' : ""}${isLocked ? ` aria-label="Lição ${challenge.id}: ${escapeHtml(challenge.title)}. Bloqueada; conclua a lição ${ALL_CHALLENGES[getNextLessonIndex()].id} primeiro"` : ""}>
        <span class="challenge-number${isResolved ? " is-resolved" : ""}">${challenge.id}</span>
        <span class="challenge-item-copy">
          <span class="challenge-item-title">${escapeHtml(challenge.title)}</span>
          <span class="challenge-item-meta">${escapeHtml(challenge.topic)} · ${escapeHtml(challenge.difficulty)}</span>
        </span>
        <span class="challenge-item-status">
          ${attempts > 0 ? `<span class="attempt-count">${attempts}x</span>` : ""}
          ${isLocked ? '<span class="lesson-lock" aria-label="Bloqueada">🔒</span>' : isResolved ? '<span class="check-mark" aria-label="Resolvido">✓</span>' : ""}
        </span>
      </button>`;
  }).join("");
}

function renderCategoryProgress() {
  const totals = {};
  const solved = {};

  ALL_CHALLENGES.forEach((challenge) => {
    totals[challenge.topic] = (totals[challenge.topic] || 0) + 1;
    if (state.resolvedIds.includes(challenge.id)) {
      solved[challenge.topic] = (solved[challenge.topic] || 0) + 1;
    }
  });

  return Object.entries(totals).slice(0, 5).map(([topic, total]) => {
    const completed = solved[topic] || 0;
    const percentage = Math.round((completed / total) * 100);
    return `
      <div class="category-progress">
        <div class="category-progress-label">
          <span>${escapeHtml(topic)}</span><span>${completed}/${total}</span>
        </div>
        <div class="progress-track" role="progressbar" aria-label="${escapeHtml(topic)}"
          aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${completed}">
          <span style="width:${percentage}%"></span>
        </div>
      </div>`;
  }).join("");
}

function renderTerminal() {
  const logs = state.terminalLogs.length
    ? state.terminalLogs.map((log) => `
      <div class="terminal-line"><span aria-hidden="true">&gt;</span><span>${escapeHtml(log)}</span></div>
    `).join("")
    : '<p class="terminal-empty">Nenhuma saída ainda. Execute seu código para ver o resultado.</p>';

  const error = state.terminalError
    ? `<div class="terminal-error"><strong>Erro de execução</strong><span>${escapeHtml(state.terminalError)}</span></div>`
    : "";

  return `${logs}${error}`;
}

function renderTestResult() {
  if (!state.testResult.tested) return "";
  return `
    <section class="result-card ${state.testResult.success ? "is-success" : "is-failure"}" aria-live="polite">
      <span class="result-icon" aria-hidden="true">${state.testResult.success ? "✓" : "!"}</span>
      <div>
        <h3>${state.testResult.success ? "Desafio concluído!" : "O teste não passou"}</h3>
        <p>${escapeHtml(state.testResult.message)}</p>
      </div>
    </section>`;
}

function render() {
  if (!root || !ALL_CHALLENGES.length) return;

  const challenge = getActiveChallenge();
  const solvedCount = state.resolvedIds.length;
  const totalChallenges = ALL_CHALLENGES.length;
  const percentage = Math.round((solvedCount / totalChallenges) * 100);
  const attempts = Object.values(state.attemptsMap).reduce((total, count) => total + count, 0);
  const circleLength = 2 * Math.PI * 18;

  root.innerHTML = `
    ${state.showCelebration ? `
      <div class="celebration" role="status">
        <div class="celebration-card">
          <span class="celebration-trophy" aria-hidden="true">🏆</span>
          <h2>Desafio corrigido!</h2>
          <p>Você venceu mais um bug. Continue praticando!</p>
        </div>
      </div>` : ""}
    <header class="topbar">
      <a class="brand" href="./" aria-label="Trilha Web - início">
        <img class="brand-mark" src="./assets/trilha-web-logo.png" alt="" width="48" height="48" />
        <span class="brand-copy">
          <span class="brand-title">Trilha Web <span class="challenge-badge">${totalChallenges} lições</span></span>
          <span class="brand-subtitle">Aprenda JavaScript e desenvolvimento web com prática</span>
        </span>
      </a>
      <div class="topbar-stats">
        <span class="streak"><span aria-hidden="true">🔥</span> ${state.streak} dia(s) de prática</span>
        <div class="overall-progress">
          <div class="overall-copy">
            <span>Evolução geral</span>
            <strong>${solvedCount} / ${totalChallenges} (${percentage}%)</strong>
          </div>
          <svg class="progress-ring" viewBox="0 0 48 48" role="img" aria-label="${percentage}% concluído">
            <circle class="ring-background" cx="24" cy="24" r="18"></circle>
            <circle class="ring-value" cx="24" cy="24" r="18"
              stroke-dasharray="${circleLength}" stroke-dashoffset="${circleLength * (1 - solvedCount / totalChallenges)}"></circle>
            <text x="24" y="28" text-anchor="middle">🏆</text>
          </svg>
        </div>
      </div>
    </header>

    <nav class="main-nav" aria-label="Seções do sistema">
      ${NAV_ITEMS.map(([view, label]) => `<button type="button" class="nav-tab${state.view === view ? " is-active" : ""}"
        data-action="go-view" data-view="${view}"${state.view === view ? ' aria-current="page"' : ""}>${label}</button>`).join("")}
    </nav>
    ${state.view !== "licoes" ? renderPage() : `<main class="app-layout">
      <aside class="sidebar" aria-label="Navegação dos desafios">
        <div class="sidebar-heading">
          <h2><span aria-hidden="true">▤</span> Diretório de lições</h2>
          <button class="icon-button" type="button" data-action="reset-progress"
            title="Resetar progresso" aria-label="Resetar progresso">↻</button>
        </div>
        <div class="quick-stats">
          <div><span>Concluídos</span><strong>${solvedCount}/${totalChallenges}</strong></div>
          <div><span>Tentativas</span><strong>${attempts}</strong></div>
        </div>
        <nav class="challenge-list" aria-label="Escolher desafio">
          ${renderChallengeList()}
        </nav>
        <section class="category-section">
          <h3>Progresso por matéria</h3>
          ${renderCategoryProgress()}
        </section>
      </aside>

      <section class="workspace" aria-label="Área do desafio">
        ${state.lockedMessage ? `<div class="locked-notice" role="alert">${escapeHtml(state.lockedMessage)}</div>` : ""}
        <article class="challenge-card">
          <div class="challenge-card-top">
            <div class="challenge-tags">
              <span class="topic-tag">${escapeHtml(challenge.topic)}</span>
              <span class="difficulty-tag ${challenge.difficulty === "Fácil" ? "easy" : challenge.difficulty === "Médio" ? "medium" : "hard"}">${escapeHtml(challenge.difficulty)}</span>
              ${state.resolvedIds.includes(challenge.id) ? '<span class="solved-tag">✓ Resolvido</span>' : ""}
            </div>
            <div class="challenge-navigation">
              <button class="secondary-button" type="button" data-action="previous" ${state.currentIndex === 0 ? "disabled" : ""}>← <span>Anterior</span></button>
              <button class="secondary-button" type="button" data-action="next" ${state.currentIndex >= getNextLessonIndex() || state.currentIndex === totalChallenges - 1 ? "disabled" : ""}><span>Próximo</span> →</button>
              <button class="secondary-button lesson-reset-button" type="button" data-action="reset-lesson">↻ <span>Resetar esta lição</span></button>
            </div>
          </div>
          <h1>${challenge.id}. ${escapeHtml(challenge.title)}</h1>
          <p class="challenge-description">${escapeHtml(challenge.desc)}</p>
        </article>

        <div class="work-grid">
          <section class="editor-panel" aria-label="Editor de código">
            <div class="panel-heading">
              <div><span class="panel-icon" aria-hidden="true">&lt;/&gt;</span><h2>Seu código</h2></div>
              <div class="editor-tools">
                <button class="text-button" type="button" data-action="copy-original">${state.copied ? "Copiado ✓" : "Copiar original"}</button>
                <button class="text-button" type="button" data-action="insert-comment">Inserir comentário //</button>
                <button class="text-button restore-button" type="button" data-action="restore">Restaurar</button>
              </div>
            </div>
            <label class="visually-hidden" for="code-editor">Código JavaScript do desafio</label>
            <textarea id="code-editor" class="code-editor" spellcheck="false" autocapitalize="off"
              autocomplete="off" autocorrect="off" aria-describedby="editor-help">${escapeHtml(state.editorCode)}</textarea>
            <div id="editor-help" class="editor-help">Edite e comente seu código com // ou /* ... */. Suas alterações são salvas nesta lição.</div>
            <section class="study-note-panel">
              <div class="study-note-heading"><label for="study-note">Minhas notas e comentários</label><span>Salvo automaticamente</span></div>
              <textarea id="study-note" class="study-note-editor" data-lesson-id="${challenge.id}"
                placeholder="Anote o que aprendeu, explique uma linha ou registre uma dúvida..."
                aria-describedby="study-note-help">${escapeHtml(state.studyNotesMap[challenge.id] || "")}</textarea>
              <small id="study-note-help">Estas anotações ficam vinculadas à lição. Você também pode inserir um comentário JavaScript no editor.</small>
            </section>
            <div class="editor-actions">
              <button class="primary-button" type="button" data-action="run">▶ <span>Executar e testar</span></button>
              <button class="hint-button" type="button" data-action="hint"><span aria-hidden="true">✦</span> Ver dica de correção</button>
            </div>
          </section>

          <aside class="output-column" aria-label="Resultado da execução">
            <section class="terminal-panel">
              <div class="panel-heading terminal-heading">
                <div><span class="panel-icon terminal-icon" aria-hidden="true">›_</span><h2>Saída do console</h2></div>
                <span class="live-badge">Captura ativa</span>
              </div>
              <div class="terminal-output" aria-live="polite">${renderTerminal()}</div>
            </section>
            ${renderTestResult()}
            ${!state.testResult.success ? `
              <section class="quick-hint">
                <span class="hint-symbol" aria-hidden="true">?</span>
                <div><h3>Dica rápida</h3><p>${escapeHtml(challenge.hint)}</p></div>
              </section>` : ""}
          </aside>
        </div>

        ${state.aiTip ? `
          <section class="tip-card" aria-live="polite">
            <div class="tip-heading"><span aria-hidden="true">✦</span><div><h2>Dica do desafio</h2><span>Disponível offline</span></div></div>
            <p>${escapeHtml(state.aiTip)}</p>
          </section>` : ""}
        ${renderLessonProject(challenge)}
        ${renderSupportPanel(challenge)}
        ${renderMartPanel(challenge)}
      </section>
    </main>`}
    <footer class="site-footer">
      <span>Trilha Web © 2026 · Aprendizado prático de JavaScript e desenvolvimento web.</span>
      <strong>GA automação engenheiro desenvolvedor : Gledison Andrade</strong>
    </footer>`;
}

const NAV_ITEMS = [
  ["licoes", "Lições"],
  ["dashboard", "Dashboard"],
  ["projetos", "Laboratório de automação"],
  ["carreira", "Trilha de carreira"],
  ["sistema", "Instruções e objetivo"],
  ["memoria", "Memória do Mart"],
  ["parametros", "Parâmetros de desenvolvimento"],
  ["ajuda", "Ajuda"],
  ["sobre", "Sobre o sistema"],
];

const CAREER_LEVELS = [
  { name: "Junior", threshold: 0, next: 12, skills: "Fundamentos de JavaScript, tipos, condições e funções." },
  { name: "Pleno", threshold: 12, next: 27, skills: "Estruturas de dados, depuração, formulários e projetos interativos." },
  { name: "Senior", threshold: 27, next: 40, skills: "Arquitetura de funcionalidades, testes, automações e boas decisões técnicas." },
  { name: "Engenheiro de Desenvolvimento Web e Plataforma", threshold: 40, next: 50, skills: "Integração assíncrona, métricas, configuração e composição de plataformas web." },
];

const PROJECT_PRODUCTS = [
  { name: "Teclado mecânico", category: "Acessórios", price: 249.9, description: "Teclas confortáveis para estudar e trabalhar." },
  { name: "Mouse sem fio", category: "Acessórios", price: 89.9, description: "Precisão e liberdade para o seu espaço." },
  { name: "Monitor Full HD", category: "Monitores", price: 799, description: "Mais espaço para visualizar seus projetos." },
];

const AUTOMATION_TASKS = ["Validar dados da rotina", "Gerar relatório diário", "Salvar cópia de segurança", "Enviar notificação de conclusão"];

function getCareerLevel(completed = state.resolvedIds.length) {
  return CAREER_LEVELS.reduce((current, level, index) =>
    completed >= level.threshold ? index : current, 0);
}

function renderDashboard() {
  const completed = state.resolvedIds.length;
  const nextLesson = ALL_CHALLENGES[getNextLessonIndex()];
  const records = Object.values(state.recordsMap).sort((a, b) =>
    new Date(b.completedAt) - new Date(a.completedAt));
  const levelIndex = getCareerLevel(completed);
  const level = CAREER_LEVELS[levelIndex];
  const target = level.next;
  const levelProgress = completed >= 50
    ? 100
    : Math.min(100, Math.round(((completed - level.threshold) / (target - level.threshold)) * 100));
  const history = records.length ? records.slice(0, 10).map((record) => `
    <article class="history-item">
      <div class="memory-head">
        <strong>Lição ${record.id}. ${escapeHtml(record.title)}</strong>
        <span>${formatDate(record.completedAt)} · ${record.attempts} tentativa(s)</span>
      </div>
      <p><strong>Saída registrada:</strong> ${escapeHtml((record.output || []).join(" / "))}</p>
      ${record.note ? `<p class="history-note"><strong>Anotação salva:</strong> ${escapeHtml(record.note)}</p>` : ""}
      <details><summary>Relembrar código realizado</summary><pre class="mart-code">${escapeHtml(record.code)}</pre></details>
      <button class="text-button" type="button" data-action="select-challenge" data-index="${ALL_CHALLENGES.findIndex((item) => item.id === record.id)}">Abrir lição</button>
    </article>`).join("") : '<p class="empty-state">Conclua uma lição para criar seu primeiro registro de execução.</p>';

  return `<main class="page-view dashboard-page">
    <h1>Dashboard de aprendizado</h1>
    <p>Acompanhe sua trilha, tarefas executadas e o que já pode revisar. Os registros ficam salvos neste navegador.</p>
    <section class="dashboard-metrics">
      <article class="metric-card"><span>Lições concluídas</span><strong>${completed} / ${ALL_CHALLENGES.length}</strong><div class="progress-track"><span style="width:${Math.round(completed / ALL_CHALLENGES.length * 100)}%"></span></div></article>
      <article class="metric-card"><span>Tentativas realizadas</span><strong>${Object.values(state.attemptsMap).reduce((sum, count) => sum + count, 0)}</strong><small>Inclui testes aprovados e tentativas para aprender com erros.</small></article>
      <article class="metric-card"><span>Nível atual</span><strong>${escapeHtml(level.name)}</strong><small>${completed >= target ? "Trilha concluída!" : `${completed} de ${target} lições para o próximo marco`}</small></article>
    </section>
    <section class="dashboard-level">
      <div><span class="eyebrow">Próximo marco</span><h2>${completed >= 50 ? "Trilha completa" : escapeHtml(CAREER_LEVELS[Math.min(levelIndex + 1, CAREER_LEVELS.length - 1)].name)}</h2>
      <p>${escapeHtml(level.skills)}</p></div>
      <div class="level-progress"><strong>${levelProgress}%</strong><div class="progress-track"><span style="width:${levelProgress}%"></span></div><small>${completed} / ${target} lições</small></div>
    </section>
    ${completed < ALL_CHALLENGES.length ? `<section class="continue-card">
      <div><span class="eyebrow">Continue de onde parou</span><h2>Lição ${nextLesson.id}: ${escapeHtml(nextLesson.title)}</h2>
      <p>Conclua esta lição para liberar a próxima etapa da trilha.</p></div>
      <button class="primary-button" type="button" data-action="continue-learning">Continuar lição</button>
    </section>` : '<section class="continue-card"><div><span class="eyebrow">Parabéns</span><h2>Você concluiu todas as lições!</h2><p>Seu projeto final está disponível na lição 50.</p></div></section>'}
    <section class="history-section"><div class="section-title"><h2>Tarefas executadas</h2><span>${records.length} registro(s)</span></div>${history}</section>
    ${renderStudyNotes()}
  </main>`;
}

function renderStudyNotes() {
  const notes = Object.entries(state.studyNotesMap)
    .filter(([, note]) => typeof note === "string" && note.trim())
    .sort(([firstId], [secondId]) => Number(firstId) - Number(secondId));
  if (!notes.length) {
    return `<section class="study-notes-dashboard"><h2>Notas de estudo</h2><p class="empty-state">Suas anotações por lição aparecerão aqui. Abra uma lição e registre comentários sobre o código.</p></section>`;
  }
  const entries = notes.map(([id, note]) => {
    const challenge = ALL_CHALLENGES.find((item) => item.id === Number(id));
    if (!challenge) return "";
    return `<article class="study-note-entry"><div><strong>Lição ${challenge.id}: ${escapeHtml(challenge.title)}</strong>
      <button class="text-button" type="button" data-action="select-challenge" data-index="${challenge.id - 1}">Abrir lição</button></div>
      <p>${escapeHtml(note)}</p></article>`;
  }).join("");
  return `<section class="study-notes-dashboard"><div class="section-title"><h2>Notas de estudo</h2><span>${notes.length} lição(ões)</span></div>${entries}</section>`;
}

function renderCareer() {
  const completed = state.resolvedIds.length;
  const activeLevel = getCareerLevel(completed);
  const levels = CAREER_LEVELS.map((level, index) => {
    const reached = completed >= level.threshold;
    const current = index === activeLevel;
    const range = index === CAREER_LEVELS.length - 1 ? `${level.threshold}+ lições` : `${level.threshold}–${level.next - 1} lições`;
    return `<article class="career-card${current ? " is-current" : ""}${reached ? " is-reached" : ""}">
      <div class="career-card-top"><span class="career-index">${String(index + 1).padStart(2, "0")}</span><span class="career-range">${range}</span></div>
      <h2>${escapeHtml(level.name)}</h2><p>${escapeHtml(level.skills)}</p>
      <strong class="career-status">${reached ? (current ? "Nível atual" : "Marco alcançado") : "Próximo marco"}</strong>
    </article>`;
  }).join("");
  return `<main class="page-view career-page">
    <h1>Trilha de evolução profissional</h1>
    <p>A evolução é baseada nas lições concluídas e nos projetos praticados. Use os marcos como referência de estudo, não como substituto de experiência profissional.</p>
    <section class="career-track">${levels}</section>
    <section class="career-guidance"><h2>Como avançar</h2>
      <ol><li>Resolva cada lição e leia o material de apoio antes de avançar.</li>
      <li>Revise no dashboard o código que você executou e os resultados registrados.</li>
      <li>Nos projetos de calculadora, site e automação, adapte a solução e teste casos inválidos.</li>
      <li>Ao concluir uma lição novamente, seu registro mais recente será atualizado.</li></ol>
    </section>
  </main>`;
}

function renderCalculatorWidget() {
  return `<section class="project-panel"><div class="project-heading"><span>01</span><div><h2>Calculadora Universal</h2><p>Soma, subtração, multiplicação, divisão, módulo e potência.</p></div></div>
    <form class="calculator-form" data-form="calculator">
      <label>Primeiro valor<input name="a" type="number" step="any" required value="12"></label>
      <label>Operação<select name="operator"><option value="+">Somar (+)</option><option value="-">Subtrair (−)</option><option value="*">Multiplicar (×)</option><option value="/">Dividir (÷)</option><option value="%">Módulo (%)</option><option value="**">Potência (^)</option></select></label>
      <label>Segundo valor<input name="b" type="number" step="any" required value="3"></label>
      <button class="primary-button" type="submit">Calcular</button>
    </form>
    <output class="project-result" aria-live="polite">${escapeHtml(state.calculatorResult)}</output>
  </section>`;
}

function renderCatalogWidget() {
  const search = state.projectSearch.trim().toLocaleLowerCase("pt-BR");
  const products = PROJECT_PRODUCTS.filter((product) =>
    `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase("pt-BR").includes(search));
  const productCards = products.length ? products.map((product) => `
    <article class="product-card"><span>${escapeHtml(product.category)}</span><h3>${escapeHtml(product.name)}</h3>
      <p>${escapeHtml(product.description)}</p><strong>${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)}</strong>
    </article>`).join("") : '<p class="empty-state">Nenhum produto encontrado.</p>';
  return `<section class="project-panel site-demo"><div class="project-heading"><span>02</span><div><h2>Catálogo do site</h2><p>Prévia de página com busca e cartões de produto.</p></div></div>
    <form class="project-search" data-form="project-search"><label class="visually-hidden" for="project-search-input">Buscar produtos</label>
      <input id="project-search-input" name="q" type="search" value="${escapeHtml(state.projectSearch)}" placeholder="Buscar produto ou categoria">
      <button class="secondary-button" type="submit">Buscar</button></form>
    <div class="product-list">${productCards}</div>
  </section>`;
}

function renderAutomationWidget() {
  const taskRows = AUTOMATION_TASKS.map((task, index) => `
    <li class="${index < state.automationIndex ? "task-done" : ""}">
      <span>${index < state.automationIndex ? "✓" : `${index + 1}.`}</span>${escapeHtml(task)}
    </li>`).join("");
  const automationComplete = state.automationIndex >= AUTOMATION_TASKS.length;
  return `<section class="project-panel automation-panel"><div class="project-heading"><span>03</span><div><h2>Automatizador de tarefas</h2><p>Simule um fluxo de rotina em etapas.</p></div></div>
    <ol class="automation-list">${taskRows}</ol>
    <div class="automation-actions"><button class="primary-button" type="button" data-action="automation-run"${automationComplete ? " disabled" : ""}>${automationComplete ? "Rotina concluída" : "Executar próxima tarefa"}</button>
      <button class="secondary-button" type="button" data-action="automation-reset">Reiniciar</button></div>
    ${state.automationLogs.length ? `<p class="automation-log" aria-live="polite">${escapeHtml(state.automationLogs[state.automationLogs.length - 1])}</p>` : ""}
  </section>`;
}

function renderLessonProject(challenge) {
  if ((challenge.id < 38 || challenge.id > 42) && challenge.id !== 50) return "";
  if (challenge.id === 50) {
    return `<section class="lesson-project final-project">
      <div class="project-heading"><span>FINAL</span><div><h2>Projeto final: plataforma Web funcionando</h2><p>Integra a calculadora, o catálogo do site e o automatizador desenvolvidos ao longo da trilha.</p></div></div>
      <div class="project-grid">${renderCalculatorWidget()}${renderCatalogWidget()}${renderAutomationWidget()}</div>
    </section>`;
  }

  const stages = [
    { id: 38, title: "Lógica da calculadora", detail: "Separar os valores e o operador, depois retornar o resultado da operação." },
    { id: 39, title: "Validação da calculadora", detail: "Tratar divisão por zero e entradas inválidas antes de calcular." },
    { id: 40, title: "Estrutura da página", detail: "Organizar produtos como dados e montar cartões reutilizáveis." },
    { id: 41, title: "Busca do catálogo", detail: "Filtrar os produtos pelo texto digitado, sem diferenciar maiúsculas." },
    { id: 42, title: "Navegação e integração", detail: "Preparar a navegação do site e conectar os componentes criados." },
  ];
  const currentStage = stages.find((stage) => stage.id === challenge.id);
  const stageList = stages.map((stage, index) => {
    const completed = state.resolvedIds.includes(stage.id);
    return `<li class="${completed ? "task-done" : stage.id === challenge.id ? "task-current" : ""}">
      <span>${completed ? "✓" : `${index + 1}.`}</span><div><strong>Lição ${stage.id}: ${escapeHtml(stage.title)}</strong><small>${escapeHtml(stage.detail)}</small></div>
    </li>`;
  }).join("");
  const widget = challenge.id <= 39 ? renderCalculatorWidget() : renderCatalogWidget();
  return `<section class="lesson-project">
    <div class="project-heading"><span>PROJETO</span><div><h2>Construindo a calculadora e o site — etapa ${challenge.id - 37} de 5</h2>
      <p>${escapeHtml(currentStage.detail)} A calculadora e o catálogo são praticados aqui nas lições, não no laboratório.</p></div></div>
    <ol class="automation-list project-roadmap">${stageList}</ol>
    <div class="project-grid">${widget}</div>
  </section>`;
}

function renderProjects() {
  return `<main class="page-view projects-page">
    <h1>Laboratório de automação</h1>
    <p>O desenvolvimento da calculadora e do site faz parte das lições 38 a 42. A plataforma integrada fica disponível na lição final 50.</p>
    <div class="project-grid">${renderAutomationWidget()}</div>
    <button class="secondary-button" type="button" data-action="select-challenge" data-index="42">Abrir lição 43: automatizador</button>
  </main>`;
}

function renderMartPanel(challenge) {
  const solution = Mart.getSolution(challenge.id);
  const remembered = Mart.loadMemory()[challenge.id];
  return `
    <section class="mart-card" aria-live="polite">
      <div class="tip-heading"><span aria-hidden="true">🤖</span><div><h2>${Mart.CONFIG.nome}</h2><span>Agente interno · offline</span></div></div>
      ${state.martExplain && state.martExplain.id === challenge.id ? `
        <p><strong>Conceito:</strong> ${escapeHtml(solution.concept)}</p>
        <p>${escapeHtml(solution.why)}</p>
        <pre class="mart-code">${escapeHtml(solution.code)}</pre>
        <p class="mart-saved">✓ Conceito gravado na memória interna.</p>` : `
        <p>${remembered ? "Você já estudou esta lição. Peça ao Senhor Mart para rever a solução." : "Precisa de ajuda? O Senhor Mart resolve a tarefa por completo e explica como foi feito."}</p>`}
      <button class="primary-button" type="button" data-action="mart-solve" ${solution ? "" : "disabled"}>🤖 <span>Senhor Mart: resolver e explicar</span></button>
      <form class="mart-ask" data-form="mart-ask">
        <label class="visually-hidden" for="mart-question">Pergunte ao Senhor Mart</label>
        <input id="mart-question" name="q" type="text" placeholder="Pergunte um conceito (ex.: reduce, escopo, this)" autocomplete="off" />
        <button class="secondary-button" type="submit">Perguntar</button>
      </form>
      ${state.martAnswer ? `<pre class="mart-code">${escapeHtml(state.martAnswer)}</pre>` : ""}
    </section>`;
}

function renderSupportPanel(challenge) {
  const solution = Mart.getSolution(challenge.id);
  if (!solution) return "";
  return `<details class="support-card">
    <summary>Conteúdo de apoio: entenda o código desta lição</summary>
    <div class="support-content"><h3>${escapeHtml(solution.concept)}</h3>
      <p>${escapeHtml(solution.why)}</p>
      <h4>Exemplo de solução</h4><pre class="mart-code">${escapeHtml(solution.code)}</pre>
    </div>
  </details>`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function renderPage() {
  const C = Mart.CONFIG;
  const pages = {
    dashboard: renderDashboard(),
    projetos: renderProjects(),
    carreira: renderCareer(),
    sistema: `
      <h1>Instruções e objetivo</h1>
      <h2>Objetivo</h2>
      <p>Treinar JavaScript e fundamentos de desenvolvimento web com ${ALL_CHALLENGES.length} lições sequenciais. A calculadora e o site são construídos nas lições 38 a 42, com a plataforma integrada funcionando na lição final.</p>
      <h2>Como usar</h2>
      <ol>
        <li>Escolha uma lição no diretório e leia o enunciado.</li>
        <li>Edite o código e clique em <em>Executar e testar</em>.</li>
        <li>Se travar, use a dica ou o botão do <strong>${C.nome}</strong> para ver a solução completa explicada.</li>
        <li>O sistema grava seu código aprovado, a saída, a data e as tentativas para relembrar como a tarefa foi realizada.</li>
        <li>As lições são liberadas em sequência. Se tentar abrir uma etapa adiantada, o sistema informa qual lição está pendente.</li>
        <li>Comente o código diretamente com <code>//</code> ou <code>/* ... */</code> e escreva suas próprias notas na área da lição. O editor e as anotações ficam salvos automaticamente.</li>
        <li>Use o dashboard para acompanhar o andamento e a trilha de carreira para ver os marcos Junior, Pleno, Senior e Engenheiro de Desenvolvimento Web e Plataforma.</li>
      </ol>
      <h2>Sobre o ${C.nome}</h2>
      <p>É o agente interno do sistema. Ele funciona offline: possui a solução e a explicação de cada lição, executa o teste por você, memoriza o que foi aprendido e responde perguntas por palavra-chave.</p>`,
    memoria: renderMemoryPage(),
    parametros: `
      <h1>Parâmetros de desenvolvimento</h1>
      <table class="param-table">
        <tr><th>Agente</th><td>${C.nome} v${C.versao}</td></tr>
        <tr><th>Lições carregadas</th><td>${ALL_CHALLENGES.length}</td></tr>
        <tr><th>Soluções do Mart</th><td>${Object.keys(window.MART_SOLUTIONS || {}).length}</td></tr>
        <tr><th>Armazenamento</th><td>${C.armazenamento}</td></tr>
        <tr><th>Chaves usadas</th><td>${C.chaves.join(", ")}</td></tr>
        <tr><th>Execução do código</th><td>${C.execucao}</td></tr>
        <tr><th>Validação</th><td>${C.comparacao}</td></tr>
        <tr><th>Revisão sugerida</th><td>após ${C.revisaoDias} dias sem estudar o conceito</td></tr>
        <tr><th>Conceitos na memória</th><td>${Object.keys(Mart.loadMemory()).length}</td></tr>
        <tr><th>Arquivos</th><td>index.html, src/main.js, src/mart.js, src/data/challenges.js, src/data/solutions.js, src/index.css</td></tr>
      </table>
      <h2>Como adicionar uma lição</h2>
      <p>Inclua o objeto em <code>challenges.js</code> (id, title, desc, code, output, hint, difficulty, topic) e a solução com o mesmo id em <code>solutions.js</code> (concept, code, why).</p>`,
    ajuda: `
      <h1>Ajuda</h1>
      <h2>Perguntas frequentes</h2>
      <p><strong>O Mart resolve de verdade?</strong> Sim: ele coloca a solução no editor, executa o teste e explica o raciocínio.</p>
      <p><strong>Onde ficam meus dados?</strong> No navegador (localStorage). Limpar dados do site apaga o progresso.</p>
      <p><strong>Como revisar?</strong> Abra a Memória do Mart ou o Dashboard para consultar conceitos, código executado, saída e data.</p>
      <p><strong>Como comentar o código?</strong> Use o botão "Inserir comentário //" no editor ou escreva comentários JavaScript diretamente. Use também o campo de notas para registrar explicações e dúvidas; o sistema salva tudo automaticamente por lição.</p>
      <p><strong>Posso pular lições?</strong> Não. As lições são liberadas em sequência; o Dashboard mostra a próxima lição pendente.</p>
      <p><strong>Onde construo a calculadora e o site?</strong> Nas lições 38 a 42. A lição 50 apresenta a plataforma integrada funcionando.</p>
      <p><strong>Como reiniciar uma lição?</strong> Use "Resetar esta lição" dentro dela. O botão do diretório continua disponível para apagar todo o progresso.</p>
      <p><strong>Pergunta livre:</strong> use o campo "Pergunte ao Senhor Mart" dentro de qualquer lição.</p>`,
    sobre: `
      <h1>Sobre o sistema</h1>
      <p>Trilha Web é uma aplicação estática (HTML, CSS e JavaScript) para aprender JavaScript e fundamentos de desenvolvimento web, com o assistente interno ${C.nome}.</p>
      <p>Versão ${C.versao}</p>
      <p><strong>GA automação engenheiro desenvolvedor : Gledison Andrade</strong></p>`,
  };
  if (state.view === "dashboard" || state.view === "carreira" || state.view === "projetos") {
    return pages[state.view] || "";
  }
  return `<main class="page-view">${pages[state.view] || ""}</main>`;
}

function renderMemoryPage() {
  const items = Object.values(Mart.loadMemory()).sort((a, b) => a.id - b.id);
  const list = items.length ? items.map((item) => `
    <article class="memory-item">
      <div class="memory-head">
        <strong>${item.id}. ${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.topic)} · visto ${item.times}x · ${formatDate(item.lastSeenAt)}
          ${Mart.isDueForReview(item) ? '<em class="review-flag">revisar</em>' : ""}</span>
      </div>
      <p><strong>${escapeHtml(item.concept)}</strong> — ${escapeHtml(item.why)}</p>
      <pre class="mart-code">${escapeHtml(item.code)}</pre>
    </article>`).join("") : "<p>Nenhum conceito gravado ainda. Resolva uma lição ou peça ajuda ao Senhor Mart.</p>";
  return `<h1>Memória do Mart</h1>
    <p>Conceitos gravados para você relembrar. <button class="text-button" type="button" data-action="clear-memory">Limpar memória</button></p>${list}`;
}

async function runCode(code) {
  const logs = [];
  const customConsole = {
    log: (...args) => logs.push(args.map(formatLogValue).join(" ")),
    error: (...args) => logs.push(`[erro] ${args.map(formatLogValue).join(" ")}`),
  };

  try {
    const runner = new Function("_customConsole", `
      return (async () => {
      const console = { log: _customConsole.log, error: _customConsole.error };
      ${code}
      })();
    `);
    await runner(customConsole);
    return { logs, error: "" };
  } catch (error) {
    return { logs, error: error?.message || String(error) };
  }
}

function formatLogValue(value) {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

async function testCode() {
  const challenge = getActiveChallenge();
  state.attemptsMap[challenge.id] = (state.attemptsMap[challenge.id] || 0) + 1;
  const result = await runCode(state.editorCode);
  state.terminalLogs = result.logs;
  state.terminalError = result.error;

  let success = false;
  let message;
  if (result.error) {
    message = `Ocorreu um erro de execução: "${result.error}". Consulte a dica para corrigir o problema.`;
  } else if (!result.logs.length && challenge.output.length) {
    message = `Nenhum console.log foi emitido. Saída esperada: ${JSON.stringify(challenge.output)}`;
  } else {
    const normalize = (value) => value.trim().replace(/\s+/g, "");
    const actual = result.logs.map(normalize);
    const expected = challenge.output.map(normalize);
    success = expected.length === actual.length && expected.every((value, index) => value === actual[index]);
    message = success
      ? "Excelente! A saída corresponde ao resultado esperado. Desafio resolvido!"
      : `A saída difere do esperado.\nEsperado: ${challenge.output.join(" / ")}\nRecebido: ${result.logs.join(" / ") || "(vazio)"}`;
  }

  state.testResult = { tested: true, success, message };
  if (success) {
    state.lockedMessage = "";
    Mart.remember(challenge);
    state.showCelebration = true;
    window.setTimeout(() => {
      state.showCelebration = false;
      render();
    }, 2500);

    if (!state.resolvedIds.includes(challenge.id)) {
      state.resolvedIds.push(challenge.id);
      try {
        const today = new Date().toDateString();
        if (localStorage.getItem(lastResolvedKey) !== today) {
          state.streak += 1;
          localStorage.setItem(lastResolvedKey, today);
        }
      } catch (error) {
        console.error("Não foi possível atualizar a sequência de dias:", error);
      }
    }
    state.recordsMap[challenge.id] = {
      id: challenge.id,
      title: challenge.title,
      code: state.editorCode,
      output: result.logs,
      completedAt: new Date().toISOString(),
      attempts: state.attemptsMap[challenge.id],
      note: state.studyNotesMap[challenge.id] || "",
    };
  }

  saveProgress();
  render();
}

function selectChallenge(index) {
  const challenge = ALL_CHALLENGES[index];
  if (!challenge) return;
  if (!isLessonAccessible(index)) {
    const stoppedAt = ALL_CHALLENGES[getNextLessonIndex()];
    state.view = "licoes";
    state.lockedMessage = `Faça a lição em que você parou para acessar as próximas. Você parou na lição ${stoppedAt.id}: ${stoppedAt.title}.`;
    render();
    return;
  }
  state.currentIndex = index;
  state.view = "licoes";
  state.lockedMessage = "";
  state.editorCode = state.recordsMap[challenge.id]?.code
    ?? state.draftsMap[challenge.id]
    ?? challenge.code;
  state.terminalLogs = [];
  state.terminalError = "";
  state.testResult = { tested: false, success: false, message: "" };
  state.aiTip = "";
  state.martExplain = null;
  state.martAnswer = "";
  state.copied = false;
  render();
}

root?.addEventListener("submit", (event) => {
  if (event.target.matches("[data-form='calculator']")) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const a = Number(formData.get("a"));
    const b = Number(formData.get("b"));
    const operator = formData.get("operator");
    const operations = {
      "+": () => a + b,
      "-": () => a - b,
      "*": () => a * b,
      "/": () => b === 0 ? "Não é possível dividir por zero." : a / b,
      "%": () => b === 0 ? "Não é possível dividir por zero." : a % b,
      "**": () => a ** b,
    };
    const result = Number.isFinite(a) && Number.isFinite(b) && operations[operator]
      ? operations[operator]()
      : "Informe valores numéricos válidos.";
    state.calculatorResult = typeof result === "number" && !Number.isFinite(result)
      ? "Resultado fora do intervalo numérico."
      : String(result);
    render();
    return;
  }
  if (event.target.matches("[data-form='project-search']")) {
    event.preventDefault();
    state.projectSearch = String(new FormData(event.target).get("q") || "");
    render();
    return;
  }
  if (!event.target.matches("[data-form='mart-ask']")) return;
  event.preventDefault();
  state.martAnswer = Mart.ask(new FormData(event.target).get("q") || "", ALL_CHALLENGES);
  render();
});

root?.addEventListener("input", (event) => {
  if (event.target.matches("#code-editor")) {
    state.editorCode = event.target.value;
    state.draftsMap[getActiveChallenge().id] = state.editorCode;
    saveProgress();
  }
  if (event.target.matches("#study-note")) {
    const challengeId = getActiveChallenge().id;
    state.studyNotesMap[challengeId] = event.target.value;
    if (state.recordsMap[challengeId]) state.recordsMap[challengeId].note = event.target.value;
    saveProgress();
  }
});

root?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  switch (button.dataset.action) {
    case "go-view":
      state.view = button.dataset.view;
      state.lockedMessage = "";
      render();
      break;
    case "continue-learning":
      selectChallenge(getNextLessonIndex());
      break;
    case "mart-solve": {
      const challenge = getActiveChallenge();
      const solution = Mart.getSolution(challenge.id);
      if (!solution) break;
      state.editorCode = solution.code;
      state.martExplain = { id: challenge.id };
      Mart.remember(challenge);
      await testCode();
      break;
    }
    case "clear-memory":
      if (window.confirm("Apagar todos os conceitos gravados pelo Senhor Mart?")) {
        Mart.clearMemory();
        render();
      }
      break;
    case "select-challenge":
      selectChallenge(Number(button.dataset.index));
      break;
    case "previous":
      selectChallenge(state.currentIndex - 1);
      break;
    case "next":
      selectChallenge(state.currentIndex + 1);
      break;
    case "run":
      await testCode();
      break;
    case "restore":
      state.editorCode = getActiveChallenge().code;
      state.draftsMap[getActiveChallenge().id] = state.editorCode;
      state.terminalLogs = [];
      state.terminalError = "";
      state.testResult = { tested: false, success: false, message: "" };
      state.aiTip = "";
      saveProgress();
      render();
      break;
    case "insert-comment": {
      const editor = root.querySelector("#code-editor");
      if (!editor) break;
      const beforeCursor = editor.value.slice(0, editor.selectionStart);
      const prefix = beforeCursor && !beforeCursor.endsWith("\n") ? "\n" : "";
      const comment = `${prefix}// Anotação: \n`;
      editor.setRangeText(comment, editor.selectionStart, editor.selectionEnd, "end");
      state.editorCode = editor.value;
      state.draftsMap[getActiveChallenge().id] = state.editorCode;
      saveProgress();
      editor.focus();
      break;
    }
    case "reset-lesson": {
      const challenge = getActiveChallenge();
      if (window.confirm(`Resetar a lição ${challenge.id} e apagar seu registro, rascunho, anotações, tentativas e memória associada?`)) {
        state.resolvedIds = state.resolvedIds.filter((id) => id !== challenge.id);
        delete state.attemptsMap[challenge.id];
        delete state.recordsMap[challenge.id];
        delete state.draftsMap[challenge.id];
        delete state.studyNotesMap[challenge.id];
        Mart.forget(challenge.id);
        state.editorCode = challenge.code;
        state.terminalLogs = [];
        state.terminalError = "";
        state.testResult = { tested: false, success: false, message: "" };
        state.aiTip = "";
        state.martExplain = null;
        saveProgress();
        selectChallenge(state.currentIndex);
      }
      break;
    }
    case "automation-run":
      if (state.automationIndex < AUTOMATION_TASKS.length) {
        state.automationLogs.push(`Concluída: ${AUTOMATION_TASKS[state.automationIndex]}`);
        state.automationIndex += 1;
        render();
      }
      break;
    case "automation-reset":
      state.automationIndex = 0;
      state.automationLogs = [];
      render();
      break;
    case "hint": {
      const outcome = state.terminalError
        ? `O código gerou este erro: ${state.terminalError}`
        : state.testResult.tested && !state.testResult.success
          ? state.testResult.message
          : "Revise o enunciado e compare sua saída com o resultado esperado.";
      state.aiTip = `${outcome}\n\nDica para este desafio: ${getActiveChallenge().hint}`;
      render();
      break;
    }
    case "copy-original":
      try {
        await navigator.clipboard.writeText(getActiveChallenge().code);
        state.copied = true;
      } catch (error) {
        console.error("Não foi possível copiar o código:", error);
        state.aiTip = "Não foi possível acessar a área de transferência. Você pode copiar o código manualmente.";
      }
      render();
      window.setTimeout(() => {
        state.copied = false;
        render();
      }, 2000);
      break;
    case "reset-progress":
      if (window.confirm("Deseja realmente apagar seu progresso e suas estatísticas?")) {
        state.resolvedIds = [];
        state.attemptsMap = {};
        state.recordsMap = {};
        state.draftsMap = {};
        state.studyNotesMap = {};
        state.streak = 1;
        state.currentIndex = 0;
        state.lockedMessage = "";
        state.editorCode = ALL_CHALLENGES[0]?.code ?? "";
        state.terminalLogs = [];
        state.terminalError = "";
        state.testResult = { tested: false, success: false, message: "" };
        state.aiTip = "";
        Mart.clearMemory();
        try {
          localStorage.removeItem(progressKey);
          localStorage.removeItem(lastResolvedKey);
        } catch (error) {
          console.error("Não foi possível apagar o progresso salvo:", error);
        }
        render();
      }
      break;
  }
});

loadProgress();
render();
