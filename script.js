// ==================== DEVICE DETECTION & ADAPTIVE ENGINE ====================
function detectDevice() {
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    const platform = navigator.platform || '';
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    
    let os = 'other';
    let deviceType = 'desktop';
    let brandName = 'Desktop PC';
    let iconClass = 'fas fa-desktop';

    // Detect OS
    if (/android/i.test(ua)) {
        os = 'android';
        brandName = 'Android';
        iconClass = 'fab fa-android';
    } else if (/iPad|iPhone|iPod/.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
        os = 'ios';
        if (/iPad/.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
            brandName = 'iPad';
            iconClass = 'fas fa-tablet-screen-button';
        } else {
            brandName = 'iPhone';
            iconClass = 'fab fa-apple';
        }
    } else if (/Windows/i.test(ua)) {
        os = 'windows';
        brandName = 'Windows PC';
        iconClass = 'fab fa-windows';
    } else if (/Macintosh|Mac OS X/i.test(ua)) {
        os = 'macos';
        brandName = 'Mac';
        iconClass = 'fab fa-apple';
    } else if (/Linux/i.test(ua)) {
        os = 'linux';
        brandName = 'Linux';
        iconClass = 'fab fa-linux';
    }

    // Detect Device Type
    const isMobileUA = /Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTabletUA = /iPad|Tablet|(Android(?!.*Mobile))/i.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isTabletUA || (isTouch && width >= 600 && width <= 1024)) {
        deviceType = 'tablet';
    } else if (isMobileUA || (isTouch && width < 768) || width <= 600) {
        deviceType = 'mobile';
    } else {
        deviceType = 'desktop';
    }

    const orientation = width > height ? 'landscape' : 'portrait';

    // Apply attributes and classes to HTML and Body
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    htmlEl.setAttribute('data-device', deviceType);
    htmlEl.setAttribute('data-os', os);
    htmlEl.setAttribute('data-orientation', orientation);
    htmlEl.setAttribute('data-touch', isTouch ? 'true' : 'false');

    bodyEl.classList.remove('device-desktop', 'device-mobile', 'device-tablet');
    bodyEl.classList.add(`device-${deviceType}`);
    
    bodyEl.classList.remove('os-windows', 'os-android', 'os-ios', 'os-macos', 'os-linux', 'os-other');
    bodyEl.classList.add(`os-${os}`);

    if (isTouch) {
        bodyEl.classList.add('touch-device');
    } else {
        bodyEl.classList.remove('touch-device');
    }

    // Update real viewport height for mobile browsers
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);

    // Update device status badge in footer
    const badgeText = document.getElementById('deviceStatusText');
    const badgeIcon = document.getElementById('deviceIcon');
    if (badgeText && badgeIcon) {
        const typeLabel = deviceType === 'desktop' ? 'Desktop' : (deviceType === 'mobile' ? 'Mobile' : 'Tablet');
        badgeText.textContent = `${brandName} (${typeLabel} · ${width}×${height})`;
        badgeIcon.className = iconClass;
    }

    return { deviceType, os, orientation, isTouch, width, height };
}

let resizeTimeout;
function handleResizeAdaptive() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        detectDevice();
        const activeTab = document.querySelector('.dynamic-island-tab.active');
        if (activeTab) {
            updateDynamicIslandIndicator(activeTab, true);
        }
    }, 100);
}

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

    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateDynamicIslandIndicator(activeTab, instant = false) {
    const indicator = document.getElementById('dynamicIslandIndicator');
    if (!indicator || !activeTab) return;

    // Use exact DOM measurements to prevent any gepeng or offset on any device
    const targetLeft = activeTab.offsetLeft;
    const targetWidth = activeTab.offsetWidth;

    if (instant || !indicator.dataset.initialized) {
        indicator.style.transition = 'none';
        indicator.style.left = `${targetLeft}px`;
        indicator.style.width = `${targetWidth}px`;
        indicator.dataset.initialized = 'true';
        requestAnimationFrame(() => {
            indicator.style.transition = 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        return;
    }

    // FLIP Animation (Magic Move style)
    const currentLeft = parseFloat(indicator.style.left) || targetLeft;
    const currentWidth = parseFloat(indicator.style.width) || targetWidth;
    
    const deltaLeft = currentLeft - targetLeft;
    const deltaWidth = currentWidth - targetWidth;

    indicator.style.transition = 'none';
    indicator.style.transform = `translateX(${deltaLeft}px) scaleX(${currentWidth / targetWidth})`;
    indicator.style.width = `${targetWidth}px`;
    
    // Force reflow
    indicator.offsetHeight;
    
    indicator.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    indicator.style.transform = 'translateX(0) scaleX(1)';
    indicator.style.left = `${targetLeft}px`;
    
    setTimeout(() => {
        indicator.style.transform = '';
        indicator.style.transition = 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    }, 400);
}

function initDynamicIsland() {
    detectDevice();
    const activeTab = document.querySelector('.dynamic-island-tab.active');
    if (activeTab) {
        updateDynamicIslandIndicator(activeTab, true);
    }

    window.addEventListener('resize', handleResizeAdaptive);
    window.addEventListener('orientationchange', handleResizeAdaptive);
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
    
    const panel = document.getElementById('tab-' + tabId);
    if (panel) panel.classList.add('active');
    if (btnElement) btnElement.classList.add('active');
}

/* ==================== AUTO-ROUTING DOWNLOADERS ==================== */

// TikTok -> SSSTik
function routeTikTok() {
    let url = document.getElementById('tiktokUrlInput').value.trim();
    if (!url) return alert('Please enter TikTok link!');
    window.open(`https://ssstik.io/id?url=${encodeURIComponent(url)}`, '_blank');
}

// YouTube -> Y2Mate
function routeYouTube() {
    let url = document.getElementById('ytUrlInput').value.trim();
    if (!url) return alert('Please enter YouTube link!');
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
