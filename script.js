// ==========================================
// DOM ELEMENTS SELECTION
// ==========================================
const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');
const themeToggle = document.getElementById('themeToggle');

// Sidebar (Left) - Source, Dimensions & Text
const ratioSelect = document.getElementById('ratioSelect');
const customSizeWrapper = document.getElementById('customSizeWrapper');
const customUnit = document.getElementById('customUnit');
const customW = document.getElementById('customW');
const customH = document.getElementById('customH');
const addBorderToggle = document.getElementById('addBorderToggle');
const borderWidthInp = document.getElementById('borderWidth');
const showGuideToggle = document.getElementById('showGuideToggle'); 
const showGridToggle = document.getElementById('showGridToggle'); 
const safeZoneToggle = document.getElementById('safeZoneToggle'); 
const addTextToggle = document.getElementById('addTextToggle');
const photoName = document.getElementById('photoName');
const photoDate = document.getElementById('photoDate');
const addWatermarkToggle = document.getElementById('addWatermarkToggle'); 
const watermarkText = document.getElementById('watermarkText');
const paperSize = document.getElementById('paperSize');
const printCropMarks = document.getElementById('printCropMarks');
const targetKB = document.getElementById('targetKB');
const imgFormat = document.getElementById('imgFormat');
const liveEstSize = document.getElementById('liveEstSize'); 
const resolutionSlider = document.getElementById('resolutionSlider'); 
const resVal = document.getElementById('resVal');

// Sidebar (Right) - Sliders & Actions
const rightSidebar = document.getElementById('rightSidebar');
const bgColor = document.getElementById('bgColor');
const brightnessInp = document.getElementById('brightness');
const contrastInp = document.getElementById('contrast');
const saturationInp = document.getElementById('saturation');
const rotationInp = document.getElementById('rotation');
const cornerRadiusInp = document.getElementById('cornerRadius'); 
const flipHBtn = document.getElementById('flipHBtn');
const flipVBtn = document.getElementById('flipVBtn');

const tempInp = document.getElementById('temperature');
const hueInp = document.getElementById('hue');
const grayInp = document.getElementById('grayscale');
const blurInp = document.getElementById('blur');
const sepiaInp = document.getElementById('sepia');
const vignetteInp = document.getElementById('vignette'); 
const studioGlowInp = document.getElementById('studioGlow'); 

const removeBGBtn = document.getElementById('removeBGBtn');
const aiEnhanceBtn = document.getElementById('aiEnhanceBtn');
const resetFiltersBtn = document.getElementById('resetFilters');
const downloadBtn = document.getElementById('downloadBtn');

// Modal Elements
const printModal = document.getElementById('printModal');
const openPrintModalBtn = document.getElementById('openPrintModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const previewCanvas = document.getElementById('previewCanvas');
const pCtx = previewCanvas.getContext('2d');
const btnMinus = document.getElementById('btnMinus');
const btnPlus = document.getElementById('btnPlus');
const previewCountText = document.getElementById('previewCountText');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');

// ==========================================
// STATE VARIABLES
// ==========================================
let loadedImg = null;
let targetW = 413;
let targetH = 531; 
let scale = 1;
let imgX = 0;
let imgY = 0;
let rotation = 0;
let flipH = 1;
let flipV = 1; 
let printPhotoCount = 8;
let isExporting = false; 
let estSizeTimeout;
let currentUpscale = 1; 

// Drag, Resize & Touch State
let isDragging = false;
let isResizing = false;
let resizeHandle = '';
let startX = 0;
let startY = 0;
let originalScale = 1;
const handleSize = 12;
let initialPinchDist = null;
let initialPinchScale = 1;

// Polyfill for roundRect (purane browsers ke liye)
if (!ctx.roundRect) {
    ctx.roundRect = function(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2; 
        if (h < 2 * r) r = h / 2;
        this.beginPath(); 
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r); 
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r); 
        this.arcTo(x, y, x + w, y, r);
        this.closePath(); 
        return this;
    }
}

// ==========================================
// 1. TOAST NOTIFICATION LOGIC
// ==========================================
function showToast(msg, icon = 'check-circle') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-${icon}"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ==========================================
// 2. SESSION PERSISTENCE (Auto-Save)
// ==========================================
function saveSession() {
    const settings = {
        brightness: brightnessInp.value,
        contrast: contrastInp.value,
        glow: studioGlowInp.value,
        name: photoName.value,
        date: photoDate.value,
        bgColor: bgColor.value,
        saturation: saturationInp.value,
        temp: tempInp.value,
        upscale: resolutionSlider.value
    };
    localStorage.setItem('pixelPass_session', JSON.stringify(settings));
}

function loadSession() {
    const saved = localStorage.getItem('pixelPass_session');
    if (!saved) return;
    try {
        const s = JSON.parse(saved);
        brightnessInp.value = s.brightness || 100; 
        contrastInp.value = s.contrast || 100;
        studioGlowInp.value = s.glow || 0; 
        photoName.value = s.name || ''; 
        photoDate.value = s.date || '';
        bgColor.value = s.bgColor || '#ffffff'; 
        saturationInp.value = s.saturation || 100; 
        tempInp.value = s.temp || 0;
        
        if(s.upscale) {
            resolutionSlider.value = s.upscale; 
            currentUpscale = parseInt(s.upscale);
            let labels = {1: "1x (Std)", 2: "2x (HD)", 3: "3x (FHD)", 4: "4x (4K)"};
            resVal.innerText = labels[currentUpscale] || "1x (Std)";
        }
    } catch(e) {}
}

