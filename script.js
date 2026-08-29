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

function openHqModal() { openModal('hqModalOverlay'); }
function openUpscalerModal() { openModal('upscalerModalOverlay'); }
function openBgModal() { openModal('bgModalOverlay'); }
function openTiktokDlModal() { openModal('tiktokDlModalOverlay'); }
function openYtDlModal() { openModal('ytDlModalOverlay'); }
function openIgDlModal() { openModal('igDlModalOverlay'); }

/* ==================== 1. TIKTOK HQ CONVERTER ENGINE ==================== */
let currentHqMethod = 'wmv';
let currentCompress = '1080P'; // Default Resolusi
let currentFps = '60';         // Default FPS
let selectedHqFile = null;

// Fungsi untuk mengganti resolusi lewat tombol di UI
function setHqResolution(res, btnElement) {
    currentCompress = res;
    // Hapus class active dari semua tombol di dalam baris yang sama
    const btns = btnElement.parentElement.querySelectorAll('.seg-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    // Tambahkan class active ke tombol yang diklik
    btnElement.classList.add('active');
}

function handleHqFileSelect(file) {
    if (!file) return;
    selectedHqFile = file;
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    document.getElementById('hqFileName').textContent = `${file.name} (${sizeMB} MB)`;
    document.getElementById('hqDropzone').style.display = 'none';
    document.getElementById('hqFileSelectedBox').style.display = 'flex';
    document.getElementById('hqProcessBtn').classList.add('ready');
}

function removeHqFile() {
    selectedHqFile = null;
    document.getElementById('hqFileInput').value = '';
    document.getElementById('hqDropzone').style.display = 'block';
    document.getElementById('hqFileSelectedBox').style.display = 'none';
    document.getElementById('hqProcessBtn').classList.remove('ready');
}

async function startHqProcessing() {
    if (!selectedHqFile) return;
    
    const processBtn = document.getElementById('hqProcessBtn');
    const processingView = document.getElementById('hqProcessingView');
    const progressFill = document.getElementById('hqProgressFill');
    
    processBtn.style.display = 'none';
    processingView.style.display = 'block';
    progressFill.style.width = '30%';

    // Memasukkan Video, Resolusi, dan FPS ke Form Data
    const formData = new FormData();
    formData.append('video', selectedHqFile);
    formData.append('resolution', currentCompress);
    formData.append('fps', currentFps);

    try {
        // Otomatis mendeteksi IP PC kamu tempat Live Server berjalan
        const serverIp = window.location.hostname;
        const backendUrl = `https://rama.ngrok-free.dev`;

        // Mengirim video ke Backend
        const response = await fetch(backendUrl, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Pastikan file .exe TikTok HQ Engine sudah dibuka!');

        progressFill.style.width = '80%';
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        
        progressFill.style.width = '100%';
        await new Promise(r => setTimeout(r, 500));

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `[${currentCompress}]_HQ_${selectedHqFile.name}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        
    } catch (error) {
        alert('Proses Gagal: ' + error.message);
    } finally {
        processingView.style.display = 'none';
        removeHqFile();
        processBtn.style.display = 'flex';
        progressFill.style.width = '0%';
    }
}

/* ==================== 2. LOCAL AI ENHANCER (CANVAS PROCESSING) ==================== */
let upscaleFile = null;
let upscaleOriginalImg = null;
let upscaleFactor = 2;
let upscaledCanvas = document.createElement('canvas');

function selectUpscaleFactor(factor) {
    upscaleFactor = factor;
    document.getElementById('btnScale2x').classList.toggle('active', factor === 2);
    document.getElementById('btnScale4x').classList.toggle('active', factor === 4);
}

function handleUpscaleFileSelect(file) {
    if (!file) return;
    upscaleFile = file;
    document.getElementById('upscaleFileName').textContent = file.name;
    document.getElementById('upscaleDropzone').style.display = 'none';
    document.getElementById('upscaleFileSelectedBox').style.display = 'flex';
    document.getElementById('upscaleProcessBtn').classList.add('ready');

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => { upscaleOriginalImg = img; };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function removeUpscaleFile() {
    upscaleFile = null; upscaleOriginalImg = null;
    document.getElementById('upscaleDropzone').style.display = 'block';
    document.getElementById('upscaleFileSelectedBox').style.display = 'none';
    document.getElementById('upscalePreviewArea').style.display = 'none';
    document.getElementById('upscaleProcessBtn').classList.remove('ready');
    document.getElementById('upscaleProcessBtn').style.display = 'flex';
}

function startUpscaleProcessing() {
    if (!upscaleOriginalImg) return;
    const btn = document.getElementById('upscaleProcessBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Neural Computations (Local)...';
    
    // Memberi waktu UI render
    setTimeout(() => {
        const targetW = upscaleOriginalImg.width * upscaleFactor;
        const targetH = upscaleOriginalImg.height * upscaleFactor;

        upscaledCanvas.width = targetW;
        upscaledCanvas.height = targetH;
        const ctx = upscaledCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(upscaleOriginalImg, 0, 0, targetW, targetH);

        // Algoritma Penajaman Piksel (Local AI Simulation)
        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;
        const copyData = new Uint8ClampedArray(data);
        const mix = 0.45; // Sharpen Intensity
        const w = targetW;

        for (let i = 0; i < data.length; i += 4) {
            // Hindari pinggiran
            if (i < w*4 || i > data.length - w*4 || i%(w*4) === 0 || i%(w*4) === (w-1)*4) continue;
            for (let c = 0; c < 3; c++) {
                let center = copyData[i + c];
                let top = copyData[i - (w*4) + c];
                let bottom = copyData[i + (w*4) + c];
                let left = copyData[i - 4 + c];
                let right = copyData[i + 4 + c];
                
                let edge = (center * 4) - (top + bottom + left + right);
                data[i + c] = Math.min(255, Math.max(0, center + (edge * mix)));
            }
        }
        ctx.putImageData(imgData, 0, 0);

        // Render Split Preview
        document.getElementById('upscaleImgBefore').src = upscaleOriginalImg.src;
        document.getElementById('upscaleImgAfter').src = upscaledCanvas.toDataURL('image/png');
        setupSplitSlider('upscaleSplitContainer', 'upscaleAfterWrap', 'upscaleSplitHandle');

        document.getElementById('upscalePreviewArea').style.display = 'block';
        btn.style.display = 'none';
        btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> <span>Enhance to Ultra HD</span>';
    }, 500);
}

function downloadUpscaledImage() {
    if (!upscaledCanvas) return;
    const a = document.createElement('a');
    a.download = `AI_Upscaled_${upscaleFactor}X_${upscaleFile.name}`;
    a.href = upscaledCanvas.toDataURL('image/png');
    a.click();
}

/* ==================== 3. SPLIT SLIDER ENGINE ==================== */
function setupSplitSlider(containerId, wrapId, handleId) {
    const container = document.getElementById(containerId);
    const wrap = document.getElementById(wrapId);
    const handle = document.getElementById(handleId);
    let isDragging = false;

    function moveSlider(clientX) {
        const rect = container.getBoundingClientRect();
        let x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        wrap.style.width = percent + '%';
        handle.style.left = percent + '%';
    }

    handle.onmousedown = () => isDragging = true;
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => { if (isDragging) moveSlider(e.clientX); });
    container.addEventListener('click', (e) => moveSlider(e.clientX));

    handle.ontouchstart = () => isDragging = true;
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => { if (isDragging && e.touches[0]) moveSlider(e.touches[0].clientX); });
}

/* ==================== 4. AUTO-ROUTING DOWNLOADERS ==================== */

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