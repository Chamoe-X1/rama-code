/**
 * RAMA YAFIQ - CREATIVE SUITE CONTROLLER
 * Dynamic Navigation, Indicator Tracker, Live Clock & Modal Actions
 */

// ==================== NAVIGATION CONTROLLER ====================
function showSection(sectionId, event) {
  if (event) event.preventDefault();

  // Hide all sections
  document.querySelectorAll('.page-section').forEach((section) => {
    section.classList.remove('active');
  });

  // Activate target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Update Top Nav
  document.querySelectorAll('.nav-item-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-nav') === sectionId);
  });

  // Update Dynamic Dock
  document.querySelectorAll('.dock-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.getAttribute('data-section') === sectionId);
  });

  // Move dock indicator
  const activeDockTab = document.querySelector(`.dock-tab[data-section="${sectionId}"]`);
  if (activeDockTab) {
    updateDockIndicator(activeDockTab);
  }

  // Smooth scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Optional subtle confetti on store click
  if (sectionId === 'project' && typeof confetti === 'function') {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#06b6d4', '#6366f1', '#ec4899']
    });
  }
}

// Update floating indicator smoothly
function updateDockIndicator(activeTab) {
  const indicator = document.getElementById('dockIndicator');
  if (!indicator || !activeTab) return;

  const left = activeTab.offsetLeft;
  const width = activeTab.offsetWidth;

  indicator.style.left = `${left}px`;
  indicator.style.width = `${width}px`;
}

// ==================== TUTORIAL TAB SWITCHER ====================
function switchTutorialTab(tabKey, btnElement) {
  document.querySelectorAll('.tutorial-tab-panel').forEach((panel) => {
    panel.classList.remove('active');
  });
  document.querySelectorAll('.category-pill').forEach((pill) => {
    pill.classList.remove('active');
  });

  const targetPanel = document.getElementById('tab-' + tabKey);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }
  if (btnElement) {
    btnElement.classList.add('active');
  }
}

// ==================== TOOL SEARCH FILTER ====================
function filterTools(keyword) {
  const query = keyword.toLowerCase().trim();
  const cards = document.querySelectorAll('#toolsGrid .interactive-tool-card');

  cards.forEach((card) => {
    const titleAndTags = (card.getAttribute('data-title') || '') + ' ' + card.innerText.toLowerCase();
    if (titleAndTags.includes(query)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// ==================== MODAL SYSTEM ====================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function handleOverlayClick(event, id) {
  if (event.target.id === id) {
    closeModal(id);
  }
}

function openTiktokChoiceModal() {
  openModal('tiktokChoiceModalOverlay');
}

function openIgChoiceModal() {
  openModal('igChoiceModalOverlay');
}

function openDirectLink(url) {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

// ==================== LIVE CLOCK & DEVICE DETECTOR ====================
function updateClock() {
  const clockEl = document.getElementById('liveClockText');
  if (!clockEl) return;
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${hours}:${minutes}:${seconds}`;
}

function detectDeviceAndSystem() {
  const ua = navigator.userAgent;
  let osName = 'Desktop Engine';

  if (/android/i.test(ua)) osName = 'Android Device';
  else if (/iPad|iPhone|iPod/.test(ua)) osName = 'iOS Device';
  else if (/Windows/i.test(ua)) osName = 'Windows PC';
  else if (/Macintosh|Mac OS X/i.test(ua)) osName = 'Apple Mac';
  else if (/Linux/i.test(ua)) osName = 'Linux Server';

  const badge = document.getElementById('deviceDetectorText');
  if (badge) {
    badge.textContent = `${osName} · Operational`;
  }
}

// ==================== CURSOR TRACKER & INITIALIZER ====================
document.addEventListener('DOMContentLoaded', () => {
  // Init Clock
  updateClock();
  setInterval(updateClock, 1000);

  // Init Device Detector
  detectDeviceAndSystem();

  // Init Dock Indicator
  const initialActiveTab = document.querySelector('.dock-tab.active');
  if (initialActiveTab) {
    setTimeout(() => updateDockIndicator(initialActiveTab), 100);
  }

  // Window Resize
  window.addEventListener('resize', () => {
    const activeTab = document.querySelector('.dock-tab.active');
    if (activeTab) updateDockIndicator(activeTab);
  });

  // Interactive Cursor Light (Desktop)
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }
});