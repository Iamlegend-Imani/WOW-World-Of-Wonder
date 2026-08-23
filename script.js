const darkBtn = document.getElementById('darkTheme');
const lightBtn = document.getElementById('lightTheme');
const animationBtn = document.getElementById('animationToggle');

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
