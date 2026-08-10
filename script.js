const STORAGE_KEY = "akademikProfileV5";
const app = document.getElementById("app");
const state = { currentStep: 1, language: "", educationLevel: "", subjects: [], otherSubject: "", masteryLevel: 75, timeAmount: "", timeUnit: "Hours", theme: "light" };
const subjectOptions = ["Math", "Physics", "Chemistry", "Biology", "Engineering", "Economics", "History", "Literature", "Coding", "Art & Design", "Other"];

const langDict = {
  "English": {
    welcome: "Welcome Back", step: "STEP", back: "Back", next: "Continue", finish: "Finish", reset: "Start Over",
    q2: "What is your education level?", selectOpt: "Select status", jh: "Junior High School (SMP)", sh: "Senior High School (SMA/SMK)", bach: "Bachelor's Degree (S1)", mast: "Master's Degree (S2/S3)",
    q3: "Select your favorite subjects", otherPlh: "Specify other subject...", q4: "Subject mastery level?", est: "Estimated Level", q5: "Study time dedication (per day)?", unitH: "Hours", unitM: "Minutes"
  },
  "Bahasa Indonesia": {
    welcome: "Selamat Datang Kembali", step: "LANGKAH", back: "Kembali", next: "Lanjutkan", finish: "Selesai", reset: "Mulai Dari Awal",
    q2: "Apa tingkat pendidikan Anda?", selectOpt: "Pilih status", jh: "Sekolah Menengah Pertama (SMP)", sh: "Sekolah Menengah Atas (SMA/SMK)", bach: "Sarjana (S1)", mast: "Magister (S2/S3)",
    q3: "Pilih mata pelajaran favorit Anda", otherPlh: "Tulis pelajaran lain...", q4: "Tingkat penguasaan materi?", est: "Estimasi Tingkat", q5: "Dedikasi waktu belajar (per hari)?", unitH: "Jam", unitM: "Menit"
  }
};

function toggleTheme() { state.theme = state.theme === "light" ? "dark" : "light"; document.body.className = state.theme === "dark" ? "dark" : ""; render(); }
function getSavedProfile() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; } }
function render() { const p = getSavedProfile(); if (p) { renderDashboard(p); } else { renderQuestionnaire(); } }

function renderDashboard(p) {
  const d = langDict[p.language || "English"];
  let subList = [...p.subjects];
  if (subList.includes("Other") && p.otherSubject) subList = subList.map(s => s === "Other" ? p.otherSubject : s);
  const displayUnit = p.timeUnit === "Hours" ? d.unitH : d.unitM;
  app.innerHTML = `
    <button class="theme-toggle" onclick="toggleTheme()">${state.theme==='light'?'🌙':'☀️'}</button>
    <div style="text-align:center"><div class="brand">AC</div><h2 style="margin:5px 0 20px 0">${d.welcome}</h2></div>
    <div class="summary-grid">
      <div class="summary-item"><p class="summary-label">Language</p><p class="summary-val">${p.language}</p></div>
      <div class="summary-item"><p class="summary-label">Education</p><p class="summary-val">${p.educationLevel}</p></div>
      <div class="summary-item" style="grid-column: span 2"><p class="summary-label">Subjects</p><p class="summary-val">${subList.join(', ')}</p></div>
      <div class="summary-item"><p class="summary-label">Mastery</p><p class="summary-val">${p.masteryLevel}%</p></div>
      <div class="summary-item"><p class="summary-label">Time</p><p class="summary-val">${p.timeAmount} ${displayUnit}</p></div>
    </div>
    <button id="resetProfile" class="btn btn-next" style="background:#ef4444;margin-top:25px;width:100%">${d.reset}</button>
  `;
  document.getElementById("resetProfile").onclick = () => { localStorage.removeItem(STORAGE_KEY); Object.assign(state, { currentStep: 1, language: "", educationLevel: "", subjects: [], otherSubject: "", masteryLevel: 75, timeAmount: "", timeUnit: "Hours" }); render(); };
}

