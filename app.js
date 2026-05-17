'use strict';

// State
const state = {
  ops: new Set(['+', '-']),
  min: -10,
  max: 10,
  a: 0,
  b: 0,
  op: '+',
  answer: null,
  score: { correct: 0, wrong: 0, total: 0 },
  answered: false
};

// Elements
const problemEl   = document.getElementById('problem');
const inputEl     = document.getElementById('answer-input');
const checkBtn    = document.getElementById('check-btn');
const nextBtn     = document.getElementById('next-btn');
const resetBtn    = document.getElementById('reset-btn');
const feedbackEl  = document.getElementById('feedback');
const scoreCorrect = document.getElementById('score-correct');
const scoreWrong  = document.getElementById('score-wrong');
const scoreTotal  = document.getElementById('score-total');
const minInput    = document.getElementById('range-min');
const maxInput    = document.getElementById('range-max');

// Numpad
document.querySelectorAll('.numpad button').forEach(btn => {
  btn.addEventListener('click', () => {
    if (state.answered) return;
    const v = btn.dataset.val;
    if (v === 'neg') {
      // toggle sign
      if (inputEl.value.startsWith('-')) {
        inputEl.value = inputEl.value.slice(1);
      } else if (inputEl.value !== '') {
        inputEl.value = '-' + inputEl.value;
      } else {
        inputEl.value = '-';
      }
    } else if (v === 'clear') {
      inputEl.value = '';
    } else if (v === 'del') {
      inputEl.value = inputEl.value.slice(0, -1);
    } else {
      if (inputEl.value === '-') {
        inputEl.value = '-' + v;
      } else {
        inputEl.value += v;
      }
    }
    inputEl.focus();
  });
});

// Op toggle buttons
document.querySelectorAll('.toggle-btn[data-op]').forEach(btn => {
  btn.addEventListener('click', () => {
    const op = btn.dataset.op;
    if (state.ops.has(op)) {
      if (state.ops.size > 1) {
        state.ops.delete(op);
        btn.classList.remove('active');
      }
    } else {
      state.ops.add(op);
      btn.classList.add('active');
    }
  });
});

// Range inputs
minInput.addEventListener('change', () => {
  state.min = parseInt(minInput.value) || -10;
  if (state.min >= state.max) state.min = state.max - 1;
  minInput.value = state.min;
});

maxInput.addEventListener('change', () => {
  state.max = parseInt(maxInput.value) || 10;
  if (state.max <= state.min) state.max = state.min + 1;
  maxInput.value = state.max;
});

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function colorNum(n) {
  const cls = n < 0 ? 'num-neg' : n > 0 ? 'num-pos' : 'num-zero';
  const text = n < 0 ? `(${n})` : `${n}`;
  return `<span class="${cls}">${text}</span>`;
}

function newProblem() {
  const ops = [...state.ops];
  state.op = ops[Math.floor(Math.random() * ops.length)];
  state.a  = randInt(state.min, state.max);
  state.b  = randInt(state.min, state.max);
  state.answer = state.op === '+' ? state.a + state.b : state.a - state.b;
  state.answered = false;

  problemEl.innerHTML =
    `${colorNum(state.a)} <span class="op-symbol">${state.op}</span> ${colorNum(state.b)} <span style="color:#888">=</span>`;

  inputEl.value = '';
  inputEl.className = '';
  inputEl.disabled = false;
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  nextBtn.classList.remove('visible');
  checkBtn.style.display = '';
  inputEl.focus();
}

function check() {
  if (state.answered) return;
  const val = inputEl.value.trim();
  if (val === '' || val === '-') return;

  const userAns = parseInt(val);
  if (isNaN(userAns)) return;

  state.answered = true;
  state.score.total++;
  inputEl.disabled = true;
  checkBtn.style.display = 'none';
  nextBtn.classList.add('visible');

  if (userAns === state.answer) {
    state.score.correct++;
    feedbackEl.textContent = ['答對了！🎉', '太棒了！⭐', '正確！👏', '你真厲害！🌟'][Math.floor(Math.random()*4)];
    feedbackEl.className = 'feedback correct';
    inputEl.classList.add('correct');
  } else {
    state.score.wrong++;
    feedbackEl.textContent = `答錯了，正確答案是 ${state.answer}`;
    feedbackEl.className = 'feedback wrong';
    inputEl.classList.add('wrong');
  }

  updateScore();
}

function updateScore() {
  scoreCorrect.textContent = state.score.correct;
  scoreWrong.textContent   = state.score.wrong;
  scoreTotal.textContent   = state.score.total;
}

checkBtn.addEventListener('click', check);

nextBtn.addEventListener('click', newProblem);

resetBtn.addEventListener('click', () => {
  state.score = { correct: 0, wrong: 0, total: 0 };
  updateScore();
  newProblem();
});

inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (state.answered) newProblem();
    else check();
  }
});

// Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

// Init
newProblem();