window.onload = () => {
    loadSession(); 
    updateDimensions(); 
    showToast("Welcome to PixelPass By Ujjwal", "crown"); 
    renderEngine();
};

themeToggle.onclick = () => {
    const isDark = document.body.dataset.theme === 'dark';
    document.body.dataset.theme = isDark ? 'light' : 'dark';
    themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
};

// ==========================================
// 3. 4K RESOLUTION SLIDER LOGIC
// ==========================================
resolutionSlider.addEventListener('input', (e) => {
    let newUpscale = parseInt(e.target.value);
    if (newUpscale === currentUpscale) return;
    
    let ratio = newUpscale / currentUpscale;
    currentUpscale = newUpscale;
    
    targetW = Math.round(targetW * ratio); 
    targetH = Math.round(targetH * ratio);
    imgX *= ratio; 
    imgY *= ratio; 
    scale *= ratio;
    
    let labels = {1: "1x (Std)", 2: "2x (HD)", 3: "3x (FHD)", 4: "4x (4K)"};
    resVal.innerText = labels[newUpscale];
    
    renderEngine(); 
    saveSession();
});

// ==========================================
// PRESETS LOGIC
// ==========================================
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.onclick = () => {
        if (!loadedImg) return showToast("Please upload a photo first!", "exclamation-triangle");
        const type = btn.dataset.preset;
        if (type === 'official') {
            brightnessInp.value = 105; 
            contrastInp.value = 115; 
            studioGlowInp.value = 10; 
            tempInp.value = 0; 
            saturationInp.value = 100;
        } else if (type === 'vibrant') {
            brightnessInp.value = 110; 
            contrastInp.value = 110; 
            studioGlowInp.value = 25; 
            tempInp.value = 10; 
            saturationInp.value = 120;
        }
        showToast(`Preset: ${type.toUpperCase()} Applied`); 
        renderEngine(); 
        saveSession();
    };
});

// KEYBOARD SHORTCUTS
window.addEventListener('keydown', (e) => {
    if (!loadedImg || document.activeElement.tagName === 'INPUT') return;
    const moveStep = 5 * currentUpscale;
    
    if (e.key === 'ArrowUp') { imgY -= moveStep; e.preventDefault(); }
    if (e.key === 'ArrowDown') { imgY += moveStep; e.preventDefault(); }
    if (e.key === 'ArrowLeft') { imgX -= moveStep; e.preventDefault(); }
    if (e.key === 'ArrowRight') { imgX += moveStep; e.preventDefault(); }
    
    if (e.key.toLowerCase() === 's' && !e.ctrlKey) document.getElementById('downloadBtn').click();
    if (e.key.toLowerCase() === 'r') document.getElementById('resetFilters').click();
    renderEngine();
});

// ==========================================
// DIMENSIONS UPDATE
// ==========================================
function updateDimensions() {
    let baseW, baseH;
    if (ratioSelect.value === 'custom') {
        customSizeWrapper.style.display = 'block';
        let valW = parseFloat(customW.value) || 400; 
        let valH = parseFloat(customH.value) || 400; 
        let unit = customUnit.value;
        
        if (unit === 'inch') { 
            baseW = Math.round(valW * 300); 
            baseH = Math.round(valH * 300); 
        } else if (unit === 'cm') { 
            baseW = Math.round((valW * 300) / 2.54); 
            baseH = Math.round((valH * 300) / 2.54); 
        } else { 
            baseW = valW; 
            baseH = valH; 
        }
    } else {
        customSizeWrapper.style.display = 'none';
        let [w, h] = ratioSelect.value.split('x'); 
        baseW = parseInt(w); 
        baseH = parseInt(h);
    }
    
    let newTargetW = baseW * currentUpscale; 
    let newTargetH = baseH * currentUpscale;
    
    if (loadedImg && targetW > 0) {
        let ratioW = newTargetW / targetW; 
        let ratioH = newTargetH / targetH;
        imgX *= ratioW; 
        imgY *= ratioH; 
        scale *= ratioW;
    }
    
    targetW = newTargetW; 
    targetH = newTargetH;
    
    if (!loadedImg) resetLayout(); 
    else renderEngine();
}

// Event Listeners for Updates
ratioSelect.addEventListener('change', updateDimensions); 
customW.addEventListener('input', updateDimensions); 
customH.addEventListener('input', updateDimensions); 
customUnit.addEventListener('change', updateDimensions);

addTextToggle.addEventListener('change', (e) => { 
    document.getElementById('textInputsWrapper').style.display = e.target.checked ? 'flex' : 'none'; 
    renderEngine(); 
});
addWatermarkToggle.addEventListener('change', (e) => { 
    document.getElementById('watermarkInputsWrapper').style.display = e.target.checked ? 'flex' : 'none'; 
    renderEngine(); 
});

