/**
 * CEFR Mock Exam Telegram Mini App
 * Modular Vanilla JS Architecture
 */

// ==========================================
// 1. STRINGS (Uzbek Latin)
// ==========================================
const STRINGS = {
  all: "Barchasi",
  start: "Boshlash",
  continue: "Davom etish",
  finish: "Yakunlash",
  submit: "Topshirish",
  next: "Keyingi",
  prev: "Oldingi",
  flag: "Ko'rib chiqish uchun belgilash",
  unflag: "Belgini olib tashlash",
  timeLeft: "Qolgan vaqt",
  noTime: "Vaqt ko'rsatilmagan",
  noKey: "Kalit yo'q",
  score: "Natija",
  correct: "To'g'ri",
  incorrect: "Noto'g'ri",
  recording: "Yozib olinmoqda...",
  stopRecording: "To'xtatish",
  play: "Eshitib ko'rish",
  words: "so'z",
  minWords: "Minimal so'zlar soni",
  permissionDenied: "Mikrofon ruxsati rad etildi",
  audioEmpty: "Audio fayl mavjud emas",
  openPdf: "Asl PDF'ni ochish"
};

// ==========================================
// 2. STATE & STORAGE
// ==========================================
const State = {
  mocks: [],
  currentMockId: null,
  currentModule: null, // 'reading', 'listening', 'speaking', 'writing'
  currentPartIndex: 0,
  currentQuestionIndex: 0,
  answers: {}, // { "b2-01-reading-0-0": 1 }
  flags: {},   // { "b2-01-reading-0-0": true }
  timerInterval: null,
  timeRemaining: 0,
  mediaRecorder: null,
  audioChunks: []
};

const Storage = {
  save(key, data) {
    try {
      localStorage.setItem(`cef_mock_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn("LocalStorage unavailable", e);
    }
  },
  load(key) {
    try {
      const data = localStorage.getItem(`cef_mock_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn("LocalStorage unavailable", e);
      return null;
    }
  },
  clear(key) {
    try {
      localStorage.removeItem(`cef_mock_${key}`);
    } catch (e) {}
  }
};

// ==========================================
// 3. TELEGRAM INTEGRATION
// ==========================================
const TG = window.Telegram.WebApp;

function initTelegram() {
  TG.ready();
  TG.expand();
  
  // Theme handling
  document.documentElement.style.setProperty('--tg-theme-bg-color', TG.themeParams.bg_color || '#ffffff');
  document.documentElement.style.setProperty('--tg-theme-text-color', TG.themeParams.text_color || '#222222');
  document.documentElement.style.setProperty('--tg-theme-button-color', TG.themeParams.button_color || '#3390ec');
  document.documentElement.style.setProperty('--tg-theme-button-text-color', TG.themeParams.button_text_color || '#ffffff');
  document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', TG.themeParams.secondary_bg_color || '#f0f0f0');
  
  TG.onEvent('themeChanged', () => {
    document.documentElement.style.setProperty('--tg-theme-bg-color', TG.themeParams.bg_color || '#ffffff');
    document.documentElement.style.setProperty('--tg-theme-text-color', TG.themeParams.text_color || '#222222');
    document.documentElement.style.setProperty('--tg-theme-button-color', TG.themeParams.button_color || '#3390ec');
    document.documentElement.style.setProperty('--tg-theme-button-text-color', TG.themeParams.button_text_color || '#ffffff');
    document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', TG.themeParams.secondary_bg_color || '#f0f0f0');
  });

  TG.BackButton.onClick(() => {
    navigateBack();
  });

  TG.MainButton.onClick(() => {
    handleMainButton();
  });
}

function setMainButton(text, isVisible = true, isActive = true) {
  if (isVisible) {
    TG.MainButton.setText(text);
    TG.MainButton.show();
    isActive ? TG.MainButton.enable() : TG.MainButton.disable();
  } else {
    TG.MainButton.hide();
  }
}

function haptic(type = 'light') {
  if (TG.HapticFeedback) {
    TG.HapticFeedback.impactOccurred(type);
  }
}

// ==========================================
// 4. CORE LOGIC & NAVIGATION
// ==========================================
let appData = null;

async function loadData() {
  try {
    const response = await fetch('data/mocks.json');
    appData = await response.json();
    State.mocks = appData.mocks;
    renderMockList('ALL');
  } catch (e) {
    console.error("Failed to load mocks.json", e);
  }
}

function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  
  if (viewId === 'mock-list-view') {
    TG.BackButton.hide();
    setMainButton(STRINGS.start, false);
  }
}

