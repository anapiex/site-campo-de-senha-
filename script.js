// Elementos do DOM
const passwordInput = document.getElementById('password-input');
const clearBtn = document.getElementById('clear-btn');
const algoSelect = document.getElementById('algo-select');
const encodeBtn = document.getElementById('encode-btn');
const resultSection = document.getElementById('result-section');
const finalPasswordDisplay = document.getElementById('final-password');
const copyBtn = document.getElementById('copy-btn');
const stepsList = document.getElementById('steps-list');
const themeToggleBtn = document.getElementById('theme-toggle');

// Mapeamento de Leet Speak
const leetMap = {
  'a': '4', 'A': '@', 'e': '3', 'E': '3', 'i': '1', 'I': '!',
  'o': '0', 'O': '0', 's': '$', 'S': '5', 't': '7', 'T': '7'
};

function applyLeet(text) {
  return text.split('').map(char => leetMap[char] || char).join('');
}

function applyShift(text, shift = 2) {
  return text.split('').map(char => String.fromCharCode(char.charCodeAt(0) + shift)).join('');
}

function toHex(text) {
  return text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
}

function reverseString(text) {
  return text.split('').reverse().join('');
}

// Processador de Transformação com Registro de Passos
function processPassword(input, level) {
  const steps = [];
  let current = input;

  steps.push({
    title: 'Passo 1: Texto Original',
    desc: 'Captura do código ou senha inserido pelo usuário.',
    result: current
  });

  // Nível Básico
  if (['basic', 'medium', 'advanced'].includes(level)) {
    current = reverseString(current);
    steps.push({
      title: `Passo ${steps.length + 1}: Inversão de Caracteres`,
      desc: 'A ordem da sequência de texto foi invertida.',
      result: current
    });

    current = applyLeet(current);
    steps.push({
      title: `Passo ${steps.length + 1}: Substituição Leet (1337)`,
      desc: 'Letras e vogais comuns foram trocadas por números e símbolos visuais.',
      result: current
    });

    current = applyShift(current, 2);
    steps.push({
      title: `Passo ${steps.length + 1}: Deslocamento ASCII (+2)`,
      desc: 'Cada caractere avançou duas posições na tabela ASCII.',
      result: current
    });
  }

  // Nível Intermediário
  if (['medium', 'advanced'].includes(level)) {
    current = btoa(current);
    steps.push({
      title: `Passo ${steps.length + 1}: Codificação Base64`,
      desc: 'O resultado intermediário foi codificado no padrão Base64.',
      result: current
    });

    const prefix = current.length.toString(16).padStart(2, '0');
    current = `CF#${prefix}_${current}`;
    steps.push({
      title: `Passo ${steps.length + 1}: Injeção de Prefixo Hash`,
      desc: 'Adicionado o identificador "CF#" contendo o tamanho da chave em Hex.',
      result: current
    });
  }

  // Nível Avançado
  if (level === 'advanced') {
    const salt = 'X9!';
    current = `${salt}${current}${salt}`;
    steps.push({
      title: `Passo ${steps.length + 1}: Aplicação de Salt`,
      desc: 'Símbolos adicionais foram inseridos nas extremidades para aumentar a complexidade.',
      result: current
    });

    current = toHex(current);
    steps.push({
      title: `Passo ${steps.length + 1}: Conversão Hexadecimal Final`,
      desc: 'Toda a cadeia final de caracteres foi convertida para hexadecimal.',
      result: current
    });
  }

  return { finalResult: current, steps };
}

// Renderizar os cards do Passo a Passo
function renderSteps(steps) {
  stepsList.innerHTML = '';
  steps.forEach(step => {
    const div = document.createElement('div');
    div.className = 'step-card';
    div.innerHTML = `
      <div class="step-header">
        <span>${step.title}</span>
      </div>
      <p class="step-desc">${step.desc}</p>
      <code class="step-value">${escapeHTML(step.result)}</code>
    `;
    stepsList.appendChild(div);
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Eventos
encodeBtn.addEventListener('click', () => {
  const inputVal = passwordInput.value.trim();
  if (!inputVal) {
    alert('Por favor, digite uma senha ou código!');
    return;
  }

  const algoLevel = algoSelect.value;
  const { finalResult, steps } = processPassword(inputVal, algoLevel);

  finalPasswordDisplay.textContent = finalResult;
  renderSteps(steps);
  resultSection.classList.remove('hidden');
});

clearBtn.addEventListener('click', () => {
  passwordInput.value = '';
  resultSection.classList.add('hidden');
});

copyBtn.addEventListener('click', () => {
  const textToCopy = finalPasswordDisplay.textContent;
  navigator.clipboard.writeText(textToCopy).then(() => {
    copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #10b981;"></i>';
    setTimeout(() => {
      copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
    }, 2000);
  });
});

// Tema Claro/Escuro
themeToggleBtn.addEventListener('click', () => {
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.body.removeAttribute('data-theme');
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem('cipherflow_theme', 'light');
  } else {
    document.body.setAttribute('data-theme', 'dark');
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    localStorage.setItem('cipherflow_theme', 'dark');
  }
});

// Carregar Tema Salvo
if (localStorage.getItem('cipherflow_theme') === 'dark') {
  document.body.setAttribute('data-theme', 'dark');
  themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
}