showGuideToggle.addEventListener('change', renderEngine); 
showGridToggle.addEventListener('change', renderEngine); 
safeZoneToggle.addEventListener('change', renderEngine); 
printCropMarks.addEventListener('change', () => { 
    if(printModal.style.display === 'flex') renderPrintPreview(); 
});

const inputsToWatch = [photoName, photoDate, watermarkText, addBorderToggle, borderWidthInp, bgColor, brightnessInp, contrastInp, saturationInp, hueInp, grayInp, blurInp, sepiaInp, tempInp, vignetteInp, cornerRadiusInp, studioGlowInp];
inputsToWatch.forEach(el => el.addEventListener('input', () => { 
    renderEngine(); 
    saveSession(); 
}));

rotationInp.addEventListener('input', (e) => { 
    rotation = parseInt(e.target.value); 
    renderEngine(); 
}); 

flipHBtn.onclick = () => { flipH *= -1; renderEngine(); }; 
flipVBtn.onclick = () => { flipV *= -1; renderEngine(); };

// ==========================================
// UPLOAD LOGIC
// ==========================================
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0]; 
    if(!file) return;
    
    rightSidebar.classList.remove('disabled-panel'); 
    document.getElementById('fileName').innerText = file.name;
    
    const reader = new FileReader();
    reader.onload = (event) => { 
        loadedImg = new Image(); 
        loadedImg.onload = resetLayout; 
        loadedImg.src = event.target.result; 
        showToast("Photo Uploaded!"); 
    };
    reader.readAsDataURL(file);
});

function resetLayout() {
    if(!loadedImg) return;
    scale = Math.max(targetW / loadedImg.width, targetH / loadedImg.height);
    imgX = (targetW - loadedImg.width * scale) / 2; 
    imgY = (targetH - loadedImg.height * scale) / 2;
    renderEngine();
}

