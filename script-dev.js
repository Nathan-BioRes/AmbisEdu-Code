const app=document.getElementById("app");
const KEY="akademikProfileV5";

const state={
step:0,
language:"",
educationLevel:"",
subjects:[],
otherSubject:"",
masteryLevel:75,
timeAmount:"",
timeUnit:"Hours",
theme:localStorage.getItem("akademikTheme")||"light"
};

const subjects=[
"Math","Physics","Chemistry","Biology",
"Engineering","Economics","History",
"Literature","Coding","Art & Design","Other"
];

const T={
English:{
step:"STEP",back:"Back",next:"Continue",finish:"Finish",
q2:"What is your education level?",
select:"Select status",
jh:"Junior High School (SMP)",
sh:"Senior High School (SMA/SMK)",
bach:"Bachelor's Degree (S1)",
mast:"Master's Degree (S2/S3)",
q3:"Select your favorite subjects",
other:"Specify other subject...",
q4:"Subject mastery level?",
est:"Estimated Level",
q5:"Study time dedication (per day)?",
hours:"Hours",minutes:"Minutes"
},
"Bahasa Indonesia":{
step:"LANGKAH",back:"Kembali",next:"Lanjutkan",finish:"Selesai",
q2:"Apa tingkat pendidikan Anda?",
select:"Pilih status",
jh:"Sekolah Menengah Pertama (SMP)",
sh:"Sekolah Menengah Atas (SMA/SMK)",
bach:"Sarjana (S1)",
mast:"Magister (S2/S3)",
q3:"Pilih mata pelajaran favorit Anda",
other:"Tulis pelajaran lain...",
q4:"Tingkat penguasaan materi?",
est:"Estimasi Tingkat",
q5:"Dedikasi waktu belajar (per hari)?",
hours:"Jam",minutes:"Menit"
}
};

function setTheme(){
document.documentElement.className=state.theme==="dark"?"dark":"";
}

function toggleTheme(){
state.theme=state.theme==="dark"?"light":"dark";
localStorage.setItem("akademikTheme",state.theme);
setTheme();
if(state.step===0)welcome();
else renderQuiz();
}

function saved(){
try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}
}

setTheme();
function esc(x){
return String(x).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))
}

function faq(el){
el.parentElement.classList.toggle("open");
}

