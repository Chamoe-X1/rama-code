/**
 * RAMA YAFIQ — Redesigned Script
 * Navigation · Dock · Clock · Tools Filter · Modal · Tabs
 */

// ── Navigation ──
function go(id, event) {
  if (event) event.preventDefault();

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.nav === id)
  );
  document.querySelectorAll('.dock-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.section === id)
  );

  const activeTab = document.querySelector(`.dock-btn[data-section="${id}"]`);
  if (activeTab) updatePill(activeTab);

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (id === 'project' && typeof confetti === 'function') {
    confetti({ particleCount: 30, spread: 55, origin: { y: 0.88 }, colors: ['#06b6d4','#6366f1','#ec4899'] });
  }
}

// ── Dock pill ──
function updatePill(tab) {
  const pill = document.getElementById('dockPill');
  if (!pill || !tab) return;
  requestAnimationFrame(() => {
    pill.style.left  = tab.offsetLeft + 'px';
    pill.style.width = tab.offsetWidth + 'px';
  });
}

// ── Tutorial search + category filter ──
function filterVideos() {
  const q   = (document.getElementById('vidSearch')?.value || '').toLowerCase().trim();
  const cat = document.getElementById('vidCat')?.value || 'all';
  const cards = document.querySelectorAll('#vidGrid .video-card');

  let visible = 0;
  cards.forEach(card => {
    const titleData = (card.dataset.title || '').toLowerCase();
    const cardCat   = card.dataset.cat || '';
    const matchCat  = cat === 'all' || cardCat === cat;
    const matchQ    = !q || titleData.includes(q);
    const show      = matchCat && matchQ;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  const total = cards.length;
  const showEl = document.getElementById('vidShowing');
  if (showEl) showEl.innerHTML = `Menampilkan <strong>${visible}</strong> dari ${total} tutorial`;

  const emptyEl = document.getElementById('vidEmpty');
  if (emptyEl) emptyEl.style.display = visible === 0 ? 'block' : 'none';
}

// ── Tool search ──
function filterTools(q) {
  const kw = q.toLowerCase().trim();
  document.querySelectorAll('#toolsGrid .tool-card').forEach(card => {
    const hay = (card.dataset.title || '') + ' ' + card.innerText.toLowerCase();
    card.style.display = hay.includes(kw) ? 'flex' : 'none';
  });
}

// ── Modals ──
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('active'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('active'); document.body.style.overflow = ''; }
}

function handleBackdrop(e, id) {
  if (e.target.id === id) closeModal(id);
}

// ── Clock ──
function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const n = new Date();
  el.textContent = [n.getHours(), n.getMinutes(), n.getSeconds()]
    .map(v => String(v).padStart(2, '0')).join(':');
}

// ── Device ──
function detectDevice() {
  const ua = navigator.userAgent;
  let name = 'Desktop';
  if (/android/i.test(ua))          name = 'Android';
  else if (/iPad|iPhone|iPod/.test(ua)) name = 'iOS';
  else if (/Windows/i.test(ua))     name = 'Windows';
  else if (/Mac/i.test(ua))         name = 'Mac';
  else if (/Linux/i.test(ua))       name = 'Linux';
  const el = document.getElementById('deviceText');
  if (el) el.textContent = name + ' · Online';
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 1000);
  detectDevice();

  const initTab = document.querySelector('.dock-btn.active');
  if (initTab) {
    setTimeout(() => updatePill(initTab), 60);
    setTimeout(() => updatePill(initTab), 300);
  }

  const onResize = () => {
    const t = document.querySelector('.dock-btn.active');
    if (t) updatePill(t);
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', () => setTimeout(onResize, 150));
});