// ==========================================
// MASTER RENDER ENGINE
// ==========================================
function renderEngine() {
    canvas.width = targetW; 
    canvas.height = targetH;
    ctx.imageSmoothingEnabled = true; 
    ctx.imageSmoothingQuality = 'high';

    // GUARANTEED CANVAS CLEAR AND BACKGROUND FILL
    ctx.clearRect(0, 0, targetW, targetH);
    
    let cornerRad = (parseInt(cornerRadiusInp.value) || 0) * currentUpscale;
    
    ctx.save(); 
    if (cornerRad > 0) { 
        ctx.beginPath(); 
        ctx.roundRect(0, 0, targetW, targetH, cornerRad); 
        ctx.clip(); 
    }

    // Fill Background Color (Ensures it resets to white/transparent if local storage was corrupted)
    ctx.filter = 'none'; 
    ctx.fillStyle = bgColor.value || '#ffffff'; 
    ctx.fillRect(0, 0, targetW, targetH);

    if(loadedImg) {
        let dynBlur = (parseFloat(blurInp.value) || 0) * currentUpscale;
        
        ctx.filter = `brightness(${brightnessInp.value}%) contrast(${contrastInp.value}%) saturate(${saturationInp.value}%) hue-rotate(${hueInp.value}deg) grayscale(${grayInp.value}%) blur(${dynBlur}px) sepia(${sepiaInp.value}%)`;
        
        ctx.save();
        let cx = imgX + (loadedImg.width * scale) / 2; 
        let cy = imgY + (loadedImg.height * scale) / 2;
        
        ctx.translate(cx, cy); 
        ctx.rotate(rotation * Math.PI / 180); 
        ctx.scale(flipH, flipV);
        ctx.drawImage(loadedImg, -(loadedImg.width * scale) / 2, -(loadedImg.height * scale) / 2, loadedImg.width * scale, loadedImg.height * scale);
        
        // Studio Glow
        let glowVal = parseInt(studioGlowInp.value);
        if (glowVal > 0) {
            ctx.globalCompositeOperation = 'screen'; 
            ctx.globalAlpha = glowVal / 100; 
            ctx.filter = `blur(${10*currentUpscale}px)`;
            ctx.drawImage(loadedImg, -(loadedImg.width * scale) / 2, -(loadedImg.height * scale) / 2, loadedImg.width * scale, loadedImg.height * scale);
        }
        ctx.restore();

        // Temperature
        let tempVal = parseInt(tempInp.value);
        if (tempVal !== 0) {
            ctx.save(); 
            ctx.globalCompositeOperation = 'overlay'; 
            ctx.fillStyle = tempVal > 0 ? `rgba(255, 140, 0, ${tempVal/200})` : `rgba(0, 130, 255, ${-tempVal/200})`;
            ctx.fillRect(0, 0, targetW, targetH); 
            ctx.restore();
        }

        // Vignette
        let vigVal = parseInt(vignetteInp.value);
        if (vigVal > 0) {
            ctx.save(); 
            ctx.globalCompositeOperation = 'multiply'; 
            let radius = Math.max(targetW, targetH) * 0.8;
            let gradient = ctx.createRadialGradient(targetW/2, targetH/2, radius*0.3, targetW/2, targetH/2, radius);
            gradient.addColorStop(0, 'rgba(0,0,0,0)'); 
            gradient.addColorStop(1, `rgba(0,0,0,${vigVal/100})`);
            ctx.fillStyle = gradient; 
            ctx.fillRect(0, 0, targetW, targetH); 
            ctx.restore();
        }

        // Watermark
        if (addWatermarkToggle.checked) {
            ctx.save(); 
            ctx.translate(targetW/2, targetH/2); 
            ctx.rotate(-30 * Math.PI / 180);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'; 
            ctx.font = `bold ${targetW * 0.08}px Arial`; 
            ctx.textAlign = 'center'; 
            ctx.textBaseline = 'middle';
            let wText = watermarkText.value || "SBU WATERMARK";
            for(let i = -3; i <= 3; i++) { 
                for(let j = -3; j <= 3; j++) { 
                    ctx.fillText(wText, i * targetW * 0.5, j * targetH * 0.25); 
                } 
            }
            ctx.restore();
        }

        // Name & Date Text
        if (addTextToggle.checked) {
            ctx.filter = 'none'; 
            let stripH = targetH * 0.15;
            ctx.fillStyle = '#ffffff'; 
            ctx.fillRect(0, targetH - stripH, targetW, stripH);
            ctx.fillStyle = '#000000'; 
            ctx.textAlign = 'center'; 
            ctx.textBaseline = 'middle';
            ctx.font = `bold ${stripH * 0.35}px Arial`; 
            ctx.fillText(photoName.value || "Name", targetW / 2, targetH - stripH * 0.65);
            ctx.font = `600 ${stripH * 0.25}px Arial`; 
            ctx.fillText(photoDate.value || "DD/MM/YYYY", targetW / 2, targetH - stripH * 0.25);
        }

        // Guides & Overlays (Hidden during export)
        if (!isExporting) {
            if (showGuideToggle.checked) {
                ctx.save(); 
                ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)'; 
                ctx.lineWidth = 2 * currentUpscale; 
                ctx.setLineDash([6 * currentUpscale, 6 * currentUpscale]);
                
                ctx.beginPath(); 
                ctx.ellipse(targetW/2, targetH * 0.45, targetW * 0.35, targetH * 0.32, 0, 0, Math.PI*2); 
                ctx.stroke();
                
                ctx.beginPath(); ctx.moveTo(targetW * 0.1, targetH * 0.4); ctx.lineTo(targetW * 0.9, targetH * 0.4); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(targetW/2, targetH * 0.05); ctx.lineTo(targetW/2, targetH * 0.85); ctx.stroke();
                
                ctx.fillStyle = 'rgba(16, 185, 129, 0.9)'; 
                ctx.font = `bold ${targetW * 0.04}px Arial`; 
                ctx.textAlign = 'center'; 
                ctx.fillText("EYE LEVEL", targetW/2, targetH * 0.38); 
                ctx.restore();
            }

            if (showGridToggle.checked) {
                ctx.save(); 
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'; 
                ctx.lineWidth = 1 * currentUpscale; 
                ctx.setLineDash([4 * currentUpscale, 4 * currentUpscale]);
                
                ctx.beginPath(); ctx.moveTo(targetW * 0.33, 0); ctx.lineTo(targetW * 0.33, targetH); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(targetW * 0.66, 0); ctx.lineTo(targetW * 0.66, targetH); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, targetH * 0.33); ctx.lineTo(targetW, targetH * 0.33); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, targetH * 0.66); ctx.lineTo(targetW, targetH * 0.66); ctx.stroke(); 
                ctx.restore();
            }

            if (safeZoneToggle.checked) {
                ctx.save(); 
                let bleed = Math.min(targetW, targetH) * 0.05; 
                ctx.strokeStyle = 'rgba(225, 29, 72, 0.9)'; 
                ctx.lineWidth = 3 * currentUpscale; 
                ctx.setLineDash([8 * currentUpscale, 8 * currentUpscale]);
                
                ctx.strokeRect(bleed, bleed, targetW - (bleed*2), targetH - (bleed*2));
                
                ctx.fillStyle = 'rgba(225, 29, 72, 0.9)'; 
                ctx.font = `bold ${targetW * 0.035}px Arial`; 
                ctx.textAlign = 'center'; 
                ctx.fillText("PRINT SAFE ZONE", targetW/2, bleed + (targetH * 0.04)); 
                ctx.restore();
            }
            
            drawBoundingBox();
        }
    }

    ctx.restore();

    // Outer Border
    if (addBorderToggle.checked) {
        ctx.filter = 'none'; 
        ctx.strokeStyle = '#000000'; 
        ctx.setLineDash([]); 
        ctx.lineWidth = (parseInt(borderWidthInp.value) || 2) * currentUpscale;
        
        if (cornerRad > 0) { 
            ctx.beginPath(); 
            ctx.roundRect(0, 0, targetW, targetH, cornerRad); 
            ctx.stroke(); 
        } else { 
            ctx.strokeRect(0, 0, targetW, targetH); 
        }
    }

    // Update UI labels
    document.getElementById('brightVal').innerText = brightnessInp.value; 
    document.getElementById('contrastVal').innerText = contrastInp.value; 
    document.getElementById('saturateVal').innerText = saturationInp.value; 
    document.getElementById('rotVal').innerText = rotation + '°'; 
    document.getElementById('hueVal').innerText = hueInp.value + '°'; 
    document.getElementById('grayVal').innerText = grayInp.value + '%'; 
    document.getElementById('blurVal').innerText = blurInp.value + 'px'; 
    document.getElementById('sepiaVal').innerText = sepiaInp.value + '%'; 
    document.getElementById('tempVal').innerText = tempInp.value; 
    document.getElementById('vignetteVal').innerText = vignetteInp.value + '%'; 
    document.getElementById('radiusVal').innerText = cornerRadiusInp.value + 'px'; 
    document.getElementById('glowVal').innerText = studioGlowInp.value + '%';
    
    triggerLiveSizeUpdate();
}

