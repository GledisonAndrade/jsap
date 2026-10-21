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
  streak: 1,
  aiTip: "",
  copied: false,
  showCelebration: false,
  view: "licoes",
  martExplain: null,
  martAnswer: "",
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
    if (typeof parsed.streak === "number") state.streak = parsed.streak;
  } catch (error) {
    console.error("Não foi possível carregar o progresso salvo:", error);
  }
}

function saveProgress() {
  try {
    localStorage.setItem(progressKey, JSON.stringify({
      resolvedIds: state.resolvedIds,
      attemptsMap: state.attemptsMap,
      streak: state.streak,
    }));
  } catch (error) {
    console.error("Não foi possível salvar o progresso:", error);
  }
}

function getActiveChallenge() {
  return ALL_CHALLENGES[state.currentIndex] ?? ALL_CHALLENGES[0];
}

function renderChallengeList() {
  return ALL_CHALLENGES.map((challenge, index) => {
    const isActive = index === state.currentIndex;
    const isResolved = state.resolvedIds.includes(challenge.id);
    const attempts = state.attemptsMap[challenge.id] || 0;

    return `
      <button class="challenge-item${isActive ? " is-active" : ""}" type="button"
        data-action="select-challenge" data-index="${index}"${isActive ? ' aria-current="true"' : ""}>
        <span class="challenge-number${isResolved ? " is-resolved" : ""}">${challenge.id}</span>
        <span class="challenge-item-copy">
          <span class="challenge-item-title">${escapeHtml(challenge.title)}</span>
          <span class="challenge-item-meta">${escapeHtml(challenge.topic)} · ${escapeHtml(challenge.difficulty)}</span>
        </span>
        <span class="challenge-item-status">
          ${attempts > 0 ? `<span class="attempt-count">${attempts}x</span>` : ""}
          ${isResolved ? '<span class="check-mark" aria-label="Resolvido">✓</span>' : ""}
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
      <a class="brand" href="./" aria-label="Caça aos Bugs JS - início">
        <span class="brand-mark" aria-hidden="true">JS</span>
        <span class="brand-copy">
          <span class="brand-title">Caça aos Bugs JS <span class="challenge-badge">${totalChallenges} desafios</span></span>
          <span class="brand-subtitle">Aprenda JavaScript resolvendo desafios no navegador</span>
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
        <article class="challenge-card">
          <div class="challenge-card-top">
            <div class="challenge-tags">
              <span class="topic-tag">${escapeHtml(challenge.topic)}</span>
              <span class="difficulty-tag ${challenge.difficulty === "Fácil" ? "easy" : challenge.difficulty === "Médio" ? "medium" : "hard"}">${escapeHtml(challenge.difficulty)}</span>
              ${state.resolvedIds.includes(challenge.id) ? '<span class="solved-tag">✓ Resolvido</span>' : ""}
            </div>
            <div class="challenge-navigation">
              <button class="secondary-button" type="button" data-action="previous" ${state.currentIndex === 0 ? "disabled" : ""}>← <span>Anterior</span></button>
              <button class="secondary-button" type="button" data-action="next" ${state.currentIndex === totalChallenges - 1 ? "disabled" : ""}><span>Próximo</span> →</button>
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
                <button class="text-button restore-button" type="button" data-action="restore">Restaurar</button>
              </div>
            </div>
            <label class="visually-hidden" for="code-editor">Código JavaScript do desafio</label>
            <textarea id="code-editor" class="code-editor" spellcheck="false" autocapitalize="off"
              autocomplete="off" autocorrect="off" aria-describedby="editor-help">${escapeHtml(state.editorCode)}</textarea>
            <div id="editor-help" class="editor-help">Edite o código acima e execute os testes.</div>
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
        ${renderMartPanel(challenge)}
      </section>
    </main>`}
    <footer class="site-footer">
      <span>JavaScript Bug Hunt © 2026 · Desenvolvido para aprendizagem ativa de JavaScript.</span>
      <strong>GA automação engenheiro desenvolvedor : Gledison Andrade</strong>
    </footer>`;
}

const NAV_ITEMS = [
  ["licoes", "Lições"],
  ["sistema", "Instruções e objetivo"],
  ["memoria", "Memória do Mart"],
  ["parametros", "Parâmetros de desenvolvimento"],
  ["ajuda", "Ajuda"],
  ["sobre", "Sobre o sistema"],
];

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

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function renderPage() {
  const C = Mart.CONFIG;
  const pages = {
    sistema: `
      <h1>Instruções e objetivo</h1>
      <h2>Objetivo</h2>
      <p>Treinar JavaScript corrigindo ${ALL_CHALLENGES.length} códigos com defeitos, entendendo a causa de cada erro e fixando os conceitos por repetição.</p>
      <h2>Como usar</h2>
      <ol>
        <li>Escolha uma lição no diretório e leia o enunciado.</li>
        <li>Edite o código e clique em <em>Executar e testar</em>.</li>
        <li>Se travar, use a dica ou o botão do <strong>${C.nome}</strong> para ver a solução completa explicada.</li>
        <li>Todo conceito resolvido é gravado na <em>Memória do Mart</em> para revisão futura.</li>
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
      <p><strong>Como revisar?</strong> Abra a Memória do Mart; conceitos antigos aparecem marcados como "revisar".</p>
      <p><strong>Pergunta livre:</strong> use o campo "Pergunte ao Senhor Mart" dentro de qualquer lição.</p>`,
    sobre: `
      <h1>Sobre o sistema</h1>
      <p>Caça aos Bugs JS é uma aplicação estática (HTML, CSS e JavaScript) para praticar depuração em JavaScript, com o assistente interno ${C.nome}.</p>
      <p>Versão ${C.versao}</p>
      <p><strong>GA automação engenheiro desenvolvedor : Gledison Andrade</strong></p>`,
  };
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

function runCode(code) {
  const logs = [];
  const customConsole = {
    log: (...args) => logs.push(args.map(formatLogValue).join(" ")),
    error: (...args) => logs.push(`[erro] ${args.map(formatLogValue).join(" ")}`),
  };

  try {
    const runner = new Function("_customConsole", `
      const console = { log: _customConsole.log, error: _customConsole.error };
      ${code}
    `);
    runner(customConsole);
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

function testCode() {
  const challenge = getActiveChallenge();
  state.attemptsMap[challenge.id] = (state.attemptsMap[challenge.id] || 0) + 1;
  const result = runCode(state.editorCode);
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
  }

  saveProgress();
  render();
}

function selectChallenge(index) {
  const challenge = ALL_CHALLENGES[index];
  if (!challenge) return;
  state.currentIndex = index;
  state.editorCode = challenge.code;
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
  if (!event.target.matches("[data-form='mart-ask']")) return;
  event.preventDefault();
  state.martAnswer = Mart.ask(new FormData(event.target).get("q") || "", ALL_CHALLENGES);
  render();
});

root?.addEventListener("input", (event) => {
  if (event.target.matches("#code-editor")) state.editorCode = event.target.value;
});

root?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  switch (button.dataset.action) {
    case "go-view":
      state.view = button.dataset.view;
      render();
      break;
    case "mart-solve": {
      const challenge = getActiveChallenge();
      const solution = Mart.getSolution(challenge.id);
      if (!solution) break;
      state.editorCode = solution.code;
      state.martExplain = { id: challenge.id };
      Mart.remember(challenge);
      testCode();
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
      testCode();
      break;
    case "restore":
      selectChallenge(state.currentIndex);
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
        state.streak = 1;
        state.currentIndex = 0;
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
