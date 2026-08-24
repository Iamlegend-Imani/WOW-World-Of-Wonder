const darkBtn = document.getElementById('darkTheme');
const lightBtn = document.getElementById('lightTheme');
const animationBtn = document.getElementById('animationToggle');

// Make the full curriculum visible from every WOW page without rewriting each page header.
const mainNav = document.querySelector('.topbar nav');
if(mainNav && !mainNav.querySelector('a[href="curriculum.html"]')){
  const link = document.createElement('a');
  link.href = 'curriculum.html';
  link.textContent = 'Curriculum';
  const worldsLink = mainNav.querySelector('a[href="worlds.html"]');
  mainNav.insertBefore(link, worldsLink || null);
}

// Load the curriculum-specific presentation only where it is needed.
if(document.querySelector('.curriculum-shell, .curriculum-preview')){
  const extraStyles = document.createElement('link');
  extraStyles.rel = 'stylesheet';
  extraStyles.href = 'curriculum.css?v=1';
  document.head.appendChild(extraStyles);
}

function setTheme(theme){
  const light = theme === 'light';
  document.body.classList.toggle('light-theme', light);
  document.documentElement.style.colorScheme = light ? 'light' : 'dark';
  if(darkBtn) darkBtn.setAttribute('aria-pressed', String(!light));
  if(lightBtn) lightBtn.setAttribute('aria-pressed', String(light));
  localStorage.setItem('wowTheme', theme);
}

setTheme(localStorage.getItem('wowTheme') || 'dark');
if(darkBtn) darkBtn.addEventListener('click',()=>setTheme('dark'));
if(lightBtn) lightBtn.addEventListener('click',()=>setTheme('light'));

function setAnimations(on){
  document.body.classList.toggle('reduce-motion', !on);
  if(animationBtn){
    animationBtn.textContent = on ? 'Animations: On' : 'Animations: Off';
    animationBtn.setAttribute('aria-pressed', String(on));
  }
  localStorage.setItem('wowAnimations', String(on));
}

const savedAnimations = localStorage.getItem('wowAnimations');
const defaultAnimations = savedAnimations === null ? !window.matchMedia('(prefers-reduced-motion: reduce)').matches : savedAnimations === 'true';
setAnimations(defaultAnimations);
if(animationBtn) animationBtn.addEventListener('click',()=>setAnimations(document.body.classList.contains('reduce-motion')));

const wonders = [
  'What is something you have noticed lately that you do not understand yet?',
  'What can your body notice before your mind has words for it?',
  'What is one thing in nature that humans could learn from?',
  'Can two people see the same thing and experience it differently?',
  'What everyday object would you redesign if nobody told you how it had to look?',
  'How do you know when something deserves to be trusted?',
  'What is one question you think no machine could answer for you?',
  'What do you wish existed that does not exist yet?'
];

const prompt = document.getElementById('wonderPrompt');
const newWonder = document.getElementById('newWonder');
if(prompt && newWonder){
  let index = 0;
  newWonder.addEventListener('click',()=>{
    index = (index + 1) % wonders.length;
    prompt.textContent = wonders[index];
  });
}

const modal = document.getElementById('wonderModal');
const modalText = document.getElementById('wonderText');
const closeWonder = document.getElementById('closeWonder');

document.querySelectorAll('.wonder-chip').forEach(btn=>{
  btn.addEventListener('click',()=>{
    if(!modal || !modalText) return;
    modalText.textContent = btn.dataset.wonder || 'What are you wondering?';
    modal.hidden = false;
    if(closeWonder) closeWonder.focus();
  });
});

function closeModal(){ if(modal) modal.hidden = true; }
if(closeWonder) closeWonder.addEventListener('click', closeModal);
if(modal) modal.addEventListener('click',e=>{ if(e.target === modal) closeModal(); });
document.addEventListener('keydown',e=>{ if(e.key === 'Escape' && modal && !modal.hidden) closeModal(); });

// Eight-adventure journey progress.
const missions = Array.from(document.querySelectorAll('.mission'));
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

function getDiscoveries(){
  try { return JSON.parse(localStorage.getItem('wowDiscoveries') || '[]'); }
  catch { return []; }
}
function saveDiscoveries(ids){ localStorage.setItem('wowDiscoveries', JSON.stringify(ids)); }
function updateProgress(){
  const discovered = getDiscoveries();
  missions.forEach(mission=>{
    const id = mission.dataset.mission;
    const isDone = discovered.includes(id);
    mission.classList.toggle('discovered', isDone);
    const button = mission.querySelector('.discover-btn');
    if(button){
      button.setAttribute('aria-pressed', String(isDone));
      button.textContent = isDone ? 'Discovered ✓' : 'Mark discovered';
    }
  });
  if(progressFill) progressFill.style.width = `${missions.length ? (discovered.length / missions.length) * 100 : 0}%`;
  if(progressText) progressText.textContent = `${discovered.length} of ${missions.length} adventures discovered`;
}

missions.forEach(mission=>{
  const toggle = mission.querySelector('.mission-toggle');
  const discover = mission.querySelector('.discover-btn');
  if(toggle){
    toggle.addEventListener('click',()=>{
      const open = mission.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close adventure' : 'Open adventure';
    });
  }
  if(discover){
    discover.addEventListener('click',()=>{
      const id = mission.dataset.mission;
      const ids = getDiscoveries();
      const next = ids.includes(id) ? ids.filter(x=>x!==id) : [...ids,id];
      saveDiscoveries(next);
      updateProgress();
    });
  }
});
updateProgress();

// Full 24-week curriculum: one calm expandable lesson at a time.
document.querySelectorAll('.week').forEach(week=>{
  const head = week.querySelector('.week-head');
  if(!head) return;
  head.addEventListener('click',()=>{
    const open = week.classList.toggle('open');
    head.setAttribute('aria-expanded', String(open));
  });
});
