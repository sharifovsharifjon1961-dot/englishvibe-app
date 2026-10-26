/**
 * CEFR Mock Exam Telegram Mini App
 * Production-ready, vanilla JS, zero external dependencies.
 */

// ==========================================================================
// 1. EMBEDDED MOCK DATA (8 Exams: B1, B2, C1)
// ==========================================================================
const MOCK_DATA = {
  mocks: [
    {
      id: "b1-01", level: "B1", title: "B1 Preliminary Mock Exam 1",
      pdf: "https://drive.google.com/file/d/1B1M0CK1/view",
      modules: {
        reading: { time: 30, passage: "The city of Bristol is known for its vibrant culture and historic docks. Every year, thousands of tourists visit the SS Great Britain, a famous ship designed by Isambard Kingdom Brunel. The city also hosts an international balloon festival in August, filling the sky with colorful shapes. Local businesses thrive on this tourism, offering guided tours and traditional food.", questions: [{ id: "b1-01-r1", text: "What is Bristol famous for?", options: ["Its modern skyscrapers", "Its historic docks and SS Great Britain", "Its mountain ranges", "Its desert landscapes"], correctIndex: 1 }, { id: "b1-01-r2", text: "When does the balloon festival take place?", options: ["In January", "In August", "In December", "In May"], correctIndex: 1 }] },
        listening: { time: 20, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", questions: [{ id: "b1-01-l1", text: "What is the main topic of the audio?", options: ["A cooking recipe", "A travel announcement", "A weather forecast", "A sports match"], correctIndex: 1 }] },
        speaking: { time: 10, prompts: ["Describe your favorite way to spend a weekend.", "Talk about a book or movie you recently enjoyed."] },
        writing: { time: 30, tasks: [{ prompt: "Write an email to a friend inviting them to your birthday party. Include the time, place, and what to bring.", minWords: 100 }] }
      }
    },
    {
      id: "b1-02", level: "B1", title: "B1 Preliminary Mock Exam 2",
      pdf: "https://drive.google.com/file/d/1B1M0CK2/view",
      modules: {
        reading: { time: 30, passage: "Eating a balanced diet is essential for maintaining good health. Nutritionists recommend consuming a variety of fruits, vegetables, whole grains, and lean proteins. Processed foods, which are often high in sugar and salt, should be limited. Drinking plenty of water and engaging in regular physical activity are also key components of a healthy lifestyle.", questions: [{ id: "b1-02-r1", text: "What do nutritionists recommend?", options: ["Eating only processed foods", "Consuming a variety of whole foods", "Avoiding all physical activity", "Drinking sugary beverages"], correctIndex: 1 }] },
        listening: { time: 20, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", questions: [{ id: "b1-02-l1", text: "Where is this announcement taking place?", options: ["At a train station", "In a library", "At a hospital", "In a school"], correctIndex: 1 }] },
        speaking: { time: 10, prompts: ["Describe a hobby you have.", "Talk about your best friend."] },
        writing: { time: 30, tasks: [{ prompt: "Write a letter of complaint to a hotel manager about a problem you had during your stay.", minWords: 100 }] }
      }
    },
    {
      id: "b2-01", level: "B2", title: "B2 First Mock Exam 1",
      pdf: "https://drive.google.com/file/d/1B2M0CK1/view",
      modules: {
        reading: { time: 60, passage: "The Impact of Remote Work on Urban Development\n\nIn recent years, the shift towards remote work has fundamentally altered the landscape of urban development. City centres, once bustling with commuters, have experienced a noticeable decline in daytime foot traffic. This phenomenon has prompted urban planners to reconsider the traditional zoning laws that separate residential, commercial, and industrial areas.\n\nProponents of mixed-use development argue that integrating residential spaces with offices and retail can create more vibrant, resilient communities.", questions: [{ id: "b2-01-r1", text: "What is the main idea of the passage?", options: ["Remote work has completely destroyed city centres.", "Urban planners are ignoring the effects of remote work.", "Remote work is prompting a reevaluation of urban development and zoning.", "Mixed-use development is universally rejected by critics."], correctIndex: 2 }, { id: "b2-01-r2", text: "What is a challenge of transitioning to mixed-use development?", options: ["It increases daytime foot traffic too much.", "Commercial property owners face financial losses.", "It requires destroying architectural heritage.", "Local businesses are thriving too quickly."], correctIndex: 1 }] },
        listening: { time: 40, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", questions: [{ id: "b2-01-l1", text: "What is the professor's main argument?", options: ["Sleep is irrelevant to cognitive function.", "Adequate sleep is essential for memory consolidation.", "Students should study all night before exams.", "Dreams have no psychological significance."], correctIndex: 1 }] },
        speaking: { time: 15, prompts: ["Describe a time when you had to adapt to a significant change in your life or work.", "Do you think technology has made people more isolated or more connected?"] },
        writing: { time: 60, tasks: [{ prompt: "Write an essay discussing the advantages and disadvantages of remote work for both employees and employers. Give your own opinion.", minWords: 150 }] }
      }
    },
    {
      id: "b2-02", level: "B2", title: "B2 First Mock Exam 2",
      pdf: "https://drive.google.com/file/d/1B2M0CK2/view",
      modules: {
        reading: { time: 60, passage: "The Psychology of Habit Formation\n\nHabits are the invisible architecture of daily life. Researchers suggest that up to 40 percent of the actions people perform each day are not actual decisions, but habits. The habit loop, a concept popularized by Charles Duhigg, consists of three components: a cue, a routine, and a reward.", questions: [{ id: "b2-02-r1", text: "What percentage of daily actions are estimated to be habits?", options: ["20 percent", "40 percent", "60 percent", "80 percent"], correctIndex: 1 }] },
        listening: { time: 40, audioUrl: "", questions: [{ id: "b2-02-l1", text: "What is the main topic?", options: ["History", "Science", "Art", "Music"], correctIndex: null }] },
        speaking: { time: 15, prompts: ["Talk about a book or film that has significantly influenced your perspective on life."] },
        writing: { time: 60, tasks: [{ prompt: "Write a report for a college tutor describing a recent educational trip.", minWords: 150 }] }
      }
    },
    {
      id: "b2-03", level: "B2", title: "B2 First Mock Exam 3",
      pdf: "https://drive.google.com/file/d/1B2M0CK3/view",
      modules: {
        reading: { time: 60, passage: "Renewable energy sources, such as solar and wind power, are becoming increasingly cost-competitive with fossil fuels. This transition is driven by technological advancements and government incentives aimed at reducing carbon emissions. However, the intermittency of these sources remains a significant challenge for grid stability.", questions: [{ id: "b2-03-r1", text: "What is a challenge mentioned in the text?", options: ["High costs", "Intermittency", "Lack of sunlight", "Government bans"], correctIndex: 1 }] },
        listening: { time: 40, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", questions: [{ id: "b2-03-l1", text: "What is the speaker's tone?", options: ["Optimistic", "Pessimistic", "Neutral", "Angry"], correctIndex: 0 }] },
        speaking: { time: 15, prompts: ["Discuss the environmental impact of fast fashion."] },
        writing: { time: 60, tasks: [{ prompt: "Write an article for a magazine about the benefits of learning a second language.", minWords: 150 }] }
      }
    },
    {
      id: "c1-01", level: "C1", title: "C1 Advanced Mock Exam 1",
      pdf: "https://drive.google.com/file/d/1C1M0CK1/view",
      modules: {
        reading: { time: 90, passage: "The proliferation of artificial intelligence in creative industries has sparked a contentious debate regarding the nature of authorship and originality. While algorithms can now generate prose, poetry, and visual art with startling proficiency, critics argue that these outputs lack the intrinsic human experience and emotional resonance that define true artistry.", questions: [{ id: "c1-01-r1", text: "What is the critics' main argument against AI art?", options: ["It is too expensive", "It lacks intrinsic human experience and emotional resonance", "It is illegal", "It is too slow"], correctIndex: 1 }] },
        listening: { time: 40, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", questions: [{ id: "c1-01-l1", text: "What is the lecture primarily about?", options: ["Quantum physics", "Linguistic relativity", "Macroeconomics", "Botany"], correctIndex: 1 }] },
        speaking: { time: 15, prompts: ["Evaluate the extent to which globalization has eroded cultural identity."] },
        writing: { time: 90, tasks: [{ prompt: "Write a proposal for a local council outlining a plan to improve community mental health services.", minWords: 220 }] }
      }
    },
    {
      id: "c1-02", level: "C1", title: "C1 Advanced Mock Exam 2",
      pdf: "https://drive.google.com/file/d/1C1M0CK2/view",
      modules: {
        reading: { time: 90, passage: "Historical revisionism, while a legitimate scholarly endeavor when grounded in new evidence, can sometimes veer into the realm of denialism when motivated by ideological agendas. The distinction lies in the rigorous adherence to the scientific method and the willingness to subject hypotheses to peer review.", questions: [{ id: "c1-02-r1", text: "What distinguishes legitimate revisionism from denialism?", options: ["The length of the text", "Rigorous adherence to the scientific method", "The author's fame", "The publisher's location"], correctIndex: 1 }] },
        listening: { time: 40, audioUrl: "", questions: [{ id: "c1-02-l1", text: "What conclusion does the speaker draw?", options: ["A", "B", "C", "D"], correctIndex: 2 }] },
        speaking: { time: 15, prompts: ["Discuss the ethical implications of genetic engineering in humans."] },
        writing: { time: 90, tasks: [{ prompt: "Write a review of a recent exhibition or performance, assessing its artistic merit and cultural significance.", minWords: 220 }] }
      }
    },
    {
      id: "c1-03", level: "C1", title: "C1 Advanced Mock Exam 3",
      pdf: "https://drive.google.com/file/d/1C1M0CK3/view",
      modules: {
        reading: { time: 90, passage: "The concept of universal basic income (UBI) has transitioned from a fringe economic theory to a mainstream policy proposal. Proponents argue it provides a safety net in an era of automation, while detractors warn of inflationary pressures and the potential erosion of the work ethic.", questions: [{ id: "c1-03-r1", text: "What is a detractor's concern about UBI?", options: ["It is too complex", "Inflationary pressures and erosion of work ethic", "It favors the rich", "It is unconstitutional"], correctIndex: 1 }] },
        listening: { time: 40, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", questions: [{ id: "c1-03-l1", text: "What is the speaker's stance?", options: ["Strongly against", "Cautiously supportive", "Completely indifferent", "Highly enthusiastic"], correctIndex: 1 }] },
        speaking: { time: 15, prompts: ["Analyze the role of social media in shaping modern political discourse."] },
        writing: { time: 90, tasks: [{ prompt: "Write an essay evaluating the effectiveness of international climate agreements.", minWords: 220 }] }
      }
    }
  ]
};

// ==========================================================================
// 2. STATE & STORAGE MANAGEMENT
// ==========================================================================
const State = {
  currentMockId: null,
  currentModule: null,
  currentQuestionIndex: 0,
  answers: {},
  flags: {},
  timerInterval: null,
  timeRemaining: 0,
  mediaRecorder: null,
  audioChunks: []
};

const Storage = {
  save(key, data) {
    try { localStorage.setItem(`cef_${key}`, JSON.stringify(data)); } catch (e) {}
  },
  load(key) {
    try {
      const data = localStorage.getItem(`cef_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (e) { return null; }
  },
  clear(key) {
    try { localStorage.removeItem(`cef_${key}`); } catch (e) {}
  }
};

// ==========================================================================
// 3. TELEGRAM INTEGRATION
// ==========================================================================
const TG = window.Telegram.WebApp;

function initTelegram() {
  if (TG) {
    TG.ready();
    TG.expand();
    TG.BackButton.onClick(() => navigateBack());
    TG.MainButton.onClick(() => handleMainButton());
  }
}

function setMainButton(text, isVisible = true, isActive = true) {
  if (!TG) return;
  if (isVisible) {
    TG.MainButton.setText(text);
    TG.MainButton.show();
    isActive ? TG.MainButton.enable() : TG.MainButton.disable();
  } else {
    TG.MainButton.hide();
  }
}

function haptic(type = 'light') {
  if (TG && TG.HapticFeedback) TG.HapticFeedback.impactOccurred(type);
}

// ==========================================================================
// 4. NAVIGATION & VIEW MANAGEMENT
// ==========================================================================
function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  window.scrollTo(0, 0);
  
  if (viewId === 'mock-list-view') {
    if (TG) TG.BackButton.hide();
    setMainButton("Boshlash", false);
  }
}

function navigateBack() {
  haptic('light');
  const currentView = document.querySelector('.view.active').id;
  
  if (currentView === 'exam-view') {
    if (confirm("Imtihondan chiqishni xohlaysizmi? Jarayon saqlanib qoladi.")) {
      stopTimer();
      showView('module-view');
      if (TG) TG.BackButton.show();
    }
  } else if (currentView === 'module-view' || currentView === 'results-view') {
    stopTimer();
    showView('mock-list-view');
  }
}

function handleMainButton() {
  haptic('medium');
  const currentView = document.querySelector('.view.active').id;
  
  if (currentView === 'module-view') {
    startModule(State.currentModule);
  } else if (currentView === 'exam-view') {
    const total = getTotalQuestions();
    if (State.currentQuestionIndex < total - 1) {
      State.currentQuestionIndex++;
      renderQuestion();
      updateNavGrid();
    } else {
      submitExam();
    }
  } else if (currentView === 'results-view') {
    showView('mock-list-view');
    if (TG) TG.BackButton.hide();
  }
}

// ==========================================================================
// 5. CORE LOGIC & RENDERING
// ==========================================================================
function renderMockList(filterLevel) {
  const container = document.getElementById('mocks-container');
  container.innerHTML = '';
  
  const filtered = filterLevel === 'ALL' 
    ? MOCK_DATA.mocks 
    : MOCK_DATA.mocks.filter(m => m.level === filterLevel);
    
  filtered.forEach(mock => {
    const card = document.createElement('div');
    card.className = 'mock-card';
    card.innerHTML = `<h3>${mock.title}</h3><div class="meta">Daraja: ${mock.level} • ID: ${mock.id.toUpperCase()}</div>`;
    card.onclick = () => { haptic('light'); openMock(mock.id); };
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
  const mock = MOCK_DATA.mocks.find(m => m.id === mockId);
  
  document.getElementById('header-title').textContent = mock.title;
  
  const pdfBtn = document.getElementById('pdf-btn');
  if (mock.pdf && !mock.pdf.includes('YOUR_LINK')) {
    pdfBtn.classList.remove('hidden');
    pdfBtn.onclick = () => {
      haptic('light');
      if (TG && TG.openLink) {
        TG.openLink(mock.pdf);
      } else {
        window.open(mock.pdf, '_blank');
      }
    };
  } else {
    pdfBtn.classList.add('hidden');
  }

  document.getElementById('module-header-info').innerHTML = `<strong>${mock.title}</strong><br>Daraja: ${mock.level}`;
  
  const grid = document.getElementById('modules-grid');
  grid.innerHTML = '';
  
  const modules = [
    { key: 'reading', name: 'Reading (O\'qish)', data: mock.modules.reading },
    { key: 'listening', name: 'Listening (Tinglash)', data: mock.modules.listening },
    { key: 'speaking', name: 'Speaking (Gapirish)', data: mock.modules.speaking },
    { key: 'writing', name: 'Writing (Yozish)', data: mock.modules.writing }
  ];
  
  modules.forEach(mod => {
    if (mod.data) {
      const saved = Storage.load(`${mockId}-${mod.key}-progress`);
      const status = saved ? "Davom etish" : "Boshlash";
      
      const card = document.createElement('div');
      card.className = 'module-card';
      card.innerHTML = `<h4>${mod.name}</h4><div class="status">${mod.data.time ? `${mod.data.time} daqiqa` : 'Vaqt yo\'q'}</div><div class="status" style="margin-top:8px; color: var(--color-accent); font-weight:600">${status}</div>`;
      card.onclick = () => {
        haptic('light');
        State.currentModule = mod.key;
        showView('module-view');
        if (TG) TG.BackButton.show();
        setMainButton(status === "Boshlash" ? "Boshlash" : "Davom etish");
      };
      grid.appendChild(card);
    }
  });
  
  showView('module-view');
}

function getTotalQuestions() {
  const mock = MOCK_DATA.mocks.find(m => m.id === State.currentMockId);
  const moduleData = mock.modules[State.currentModule];
  if (State.currentModule === 'reading' || State.currentModule === 'listening') {
    return moduleData.questions.length;
  }
  if (State.currentModule === 'speaking') return moduleData.prompts.length;
  if (State.currentModule === 'writing') return moduleData.tasks.length;
  return 0;
}

function getQuestionKey() {
  return `${State.currentMockId}-${State.currentModule}-${State.currentQuestionIndex}`;
}

function startModule(moduleKey) {
  State.currentQuestionIndex = 0;
  const mock = MOCK_DATA.mocks.find(m => m.id === State.currentMockId);
  const moduleData = mock.modules[moduleKey];
  
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
    document.getElementById('timer-display').textContent = "Vaqt yo'q";
  }
  
  showView('exam-view');
  if (TG) TG.BackButton.show();
  
  if (moduleKey === 'reading' || moduleKey === 'listening') {
    renderNavGrid();
    renderQuestion();
    setMainButton("Keyingi");
  } else if (moduleKey === 'speaking') {
    renderSpeaking();
    setMainButton("Yakunlash");
  } else if (moduleKey === 'writing') {
    renderWriting();
    setMainButton("Topshirish");
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
  if (State.timeRemaining < 300) el.classList.add('warning');
  else el.classList.remove('warning');
}

function saveProgress() {
  Storage.save(`${State.currentMockId}-${State.currentModule}-progress`, {
    answers: State.answers,
    flags: State.flags,
    timeRemaining: State.timeRemaining
  });
}

// ==========================================================================
// 6. EXAM INTERFACE RENDERING
// ==========================================================================
function renderNavGrid() {
  const container = document.getElementById('question-navigator');
  container.innerHTML = '';
  const total = getTotalQuestions();
  const mock = MOCK_DATA.mocks.find(m => m.id === State.currentMockId);
  const qList = mock.modules[State.currentModule].questions;
  
  for (let i = 0; i < total; i++) {
    const btn = document.createElement('button');
    btn.className = 'q-nav-btn';
    btn.textContent = i + 1;
    btn.dataset.index = i;
    
    const key = `${State.currentMockId}-${State.currentModule}-${i}`;
    if (State.answers[key] !== undefined) btn.classList.add('answered');
    if (State.flags[key]) btn.classList.add('flagged');
    if (qList[i].correctIndex === null) btn.classList.add('no-key');
    
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
  const key = getQuestionKey();
  const flagBtn = document.getElementById('flag-toggle-btn');
  State.flags[key] ? flagBtn.classList.add('flagged') : flagBtn.classList.remove('flagged');
}

document.getElementById('flag-toggle-btn').addEventListener('click', () => {
  haptic('light');
  const key = getQuestionKey();
  State.flags[key] = !State.flags[key];
  saveProgress();
  updateNavGrid();
});

function renderQuestion() {
  const mock = MOCK_DATA.mocks.find(m => m.id === State.currentMockId);
  const moduleData = mock.modules[State.currentModule];
  const q = moduleData.questions[State.currentQuestionIndex];
  const container = document.getElementById('exam-content');
  
  let html = '';
  if (State.currentModule === 'reading' && State.currentQuestionIndex === 0) {
    html += `<div class="passage">${moduleData.passage}</div>`;
  }
  if (State.currentModule === 'listening' && State.currentQuestionIndex === 0) {
    if (moduleData.audioUrl) {
      html += `<div class="audio-container"><audio controls src="${moduleData.audioUrl}" style="width:100%"></audio></div>`;
    } else {
      html += `<div class="audio-container"><div class="audio-empty">Audio fayl mavjud emas</div></div>`;
    }
  }
  
  const key = getQuestionKey();
  const hasKey = q.correctIndex !== null && q.correctIndex !== undefined;
  
  html += `<div class="question-block">
    <div class="question-text">${State.currentQuestionIndex + 1}. ${q.text} ${!hasKey ? '<span style="color:var(--color-text-secondary); font-weight:normal; font-size:13px"> (Kalit yo\'q)</span>' : ''}</div>
    <ul class="options-list">`;
  
  q.options.forEach((opt, idx) => {
    const isSelected = State.answers[key] === idx;
    html += `<li class="option-label ${isSelected ? 'selected' : ''}" onclick="selectOption(${idx})">
      <input type="radio" name="q" ${isSelected ? 'checked' : ''}>
      <span>${opt}</span>
    </li>`;
  });
  html += `</ul></div>`;
  container.innerHTML = html;
  
  const total = getTotalQuestions();
  setMainButton(State.currentQuestionIndex === total - 1 ? "Topshirish" : "Keyingi");
}

window.selectOption = function(idx) {
  haptic('light');
  const key = getQuestionKey();
  State.answers[key] = idx;
  saveProgress();
  renderQuestion();
  renderNavGrid();
};

// ==========================================================================
// 7. SPEAKING & WRITING MODULES
// ==========================================================================
function renderSpeaking() {
  const mock = MOCK_DATA.mocks.find(m => m.id === State.currentMockId);
  const prompt = mock.modules.speaking.prompts[State.currentQuestionIndex];
  const container = document.getElementById('exam-content');
  
  container.innerHTML = `
    <div class="passage" style="margin-bottom:16px">${prompt}</div>
    <div class="recorder-ui">
      <div id="speak-timer" class="record-timer">00:00</div>
      <button id="record-btn" class="record-btn" aria-label="Yozib olishni boshlash">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>
      </button>
      <div id="record-status" class="record-status">Yozib olishni boshlash</div>
      <audio id="playback" controls class="playback-audio hidden"></audio>
    </div>`;
  
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
        mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          playback.src = URL.createObjectURL(blob);
          playback.classList.remove('hidden');
          stream.getTracks().forEach(track => track.stop());
          status.textContent = "Eshitib ko'rish";
        };
        mediaRecorder.start();
        isRecording = true;
        btn.classList.add('recording');
        status.textContent = "Yozib olinmoqda...";
        
        let sec = 0;
        window.speakInterval = setInterval(() => {
          sec++;
          document.getElementById('speak-timer').textContent = `${Math.floor(sec/60).toString().padStart(2,'0')}:${(sec%60).toString().padStart(2,'0')}`;
        }, 1000);
      } catch (err) {
        alert("Mikrofon ruxsati rad etildi");
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
  const mock = MOCK_DATA.mocks.find(m => m.id === State.currentMockId);
  const task = mock.modules.writing.tasks[State.currentQuestionIndex];
  const container = document.getElementById('exam-content');
  const savedText = Storage.load(`${State.currentMockId}-writing-text`) || '';
  
  container.innerHTML = `
    <div class="passage" style="margin-bottom:16px">${task.prompt}</div>
    <div style="font-size:13px; color:var(--color-text-secondary); margin-bottom:8px">Minimal so'zlar soni: ${task.minWords}</div>
    <textarea id="writing-input" class="writing-area" placeholder="Matnni shu yerga yozing...">${savedText}</textarea>
    <div id="word-count" class="word-count">0 so'z</div>`;
  
  const textarea = document.getElementById('writing-input');
  const countDisplay = document.getElementById('word-count');
  
  const updateCount = () => {
    const text = textarea.value.trim();
    const words = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
    countDisplay.textContent = `${words} so'z`;
    words < task.minWords ? countDisplay.classList.add('below-min') : countDisplay.classList.remove('below-min');
    Storage.save(`${State.currentMockId}-writing-text`, textarea.value);
  };
  
  textarea.addEventListener('input', updateCount);
  updateCount();
}

// ==========================================================================
// 8. SUBMISSION & RESULTS
// ==========================================================================
function submitExam() {
  stopTimer();
  haptic('heavy');
  if (!confirm("Imtihonni yakunlash va natijalarni ko'rishni xohlaysizmi?")) {
    const mock = MOCK_DATA.mocks.find(m => m.id === State.currentMockId);
    if (mock.modules[State.currentModule].time) startTimer();
    return;
  }
  
  const mock = MOCK_DATA.mocks.find(m => m.id === State.currentMockId);
  const qList = mock.modules[State.currentModule].questions;
  let correct = 0, totalScored = 0;
  const reviewItems = [];
  
  qList.forEach((q, idx) => {
    const key = `${State.currentMockId}-${State.currentModule}-${idx}`;
    const userAns = State.answers[key];
    const isNoKey = q.correctIndex === null || q.correctIndex === undefined;
    
    let status = 'no-key';
    if (!isNoKey) {
      totalScored++;
      if (userAns === q.correctIndex) { correct++; status = 'correct'; }
      else { status = 'incorrect'; }
    }
    
    reviewItems.push({
      qNum: idx + 1, question: q.text,
      userAns: userAns !== undefined ? q.options[userAns] : 'Javob berilmagan',
      correctAns: isNoKey ? "Kalit yo'q" : q.options[q.correctIndex], status
    });
  });
  
  Storage.clear(`${State.currentMockId}-${State.currentModule}-progress`);
  if (State.currentModule === 'writing') Storage.clear(`${State.currentMockId}-writing-text`);
  
  document.getElementById('score-value').textContent = `${correct} / ${totalScored}`;
  document.getElementById('score-percentage').textContent = totalScored > 0 ? `${Math.round((correct / totalScored) * 100)}% to'g'ri javob` : "Baholanmaydi";
  
  const reviewContainer = document.getElementById('results-review');
  reviewContainer.innerHTML = '';
  reviewItems.forEach(item => {
    const div = document.createElement('div');
    div.className = `review-item ${item.status}`;
    div.innerHTML = `
      <div class="review-q-num">${item.qNum}-savol</div>
      <div class="review-question">${item.question}</div>
      <div class="review-answer user"><span class="review-label">Sizning javob:</span> ${item.userAns}</div>
      <div class="review-answer ${item.status === 'correct' ? 'correct-ans' : (item.status === 'no-key' ? 'no-key-ans' : 'correct-ans')}">
        <span class="review-label">To'g'ri javob:</span> ${item.correctAns}
      </div>`;
    reviewContainer.appendChild(div);
  });
  
  showView('results-view');
  setMainButton("Yopish", true);
}

// ==========================================================================
// 9. INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTelegram();
  renderMockList('ALL');
});