// ==========================================
// LIVE SIZE UPDATER (WITH MB CONVERSION)
// ==========================================
function triggerLiveSizeUpdate() {
    clearTimeout(estSizeTimeout);
    estSizeTimeout = setTimeout(() => {
        if (!loadedImg || isExporting) return;
        
        let tmp = getCleanCanvasData(); 
        let f = imgFormat.value;
        let data = tmp.toDataURL(f, 0.9); 
        
        // Calculate KB
        let kb = (data.length * 0.75) / 1024;
        
        // Show in MB if > 1024 KB
        if (kb >= 1024) {
            let mb = kb / 1024;
            liveEstSize.innerText = mb.toFixed(2) + " MB";
        } else {
            liveEstSize.innerText = Math.round(kb) + " KB";
        }
    }, 400); 
}

// ==========================================
// DRAGGING AND BOUNDING BOX LOGIC
// ==========================================
function getHandles() {
    if(!loadedImg) return [];
    let w = loadedImg.width * scale;
    let h = loadedImg.height * scale; 
    let hs = handleSize * currentUpscale;
    return [
        { type: 'nw', x: imgX - hs/2, y: imgY - hs/2, cursor: 'nwse-resize' },
        { type: 'ne', x: imgX + w - hs/2, y: imgY - hs/2, cursor: 'nesw-resize' },
        { type: 'sw', x: imgX - hs/2, y: imgY + h - hs/2, cursor: 'nesw-resize' },
        { type: 'se', x: imgX + w - hs/2, y: imgY + h - hs/2, cursor: 'nwse-resize' }
    ];
}

function drawBoundingBox() {
    let w = loadedImg.width * scale; 
    let h = loadedImg.height * scale; 
    let hs = handleSize * currentUpscale;
    
    ctx.filter = 'none'; 
    ctx.strokeStyle = '#6366f1'; 
    ctx.lineWidth = 2 * currentUpscale; 
    ctx.setLineDash([]); 
    ctx.strokeRect(imgX, imgY, w, h);
    
    ctx.fillStyle = '#ffffff';
    getHandles().forEach(handle => { 
        ctx.fillRect(handle.x, handle.y, hs, hs); 
        ctx.strokeRect(handle.x, handle.y, hs, hs); 
    });
}

// Mouse Events
canvas.addEventListener('mousemove', (e) => {
    if (!loadedImg) return;
    const rect = canvas.getBoundingClientRect(); 
    const scaleX = canvas.width / rect.width; 
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX; 
    const my = (e.clientY - rect.top) * scaleY;
    
    if (isResizing) {
        let dx = mx - startX; 
        let dy = my - startY; 
        let dir = 1;
        
        if (resizeHandle === 'se') dir = (dx > 0) ? 1 : -1; 
        else if (resizeHandle === 'nw') dir = (dx < 0) ? 1 : -1; 
        else if (resizeHandle === 'ne') dir = (dx > 0) ? 1 : -1; 
        else if (resizeHandle === 'sw') dir = (dx < 0) ? 1 : -1;
        
        let distance = Math.sqrt(dx*dx + dy*dy); 
        let scaleChange = (distance / (500*currentUpscale)) * dir; 
        scale = Math.max(0.1, originalScale + scaleChange); 
        
        let newW = loadedImg.width * scale; 
        let newH = loadedImg.height * scale; 
        let oldW = loadedImg.width * originalScale; 
        let oldH = loadedImg.height * originalScale;
        
        imgX -= (newW - oldW) / 2; 
        imgY -= (newH - oldH) / 2;
        
        originalScale = scale; 
        startX = mx; 
        startY = my; 
        renderEngine(); 
        return;
    }
    
    if (isDragging) { 
        imgX = mx - startX; 
        imgY = my - startY; 
        renderEngine(); 
        return; 
    }

    let hs = handleSize * currentUpscale; 
    let handles = getHandles();
    let hoveringHandle = handles.find(h => mx >= h.x && mx <= h.x+hs && my >= h.y && my <= h.y+hs);
    
    if (hoveringHandle) canvas.style.cursor = hoveringHandle.cursor;
    else if (mx > imgX && mx < imgX + loadedImg.width * scale && my > imgY && my < imgY + loadedImg.height * scale) canvas.style.cursor = 'move';
    else canvas.style.cursor = 'default';
});