function navigateBack() {
  haptic('light');
  const currentView = document.querySelector('.view.active').id;
  
  if (currentView === 'exam-view') {
    if (confirm("Imtihondan chiqishni xohlaysizmi? Jarayon saqlanib qoladi.")) {
      stopTimer();
      showView('module-view');
      TG.BackButton.show();
    }
  } else if (currentView === 'module-view' || currentView === 'results-view') {
    stopTimer();
    showView('mock-list-view');
    TG.BackButton.hide();
  }
}

function handleMainButton() {
  haptic('medium');
  const currentView = document.querySelector('.view.active').id;
  
  if (currentView === 'module-view') {
    // Start selected module
    startModule(State.currentModule);
  } else if (currentView === 'exam-view') {
    // Next or Submit
    if (State.currentQuestionIndex < getTotalQuestions() - 1) {
      State.currentQuestionIndex++;
      renderQuestion();
      updateNavGrid();
    } else {
      submitExam();
    }
  }
}

// ==========================================
// 5. RENDER FUNCTIONS
// ==========================================
function renderMockList(filterLevel) {
  const container = document.getElementById('mocks-container');
  container.innerHTML = '';
  
  const filtered = filterLevel === 'ALL' 
    ? State.mocks 
    : State.mocks.filter(m => m.level === filterLevel);
    
  filtered.forEach(mock => {
    const card = document.createElement('div');
    card.className = 'mock-card';
    card.innerHTML = `
      <h3>${mock.title}</h3>
      <div class="meta">Daraja: ${mock.level} • ID: ${mock.id.toUpperCase()}</div>
    `;
    card.onclick = () => {
      haptic('light');
      openMock(mock.id);
    };
    container.appendChild(card);
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    haptic('light');
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    renderMockList(e.target.dataset.level);
  });
});

function openMock(mockId) {
  State.currentMockId = mockId;
  const mock = State.mocks.find(m => m.id === mockId);
  
  document.getElementById('header-title').textContent = mock.title;
  
  const pdfBtn = document.getElementById('pdf-btn');
  if (mock.pdf && !mock.pdf.includes('PLACEHOLDER')) {
    pdfBtn.classList.remove('hidden');
    pdfBtn.onclick = () => {
      haptic('light');
      TG.openLink(mock.pdf);
    };
  } else {
    pdfBtn.classList.add('hidden');
  }

  const info = document.getElementById('module-header-info');
  info.innerHTML = `<strong>${mock.title}</strong><br>Daraja: ${mock.level}`;
  
  const grid = document.getElementById('modules-grid');
  grid.innerHTML = '';
  
  const modules = [
    { key: 'reading', name: 'Reading (O\'qish)', data: mock.reading },
    { key: 'listening', name: 'Listening (Tinglash)', data: mock.listening },
    { key: 'speaking', name: 'Speaking (Gapirish)', data: mock.speaking },
    { key: 'writing', name: 'Writing (Yozish)', data: mock.writing }
  ];
  
  modules.forEach(mod => {
    if (mod.data) {
      const saved = Storage.load(`${mockId}-${mod.key}-progress`);
      const status = saved ? "Davom etish" : "Boshlash";
      
      const card = document.createElement('div');
      card.className = 'module-card';
      card.innerHTML = `
        <h4>${mod.name}</h4>
        <div class="status">${mod.data.time ? `${mod.data.time} daqiqa` : STRINGS.noTime}</div>
        <div class="status" style="margin-top:8px; color: var(--accent)">${status}</div>
      `;
      card.onclick = () => {
        haptic('light');
        State.currentModule = mod.key;
        showView('module-view');
        TG.BackButton.show();
        setMainButton(status === "Boshlash" ? STRINGS.start : STRINGS.continue);
      };
      grid.appendChild(card);
    }
  });
  
  showView('module-view');
}

// ==========================================
// 6. EXAM ENGINE
// ==========================================
function getTotalQuestions() {
  const mock = State.mocks.find(m => m.id === State.currentMockId);
  const moduleData = mock[State.currentModule];
  
  if (State.currentModule === 'reading' || State.currentModule === 'listening') {
    return moduleData.parts.reduce((acc, part) => acc + part.questions.length, 0);
  }
  if (State.currentModule === 'speaking') return moduleData.parts.length;
  if (State.currentModule === 'writing') return moduleData.tasks.length;
  return 0;
}

