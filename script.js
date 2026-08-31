// Tab Navigation
const sectionOrder = ['home', 'tools', 'tutorial', 'project'];
let currentSectionIndex = 0;

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('show');
}

function showSection(sectionId, element) {
    const newIndex = sectionOrder.indexOf(sectionId);
    const direction = newIndex > currentSectionIndex ? 'right' : 'left';
    currentSectionIndex = newIndex;

    document.querySelectorAll('section').forEach(sec => sec.classList.remove('active', 'slide-left'));
    
    const target = document.getElementById(sectionId);
    if (target) {
        if (direction === 'left') {
            target.classList.add('slide-left');
        }
        target.classList.add('active');
    }

    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('.dynamic-island-tab').forEach(tab => tab.classList.remove('active'));

    if (element) {
        element.classList.add('active');
        if (element.classList.contains('dynamic-island-tab')) {
            // Tap feedback
            element.style.transform = 'scale(0.92)';
            requestAnimationFrame(() => {
                element.style.transform = '';
            });
            updateDynamicIslandIndicator(element);
        }
    } else {
        const diTab = document.querySelector(`.dynamic-island-tab[data-section="${sectionId}"]`);
        if (diTab) {
            diTab.classList.add('active');
            updateDynamicIslandIndicator(diTab);
        }
    }

    document.getElementById('navLinks').classList.remove('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateDynamicIslandIndicator(activeTab, instant = false) {
    const indicator = document.getElementById('dynamicIslandIndicator');
    if (!indicator) return;

    const container = activeTab.parentElement;
    const tabIndex = Array.from(container.children).indexOf(activeTab);
    const tabWidth = 44;
    const gap = 2;
    const padding = 8;
    
    const targetLeft = padding + tabIndex * (tabWidth + gap);
    const targetWidth = tabWidth;

    if (instant || !indicator.dataset.initialized) {
        indicator.style.transition = 'none';
        indicator.style.left = `${targetLeft}px`;
        indicator.style.width = `${targetWidth}px`;
        indicator.dataset.initialized = 'true';
        requestAnimationFrame(() => {
            indicator.style.transition = 'left 0.45s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        return;
    }

    // FLIP Animation (Magic Move style)
    const currentLeft = parseFloat(indicator.style.left) || targetLeft;
    const currentWidth = parseFloat(indicator.style.width) || targetWidth;
    
    const deltaLeft = currentLeft - targetLeft;
    const deltaWidth = currentWidth - targetWidth;

    // First: apply inverse transform (no transition)
    indicator.style.transition = 'none';
    indicator.style.transform = `translateX(${deltaLeft}px) scaleX(${currentWidth / targetWidth})`;
    indicator.style.width = `${targetWidth}px`;
    
    // Force reflow
    indicator.offsetHeight;
    
    // Last: animate to target (with transition)
    indicator.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    indicator.style.transform = 'translateX(0) scaleX(1)';
    indicator.style.left = `${targetLeft}px`;
    
    // Clean up transform after animation
    setTimeout(() => {
        indicator.style.transform = '';
        indicator.style.transition = 'left 0.45s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    }, 450);
}

function initDynamicIsland() {
    const activeTab = document.querySelector('.dynamic-island-tab.active');
    if (activeTab) {
        updateDynamicIslandIndicator(activeTab, true); // instant on init
    }

    window.addEventListener('resize', () => {
        const activeTab = document.querySelector('.dynamic-island-tab.active');
        if (activeTab) {
            updateDynamicIslandIndicator(activeTab, true); // instant on resize
        }
    });
}

document.addEventListener('DOMContentLoaded', initDynamicIsland);

function filterTools(query) {
    const q = query.toLowerCase().trim();
    document.querySelectorAll('#toolsGrid .tool-card').forEach(card => {
        const text = (card.getAttribute('data-title') || '') + ' ' + card.innerText.toLowerCase();
        card.style.display = text.includes(q) ? 'flex' : 'none';
    });
}

// Modal Handlers
function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
}
function handleOverlayClick(e, id) {
    if (e.target.id === id) closeModal(id);
}

function openTiktokDlModal() { openModal('tiktokDlModalOverlay'); }
function openYtDlModal() { openModal('ytDlModalOverlay'); }
function openIgDlModal() { openModal('igDlModalOverlay'); }

/* ==================== TUTORIAL TABS ==================== */
function switchTutorialTab(tabId, btnElement) {
    document.querySelectorAll('.tutorial-tab-panel').forEach(panel => panel.classList.remove('active'));
    document.querySelectorAll('.tutorial-tab').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById('tab-' + tabId).classList.add('active');
    btnElement.classList.add('active');
}

/* ==================== AUTO-ROUTING DOWNLOADERS ==================== */

// TikTok -> SSSTik
function routeTikTok() {
    let url = document.getElementById('tiktokUrlInput').value.trim();
    if (!url) return alert('Please enter TikTok link!');
    window.open(`https://ssstik.io/id?url=${encodeURIComponent(url)}`, '_blank');
}


// YouTube -> Y2Mate (Using anti-block mirror domain)
function routeYouTube() {
    let url = document.getElementById('ytUrlInput').value.trim();
    if (!url) return alert('Please enter YouTube link!');
    
    // Throw URL as search query to mirror domain
    window.open(`https://www-y2mate.com/id42/?q=${encodeURIComponent(url)}`, '_blank');
}

// Instagram -> SnapInsta / FastDL
function routeIgVideo() {
    let url = document.getElementById('igUrlInput').value.trim();
    if (!url) return alert('Please enter Instagram link!');
    window.open(`https://snapinsta.to/id55?url=${encodeURIComponent(url)}`, '_blank');
}

function routeIgPhoto() {
    let url = document.getElementById('igUrlInput').value.trim();
    if (!url) return alert('Please enter Instagram link!');
    window.open(`https://fastdl.app/photo?url=${encodeURIComponent(url)}`, '_blank');
}
