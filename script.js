// Navigasi Tab
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('show');
}

function showSection(sectionId, element) {
    document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById(sectionId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    if (element) element.classList.add('active');

    document.getElementById('navLinks').classList.remove('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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

/* ==================== AUTO-ROUTING DOWNLOADERS ==================== */

// TikTok -> SSSTik
function routeTikTok() {
    let url = document.getElementById('tiktokUrlInput').value.trim();
    if (!url) return alert('Silakan masukkan link TikTok!');
    window.open(`https://ssstik.io/id?url=${encodeURIComponent(url)}`, '_blank');
}


// YouTube -> Y2Mate (Menggunakan domain mirror anti-blokir)
function routeYouTube() {
    let url = document.getElementById('ytUrlInput').value.trim();
    if (!url) return alert('Silakan masukkan link YouTube!');
    
    // Melempar URL sebagai query pencarian ke domain mirror
    window.open(`https://www-y2mate.com/id42/?q=${encodeURIComponent(url)}`, '_blank');
}

// Instagram -> SnapInsta / FastDL
function routeIgVideo() {
    let url = document.getElementById('igUrlInput').value.trim();
    if (!url) return alert('Silakan masukkan link Instagram!');
    window.open(`https://snapinsta.to/id55?url=${encodeURIComponent(url)}`, '_blank');
}

function routeIgPhoto() {
    let url = document.getElementById('igUrlInput').value.trim();
    if (!url) return alert('Silakan masukkan link Instagram!');
    window.open(`https://fastdl.app/photo?url=${encodeURIComponent(url)}`, '_blank');
}