canvas.addEventListener('mousedown', (e) => {
    if (!loadedImg) return;
    const rect = canvas.getBoundingClientRect(); 
    const scaleX = canvas.width / rect.width; 
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX; 
    const my = (e.clientY - rect.top) * scaleY;
    
    let hs = handleSize * currentUpscale; 
    let handles = getHandles();
    let clickedHandle = handles.find(h => mx >= h.x && mx <= h.x+hs && my >= h.y && my <= h.y+hs);

    if (clickedHandle) { 
        isResizing = true; 
        resizeHandle = clickedHandle.type; 
        startX = mx; 
        startY = my; 
        originalScale = scale; 
    } 
    else if (mx > imgX && mx < imgX + loadedImg.width * scale && my > imgY && my < imgY + loadedImg.height * scale) { 
        isDragging = true; 
        startX = mx - imgX; 
        startY = my - imgY; 
    }
});

window.addEventListener('mouseup', () => { 
    isDragging = false; 
    isResizing = false; 
});

// Touch Events for Mobile
canvas.addEventListener('touchstart', (e) => {
    if (!loadedImg) return;
    e.preventDefault(); 
    const rect = canvas.getBoundingClientRect(); 
    const scaleX = canvas.width / rect.width; 
    const scaleY = canvas.height / rect.height;
    
    if (e.touches.length === 1) {
        const mx = (e.touches[0].clientX - rect.left) * scaleX; 
        const my = (e.touches[0].clientY - rect.top) * scaleY;
        let hs = handleSize * currentUpscale; 
        let handles = getHandles(); 
        let hitPad = 15 * currentUpscale; 
        
        let clickedHandle = handles.find(h => mx >= h.x - hitPad && mx <= h.x+hs+hitPad && my >= h.y - hitPad && my <= h.y+hs+hitPad); 
        if (clickedHandle) { 
            isResizing = true; 
            resizeHandle = clickedHandle.type; 
            startX = mx; 
            startY = my; 
            originalScale = scale; 
        } else { 
            isDragging = true; 
            startX = mx - imgX; 
            startY = my - imgY; 
        }
    } else if (e.touches.length === 2) {
        isDragging = false; 
        isResizing = false; 
        const dx = e.touches[0].clientX - e.touches[1].clientX; 
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDist = Math.sqrt(dx * dx + dy * dy); 
        initialPinchScale = scale;
    }
}, {passive: false});

canvas.addEventListener('touchmove', (e) => {
    if (!loadedImg) return;
    e.preventDefault(); 
    const rect = canvas.getBoundingClientRect(); 
    const scaleX = canvas.width / rect.width; 
    const scaleY = canvas.height / rect.height;
    
    if (e.touches.length === 1) {
        const mx = (e.touches[0].clientX - rect.left) * scaleX; 
        const my = (e.touches[0].clientY - rect.top) * scaleY;
        
        if (isResizing) {
            let dx = mx - startX; 
            let dy = my - startY; 
            let dir = 1;
            
            if (resizeHandle === 'se') dir = (dx > 0) ? 1 : -1; 
            else if (resizeHandle === 'nw') dir = (dx < 0) ? 1 : -1; 
            else if (resizeHandle === 'ne') dir = (dx > 0) ? 1 : -1; 
            else if (resizeHandle === 'sw') dir = (dx < 0) ? 1 : -1;
            
            let distance = Math.sqrt(dx*dx + dy*dy); 
            let scaleChange = (distance / (500*currentUpscale)) * dir; 
            scale = Math.max(0.1, originalScale + scaleChange); 
            
            let newW = loadedImg.width * scale; 
            let newH = loadedImg.height * scale; 
            let oldW = loadedImg.width * originalScale; 
            let oldH = loadedImg.height * originalScale;
            
            imgX -= (newW - oldW) / 2; 
            imgY -= (newH - oldH) / 2; 
            originalScale = scale; 
            startX = mx; 
            startY = my; 
            renderEngine();
        } else if (isDragging) { 
            imgX = mx - startX; 
            imgY = my - startY; 
            renderEngine(); 
        }
    } else if (e.touches.length === 2 && initialPinchDist) {
        const dx = e.touches[0].clientX - e.touches[1].clientX; 
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy); 
        const pinchRatio = currentDistance / initialPinchDist;
        
        let oldW = loadedImg.width * scale; 
        let oldH = loadedImg.height * scale;
        scale = initialPinchScale * pinchRatio; 
        scale = Math.max(0.1, scale); 
        
        let newW = loadedImg.width * scale; 
        let newH = loadedImg.height * scale;
        imgX -= (newW - oldW) / 2; 
        imgY -= (newH - oldH) / 2; 
        renderEngine();
    }
}, {passive: false});

canvas.addEventListener('touchend', () => { 
    isDragging = false; 
    isResizing = false; 
    initialPinchDist = null; 
});

// ==========================================
// EXPORT & PRINT LOGIC
// ==========================================
function getCleanCanvasData() {
    isExporting = true; 
    renderEngine();
    
    let tempCanvas = document.createElement('canvas'); 
    tempCanvas.width = targetW; 
    tempCanvas.height = targetH;
    
    let tCtx = tempCanvas.getContext('2d'); 
    tCtx.imageSmoothingEnabled = true; 
    tCtx.imageSmoothingQuality = 'high';
    tCtx.putImageData(ctx.getImageData(0,0,targetW,targetH), 0, 0);
    
    isExporting = false; 
    renderEngine(); 
    return tempCanvas;
}

