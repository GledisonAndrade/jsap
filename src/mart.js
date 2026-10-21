/* Senhor Mart: agente interno offline. Resolve desafios, explica e memoriza conceitos. */
(function () {
  const memoryKey = "mart_memoria";
  const SOLUTIONS = window.MART_SOLUTIONS || {};

  const CONFIG = {
    nome: "Senhor Mart",
    versao: "1.0.0",
    armazenamento: "localStorage do navegador (sem servidor)",
    chaves: ["js_bugs_progresso", "last_resolved_date", memoryKey],
    execucao: "new Function com console isolado",
    comparacao: "Saída normalizada (sem espaços) comparada linha a linha",
    revisaoDias: 3,
  };

  function loadMemory() {
    try {
      const parsed = JSON.parse(localStorage.getItem(memoryKey) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveMemory(memory) {
    try {
      localStorage.setItem(memoryKey, JSON.stringify(memory));
    } catch (error) {
      console.error("Mart não conseguiu gravar a memória:", error);
    }
  }

  function getSolution(id) {
    return SOLUTIONS[id] || null;
  }

  function remember(challenge) {
    const solution = getSolution(challenge.id);
    if (!solution) return;
    const memory = loadMemory();
    const previous = memory[challenge.id];
    memory[challenge.id] = {
      id: challenge.id,
      title: challenge.title,
      topic: challenge.topic,
      concept: solution.concept,
      why: solution.why,
      code: solution.code,
      learnedAt: previous?.learnedAt || new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
      times: (previous?.times || 0) + 1,
    };
    saveMemory(memory);
  }

  function clearMemory() {
    try {
      localStorage.removeItem(memoryKey);
    } catch (error) {
      console.error(error);
    }
  }

  function isDueForReview(item) {
    const days = (Date.now() - new Date(item.lastSeenAt).getTime()) / 86400000;
    return days >= CONFIG.revisaoDias;
  }

  function normalize(text) {
    return String(text).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Busca por palavra-chave nos conceitos gravados e no banco de soluções.
  function ask(question, challenges) {
    const words = normalize(question).split(/\W+/).filter((word) => word.length > 2);
    if (!words.length) return "Pergunte sobre um conceito, por exemplo: \"reduce\", \"escopo\" ou \"this\".";
    const memory = loadMemory();
    const scored = challenges.map((challenge) => {
      const solution = getSolution(challenge.id);
      if (!solution) return { score: 0 };
      const haystack = normalize(`${challenge.title} ${challenge.topic} ${solution.concept} ${solution.why} ${solution.code}`);
      const score = words.filter((word) => haystack.includes(word)).length;
      return { score, challenge, solution };
    }).filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score).slice(0, 2);

    if (!scored.length) return "Ainda não encontrei esse conceito nas lições. Tente outra palavra-chave.";
    return scored.map(({ challenge, solution }) =>
      `Lição ${challenge.id} · ${solution.concept}${memory[challenge.id] ? " (já memorizado)" : ""}\n${solution.why}\n\nExemplo:\n${solution.code}`
    ).join("\n\n———\n\n");
  }

  window.Mart = { CONFIG, getSolution, remember, loadMemory, clearMemory, isDueForReview, ask };
})();
