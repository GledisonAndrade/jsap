window.ALL_CHALLENGES = [
  {
    id: 1,
    title: "Parênteses Faltando",
    desc: "O código abaixo deve imprimir a mensagem 'Olá, Mundo!' no console, mas possui um erro de sintaxe crítico. Encontre e corrija o compilador de aspas/parênteses.",
    code: "console.log(\"Olá, Mundo!\";",
    output: ["Olá, Mundo!"],
    hint: "Adicione um parêntese de fechamento ')' antes do ponto e vírgula final.",
    difficulty: "Fácil",
    topic: "Sintaxe Básica"
  },
  {
    id: 2,
    title: "Variável Não Declarada",
    desc: "A intenção deste código é somar a variável x com a variável y para exibir o resultado '15'. No entanto, a variável y não existe nem foi inicializada de forma válida.",
    code: "let x = 10;\nconsole.log(x + y);",
    output: ["15"],
    hint: "Declare e inicialize a variável 'y' com o valor '5' antes do console.log.",
    difficulty: "Fácil",
    topic: "Variáveis"
  },
  {
    id: 3,
    title: "Método em Tipo Incorreto",
    desc: "Métodos de string como .toUpperCase() não funcionam diretamente em números. Faça o código exibir a palavra 'DESAFIO' em letras maiúsculas corrigindo o valor inicial.",
    code: "let t = 123;\nconsole.log(t.toUpperCase());",
    output: ["DESAFIO"],
    hint: "Troque o valor da variável 't' de '123' para a string 'desafio'.",
    difficulty: "Fácil",
    topic: "Tipos de Dados"
  },
  {
    id: 4,
    title: "Escopo de Variável com let",
    desc: "Garante que a variável interna não vaze para o escopo global. No código abaixo, 'let' está sendo impresso fora de seu bloco. Ajuste para o console imprimir '20' e depois 'Fora do bloco' (ou resolva o escopo).",
    code: "if (true) {\n  let a = 20;\n}\nconsole.log(a);",
    output: ["20"],
    hint: "Declare 'a' fora do bloco 'if', ou faça a impressão de 'a' ocorrer dentro do bloco '{}' onde ela foi definida.",
    difficulty: "Fácil",
    topic: "Escopo"
  },
  {
    id: 5,
    title: "Comparação Estrita == vs ===",
    desc: "O console.log abaixo retorna 'true' porque a comparação com '==' faz coerção de tipo. Altere a comparação para usar o operador de igualdade estrita '===' de forma que o resultado seja exatamente 'false'.",
    code: "console.log(42 == '42');",
    output: ["false"],
    hint: "Substitua o operador '==' por '===' para verificar também a igualdade de tipos.",
    difficulty: "Fácil",
    topic: "Operadores"
  },
  {
    id: 6,
    title: "Retorno de Função Faltando",
    desc: "A função 'somar' é invocada para somar 3 e 7, mas está retornando 'undefined' no console quando deveria retornar '10'. Corrija a implementação interna.",
    code: "function somar(a, b) {\n  a + b;\n}\nconsole.log(somar(3, 7));",
    output: ["10"],
    hint: "Adicione a palavra-chave 'return' antes da expressão 'a + b' dentro da função.",
    difficulty: "Fácil",
    topic: "Funções"
  },
  {
    id: 7,
    title: "Propriedade Não Existente (Undefined)",
    desc: "Deveria exibir 'Carlos' na tela. Porém, o código tenta acessar 'nomee', que não existe no objeto 'pessoa'. Corrija a digitação.",
    code: "const pessoa = { nome: 'Carlos', idade: 30 };\nconsole.log(pessoa.nomee);",
    output: ["Carlos"],
    hint: "Corrija 'pessoa.nomee' para 'pessoa.nome' para acessar a propriedade correta.",
    difficulty: "Fácil",
    topic: "Objetos"
  },
  {
    id: 8,
    title: "Concatenação Indesejada",
    desc: "O código abaixo acaba imprimindo '55' como string (concatenação) porque '5' é uma string. Corrija o tipo ou adicione conversão para que a soma retorne o número '10'.",
    code: "console.log('5' + 5);",
    output: ["10"],
    hint: "Remova as aspas de '5' para transformá-lo em número, ou use Number('5') ou o operador unário + na frente da string.",
    difficulty: "Fácil",
    topic: "Coerção de Tipos"
  },
  {
    id: 9,
    title: "Retorno Implícito no Map",
    desc: "Tentamos usar .map() para dobrar os valores de um array, obtendo [2, 4, 6]. No entanto, as chaves '{}' no arrow function exigem um retorno explícito. Corrija para obter a saída ideal.",
    code: "const nums = [1, 2, 3];\nconst dobro = nums.map(n => { n * 2 });\nconsole.log(dobro);",
    output: ["[2,4,6]"],
    hint: "Remova as chaves da função arrow '(n => n * 2)' ou insira a instrução 'return n * 2;' dentro das chaves.",
    difficulty: "Médio",
    topic: "Arrays"
  },
  {
    id: 10,
    title: "Filtro de Números Pares",
    desc: "Queremos filtrar o array para conter somente números pares: '[2, 4]'. Porém, o resto da divisão 'n % 2' resulta em '1' (que é true-ish) para ímpares. Corrija a condicional.",
    code: "const nums = [1, 2, 3, 4];\nconst pares = nums.filter(n => n % 2);\nconsole.log(pares);",
    output: ["[2,4]"],
    hint: "Use 'n % 2 === 0' na expressão de filtragem para testar se o número é par.",
    difficulty: "Médio",
    topic: "Arrays"
  },
  {
    id: 11,
    title: "Referência ao 'this' em Arrow Functions",
    desc: "A arrow function ()=>{} captura o 'this' léxico global, resultando em 'undefined'. Corrija o método do carro para usar uma função tradicional que se referencie corretamente ao modelo, imprimindo 'Fusca'.",
    code: "const carro = {\n  modelo: 'Fusca',\n  getModelo: () => this.modelo\n};\nconsole.log(carro.getModelo());",
    output: ["Fusca"],
    hint: "Converta 'getModelo: () => this.modelo' em uma propriedade de função padrão: 'getModelo() { return this.modelo; }'.",
    difficulty: "Médio",
    topic: "This"
  },
  {
    id: 12,
    title: "Hoisting de Variáveis",
    desc: "A variável 'a' é acessada antes de ser atribuída, o que resulta em 'undefined' devido ao hoisting do tipo var. Mude a declaração para que ela imprima '10' de forma limpa.",
    code: "console.log(a);\nvar a = 10;",
    output: ["10"],
    hint: "Coloque a declaração 'let a = 10;' (ou var a = 10;) antes do console.log.",
    difficulty: "Médio",
    topic: "Hoisting"
  },
  {
    id: 13,
    title: "Atribuição em Estrutura Condicional",
    desc: "A condicional está errada pois usa '=' (atribuição) em vez de '===' (estrita igualdade), fazendo com que o bloco if seja executado independentemente de x ser igual a 10.",
    code: "let x = 5;\nif (x = 10) {\n  console.log('igual');\n} else {\n  console.log('diferente');\n}",
    output: ["diferente"],
    hint: "Altere de 'x = 10' para 'x === 10' de modo a fazer a verificação lógica correta.",
    difficulty: "Fácil",
    topic: "Operadores"
  },
  {
    id: 14,
    title: "Conversão de Float de Forma Inteira",
    desc: "Desejamos preservar as casas decimais de uma string numérica ao convertê-la, imprimindo exatamente '3.14'. No entanto, parseInt ignora a parte decimal.",
    code: "console.log(parseInt('3.14px'));",
    output: ["3.14"],
    hint: "Use a função global 'parseFloat' em vez de 'parseInt' para extrair o valor decimal da string.",
    difficulty: "Fácil",
    topic: "Funções Globais"
  },
  {
    id: 15,
    title: "Valor Inicial no Reduce",
    desc: "A soma total dos números no array deve ser exatamente '6'. No entanto, o acumulador inicia por padrão no primeiro elemento. Acrescente a boa prática do valor inicial igual a '0'.",
    code: "const soma = [1, 2, 3].reduce((acc, val) => acc + val);\nconsole.log(soma);",
    output: ["6"],
    hint: "Apesar de funcionar em arrays cheios, adicione o argumento '0' no reduce da seguinte forma: '.reduce((acc, val) => acc + val, 0)'.",
    difficulty: "Médio",
    topic: "Arrays"
  },
  {
    id: 16,
    title: "Fusão de Arrays com Spread Operator",
    desc: "Ao invés de fundir os valores de 'a' e 'b' em um único array '[1, 2, 3, 4]', a operação de push modificou o array original e retornou o novo comprimento '3'. Corrija para imprimir na tela o array final unificado usando spreads.",
    code: "const a = [1, 2];\nconst b = [3, 4];\na.push(b);\nconsole.log(a);",
    output: ["[1,2,3,4]"],
    hint: "Defina uma combinação limpa usando spread operator: 'console.log([...a, ...b]);' ou faça push dos itens individuais.",
    difficulty: "Médio",
    topic: "Sintaxe ES6"
  },
  {
    id: 17,
    title: "Obter Valor em Estrutura Map",
    desc: "Criamos um objeto Map() ES6 para armazenar a chave 'chave' associada a '42'. No entanto, a notação de ponto '.chave' não funciona para Maps. Corrija para extrair o valor de forma oficial.",
    code: "const mapa = new Map();\nmapa.set('chave', 42);\nconsole.log(mapa.chave);",
    output: ["42"],
    hint: "Substitua a propriedade 'mapa.chave' pela chamada do método específico do Map: 'mapa.get(\"chave\")'.",
    difficulty: "Médio",
    topic: "Estruturas de Dados"
  },
  {
    id: 18,
    title: "Formato JSON Estrito",
    desc: "O JavaScript exige que strings JSON válidas tenham aspas duplas nas chaves e strings de valores. Modifique a string de entrada para que o JSON.parse seja executado com sucesso e imprima o nome 'João'.",
    code: "const json = \"{'nome': 'João'}\";\nconst obj = JSON.parse(json);\nconsole.log(obj.nome);",
    output: ["João"],
    hint: "Adapte o formato do JSON para possuir aspas duplas internas: 'const json = \"{\\\"nome\\\": \\\"João\\\"}\"'.",
    difficulty: "Médio",
    topic: "JSON"
  },
  {
    id: 19,
    title: "Divisão por Zero Lógica",
    desc: "No JavaScript, dividir por zero dá Infinity. Queremos proteger o cálculo. Se o divisor 'y' for zero, o sistema deve imprimir 'Inválido'. Caso contrário, traga o resultado da divisão.",
    code: "let x = 10;\nlet y = 0;\nlet div = x / y;\nconsole.log(div);",
    output: ["Inválido"],
    hint: "Insira uma validação 'if (y === 0)' antes ou atribua 'div' de forma condicional, logando 'Inválido' se for nulo.",
    difficulty: "Médio",
    topic: "Condicionais"
  },
  {
    id: 20,
    title: "Clonagem Rasa de Objeto",
    desc: "Queremos adicionar a propriedade 'b: 2' sem alterar nosso objeto original de origem. Atualmente target se fundiu ao original. Use Object.assign() com um destino vazio ou spread para clonar com sucesso.",
    code: "const original = { a: 1 };\nconst novo = original;\nnovo.b = 2;\nconsole.log(original);",
    output: ["{\"a\":1}"],
    hint: "Substitua a atribuição direta por spread: 'const novo = { ...original };' de forma que as alterações em 'novo' não afetem a origem.",
    difficulty: "Médio",
    topic: "Objetos"
  },
  {
    id: 21,
    title: "Controle de Recursividade no Fatorial",
    desc: "O fatorial de 5 deve resultar em 120. Atualmente, a chamada recursiva causa um estouro de pilha ('Infinite Loop') porque chama 'fat(n)' infinitamente. Decremente o argumento para corrigir.",
    code: "function fat(n) {\n  if (n === 0) return 1;\n  return n * fat(n);\n}\nconsole.log(fat(5));",
    output: ["120"],
    hint: "Troque a recursão por 'fat(n - 1)', permitindo que o cálculo vá reduzindo o valor de n em cada passo.",
    difficulty: "Médio",
    topic: "Algoritmos"
  },
  {
    id: 22,
    title: "Array final filtrado por Índices",
    desc: "Desejamos obter somente os itens localizados em posições pares de nosso array original, o que geraria o resultado '[1, 3]'. Para fazer isso de forma prática usando filter, utilize o segundo parâmetro da função callback.",
    code: "const nums = [1, 2, 3, 4];\nconst pares = nums.filter((n, index) => {\n  return false; \n});\nconsole.log(pares);",
    output: ["[1,3]"],
    hint: "Retorne verdadeiro se o índice for par: 'return index % 2 === 0;'.",
    difficulty: "Médio",
    topic: "Arrays"
  },
  {
    id: 23,
    title: "Configurando Parâmetros Opcionais/Default",
    desc: "Se a função 'saudar' for executada sem argumentos, ela deve responder 'Olá, Visitante'. Atualmente, emite 'Olá, undefined'. Use um parâmetro padrão da especificação ES6.",
    code: "function saudar(nome) {\n  console.log('Olá, ' + nome);\n}\nsaudar();",
    output: ["Olá, Visitante"],
    hint: "Defina o argumento padrão diretamente na assinatura da função: 'function saudar(nome = \"Visitante\")'.",
    difficulty: "Fácil",
    topic: "Funções"
  },
  {
    id: 24,
    title: "Validação Prática de Tipos com typeof",
    desc: "A meta é somar somente se ambos forem números. Se algum for de outro tipo, deve imprimir 'Erro'. Atualmente, ela concatena '10abc'. Ajuste para validar usando typeof de forma segura.",
    code: "function somarSeguro(a, b) {\n  console.log(a + b);\n}\nsomarSeguro(10, 'abc');",
    output: ["Erro"],
    hint: "Use uma verificação 'if (typeof a !== \"number\" || typeof b !== \"number\") { console.log(\"Erro\"); } else { console.log(a + b); }'.",
    difficulty: "Médio",
    topic: "Validação"
  },
  {
    id: 25,
    title: "Removendo Valores Duplicados do Array",
    desc: "Desejamos remover valores redizidos ou repetidos no array, deixando-o apenas com '[1, 2, 3]'. Use o construtor Set para criar uma estrutura sem elementos repetidos e reconverta-a a array.",
    code: "const valores = [1, 2, 2, 3, 3, 3];\nconsole.log(valores);",
    output: ["[1,2,3]"],
    hint: "Use spreads com Set: 'console.log([...new Set(valores)]);' para criar um novo array com itens únicos.",
    difficulty: "Médio",
    topic: "Conjuntos (Set)"
  },
  {
    id: 26,
    title: "Propriedades privadas de classes",
    desc: "Nas versões modernas do Javascript ES, o prefixo '#' declara propriedades privadas em classes. Mas o código a seguir tenta ler a propriedade direta fora dela, estourando erro. Corrija o método expositor da Conta para ler internamente de forma correta.",
    code: "class Conta {\n  #saldo = 1000;\n  getSaldo() {\n    return saldo;\n  }\n}\nconst c = new Conta();\nconsole.log(c.getSaldo());",
    output: ["1000"],
    hint: "Precisa referenciar a propriedade privada com o prefixo do objeto: 'return this.#saldo;' dentro de getSaldo().",
    difficulty: "Médio",
    topic: "Classes"
  },
  {
    id: 27,
    title: "Operador de Coalescência Nula",
    desc: "Queremos usar o operador de coalescência nula '??' para garantir que se o valor for um número válido (como 0), ele seja preservado, de modo que o console mostre exatamente '0'. Atualmente o operador logico '||' o trata como falsy e o substitui por '10'.",
    code: "let cliques = 0;\nlet total = cliques || 10;\nconsole.log(total);",
    output: ["0"],
    hint: "Troque o operador lógico de disjunção '||' pelo operador de coalescência nula '??'.",
    difficulty: "Médio",
    topic: "ES2020 OS"
  },
  {
    id: 28,
    title: "Controle Estrito de Erros com Try/Catch",
    desc: "Este código tenta fazer parsing de uma entrada inválida de JSON e quebra a execução. Adicione tratamento de erros com um bloco da estrutura try-catch e imprima 'Erro de Formato' no console caso estoure uma exceção.",
    code: "const dados = JSON.parse('{nome: falha}');\nconsole.log(dados);",
    output: ["Erro de Formato"],
    hint: "Envolva JSON.parse em um bloco 'try { ... } catch(e) { console.log(\"Erro de Formato\"); }'.",
    difficulty: "Médio",
    topic: "Exceções"
  },
  {
    id: 29,
    title: "Imutabilidade de Propriedades com Object.freeze",
    desc: "Queremos bloquear alterações no objeto de configuração geral. No entanto, o código altera a propriedade de forma direta. Proteja a configuração original para manter o valor 'producao'.",
    code: "const config = { env: 'producao' };\nconfig.env = 'desenvolvimento';\nconsole.log(config.env);",
    output: ["producao"],
    hint: "Invoque 'Object.freeze(config);' logo após instanciá-lo para impedir que mutações de atribuição ocorram.",
    difficulty: "Médio",
    topic: "Imutabilidade"
  },
  {
    id: 30,
    title: "Desestruturação Aninhada de Objetos",
    desc: "Queremos ler a rua 'Av. Paulista' e imprimi-la. Atualmente o código tenta ler direto 'rua', gerando erro ou undefined, pois 'rua' é uma propriedade aninhada de 'endereco'.",
    code: "const usuario = { id: 10, endereco: { rua: 'Av. Paulista' } };\nconst { rua } = usuario;\nconsole.log(rua);",
    output: ["Av. Paulista"],
    hint: "Use a desestruturação aninhada: 'const { endereco: { rua } } = usuario;' para obter a rua diretamente.",
    difficulty: "Médio",
    topic: "Desestruturação"
  },
  {
    id: 31,
    title: "Busca Dinâmica com Array.find",
    desc: "Desejamos localizar o registro com id correspondente a '3'. O resultado final do log deve ser somente o nome 'Ana'. Atualmente o find retorna o objeto completo. Encontre o objeto e emita somente seu nome.",
    code: "const clientes = [{ id: 1, nome: 'Rui' }, { id: 3, nome: 'Ana' }];\nconst resultado = clientes.find(c => c.id === 3);\nconsole.log(resultado);",
    output: ["Ana"],
    hint: "Chame a propriedade da seguinte forma: 'console.log(resultado ? resultado.nome : \"\");'.",
    difficulty: "Médio",
    topic: "Arrays"
  },
  {
    id: 32,
    title: "Encadeamento Seguro (Optional Chaining)",
    desc: "Acessar propriedades em níveis aninhados que podem ser nulos joga uma exceção no console. Contorne o problema fazendo o programa imprimir 'undefined' ao invés de quebrar, usando Optional Chaining.",
    code: "const app = { conexao: null };\nconsole.log(app.conexao.url);",
    output: ["undefined"],
    hint: "Modifique para 'app.conexao?.url' para evitar o erro de tentar ler url em algo que é null.",
    difficulty: "Fácil",
    topic: "Optional Chaining"
  },
  {
    id: 33,
    title: "Operação com Conjuntos (Has)",
    desc: "Verifica se uma tag 'javascript' existe em nosso array HashSet. No entanto, o método '.has' é de Set, e o array comum só fornece '.includes'. Converta para Set ou corrija para o log imprimir exatamente 'true'.",
    code: "const tags = ['javascript', 'web'];\nconsole.log(tags.has('javascript'));",
    output: ["true"],
    hint: "Substitua pela chamada 'tags.includes(\"javascript\")' ou instancie o conjunto: 'new Set(tags).has(\"javascript\")'.",
    difficulty: "Fácil",
    topic: "Arrays"
  },
  {
    id: 34,
    title: "Validação Any com Array.some",
    desc: "Precisamos saber se existe alguma nota negativa no array para registrar um risco. Se houver, imprima 'Risco'. Atualmente ela emite undefined.",
    code: "const notas = [7, 8, -2, 9];\nconst risco = notas.some(n => n < 0);\n// exiba Risco ou Seguro de acordo com o booleano risco",
    output: ["Risco"],
    hint: "Escreva algo como: 'console.log(risco ? \"Risco\" : \"Seguro\");' para satisfazer o retorno.",
    difficulty: "Médio",
    topic: "Arrays"
  },
  {
    id: 35,
    title: "Verificando Instâncias com instanceof",
    desc: "Confirmar se o objeto em questão herda da classe 'Humano'. Espera-se que emita exatamente 'true'. Corrija a atribuição da classe instanciada ou resolva o teste lógico.",
    code: "class Humano {}\nconst pessoa = {};\nconsole.log(pessoa instanceof Humano);",
    output: ["true"],
    hint: "Instancie o objeto adequadamente usando o construtor correto: 'const pessoa = new Humano();'.",
    difficulty: "Fácil",
    topic: "POO"
  }
];