function getQuestionKey() {
  return `${State.currentMockId}-${State.currentModule}-${State.currentPartIndex}-${State.currentQuestionIndex}`;
}

function startModule(moduleKey) {
  State.currentPartIndex = 0;
  State.currentQuestionIndex = 0;
  
  const mock = State.mocks.find(m => m.id === State.currentMockId);
  const moduleData = mock[moduleKey];
  
  // Load saved progress
  const saved = Storage.load(`${State.currentMockId}-${moduleKey}-progress`);
  if (saved) {
    State.answers = saved.answers || {};
    State.flags = saved.flags || {};
  } else {
    State.answers = {};
    State.flags = {};
  }
  
  if (moduleData.time) {
    State.timeRemaining = moduleData.time * 60;
    startTimer();
  } else {
    document.getElementById('timer-display').textContent = STRINGS.noTime;
  }
  
  showView('exam-view');
  TG.BackButton.show();
  
  if (moduleKey === 'reading' || moduleKey === 'listening') {
    renderNavGrid();
    renderQuestion();
    setMainButton(STRINGS.next);
  } else if (moduleKey === 'speaking') {
    renderSpeaking();
    setMainButton(STRINGS.finish);
  } else if (moduleKey === 'writing') {
    renderWriting();
    setMainButton(STRINGS.submit);
  }
}

function startTimer() {
  stopTimer();
  updateTimerDisplay();
  State.timerInterval = setInterval(() => {
    State.timeRemaining--;
    updateTimerDisplay();
    if (State.timeRemaining <= 0) {
      stopTimer();
      haptic('heavy');
      alert("Vaqt tugadi!");
      submitExam();
    }
  }, 1000);
}

function stopTimer() {
  if (State.timerInterval) {
    clearInterval(State.timerInterval);
    State.timerInterval = null;
  }
}

function updateTimerDisplay() {
  const mins = Math.floor(State.timeRemaining / 60);
  const secs = State.timeRemaining % 60;
  const display = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const el = document.getElementById('timer-display');
  el.textContent = display;
  
  if (State.timeRemaining < 300) { // 5 minutes warning
    el.classList.add('warning');
  } else {
    el.classList.remove('warning');
  }
}

function saveProgress() {
  Storage.save(`${State.currentMockId}-${State.currentModule}-progress`, {
    answers: State.answers,
    flags: State.flags,
    timeRemaining: State.timeRemaining
  });
}

// ==========================================
// 7. READING & LISTING RENDERING
// ==========================================
function renderNavGrid() {
  const container = document.getElementById('question-navigator');
  container.innerHTML = '';
  const total = getTotalQuestions();
  
  for (let i = 0; i < total; i++) {
    const btn = document.createElement('button');
    btn.className = 'q-nav-btn';
    btn.textContent = i + 1;
    btn.dataset.index = i;
    
    const key = `${State.currentMockId}-${State.currentModule}-0-${i}`;
    if (State.answers[key] !== undefined) btn.classList.add('answered');
    if (State.flags[key]) btn.classList.add('flagged');
    
    // Check if no key
    const mock = State.mocks.find(m => m.id === State.currentMockId);
    const q = mock[State.currentModule].parts[0].questions[i];
    if (q.answer === null) btn.classList.add('no-key');
    
    btn.onclick = () => {
      haptic('light');
      State.currentQuestionIndex = i;
      renderQuestion();
      updateNavGrid();
    };
    container.appendChild(btn);
  }
}

function updateNavGrid() {
  document.querySelectorAll('.q-nav-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.index) === State.currentQuestionIndex);
  });
  
  // Update flag button state
  const key = getQuestionKey();
  const flagBtn = document.getElementById('flag-toggle-btn');
  if (State.flags[key]) {
    flagBtn.classList.add('flagged');
  } else {
    flagBtn.classList.remove('flagged');
  }
}

document.getElementById('flag-toggle-btn').addEventListener('click', () => {
  haptic('light');
  const key = getQuestionKey();
  State.flags[key] = !State.flags[key];
  saveProgress();
  updateNavGrid();
});