function renderPrintPreview() {
    let isA4 = paperSize.value === 'a4'; 
    let pdfW = isA4 ? 210 : 102; 
    let pdfH = isA4 ? 297 : 152;
    
    previewCanvas.width = pdfW * 3; 
    previewCanvas.height = pdfH * 3; 
    previewCanvas.style.height = isA4 ? "350px" : "250px";
    
    pCtx.fillStyle = '#ffffff'; 
    pCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    let tempCanvas = getCleanCanvasData();
    const printW = (targetW / currentUpscale * (25.4 / 300)) * 3; 
    const printH = (targetH / currentUpscale * (25.4 / 300)) * 3;
    const gap = 4 * 3; 
    const margin = (isA4 ? 8 : 5) * 3; 
    let x = margin; 
    let y = margin;
    
    for(let i=0; i < printPhotoCount; i++) {
        pCtx.drawImage(tempCanvas, x, y, printW, printH);
        if(printCropMarks.checked) { 
            pCtx.strokeStyle = 'rgba(0,0,0,0.15)'; 
            pCtx.lineWidth = 1; 
            pCtx.setLineDash([4, 4]); 
            pCtx.strokeRect(x, y, printW, printH); 
        }
        x += printW + gap; 
        if(x + printW > previewCanvas.width - margin) { 
            x = margin; 
            y += printH + gap; 
        }
    }
}

openPrintModalBtn.onclick = () => {
    if(!loadedImg) return showToast("Please upload a photo first!", "exclamation-triangle");
    printModal.style.display = 'flex'; 
    previewCountText.innerText = printPhotoCount; 
    renderPrintPreview();
};

closeModalBtn.onclick = () => { printModal.style.display = 'none'; };
btnPlus.onclick = () => { printPhotoCount++; previewCountText.innerText = printPhotoCount; renderPrintPreview(); };
btnMinus.onclick = () => { if(printPhotoCount > 1) { printPhotoCount--; previewCountText.innerText = printPhotoCount; renderPrintPreview(); } };

downloadBtn.onclick = () => {
    if(!loadedImg) return showToast("Please upload a photo first!", "exclamation-triangle");
    
    let tempCanvas = getCleanCanvasData();
    const format = imgFormat.value; 
    const sizeLimit = parseInt(targetKB.value) || 0;
    let finalFormat = format; 
    let dataUrl = tempCanvas.toDataURL(finalFormat, 1.0);

    if (sizeLimit > 0) {
        if(format === 'image/png') { 
            showToast("JPG auto-selected for size limit!"); 
            finalFormat = 'image/jpeg'; 
        }
        
        let minQ = 0.05, maxQ = 1.0; 
        let bestDataUrl = tempCanvas.toDataURL(finalFormat, 1.0);
        let currentSize = Math.round((bestDataUrl.length * 3/4) / 1024);
        
        if (currentSize > sizeLimit) {
            for (let i = 0; i < 8; i++) { 
                let midQ = (minQ + maxQ) / 2; 
                let testUrl = tempCanvas.toDataURL(finalFormat, midQ); 
                let kb = Math.round((testUrl.length * 3/4) / 1024);
                if (kb <= sizeLimit) { bestDataUrl = testUrl; minQ = midQ; } 
                else { maxQ = midQ; }
            }
            dataUrl = bestDataUrl;
        }
        
        let scaleDown = 0.9;
        while (Math.round((dataUrl.length * 3/4) / 1024) > sizeLimit && scaleDown > 0.3) {
            let shrinkCanvas = document.createElement('canvas'); 
            shrinkCanvas.width = targetW * scaleDown; 
            shrinkCanvas.height = targetH * scaleDown;
            
            let sCtx = shrinkCanvas.getContext('2d'); 
            sCtx.imageSmoothingEnabled = true; 
            sCtx.imageSmoothingQuality = 'high';
            sCtx.drawImage(tempCanvas, 0, 0, shrinkCanvas.width, shrinkCanvas.height);
            dataUrl = shrinkCanvas.toDataURL(finalFormat, 0.7); 
            scaleDown -= 0.1;
        }
    }
    
    const link = document.createElement('a');
    let randomID = Math.floor(Math.random() * 900) + 100;
    link.download = `SBU_PixelPass_${randomID}_${currentUpscale}x.${finalFormat.split('/')[1]}`;
    link.href = dataUrl; 
    link.click();
    showToast("Photo Downloaded Successfully!");
};