function renderQuestionnaire() {
  const pct = (state.currentStep / 5) * 100;
  const t = langDict[state.language || "English"] || langDict["English"];
  let html = `<button class="theme-toggle" onclick="toggleTheme()">${state.theme==='light'?'🌙':'☀️'}</button>
    <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    <div style="font-size:12px;color:var(--sub);margin-bottom:15px;font-weight:600">${t.step} ${state.currentStep} OF 5</div>`;
  
  if (state.currentStep === 1) {
    html += `<h3>Choose Language / Pilih Bahasa</h3>
      <button class="btn ${state.language==='Bahasa Indonesia'?'btn-active':''}" onclick="state.language='Bahasa Indonesia';state.currentStep++;render()">🇮🇩 Bahasa Indonesia</button>
      <button class="btn ${state.language==='English'?'btn-active':''}" onclick="state.language='English';state.currentStep++;render()">🇬🇧 English</button>`;
  } else if (state.currentStep === 2) {
    html += `<h3>${t.q2}</h3>
      <select id="eduSelect" onchange="state.educationLevel=this.value;state.currentStep++;render()">
        <option value="" disabled ${!state.educationLevel?'selected':''}>${t.selectOpt}</option>
        <option value="${t.jh}" ${state.educationLevel===t.jh?'selected':''}>${t.jh}</option>
        <option value="${t.sh}" ${state.educationLevel===t.sh?'selected':''}>${t.sh}</option>
        <option value="${t.bach}" ${state.educationLevel===t.bach?'selected':''}>${t.bach}</option>
        <option value="${t.mast}" ${state.educationLevel===t.mast?'selected':''}>${t.mast}</option>
      </select>
      <div style="display:flex"><button class="btn-back" onclick="state.currentStep--;render()">${t.back}</button></div>`;
} else if (state.currentStep === 3) {
    html += `<h3>${t.q3}</h3><div class="grid-2">`;
    subjectOptions.forEach(sub => {
      html += `<button class="btn ${state.subjects.includes(sub)?'btn-active':''}" onclick="toggleSubject('${sub}')">${sub}</button>`;
    });
    html += `</div>`;
    if (state.subjects.includes("Other")) {
      html += `<input id="otherInput" type="text" placeholder="${t.otherPlh}" value="${state.otherSubject}" oninput="state.otherSubject=this.value">`;
    }
    html += `<div style="display:flex;justify-content:space-between;align-items:center"><button class="btn-back" onclick="state.currentStep--;render()">${t.back}</button><button class="btn btn-next" ${state.subjects.length===0?'disabled style="opacity:0.4"':''} onclick="state.currentStep++;render()">${t.next}</button></div>`;
  } else if (state.currentStep === 4) {
    html += `<h3>${t.q4}</h3><div class="slider-box"><div style="display:flex;justify-content:space-between;align-items:center;font-weight:600"><span>${t.est}</span><div style="display:flex;align-items:center;gap:4px"><input type="number" min="10" max="100" id="numBox" class="num-input" value="${state.masteryLevel}" oninput="syncMastery(this.value, 'slider')">%</div></div><input type="range" min="10" max="100" id="slideBar" value="${state.masteryLevel}" oninput="syncMastery(this.value, 'box')"></div><div style="display:flex;justify-content:space-between;align-items:center"><button class="btn-back" onclick="state.currentStep--;render()">${t.back}</button><button class="btn btn-next" onclick="state.currentStep++;render()">${t.next}</button></div>`;
  } else if (state.currentStep === 5) {
    html += `<h3>${t.q5}</h3>
      <div class="grid-2">
        <input id="timeAmountInput" type="number" min="1" placeholder="0" value="${state.timeAmount}" oninput="updateTimeAmount(this.value)">
        <select id="timeUnitSelect" onchange="updateTimeUnit(this.value)">
          <option value="Hours" ${state.timeUnit==='Hours'?'selected':''}>${t.unitH}</option>
          <option value="Minutes" ${state.timeUnit==='Minutes'?'selected':''}>${t.unitM}</option>
        </select>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center"><button class="btn-back" onclick="state.currentStep--;render()">${t.back}</button><button id="subBtn" class="btn btn-next" ${!state.timeAmount.toString().trim()?'disabled style="opacity:0.4"':''} 
onclick="localStorage.setItem(STORAGE_KEY, JSON.stringify(state));window.location.href='dashboard.html'>${t.finish}</button></div>`;
  }
  app.innerHTML = html;
}

function syncMastery(val, target) {
  let num = parseInt(val) || 10; if (num > 100) num = 100; state.masteryLevel = num;
  if (target === 'slider') document.getElementById('slideBar').value = num;
  if (target === 'box') document.getElementById('numBox').value = num;
}

function updateTimeAmount(val) {
  state.timeAmount = val;
  const btn = document.getElementById('subBtn');
  if (btn) btn.disabled = !val.trim();
}

function updateTimeUnit(val) { state.timeUnit = val; }

function toggleSubject(sub) {
  if (state.subjects.includes(sub)) { state.subjects = state.subjects.filter(s => s !== sub); } 
  else { state.subjects.push(sub); }
  renderQuestionnaire();
}

render();