function renderQuestion() {
  const mock = State.mocks.find(m => m.id === State.currentMockId);
  const moduleData = mock[State.currentModule];
  const part = moduleData.parts[State.currentPartIndex];
  const q = part.questions[State.currentQuestionIndex];
  const container = document.getElementById('exam-content');
  
  let html = '';
  
  if (State.currentModule === 'reading' && State.currentQuestionIndex === 0) {
    html += `<div class="passage">${part.passage}</div>`;
  }
  
  if (State.currentModule === 'listening' && State.currentQuestionIndex === 0) {
    if (part.audio) {
      html += `
        <div class="audio-player">
          <audio controls src="${part.audio}" style="width:100%"></audio>
          ${moduleData.maxReplays ? `<div style="font-size:12px; margin-top:8px; color:var(--tg-hint)">Maksimal takrorlash: ${moduleData.maxReplays}</div>` : ''}
        </div>
      `;
    } else {
      html += `<div class="audio-empty">${STRINGS.audioEmpty}</div>`;
    }
  }
  
  const key = getQuestionKey();
  const hasKey = q.answer !== null && q.answer !== undefined;
  
  html += `
    <div class="question-block">
      <div class="question-text">
        ${State.currentQuestionIndex + 1}. ${q.q}
        ${!hasKey ? `<span style="color:var(--tg-hint); font-weight:normal; font-size:13px"> (${STRINGS.noKey})</span>` : ''}
      </div>
      <ul class="options-list">
  `;
  
  q.options.forEach((opt, idx) => {
    const isSelected = State.answers[key] === idx;
    html += `
      <li class="option-label ${isSelected ? 'selected' : ''}" onclick="selectOption(${idx})">
        <input type="radio" name="q" ${isSelected ? 'checked' : ''}>
        <span>${opt}</span>
      </li>
    `;
  });
  
  html += `</ul></div>`;
  container.innerHTML = html;
  
  // Update main button text for last question
  const total = getTotalQuestions();
  if (State.currentQuestionIndex === total - 1) {
    setMainButton(STRINGS.submit);
  } else {
    setMainButton(STRINGS.next);
  }
}

window.selectOption = function(idx) {
  haptic('light');
  const key = getQuestionKey();
  State.answers[key] = idx;
  saveProgress();
  renderQuestion();
  renderNavGrid();
};

// ==========================================
// 8. SPEAKING & WRITING RENDERING
// ==========================================
function renderSpeaking() {
  const mock = State.mocks.find(m => m.id === State.currentMockId);
  const part = mock.speaking.parts[State.currentPartIndex];
  const container = document.getElementById('exam-content');
  
  container.innerHTML = `
    <div class="info-block" style="margin-bottom:16px">
      <strong>Tayyorlanish vaqti:</strong> ${part.prep} soniya<br>
      <strong>Gapirish vaqti:</strong> ${part.talk} soniya
    </div>
    <div class="passage">${part.prompt}</div>
    <div class="recorder-ui">
      <div id="speak-timer" class="timer" style="font-size:24px; margin-bottom:16px">00:00</div>
      <button id="record-btn" class="record-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>
      </button>
      <div id="record-status" style="color:var(--tg-hint); font-size:14px">Yozib olishni boshlash</div>
      <audio id="playback" controls style="width:100%; margin-top:16px" class="hidden"></audio>
    </div>
  `;
  
  setupRecorder();
}

function setupRecorder() {
  const btn = document.getElementById('record-btn');
  const status = document.getElementById('record-status');
  const playback = document.getElementById('playback');
  let isRecording = false;
  let mediaRecorder;
  let chunks = [];
  
  btn.onclick = async () => {
    haptic('medium');
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        chunks = [];
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          playback.src = url;
          playback.classList.remove('hidden');
          stream.getTracks().forEach(track => track.stop());
          status.textContent = STRINGS.play;
        };
        
        mediaRecorder.start();
        isRecording = true;
        btn.classList.add('recording');
        status.textContent = STRINGS.recording;
        
        // Simple timer for speaking
        let sec = 0;
        const maxSec = State.mocks.find(m => m.id === State.currentMockId).speaking.parts[State.currentPartIndex].talk;
        window.speakInterval = setInterval(() => {
          sec++;
          const m = Math.floor(sec / 60).toString().padStart(2, '0');
          const s = (sec % 60).toString().padStart(2, '0');
          document.getElementById('speak-timer').textContent = `${m}:${s}`;
          if (sec >= maxSec) {
            clearInterval(window.speakInterval);
            if (isRecording) btn.click(); // Auto stop
            haptic('heavy');
          }
        }, 1000);
        
      } catch (err) {
        alert(STRINGS.permissionDenied);
        console.error(err);
      }
    } else {
      mediaRecorder.stop();
      isRecording = false;
      btn.classList.remove('recording');
      clearInterval(window.speakInterval);
    }
  };
}