downloadPdfBtn.onclick = () => {
    const { jsPDF } = window.jspdf; 
    let isA4 = paperSize.value === 'a4';
    const doc = new jsPDF('p', 'mm', [isA4 ? 210:102, isA4 ? 297:152]);
    let tempCanvas = getCleanCanvasData(); 
    const imgData = tempCanvas.toDataURL('image/jpeg', 1.0);
    
    const printW = (targetW / currentUpscale) * (25.4 / 300); 
    const printH = (targetH / currentUpscale) * (25.4 / 300);
    const gap = 4; 
    const margin = isA4 ? 8 : 5; 
    let x = margin; 
    let y = margin;
    
    if(printCropMarks.checked) { 
        doc.setDrawColor(200, 200, 200); 
        doc.setLineWidth(0.1); 
        doc.setLineDash([1, 1]); 
    }
    
    for(let i=0; i<printPhotoCount; i++) {
        doc.addImage(imgData, 'JPEG', x, y, printW, printH);
        if(printCropMarks.checked) doc.rect(x, y, printW, printH);
        x += printW + gap; 
        
        if(x + printW > (isA4?210:102) - margin) { 
            x = margin; 
            y += printH + gap; 
        }
        if(y + printH > (isA4?297:152) - margin && i < printPhotoCount-1) { 
            doc.addPage(); 
            x = margin; 
            y = margin; 
        }
    }
    
    let randomID = Math.floor(Math.random() * 900) + 100; 
    doc.save(`SBU_PrintSheet_${randomID}.pdf`); 
    printModal.style.display = 'none';
    showToast("PDF Downloaded!");
};

// ==========================================
// AI FEATURES (Auto Fix & Remove BG)
// ==========================================
aiEnhanceBtn.addEventListener('click', () => {
    if(!loadedImg) return showToast("Please upload a photo first!", "exclamation-triangle");
    
    brightnessInp.value = 110; 
    contrastInp.value = 110; 
    saturationInp.value = 115; 
    studioGlowInp.value = 15;
    hueInp.value = 0; 
    grayInp.value = 0; 
    blurInp.value = 0; 
    sepiaInp.value = 0; 
    tempInp.value = 5; 
    vignetteInp.value = 0;
    
    renderEngine(); 
    saveSession();
    
    const oldHTML = aiEnhanceBtn.innerHTML; 
    aiEnhanceBtn.innerHTML = '<i class="fas fa-check"></i> Pro Adjusted!';
    aiEnhanceBtn.style.background = "#10b981"; 
    aiEnhanceBtn.style.color = "#ffffff";
    showToast("Auto Fix Applied!");
    
    setTimeout(() => { 
        aiEnhanceBtn.innerHTML = oldHTML; 
        aiEnhanceBtn.style.background = ""; 
        aiEnhanceBtn.style.color = ""; 
    }, 2000);
});

removeBGBtn.addEventListener('click', async () => {
    const apiKey = "tMh4m4Tfn23vMpRXCkJyo92y"; 
    const file = imageInput.files[0];
    if(!file) return showToast("Please upload a photo first!", "exclamation-triangle");
    
    const oldHTML = removeBGBtn.innerHTML; 
    removeBGBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Removing BG...'; 
    removeBGBtn.disabled = true;
    showToast("Removing Background...", "spinner fa-spin");
    
    const formData = new FormData(); 
    formData.append("image_file", file); 
    formData.append("size", "full"); 
    
    try {
        const response = await fetch("https://api.remove.bg/v1.0/removebg", { 
            method: "POST", 
            headers: { "X-Api-Key": apiKey }, 
            body: formData 
        });
        
        if (response.ok) {
            const blob = await response.blob(); 
            loadedImg = new Image(); 
            loadedImg.onload = resetLayout; 
            loadedImg.src = URL.createObjectURL(blob);
            
            removeBGBtn.innerHTML = '<i class="fas fa-check"></i> BG Removed'; 
            removeBGBtn.style.background = "#10b981"; 
            removeBGBtn.style.color = "#ffffff";
            showToast("Background Removed Perfectly!");
        } else { 
            showToast("Remove.bg API Limit reached.", "times-circle"); 
            removeBGBtn.innerHTML = oldHTML; 
        }
    } catch (err) { 
        showToast("Network Error!", "wifi"); 
        removeBGBtn.innerHTML = oldHTML; 
    } finally { 
        removeBGBtn.disabled = false; 
    }
});

// ==========================================
// RESET FILTERS
// ==========================================
resetFiltersBtn.onclick = () => { 
    brightnessInp.value = 100; 
    contrastInp.value = 100; 
    saturationInp.value = 100; 
    rotationInp.value = 0; 
    rotation = 0; 
    flipH = 1; 
    flipV = 1;
    hueInp.value = 0; 
    grayInp.value = 0; 
    blurInp.value = 0; 
    sepiaInp.value = 0; 
    tempInp.value = 0; 
    vignetteInp.value = 0; 
    cornerRadiusInp.value = 0; 
    studioGlowInp.value = 0;
    
    resolutionSlider.value = 1; 
    currentUpscale = 1; 
    resVal.innerText = "1x (Std)";
    
    updateDimensions(); 
    resetLayout(); 
    saveSession(); 
    showToast("Filters Reset!");
    
    aiEnhanceBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Auto Fix'; 
    aiEnhanceBtn.style.background = ""; 
    aiEnhanceBtn.style.color = "";
    removeBGBtn.innerHTML = '<i class="fas fa-eraser"></i> Cutout BG'; 
    removeBGBtn.style.background = ""; 
    removeBGBtn.style.color = "";
};