function welcome(){
app.innerHTML=`
<button class="theme-toggle" onclick="toggleTheme()">${state.theme==="dark"?"☀️":"🌙"}</button>
<div class="brand">Ambis</div>
<div style="font-size:12px;color:var(--sub);font-weight:700;margin-bottom:8px">AMBISEDU</div>
<h1 style="margin:0 0 12px">Welcome to AmbisEdu</h1>
<p style="color:var(--sub);line-height:1.6;margin-bottom:22px">
Your academic companion for a more focused and organized learning journey.
</p>
<button class="btn btn-next" style="width:100%" onclick="state.step=1;renderQuiz()">Continue</button>

<div style="margin-top:30px;padding-top:20px;border-top:1px solid var(--border)">
<strong>Frequently Asked Questions</strong>

<div class="faq-item">
<button class="faq-q" onclick="faq(this)">What is AmbisEdu? <b>+</b></button>
<div class="faq-a">AmbisEdu is an academic companion designed to help you understand and organize your learning journey.</div>
</div>

<div class="faq-item">
<button class="faq-q" onclick="faq(this)">Why do I need to complete the questionnaire? <b>+</b></button>
<div class="faq-a">Your answers help AmbisEdu personalize your academic experience.</div>
</div>

<div class="faq-item">
<button class="faq-q" onclick="faq(this)">Can I change my profile later? <b>+</b></button>
<div class="faq-a">Your profile is stored locally on your device and can be updated in future versions.</div>
</div>
</div>`;
}
function render(){

    if(state.step===0){
        welcome();
        return;
    }

    if(saved()){
        window.location.href="dashboard.html";
        return;
    }

    welcome();
}
function renderQuiz(){
let t=T[state.language||"English"];
let p=state.step/5*100;
let h=`<button class="theme-toggle" onclick="toggleTheme()">${state.theme==="dark"?"☀️":"🌙"}</button>
<div class="progress-bar"><div class="progress-fill" style="width:${p}%"></div></div>
<div style="font-size:12px;color:var(--sub);font-weight:600;margin-bottom:15px">${t.step} ${state.step} OF 5</div>`;

if(state.step===1){
h+=`<h3>Choose Language / Pilih Bahasa</h3>
<button class="btn" onclick="state.language='Bahasa Indonesia';state.step=2;renderQuiz()">🇮🇩 Bahasa Indonesia</button>
<button class="btn" onclick="state.language='English';state.step=2;renderQuiz()">🇬🇧 English</button>`;
}
  else if(state.step===2){

h+=`<h3>${t.q2}</h3>

<select onchange="state.educationLevel=this.value;state.step=3;renderQuiz()">
<option value="" disabled selected>${t.select}</option>
<option value="${t.jh}">${t.jh}</option>
<option value="${t.sh}">${t.sh}</option>
<option value="${t.bach}">${t.bach}</option>
<option value="${t.mast}">${t.mast}</option>
</select>

<div style="display:flex">
<button class="btn-back" onclick="state.step=1;renderQuiz()">${t.back}</button>
</div>`;

  }
  


else if(state.step===3){

h+=`<h3>${t.q3}</h3>
<div class="grid-2">`;

subjects.forEach(s=>{

    let label=s;

    if(state.language==="Bahasa Indonesia"){
        label={
            Math:"Matematika",
            Physics:"Fisika",
            Chemistry:"Kimia",
            Biology:"Biologi",
            Engineering:"Teknik",
            Economics:"Ekonomi",
            History:"Sejarah",
            Literature:"Sastra",
            Coding:"Pemrograman",
            "Art & Design":"Seni & Desain",
            Other:"Lainnya"
        }[s]||s;
    }

    h+=`
    <button
        class="btn ${state.subjects.includes(s)?"btn-active":""}"
        onclick="pickSubject('${s}')"
    >
        ${label}
    </button>
    `;

});

h+=`</div>`;

if(state.subjects.includes("Other")){
    h+=`
    <input
        type="text"
        placeholder="${t.other}"
        value="${esc(state.otherSubject)}"
        oninput="state.otherSubject=this.value"
    >
    `;
}

h+=`
<div style="display:flex;justify-content:space-between;align-items:center">
    <button
        class="btn-back"
        onclick="state.step=2;renderQuiz()"
    >
        ${t.back}
    </button>

    <button
        class="btn btn-next"
        ${state.subjects.length?"":"disabled style='opacity:.4'"}
        onclick="state.step=4;renderQuiz()"
    >
        ${t.next}
    </button>
</div>`;

}
  
else if(state.step===4){

h+=`<h3>${t.q4}</h3>

<div class="slider-box">

    <div style="display:flex;justify-content:space-between;align-items:center;font-weight:600">

        <span>${t.est}</span>

        <div style="display:flex;align-items:center;gap:4px">

            <input
                id="masteryNum"
                type="number"
                min="10"
                max="100"
                class="num-input"
                value="${state.masteryLevel}"
            >

            <span>%</span>

        </div>

    </div>

    <input
        id="masteryRange"
        type="range"
        min="10"
        max="100"
        value="${state.masteryLevel}"
        step="any"
        style="width:100%;"
    >

</div>

<div style="display:flex;justify-content:space-between;align-items:center">

    <button
        class="btn-back"
        onclick="state.step=3;renderQuiz()"
    >
        ${t.back}
    </button>

    <button
        class="btn btn-next"
        onclick="state.step=5;renderQuiz()"
    >
        ${t.next}
    </button>

</div>`;
}
  else if(state.step===5){
h+=`<h3>${t.q5}</h3>
<div class="grid-2">
<input id="timeAmount" type="number" min="1" placeholder="0" value="${state.timeAmount}">
<select id="timeUnit">
<option value="Hours" ${state.timeUnit==="Hours"?"selected":""}>${t.hours}</option>
<option value="Minutes" ${state.timeUnit==="Minutes"?"selected":""}>${t.minutes}</option>
</select>
</div>
<div style="display:flex;justify-content:space-between;align-items:center;margin-top:25px">
<button class="btn-back" onclick="state.step=4;renderQuiz()">${t.back}</button>
<button class="btn btn-next" onclick="finishQuiz()">${t.finish}</button>
</div>`;
  }

app.innerHTML=h;

const masteryRange=document.getElementById("masteryRange");
const masteryNum=document.getElementById("masteryNum");

if(masteryRange && masteryNum){

    function roundToNearest5(value){
        return Math.round(value/5)*5;
    }

    // Slider digeser
    masteryRange.addEventListener("input",function(){

        masteryNum.value=Math.round(this.value);

    });

    // Slider selesai digeser
    masteryRange.addEventListener("change",function(){

        let roundedValue=roundToNearest5(this.value);

        if(roundedValue<10)roundedValue=10;
        if(roundedValue>100)roundedValue=100;

        this.value=roundedValue;
        masteryNum.value=roundedValue;
        state.masteryLevel=roundedValue;

    });

    // Input angka sedang diketik
    masteryNum.addEventListener("input",function(){

        if(this.value==="")return;

        let value=parseFloat(this.value);

        if(isNaN(value))return;

        if(value>100){
            value=100;
            this.value=100;
        }
        else if(value<10){
            value=10;
            this.value=10;
        }

        masteryRange.value=value;
        state.masteryLevel=value;

    });

    // Input angka selesai diketik
    masteryNum.addEventListener("blur",function(){

        if(
            masteryNum.value==="" ||
            isNaN(masteryNum.value)
        ){

            let fallback=roundToNearest5(masteryRange.value);

            if(fallback<10)fallback=10;
            if(fallback>100)fallback=100;

            masteryNum.value=fallback;
            masteryRange.value=fallback;
            state.masteryLevel=fallback;

            return;
        }

        let roundedValue=
            roundToNearest5(parseFloat(masteryNum.value));

        if(roundedValue<10)roundedValue=10;
        if(roundedValue>100)roundedValue=100;

        masteryNum.value=roundedValue;
        masteryRange.value=roundedValue;
        state.masteryLevel=roundedValue;

    });
}
}


function pickSubject(s){
if(state.subjects.includes(s)){
state.subjects=state.subjects.filter(x=>x!==s);
}else{
if(state.subjects.length>=5)return;
state.subjects.push(s);
}
renderQuiz();
}
function finishQuiz(){
let n=document.getElementById("timeAmount");
let u=document.getElementById("timeUnit");
if(!n.value||Number(n.value)<1)return;
state.timeAmount=n.value;
state.timeUnit=u.value;
localStorage.setItem(KEY,JSON.stringify({
language:state.language,
educationLevel:state.educationLevel,
subjects:state.subjects,
otherSubject:state.otherSubject,
masteryLevel:state.masteryLevel,
timeAmount:state.timeAmount,
timeUnit:state.timeUnit
}));
app.innerHTML=`<div style="text-align:center;padding:30px 10px">
<div class="brand">✓</div>
<h2>Profile Saved</h2>
<p style="color:var(--sub);line-height:1.6">Your academic profile has been saved successfully.</p>
<button class="btn btn-next" style="width:100%" onclick="state.step=0;render()">Back to Welcome</button>
</div>`;
}
render();