function renderWriting() {
  const mock = State.mocks.find(m => m.id === State.currentMockId);
  const task = mock.writing.tasks[State.currentPartIndex];
  const container = document.getElementById('exam-content');
  const savedText = Storage.load(`${State.currentMockId}-writing-text`) || '';
  
  container.innerHTML = `
    <div class="info-block" style="margin-bottom:16px">
      ${STRINGS.minWords}: ${task.minWords}
    </div>
    <div class="passage">${task.prompt}</div>
    <textarea id="writing-input" class="writing-area" placeholder="Matnni shu yerga yozing...">${savedText}</textarea>
    <div id="word-count" class="word-count">0 ${STRINGS.words}</div>
  `;
  
  const textarea = document.getElementById('writing-input');
  const countDisplay = document.getElementById('word-count');
  
  const updateCount = () => {
    const text = textarea.value.trim();
    const words = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
    countDisplay.textContent = `${words} ${STRINGS.words}`;
    
    if (words < task.minWords) {
      countDisplay.classList.add('below-min');
    } else {
      countDisplay.classList.remove('below-min');
    }
    
    Storage.save(`${State.currentMockId}-writing-text`, textarea.value);
  };
  
  textarea.addEventListener('input', updateCount);
  updateCount();
}

// ==========================================
// 9. SUBMISSION & RESULTS
// ==========================================
function submitExam() {
  stopTimer();
  haptic('heavy');
  
  if (!confirm("Imtihonni yakunlash va natijalarni ko'rishni xohlaysizmi?")) {
    if (State.mocks.find(m => m.id === State.currentMockId)[State.currentModule].time) {
      startTimer(); // Resume if cancelled
    }
    return;
  }
  
  const mock = State.mocks.find(m => m.id === State.currentMockId);
  const moduleData = mock[State.currentModule];
  
  let correct = 0;
  let totalScored = 0;
  const reviewItems = [];
  
  if (State.currentModule === 'reading' || State.currentModule === 'listening') {
    moduleData.parts.forEach((part, pIdx) => {
      part.questions.forEach((q, qIdx) => {
        const key = `${State.currentMockId}-${State.currentModule}-${pIdx}-${qIdx}`;
        const userAns = State.answers[key];
        const isNoKey = q.answer === null || q.answer === undefined;
        
        let status = 'no-key';
        if (!isNoKey) {
          totalScored++;
          if (userAns === q.answer) {
            correct++;
            status = 'correct';
          } else {
            status = 'incorrect';
          }
        }
        
        reviewItems.push({
          qNum: qIdx + 1,
          question: q.q,
          userAns: userAns !== undefined ? q.options[userAns] : 'Javob berilmagan',
          correctAns: isNoKey ? STRINGS.noKey : q.options[q.answer],
          status
        });
      });
    });
  }
  
  // Clear progress after submission
  Storage.clear(`${State.currentMockId}-${State.currentModule}-progress`);
  if (State.currentModule === 'writing') {
    Storage.clear(`${State.currentMockId}-writing-text`);
  }
  
  renderResults(correct, totalScored, reviewItems);
  showView('results-view');
  setMainButton("Yopish", true);
  
  // Override main button for results view
  TG.MainButton.onClick(() => {
    showView('mock-list-view');
    TG.BackButton.hide();
    setMainButton(STRINGS.start, false);
  });
}

function renderResults(correct, total, items) {
  const summary = document.getElementById('results-summary');
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  summary.innerHTML = `
    <h2>${STRINGS.score}</h2>
    <div class="score-display">${correct} / ${total}</div>
    <div style="color:var(--tg-hint)">${percentage}% to'g'ri javob</div>
  `;
  
  const review = document.getElementById('results-review');
  review.innerHTML = '<h3 style="margin-bottom:12px">Tahlil:</h3>';
  
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = `review-item ${item.status}`;
    div.innerHTML = `
      <div style="font-weight:600; margin-bottom:4px">${item.qNum}-savol</div>
      <div style="font-size:14px; margin-bottom:4px">${item.question}</div>
      <div style="font-size:13px; color:var(--tg-hint)">Sizning javob: ${item.userAns}</div>
      <div style="font-size:13px; color:${item.status === 'correct' ? '#27ae60' : '#e74c3c'}">
        To'g'ri javob: ${item.correctAns}
      </div>
    `;
    review.appendChild(div);
  });
}

// ==========================================
// 10. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initTelegram();
  loadData();
});