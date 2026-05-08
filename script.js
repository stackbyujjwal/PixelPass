// ==========================================
// DOM ELEMENTS SELECTION
// ==========================================
const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');
const themeToggle = document.getElementById('themeToggle');

// New Export Dropdown Elements
const downloadBtnToggle = document.getElementById('downloadBtnToggle');
const exportDropdown = document.getElementById('exportDropdown');
const downloadSingleBtn = document.getElementById('downloadSingleBtn');
const openPrintModalBtn = document.getElementById('openPrintModalBtn');

// Layout Elements
const ratioSelect = document.getElementById('ratioSelect');
const customSizeWrapper = document.getElementById('customSizeWrapper');
const customUnit = document.getElementById('customUnit');
const customW = document.getElementById('customW');
const customH = document.getElementById('customH');
const circleCropToggle = document.getElementById('circleCropToggle');
const transparentBgToggle = document.getElementById('transparentBgToggle');
const innerMarginInp = document.getElementById('innerMargin');
const addBorderToggle = document.getElementById('addBorderToggle');
const borderWidthInp = document.getElementById('borderWidth');
const borderStyle = document.getElementById('borderStyle');
const borderOpacity = document.getElementById('borderOpacity');

// Elements & Text
const addTextToggle = document.getElementById('addTextToggle');
const photoName = document.getElementById('photoName');
const photoDate = document.getElementById('photoDate');
const textFont = document.getElementById('textFont');
const textPosition = document.getElementById('textPosition');
const textColor = document.getElementById('textColor');
const textBgColor = document.getElementById('textBgColor');
const textShadowToggle = document.getElementById('textShadowToggle');
const textOpacityInp = document.getElementById('textOpacity');
const letterSpacingInp = document.getElementById('letterSpacing');
const textStrokeToggle = document.getElementById('textStrokeToggle');
const textStrokeColor = document.getElementById('textStrokeColor');
const textStrokeWidth = document.getElementById('textStrokeWidth');
const addWatermarkToggle = document.getElementById('addWatermarkToggle'); 
const watermarkText = document.getElementById('watermarkText');
const canvasPattern = document.getElementById('canvasPattern');
const patternColor = document.getElementById('patternColor');
const patternSize = document.getElementById('patternSize');

// Export Elements
const paperSize = document.getElementById('paperSize');
const printCropMarks = document.getElementById('printCropMarks');
const targetKB = document.getElementById('targetKB');
const imgFormat = document.getElementById('imgFormat');
const liveEstSize = document.getElementById('liveEstSize'); 
const resolutionSlider = document.getElementById('resolutionSlider'); 
const resVal = document.getElementById('resVal');

// Retouch Elements & Pro FX
const rightSidebar = document.getElementById('rightSidebar'); 
const panelFx = document.getElementById('panel-fx');
const panelElements = document.getElementById('panel-elements');
const bgColor = document.getElementById('bgColor');
const fitBtn = document.getElementById('fitBtn');
const fillBtn = document.getElementById('fillBtn');
const crosshairToggle = document.getElementById('crosshairToggle');
const exposureInp = document.getElementById('exposure');
const brightnessInp = document.getElementById('brightness');
const contrastInp = document.getElementById('contrast');
const saturationInp = document.getElementById('saturation');
const grayscaleInp = document.getElementById('grayscale');
const sepiaInp = document.getElementById('sepia');
const hueInp = document.getElementById('hue');
const invertToggle = document.getElementById('invertToggle');
const rotationInp = document.getElementById('rotation');
const cornerRadiusInp = document.getElementById('cornerRadius'); 
const rotLeftBtn = document.getElementById('rotLeftBtn');
const rotRightBtn = document.getElementById('rotRightBtn');
const flipHBtn = document.getElementById('flipHBtn');
const flipVBtn = document.getElementById('flipVBtn');
const mirrorHToggle = document.getElementById('mirrorHToggle');
const mirrorVToggle = document.getElementById('mirrorVToggle');
const tempInp = document.getElementById('temperature');
const tintInp = document.getElementById('tint');
const opacityInp = document.getElementById('opacity');
const grainInp = document.getElementById('grain');
const blurInp = document.getElementById('blur');
const vignetteInp = document.getElementById('vignette'); 
const vignetteColor = document.getElementById('vignetteColor');
const studioGlowInp = document.getElementById('studioGlow'); 
const overlayColor = document.getElementById('overlayColor'); 
const overlayMode = document.getElementById('overlayMode'); 
const instaBlurBgToggle = document.getElementById('instaBlurBgToggle');
const dropShadowToggle = document.getElementById('dropShadowToggle');
const reflectionToggle = document.getElementById('reflectionToggle');

// Advanced Pro Sliders
const pixelateInp = document.getElementById('pixelate');
const rgbSplitInp = document.getElementById('rgbSplit');
const posterizeInp = document.getElementById('posterize');
const glitchToggle = document.getElementById('glitchToggle');
const duotoneToggle = document.getElementById('duotoneToggle');
const duoLight = document.getElementById('duoLight');
const duoDark = document.getElementById('duoDark');
const gradientToggle = document.getElementById('gradientToggle');
const gradColor1 = document.getElementById('gradColor1');
const gradColor2 = document.getElementById('gradColor2');
const gradAngle = document.getElementById('gradAngle');
const gradOpacity = document.getElementById('gradOpacity');

// Presets & AI Buttons
const removeBGBtn = document.getElementById('removeBGBtn');
const aiEnhanceBtn = document.getElementById('aiEnhanceBtn');
const aiColorBtn = document.getElementById('aiColorBtn');
const aiBrightBtn = document.getElementById('aiBrightBtn');
const aiSharpBtn = document.getElementById('aiSharpBtn');
const aiPortraitBtn = document.getElementById('aiPortraitBtn');

const resetFiltersBtn = document.getElementById('resetFilters');

const printModal = document.getElementById('printModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const previewCanvas = document.getElementById('previewCanvas');
const pCtx = previewCanvas.getContext('2d');
const btnMinus = document.getElementById('btnMinus');
const btnPlus = document.getElementById('btnPlus');
const previewCountText = document.getElementById('previewCountText');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');

// Zoom System
const workspaceZoom = document.getElementById('workspaceZoom');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomVal = document.getElementById('zoomVal');

// ==========================================
// STATE VARIABLES & NOISE GENERATOR
// ==========================================
let loadedImg = null;
let targetW = 413, targetH = 531; 
let scale = 1, imgX = 0, imgY = 0, rotation = 0;
let flipH = 1, flipV = 1, printPhotoCount = 8;
let isExporting = false, estSizeTimeout, currentUpscale = 1; 

let isDragging = false, isResizing = false;
let isFastModeActive = false;
let resizeHandle = '', startX = 0, startY = 0;
let originalScale = 1;
const handleSize = 12;
let initialPinchDist = null, initialPinchScale = 1;
let currentWorkspaceZoom = 100;

// Pre-generate Noise Canvas for Film Grain
const noiseCanvas = document.createElement('canvas');
noiseCanvas.width = 500; noiseCanvas.height = 500;
const nCtx = noiseCanvas.getContext('2d');
const nData = nCtx.createImageData(500, 500);
for(let i=0; i<nData.data.length; i+=4) {
    let v = Math.random() * 255;
    nData.data[i] = v; nData.data[i+1] = v; nData.data[i+2] = v; nData.data[i+3] = 255;
}
nCtx.putImageData(nData, 0, 0);

if (!ctx.roundRect) {
    ctx.roundRect = function(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2; if (h < 2 * r) r = h / 2;
        this.beginPath(); this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r); this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r); this.arcTo(x, y, x + w, y, r);
        this.closePath(); return this;
    }
}

let isRenderPending = false;
function scheduleRender(skipSizeUpdate = false) {
    if (!isRenderPending) {
        isRenderPending = true;
        requestAnimationFrame(() => { renderEngine(skipSizeUpdate); isRenderPending = false; });
    }
}

function showToast(msg, icon = 'check-circle') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-${icon}"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ==========================================
// ZOOM LOGIC (CANVA STYLE)
// ==========================================
function updateWorkspaceZoom() {
    zoomVal.innerText = currentWorkspaceZoom + '%';
    workspaceZoom.value = currentWorkspaceZoom;
    canvas.style.transform = `scale(${currentWorkspaceZoom / 100})`;
}

workspaceZoom.addEventListener('input', (e) => {
    currentWorkspaceZoom = parseInt(e.target.value);
    updateWorkspaceZoom();
});

zoomOutBtn.onclick = () => {
    currentWorkspaceZoom = Math.max(10, currentWorkspaceZoom - 10);
    updateWorkspaceZoom();
};

zoomInBtn.onclick = () => {
    currentWorkspaceZoom = Math.min(300, currentWorkspaceZoom + 10);
    updateWorkspaceZoom();
};

// Scroll Wheel Zoom
document.querySelector('.workspace').addEventListener('wheel', (e) => {
    if(e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if(e.deltaY < 0) currentWorkspaceZoom = Math.min(300, currentWorkspaceZoom + 5);
        else currentWorkspaceZoom = Math.max(10, currentWorkspaceZoom - 5);
        updateWorkspaceZoom();
    }
}, {passive: false});

// ==========================================
// PRESETS & STARTUP
// ==========================================
const masterPresets = {
    cinematic: { bright: 105, cont: 115, sat: 110, temp: 15, tint: -5, glow: 5, vig: 20 },
    noir: { bright: 105, cont: 130, sat: 0, gray: 100, grain: 20, vig: 30 },
    vintage: { bright: 95, cont: 90, sat: 80, sepia: 40, temp: 20, grain: 15, vig: 15 },
    cyberpunk: { bright: 110, cont: 120, sat: 130, temp: -20, tint: 30, glow: 15, ca: 3 },
    polaroid: { bright: 110, cont: 95, sat: 90, sepia: 15, temp: 10, blur: 0.5, vig: 10 },
    autumn: { bright: 100, cont: 105, sat: 120, temp: 30, tint: 5, vig: 10 },
    winter: { bright: 105, cont: 110, sat: 90, temp: -30, tint: -10 },
    matte: { bright: 115, cont: 85, sat: 95, sepia: 10, vig: 5 },
    sunset: { bright: 100, cont: 110, sat: 125, temp: 40, tint: 10, glow: 10 },
    matrix: { bright: 95, cont: 120, sat: 110, temp: -10, tint: -40, glow: 5, grain: 10 }
};

document.querySelectorAll('.master-preset').forEach(btn => {
    btn.onclick = () => {
        if (!loadedImg) return showToast("Upload photo first!", "exclamation-triangle");
        const p = masterPresets[btn.dataset.filter];
        brightnessInp.value = p.bright || 100; contrastInp.value = p.cont || 100;
        saturationInp.value = p.sat || 100; tempInp.value = p.temp || 0;
        tintInp.value = p.tint || 0; studioGlowInp.value = p.glow || 0;
        vignetteInp.value = p.vig || 0; grayscaleInp.value = p.gray || 0;
        sepiaInp.value = p.sepia || 0; grainInp.value = p.grain || 0;
        blurInp.value = p.blur || 0; rgbSplitInp.value = p.ca || 0;
        isFastModeActive = false;
        showToast(`${btn.innerText} Filter Applied`);
        scheduleRender();
    };
});

window.onload = () => {
    updateDimensions(); 
    showToast("Welcome to PixelPass PRO", "crown"); 
    scheduleRender();
};

themeToggle.onclick = () => {
    const isDark = document.body.dataset.theme === 'dark';
    document.body.dataset.theme = isDark ? 'light' : 'dark';
    themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
};

// ==========================================
// EXPORT DROPDOWN LOGIC
// ==========================================
downloadBtnToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    exportDropdown.classList.toggle('show');
});

window.addEventListener('click', (e) => {
    if (!exportDropdown.contains(e.target) && e.target !== downloadBtnToggle) {
        exportDropdown.classList.remove('show');
    }
});

resolutionSlider.addEventListener('input', (e) => {
    let newUpscale = parseInt(e.target.value);
    if (newUpscale === currentUpscale) return;
    let ratio = newUpscale / currentUpscale;
    currentUpscale = newUpscale;
    targetW = Math.round(targetW * ratio); targetH = Math.round(targetH * ratio);
    imgX *= ratio; imgY *= ratio; scale *= ratio;
    let labels = {1: "1x (Std)", 2: "2x (HD)", 3: "3x (FHD)", 4: "4x (4K)"};
    resVal.innerText = labels[newUpscale];
    scheduleRender();
});

window.addEventListener('keydown', (e) => {
    if (!loadedImg || document.activeElement.tagName === 'INPUT') return;
    const moveStep = 5 * currentUpscale;
    if (e.key === 'ArrowUp') { imgY -= moveStep; e.preventDefault(); }
    if (e.key === 'ArrowDown') { imgY += moveStep; e.preventDefault(); }
    if (e.key === 'ArrowLeft') { imgX -= moveStep; e.preventDefault(); }
    if (e.key === 'ArrowRight') { imgX += moveStep; e.preventDefault(); }
    if (e.key.toLowerCase() === 's' && !e.ctrlKey) downloadSingleBtn.click();
    scheduleRender();
});

function updateDimensions() {
    let baseW, baseH;
    
    if (ratioSelect.value === 'custom') {
        customSizeWrapper.style.display = 'block';
        let unit = customUnit.value;
        let defaultVal = unit === 'px' ? 400 : (unit === 'inch' ? 2 : 3.5);
        let valW = parseFloat(customW.value) || defaultVal;
        let valH = parseFloat(customH.value) || defaultVal;
        
        if (unit === 'inch') { baseW = Math.round(valW * 300); baseH = Math.round(valH * 300); }
        else if (unit === 'cm') { baseW = Math.round((valW * 300) / 2.54); baseH = Math.round((valH * 300) / 2.54); }
        else { baseW = valW; baseH = valH; }
    } else {
        customSizeWrapper.style.display = 'none';
        let [w, h] = ratioSelect.value.split('x');
        baseW = parseInt(w); baseH = parseInt(h);
    }

    let newTargetW = baseW * currentUpscale; 
    let newTargetH = baseH * currentUpscale;
    
    if (newTargetW > 8000) newTargetW = 8000;
    if (newTargetH > 8000) newTargetH = 8000;

    targetW = newTargetW; 
    targetH = newTargetH;
    
    if (!loadedImg) scheduleRender();
    else resetLayout(); 
}

ratioSelect.addEventListener('change', updateDimensions); 
customW.addEventListener('input', updateDimensions); 
customH.addEventListener('input', updateDimensions); 
customUnit.addEventListener('change', updateDimensions);

addTextToggle.addEventListener('change', (e) => { 
    document.getElementById('textInputsWrapper').style.display = e.target.checked ? 'flex' : 'none'; scheduleRender(); 
});
textStrokeToggle.addEventListener('change', (e) => {
    document.getElementById('textStrokeWrapper').style.display = e.target.checked ? 'grid' : 'none'; scheduleRender();
});
addWatermarkToggle.addEventListener('change', (e) => { 
    document.getElementById('watermarkInputsWrapper').style.display = e.target.checked ? 'flex' : 'none'; scheduleRender(); 
});

fitBtn.onclick = () => {
    if(!loadedImg) return;
    scale = Math.min(targetW/loadedImg.width, targetH/loadedImg.height);
    imgX = (targetW - loadedImg.width*scale)/2; imgY = (targetH - loadedImg.height*scale)/2; 
    isFastModeActive = false; scheduleRender();
};
fillBtn.onclick = () => {
    if(!loadedImg) return;
    scale = Math.max(targetW/loadedImg.width, targetH/loadedImg.height);
    imgX = (targetW - loadedImg.width*scale)/2; imgY = (targetH - loadedImg.height*scale)/2; 
    isFastModeActive = false; scheduleRender();
};

const inputsToWatch = [
    circleCropToggle, transparentBgToggle, innerMarginInp, borderStyle, borderOpacity, photoName, photoDate, textFont, textPosition, textColor, textBgColor, textShadowToggle, textOpacityInp, watermarkText, addBorderToggle, borderWidthInp, bgColor, crosshairToggle, exposureInp, brightnessInp, contrastInp, saturationInp, grayscaleInp, sepiaInp, hueInp, invertToggle, opacityInp, grainInp, tintInp, blurInp, tempInp, vignetteInp, cornerRadiusInp, studioGlowInp, overlayColor, overlayMode, instaBlurBgToggle, dropShadowToggle, reflectionToggle, pixelateInp, rgbSplitInp, posterizeInp, glitchToggle, duotoneToggle, duoLight, duoDark, gradientToggle, gradColor1, gradColor2, gradAngle, gradOpacity, mirrorHToggle, mirrorVToggle, letterSpacingInp, textStrokeColor, textStrokeWidth, canvasPattern, patternColor, patternSize, vignetteColor
];

let interactionTimeout;
inputsToWatch.forEach(el => {
    if (el.type === 'checkbox' || el.tagName === 'SELECT') {
        el.addEventListener('change', () => { isFastModeActive = false; scheduleRender(); });
    } else {
        el.addEventListener('input', () => { 
            // Agar color badla jaye, toh transparency off kar do taaki rang dikhe
            if (el.id === 'bgColor') transparentBgToggle.checked = false;
            
            isFastModeActive = true; 
            scheduleRender(true); 
            clearTimeout(interactionTimeout);
            if(el.type !== 'range') {
                interactionTimeout = setTimeout(() => { isFastModeActive = false; scheduleRender(); }, 400);
            }
        });
        el.addEventListener('change', () => { 
            isFastModeActive = false; 
            scheduleRender(); 
        });
    }
});

imgFormat.addEventListener('change', () => triggerLiveSizeUpdate());
rotationInp.addEventListener('input', (e) => { rotation = parseInt(e.target.value); isFastModeActive = true; scheduleRender(true); }); 
rotationInp.addEventListener('change', () => { isFastModeActive = false; scheduleRender(); });

rotLeftBtn.onclick = () => { rotation = (rotation - 90) % 360; rotationInp.value = rotation; isFastModeActive = false; scheduleRender(); };
rotRightBtn.onclick = () => { rotation = (rotation + 90) % 360; rotationInp.value = rotation; isFastModeActive = false; scheduleRender(); };
flipHBtn.onclick = () => { flipH *= -1; isFastModeActive = false; scheduleRender(); }; 
flipVBtn.onclick = () => { flipV *= -1; isFastModeActive = false; scheduleRender(); };

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0]; if(!file) return;
    rightSidebar.classList.remove('disabled-panel'); 
    panelFx.classList.remove('disabled-panel');
    panelElements.classList.remove('disabled-panel');
    document.getElementById('fileName').innerText = file.name;
    const reader = new FileReader();
    reader.onload = (event) => { 
        loadedImg = new Image(); loadedImg.onload = resetLayout; 
        loadedImg.src = event.target.result; showToast("Photo Uploaded!"); 
    };
    reader.readAsDataURL(file);
});

function resetLayout() {
    if(!loadedImg) return;
    scale = Math.max(targetW / loadedImg.width, targetH / loadedImg.height);
    imgX = (targetW - loadedImg.width * scale) / 2; imgY = (targetH - loadedImg.height * scale) / 2;
    isFastModeActive = false;
    scheduleRender();
}

function drawPatterns() {
    let pType = canvasPattern.value;
    if(pType === 'none') return;
    let size = parseInt(patternSize.value) * currentUpscale;
    ctx.save();
    ctx.strokeStyle = patternColor.value; ctx.fillStyle = patternColor.value;
    ctx.lineWidth = 1 * currentUpscale;
    if(pType === 'grid') {
        for(let x=0; x<targetW; x+=size) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,targetH); ctx.stroke(); }
        for(let y=0; y<targetH; y+=size) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(targetW,y); ctx.stroke(); }
    } else if (pType === 'dots') {
        for(let x=0; x<targetW; x+=size) { for(let y=0; y<targetH; y+=size) { ctx.beginPath(); ctx.arc(x,y, size/10, 0, Math.PI*2); ctx.fill(); } }
    } else if (pType === 'stripes') {
        for(let i=-targetH; i<targetW*2; i+=size) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i-targetH, targetH); ctx.stroke(); }
    }
    ctx.restore();
}

function fillTextSpaced(ctx, text, x, y, letterSpacing) {
    if (letterSpacing === 0) { ctx.fillText(text, x, y); if(textStrokeToggle.checked) ctx.strokeText(text, x, y); return; }
    let totalWidth = 0; for (let i=0; i<text.length; i++) { totalWidth += ctx.measureText(text[i]).width + letterSpacing; }
    totalWidth -= letterSpacing; let startX = x - totalWidth/2;
    ctx.textAlign = 'left';
    for (let i=0; i<text.length; i++) { 
        ctx.fillText(text[i], startX, y); 
        if(textStrokeToggle.checked) ctx.strokeText(text[i], startX, y);
        startX += ctx.measureText(text[i]).width + letterSpacing; 
    }
    ctx.textAlign = 'center'; 
}

// ==========================================
// MASTER RENDER ENGINE (With Fast Mode)
// ==========================================
function renderEngine(skipSizeUpdate = false) {
    let FAST = isFastModeActive && !isExporting;
    let downscale = (FAST && currentUpscale > 1) ? currentUpscale : 1;
    
    canvas.width = targetW / downscale; 
    canvas.height = targetH / downscale;
    
    ctx.save(); 
    ctx.scale(1 / downscale, 1 / downscale); 

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = FAST ? 'low' : 'high';
    ctx.clearRect(0, 0, targetW, targetH);
    
    if (!transparentBgToggle.checked || imgFormat.value === 'image/jpeg') {
        ctx.fillStyle = bgColor.value || '#ffffff'; 
        ctx.fillRect(0, 0, targetW, targetH);
        if (!FAST) drawPatterns();
    }

    let isCircle = circleCropToggle.checked;
    let cornerRad = (parseInt(cornerRadiusInp.value) || 0) * currentUpscale;
    let m = (parseInt(innerMarginInp.value) || 0) * currentUpscale;
    
    ctx.save(); 
    if (isCircle) {
        ctx.beginPath();
        let radius = Math.max(1, (Math.min(targetW, targetH)/2) - m);
        ctx.arc(targetW/2, targetH/2, radius, 0, Math.PI * 2);
        ctx.clip();
    } else { 
        if(cornerRad > 0 || m > 0) {
            ctx.beginPath(); 
            ctx.roundRect(m, m, Math.max(1, targetW - 2*m), Math.max(1, targetH - 2*m), cornerRad); 
            ctx.clip(); 
        }
    }

    if(loadedImg) {
        if(instaBlurBgToggle.checked && !FAST) {
            ctx.save();
            let fillScale = Math.max(targetW/loadedImg.width, targetH/loadedImg.height);
            ctx.filter = `blur(${20*currentUpscale}px) brightness(80%)`;
            ctx.drawImage(loadedImg, (targetW - loadedImg.width*fillScale)/2, (targetH - loadedImg.height*fillScale)/2, loadedImg.width*fillScale, loadedImg.height*fillScale);
            ctx.restore();
        }

        let dynBlur = FAST ? 0 : (parseFloat(blurInp.value) || 0) * currentUpscale;
        let expVal = parseFloat(exposureInp.value) / 100;
        let mappedBright = brightnessInp.value * expVal; 
        let gray = parseInt(grayscaleInp.value);
        let sepia = parseInt(sepiaInp.value);
        let hue = parseInt(hueInp.value);
        let inv = invertToggle.checked ? 100 : 0;
        
        ctx.filter = `brightness(${mappedBright}%) contrast(${contrastInp.value}%) saturate(${saturationInp.value}%) grayscale(${gray}%) sepia(${sepia}%) hue-rotate(${hue}deg) invert(${inv}%) blur(${dynBlur}px)`;
        
        ctx.save();
        ctx.globalAlpha = parseFloat(opacityInp.value) / 100;
        let cx = imgX + (loadedImg.width * scale) / 2; 
        let cy = imgY + (loadedImg.height * scale) / 2;

        if (dropShadowToggle.checked && !FAST) {
            ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 15 * currentUpscale; ctx.shadowOffsetY = 10 * currentUpscale;
        }

        let renderWidth = loadedImg.width * scale; let renderHeight = loadedImg.height * scale;
        
        let pVal = FAST ? 0 : parseInt(pixelateInp.value);
        let imgSource = loadedImg;
        if(pVal > 0) {
            let pxCanvas = document.createElement('canvas');
            let reduction = pVal * currentUpscale * 0.05; 
            pxCanvas.width = renderWidth / reduction; pxCanvas.height = renderHeight / reduction;
            let pxCtx = pxCanvas.getContext('2d');
            pxCtx.drawImage(loadedImg, 0, 0, pxCanvas.width, pxCanvas.height);
            imgSource = pxCanvas;
            ctx.imageSmoothingEnabled = false; 
        }

        ctx.translate(cx, cy); ctx.rotate(rotation * Math.PI / 180); ctx.scale(flipH, flipV);

        let caVal = FAST ? 0 : parseInt(rgbSplitInp.value) * currentUpscale;

        function drawTransformedImg(xOff=0, yOff=0) {
            if(glitchToggle.checked && !FAST) {
                let slices = 10; let sliceH = renderHeight / slices;
                for(let i=0; i<slices; i++) {
                    let gOff = (Math.random() - 0.5) * 20 * currentUpscale;
                    ctx.drawImage(imgSource, 0, (imgSource.height/slices)*i, imgSource.width, imgSource.height/slices, 
                                 -(renderWidth)/2 + xOff + (i%2==0?gOff:0), -(renderHeight)/2 + yOff + (sliceH*i), renderWidth, sliceH);
                }
            } else {
                ctx.drawImage(imgSource, -(renderWidth)/2 + xOff, -(renderHeight)/2 + yOff, renderWidth, renderHeight);
            }
        }

        function drawWithMirror(xO=0, yO=0) {
            if(mirrorHToggle.checked && mirrorVToggle.checked) {
                ctx.save(); ctx.beginPath(); ctx.rect(-renderWidth/2, -renderHeight/2, renderWidth/2, renderHeight/2); ctx.clip(); drawTransformedImg(xO,yO); ctx.restore();
                ctx.save(); ctx.scale(-1,1); ctx.beginPath(); ctx.rect(-renderWidth/2, -renderHeight/2, renderWidth/2, renderHeight); ctx.clip(); drawTransformedImg(-xO,yO); ctx.restore();
                ctx.save(); ctx.scale(1,-1); ctx.beginPath(); ctx.rect(-renderWidth/2, -renderHeight/2, renderWidth/2, renderHeight/2); ctx.clip(); drawTransformedImg(xO,-yO); ctx.restore();
                ctx.save(); ctx.scale(-1,-1); ctx.beginPath(); ctx.rect(-renderWidth/2, -renderHeight/2, renderWidth/2, renderHeight/2); ctx.clip(); drawTransformedImg(-xO,-yO); ctx.restore();
            } else if (mirrorHToggle.checked) {
                ctx.save(); ctx.beginPath(); ctx.rect(-renderWidth/2, -renderHeight/2, renderWidth/2, renderHeight); ctx.clip(); drawTransformedImg(xO,yO); ctx.restore();
                ctx.save(); ctx.scale(-1,1); ctx.beginPath(); ctx.rect(-renderWidth/2, -renderHeight/2, renderWidth/2, renderHeight); ctx.clip(); drawTransformedImg(-xO,yO); ctx.restore();
            } else if (mirrorVToggle.checked) {
                ctx.save(); ctx.beginPath(); ctx.rect(-renderWidth/2, -renderHeight/2, renderWidth, renderHeight/2); ctx.clip(); drawTransformedImg(xO,yO); ctx.restore();
                ctx.save(); ctx.scale(1,-1); ctx.beginPath(); ctx.rect(-renderWidth/2, -renderHeight/2, renderWidth, renderHeight/2); ctx.clip(); drawTransformedImg(xO,-yO); ctx.restore();
            } else {
                drawTransformedImg(xO,yO);
            }
        }

        if(caVal > 0) {
            ctx.globalCompositeOperation = 'screen';
            ctx.filter += ' sepia(100%) hue-rotate(-50deg) saturate(300%)'; drawWithMirror(-caVal, 0); 
            ctx.filter = ctx.filter.replace('hue-rotate(-50deg)', 'hue-rotate(50deg)'); drawWithMirror(caVal, 0); 
            ctx.globalCompositeOperation = 'source-over';
        } else {
            drawWithMirror(0,0);
        }

        ctx.imageSmoothingEnabled = true; 
        ctx.shadowColor = 'transparent';

        let glowVal = FAST ? 0 : parseInt(studioGlowInp.value);
        if (glowVal > 0) {
            ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = glowVal / 100; 
            ctx.filter = `blur(${10*currentUpscale}px)`; drawWithMirror(0,0);
        }
        ctx.restore();

        if (duotoneToggle.checked && !FAST) {
            ctx.save();
            ctx.globalCompositeOperation = 'color';
            ctx.fillStyle = duoLight.value; ctx.fillRect(0,0,targetW,targetH);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = duoDark.value; ctx.fillRect(0,0,targetW,targetH);
            ctx.restore();
        }

        if (gradientToggle.checked && !FAST) {
            ctx.save();
            ctx.globalAlpha = parseInt(gradOpacity.value)/100;
            let ang = parseInt(gradAngle.value) * (Math.PI/180);
            let len = Math.max(targetW, targetH);
            let gx2 = targetW/2 + Math.cos(ang)*len/2; let gy2 = targetH/2 + Math.sin(ang)*len/2;
            let gx1 = targetW/2 - Math.cos(ang)*len/2; let gy1 = targetH/2 - Math.sin(ang)*len/2;
            let grad = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
            grad.addColorStop(0, gradColor1.value); grad.addColorStop(1, gradColor2.value);
            ctx.fillStyle = grad; ctx.fillRect(0,0,targetW,targetH);
            ctx.restore();
        }

        let postVal = FAST ? 0 : parseInt(posterizeInp.value);
        if(postVal > 0) {
            ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = postVal/10;
            ctx.filter = 'contrast(200%) saturate(150%)';
            ctx.drawImage(canvas,0,0); ctx.restore();
        }

        if (reflectionToggle.checked && !FAST) {
            ctx.save();
            ctx.filter = ctx.filter; 
            ctx.globalAlpha = 0.3 * (parseFloat(opacityInp.value) / 100);
            ctx.translate(cx, cy + loadedImg.height * scale + 5); 
            ctx.rotate(rotation * Math.PI / 180); ctx.scale(flipH, -flipV); 
            ctx.drawImage(loadedImg, -(loadedImg.width * scale) / 2, -(loadedImg.height * scale) / 2, loadedImg.width * scale, loadedImg.height * scale);
            ctx.restore();
        }

        let tempVal = parseInt(tempInp.value);
        if (tempVal !== 0 && !FAST) {
            ctx.save(); ctx.globalCompositeOperation = 'overlay'; 
            ctx.fillStyle = tempVal > 0 ? `rgba(255, 140, 0, ${tempVal/200})` : `rgba(0, 130, 255, ${-tempVal/200})`;
            ctx.fillRect(0, 0, targetW, targetH); ctx.restore();
        }

        let tintVal = parseInt(tintInp.value);
        if (tintVal !== 0 && !FAST) { 
            ctx.save(); ctx.globalCompositeOperation = 'overlay'; 
            ctx.fillStyle = tintVal > 0 ? `rgba(255, 0, 255, ${tintVal/200})` : `rgba(0, 255, 0, ${-tintVal/200})`;
            ctx.fillRect(0, 0, targetW, targetH); ctx.restore();
        }

        if (overlayMode.value !== 'none' && !FAST) { 
            ctx.save(); ctx.globalCompositeOperation = overlayMode.value; ctx.fillStyle = overlayColor.value; ctx.fillRect(0, 0, targetW, targetH); ctx.restore();
        }

        let vigVal = parseInt(vignetteInp.value);
        if (vigVal > 0 && !FAST) { 
            ctx.save(); ctx.globalCompositeOperation = 'multiply'; 
            let radius = Math.max(targetW, targetH) * 0.8;
            let gradient = ctx.createRadialGradient(targetW/2, targetH/2, radius*0.3, targetW/2, targetH/2, radius);
            let hex = vignetteColor.value;
            let r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
            gradient.addColorStop(0, `rgba(${r},${g},${b},0)`); 
            gradient.addColorStop(1, `rgba(${r},${g},${b},${vigVal/100})`);
            ctx.fillStyle = gradient; ctx.fillRect(0, 0, targetW, targetH); ctx.restore();
        }

        let grainVal = FAST ? 0 : parseInt(grainInp.value);
        if (grainVal > 0) {
            ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = grainVal / 100;
            ctx.drawImage(noiseCanvas, 0, 0, targetW, targetH); ctx.restore();
        }

        if (addWatermarkToggle.checked && !FAST) { 
            ctx.save(); ctx.translate(targetW/2, targetH/2); ctx.rotate(-30 * Math.PI / 180);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'; ctx.font = `bold ${targetW * 0.08}px Arial`; 
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            let wText = watermarkText.value || "SBU WATERMARK";
            for(let i = -3; i <= 3; i++) { for(let j = -3; j <= 3; j++) { ctx.fillText(wText, i * targetW * 0.5, j * targetH * 0.25); } }
            ctx.restore();
        }

        if (addTextToggle.checked && !FAST) { 
            ctx.filter = 'none'; 
            ctx.globalAlpha = parseInt(textOpacityInp.value) / 100;
            let stripH = targetH * 0.15;
            let stripY = textPosition.value === 'top' ? 0 : targetH - stripH;
            
            ctx.fillStyle = textBgColor.value || '#ffffff'; 
            ctx.fillRect(0, stripY, targetW, stripH);
            
            ctx.fillStyle = textColor.value || '#000000'; 
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            let fFamily = textFont.value || 'Arial';
            let lSpacing = parseInt(letterSpacingInp.value) * currentUpscale;
            
            if (textShadowToggle.checked && !FAST) {
                ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 4 * currentUpscale; ctx.shadowOffsetY = 1 * currentUpscale;
            }
            if (textStrokeToggle.checked) {
                ctx.strokeStyle = textStrokeColor.value; ctx.lineWidth = parseInt(textStrokeWidth.value) * currentUpscale;
                ctx.lineJoin = 'round';
            }
            
            let line1Y = textPosition.value === 'top' ? stripH * 0.35 : targetH - stripH * 0.65;
            let line2Y = textPosition.value === 'top' ? stripH * 0.75 : targetH - stripH * 0.25;

            ctx.font = `bold ${stripH * 0.35}px ${fFamily}`; 
            fillTextSpaced(ctx, photoName.value || "Name", targetW/2, line1Y, lSpacing);
            ctx.font = `600 ${stripH * 0.25}px ${fFamily}`; 
            fillTextSpaced(ctx, photoDate.value || "DD/MM/YYYY", targetW/2, line2Y, lSpacing/2);
            
            ctx.shadowColor = 'transparent'; ctx.globalAlpha = 1.0;
        }

        if (!isExporting) drawBoundingBox();
    }
    ctx.restore(); 

    if (!isExporting && crosshairToggle.checked) {
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)'; ctx.lineWidth = 1 * currentUpscale; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(targetW/2, 0); ctx.lineTo(targetW/2, targetH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, targetH/2); ctx.lineTo(targetW, targetH/2); ctx.stroke();
    }

    if (addBorderToggle.checked && !FAST) { 
        ctx.filter = 'none'; ctx.strokeStyle = '#000000'; 
        ctx.globalAlpha = parseInt(borderOpacity.value) / 100;
        
        if (borderStyle.value === 'dashed') ctx.setLineDash([12*currentUpscale, 12*currentUpscale]);
        else if (borderStyle.value === 'dotted') ctx.setLineDash([4*currentUpscale, 8*currentUpscale]);
        else ctx.setLineDash([]);
        
        ctx.lineWidth = (parseInt(borderWidthInp.value) || 2) * currentUpscale;
        let mw = Math.max(1, targetW - 2*m);
        let mh = Math.max(1, targetH - 2*m);

        if (isCircle) {
            ctx.beginPath();
            ctx.arc(targetW/2, targetH/2, Math.max(1, (Math.min(targetW, targetH)/2) - m), 0, Math.PI * 2);
            ctx.stroke();
        } else if (cornerRad > 0) { 
            ctx.beginPath(); ctx.roundRect(m, m, mw, mh, cornerRad); ctx.stroke(); 
        } else { ctx.strokeRect(m, m, mw, mh); }
        ctx.globalAlpha = 1.0;
    }

    ctx.restore();

    document.getElementById('marginVal').innerText = innerMarginInp.value + 'px';
    document.getElementById('textOpVal').innerText = textOpacityInp.value + '%';
    document.getElementById('exposureVal').innerText = exposureInp.value; 
    document.getElementById('brightVal').innerText = brightnessInp.value; 
    document.getElementById('contrastVal').innerText = contrastInp.value; 
    document.getElementById('saturateVal').innerText = saturationInp.value; 
    document.getElementById('grayVal').innerText = grayscaleInp.value + '%'; 
    document.getElementById('sepiaVal').innerText = sepiaInp.value + '%'; 
    document.getElementById('hueVal').innerText = hueInp.value + '°'; 
    document.getElementById('rotVal').innerText = rotation + '°'; 
    document.getElementById('opacityVal').innerText = opacityInp.value + '%'; 
    document.getElementById('grainVal').innerText = grainInp.value + '%'; 
    document.getElementById('tintVal').innerText = tintInp.value; 
    document.getElementById('blurVal').innerText = blurInp.value + 'px'; 
    document.getElementById('tempVal').innerText = tempInp.value; 
    document.getElementById('vignetteVal').innerText = vignetteInp.value + '%'; 
    document.getElementById('radiusVal').innerText = cornerRadiusInp.value + 'px'; 
    document.getElementById('glowVal').innerText = studioGlowInp.value + '%';
    document.getElementById('pixelVal').innerText = pixelateInp.value;
    document.getElementById('rgbSplitVal').innerText = rgbSplitInp.value;
    document.getElementById('posterizeVal').innerText = posterizeInp.value;
    document.getElementById('gradAngleVal').innerText = gradAngle.value + '°';
    document.getElementById('gradOpVal').innerText = gradOpacity.value + '%';
    document.getElementById('letterSpVal').innerText = letterSpacingInp.value + 'px';

    if (!skipSizeUpdate) triggerLiveSizeUpdate();
}

function triggerLiveSizeUpdate() {
    clearTimeout(estSizeTimeout);
    estSizeTimeout = setTimeout(() => {
        if (!loadedImg || isExporting || isFastModeActive) return;
        try {
            let tmp = getCleanCanvasData(); 
            let data = tmp.toDataURL(imgFormat.value, 0.9); 
            let kb = (data.length * 0.75) / 1024;
            if (kb >= 1024) liveEstSize.innerText = (kb / 1024).toFixed(2) + " MB";
            else liveEstSize.innerText = Math.round(kb) + " KB";
        } catch(e) { liveEstSize.innerText = "Error"; }
    }, 800); 
}

// ==========================================
// DRAGGING AND BOUNDING BOX
// ==========================================
function getHandles() {
    if(!loadedImg) return [];
    let w = loadedImg.width * scale; let h = loadedImg.height * scale; let hs = handleSize * currentUpscale;
    return [
        { type: 'nw', x: imgX - hs/2, y: imgY - hs/2, cursor: 'nwse-resize' },
        { type: 'ne', x: imgX + w - hs/2, y: imgY - hs/2, cursor: 'nesw-resize' },
        { type: 'sw', x: imgX - hs/2, y: imgY + h - hs/2, cursor: 'nesw-resize' },
        { type: 'se', x: imgX + w - hs/2, y: imgY + h - hs/2, cursor: 'nwse-resize' }
    ];
}

function drawBoundingBox() {
    let w = loadedImg.width * scale; let h = loadedImg.height * scale; let hs = handleSize * currentUpscale;
    ctx.filter = 'none'; ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 2 * currentUpscale; 
    ctx.setLineDash([]); ctx.strokeRect(imgX, imgY, w, h);
    ctx.fillStyle = '#ffffff';
    getHandles().forEach(handle => { ctx.fillRect(handle.x, handle.y, hs, hs); ctx.strokeRect(handle.x, handle.y, hs, hs); });
}

canvas.addEventListener('mousemove', (e) => {
    if (!loadedImg) return;
    const rect = canvas.getBoundingClientRect(); 
    const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX; const my = (e.clientY - rect.top) * scaleY;
    
    if (isResizing) {
        let dx = mx - startX; let dy = my - startY; let dir = 1;
        if (resizeHandle === 'se') dir = (dx > 0) ? 1 : -1; else if (resizeHandle === 'nw') dir = (dx < 0) ? 1 : -1; 
        else if (resizeHandle === 'ne') dir = (dx > 0) ? 1 : -1; else if (resizeHandle === 'sw') dir = (dx < 0) ? 1 : -1;
        let distance = Math.sqrt(dx*dx + dy*dy); let scaleChange = (distance / (500*currentUpscale)) * dir; 
        scale = Math.max(0.1, originalScale + scaleChange); 
        let newW = loadedImg.width * scale; let newH = loadedImg.height * scale; 
        let oldW = loadedImg.width * originalScale; let oldH = loadedImg.height * originalScale;
        imgX -= (newW - oldW) / 2; imgY -= (newH - oldH) / 2;
        originalScale = scale; startX = mx; startY = my; 
        isFastModeActive = true; scheduleRender(true); return;
    }
    if (isDragging) { imgX = mx - startX; imgY = my - startY; isFastModeActive = true; scheduleRender(true); return; }

    let hs = handleSize * currentUpscale; let handles = getHandles();
    let hoveringHandle = handles.find(h => mx >= h.x && mx <= h.x+hs && my >= h.y && my <= h.y+hs);
    
    if (hoveringHandle) canvas.style.cursor = hoveringHandle.cursor;
    else if (mx >= imgX && mx <= imgX + loadedImg.width * scale && my >= imgY && my <= imgY + loadedImg.height * scale) canvas.style.cursor = 'move';
    else canvas.style.cursor = 'default';
});

canvas.addEventListener('mousedown', (e) => {
    if (!loadedImg) return;
    const rect = canvas.getBoundingClientRect(); 
    const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX; const my = (e.clientY - rect.top) * scaleY;
    let hs = handleSize * currentUpscale; let handles = getHandles();
    let clickedHandle = handles.find(h => mx >= h.x && mx <= h.x+hs && my >= h.y && my <= h.y+hs);
    if (clickedHandle) { isResizing = true; isFastModeActive = true; resizeHandle = clickedHandle.type; startX = mx; startY = my; originalScale = scale; } 
    else if (mx >= imgX && mx <= imgX + loadedImg.width * scale && my >= imgY && my <= imgY + loadedImg.height * scale) { isDragging = true; isFastModeActive = true; startX = mx - imgX; startY = my - imgY; }
});

window.addEventListener('mouseup', () => { 
    if(isDragging || isResizing) {
        isDragging = false; isResizing = false; 
        isFastModeActive = false;
        scheduleRender(); 
    }
});

canvas.addEventListener('touchstart', (e) => {
    if (!loadedImg) return; e.preventDefault(); 
    const rect = canvas.getBoundingClientRect(); const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height;
    if (e.touches.length === 1) {
        const mx = (e.touches[0].clientX - rect.left) * scaleX; const my = (e.touches[0].clientY - rect.top) * scaleY;
        let hs = handleSize * currentUpscale; let hitPad = 15 * currentUpscale; let handles = getHandles(); 
        let clickedHandle = handles.find(h => mx >= h.x - hitPad && mx <= h.x+hs+hitPad && my >= h.y - hitPad && my <= h.y+hs+hitPad); 
        if (clickedHandle) { isResizing = true; isFastModeActive = true; resizeHandle = clickedHandle.type; startX = mx; startY = my; originalScale = scale; } 
        else if (mx >= imgX && mx <= imgX + loadedImg.width * scale && my >= imgY && my <= imgY + loadedImg.height * scale) { isDragging = true; isFastModeActive = true; startX = mx - imgX; startY = my - imgY; }
    } else if (e.touches.length === 2) {
        isDragging = false; isResizing = false; 
        isFastModeActive = true;
        const dx = e.touches[0].clientX - e.touches[1].clientX; const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDist = Math.sqrt(dx * dx + dy * dy); initialPinchScale = scale;
    }
}, {passive: false});

canvas.addEventListener('touchmove', (e) => {
    if (!loadedImg) return; e.preventDefault(); 
    const rect = canvas.getBoundingClientRect(); const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height;
    if (e.touches.length === 1) {
        const mx = (e.touches[0].clientX - rect.left) * scaleX; const my = (e.touches[0].clientY - rect.top) * scaleY;
        if (isResizing) {
            let dx = mx - startX; let dy = my - startY; let dir = 1;
            if (resizeHandle === 'se') dir = (dx > 0) ? 1 : -1; else if (resizeHandle === 'nw') dir = (dx < 0) ? 1 : -1; 
            else if (resizeHandle === 'ne') dir = (dx > 0) ? 1 : -1; else if (resizeHandle === 'sw') dir = (dx < 0) ? 1 : -1;
            let distance = Math.sqrt(dx*dx + dy*dy); let scaleChange = (distance / (500*currentUpscale)) * dir; 
            scale = Math.max(0.1, originalScale + scaleChange); 
            let newW = loadedImg.width * scale; let newH = loadedImg.height * scale; let oldW = loadedImg.width * originalScale; let oldH = loadedImg.height * originalScale;
            imgX -= (newW - oldW) / 2; imgY -= (newH - oldH) / 2; originalScale = scale; startX = mx; startY = my; isFastModeActive = true; scheduleRender(true); 
        } else if (isDragging) { imgX = mx - startX; imgY = my - startY; isFastModeActive = true; scheduleRender(true); }
    } else if (e.touches.length === 2 && initialPinchDist) {
        const dx = e.touches[0].clientX - e.touches[1].clientX; const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy); const pinchRatio = currentDistance / initialPinchDist;
        let oldW = loadedImg.width * scale; let oldH = loadedImg.height * scale;
        scale = initialPinchScale * pinchRatio; scale = Math.max(0.1, scale); 
        let newW = loadedImg.width * scale; let newH = loadedImg.height * scale;
        imgX -= (newW - oldW) / 2; imgY -= (newH - oldH) / 2; isFastModeActive = true; scheduleRender(true); 
    }
}, {passive: false});

canvas.addEventListener('touchend', () => { 
    if(isDragging || isResizing || initialPinchDist) {
        isDragging = false; isResizing = false; initialPinchDist = null; 
        isFastModeActive = false; 
        scheduleRender(); 
    }
});

// ==========================================
// EXPORT & PRINT LOGIC
// ==========================================
function getCleanCanvasData() {
    isExporting = true; renderEngine(true); 
    let tempCanvas = document.createElement('canvas'); tempCanvas.width = targetW; tempCanvas.height = targetH;
    let tCtx = tempCanvas.getContext('2d'); tCtx.imageSmoothingEnabled = true; tCtx.imageSmoothingQuality = 'high';
    tCtx.putImageData(ctx.getImageData(0,0,targetW,targetH), 0, 0);
    isExporting = false; renderEngine(true); 
    return tempCanvas;
}

function renderPrintPreview() {
    let isA4 = paperSize.value === 'a4'; let pdfW = isA4 ? 210 : 102; let pdfH = isA4 ? 297 : 152;
    previewCanvas.width = pdfW * 3; previewCanvas.height = pdfH * 3; previewCanvas.style.height = isA4 ? "350px" : "250px";
    pCtx.fillStyle = '#ffffff'; pCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    let tempCanvas = getCleanCanvasData();
    const printW = (targetW / currentUpscale * (25.4 / 300)) * 3; const printH = (targetH / currentUpscale * (25.4 / 300)) * 3;
    const gap = 4 * 3; const margin = (isA4 ? 8 : 5) * 3; let x = margin; let y = margin;
    for(let i=0; i < printPhotoCount; i++) {
        pCtx.drawImage(tempCanvas, x, y, printW, printH);
        if(printCropMarks.checked) { pCtx.strokeStyle = 'rgba(0,0,0,0.15)'; pCtx.lineWidth = 1; pCtx.setLineDash([4, 4]); pCtx.strokeRect(x, y, printW, printH); }
        x += printW + gap; if(x + printW > previewCanvas.width - margin) { x = margin; y += printH + gap; }
    }
}

openPrintModalBtn.onclick = () => {
    exportDropdown.classList.remove('show');
    if(!loadedImg) return showToast("Upload photo first!", "exclamation-triangle");
    printModal.style.display = 'flex'; previewCountText.innerText = printPhotoCount; renderPrintPreview();
};
closeModalBtn.onclick = () => { printModal.style.display = 'none'; };
btnPlus.onclick = () => { printPhotoCount++; previewCountText.innerText = printPhotoCount; renderPrintPreview(); };
btnMinus.onclick = () => { if(printPhotoCount > 1) { printPhotoCount--; previewCountText.innerText = printPhotoCount; renderPrintPreview(); } };

downloadSingleBtn.onclick = () => {
    exportDropdown.classList.remove('show');
    if(!loadedImg) return showToast("Upload photo first!", "exclamation-triangle");
    let tempCanvas = getCleanCanvasData();
    const format = imgFormat.value; const sizeLimit = parseInt(targetKB.value) || 0;
    let finalFormat = format; let dataUrl = tempCanvas.toDataURL(finalFormat, 1.0);
    if (sizeLimit > 0) {
        if(format === 'image/png') { showToast("JPG auto-selected for size limit!"); finalFormat = 'image/jpeg'; }
        let minQ = 0.05, maxQ = 1.0; let bestDataUrl = tempCanvas.toDataURL(finalFormat, 1.0);
        let currentSize = Math.round((bestDataUrl.length * 3/4) / 1024);
        if (currentSize > sizeLimit) {
            for (let i = 0; i < 8; i++) { 
                let midQ = (minQ + maxQ) / 2; let testUrl = tempCanvas.toDataURL(finalFormat, midQ); 
                let kb = Math.round((testUrl.length * 3/4) / 1024);
                if (kb <= sizeLimit) { bestDataUrl = testUrl; minQ = midQ; } else { maxQ = midQ; }
            }
            dataUrl = bestDataUrl;
        }
        let scaleDown = 0.9;
        while (Math.round((dataUrl.length * 3/4) / 1024) > sizeLimit && scaleDown > 0.3) {
            let shrinkCanvas = document.createElement('canvas'); shrinkCanvas.width = targetW * scaleDown; shrinkCanvas.height = targetH * scaleDown;
            let sCtx = shrinkCanvas.getContext('2d'); sCtx.imageSmoothingEnabled = true; sCtx.imageSmoothingQuality = 'high';
            sCtx.drawImage(tempCanvas, 0, 0, shrinkCanvas.width, shrinkCanvas.height);
            dataUrl = shrinkCanvas.toDataURL(finalFormat, 0.7); scaleDown -= 0.1;
        }
    }
    const link = document.createElement('a'); let randomID = Math.floor(Math.random() * 900) + 100;
    link.download = `PixelPass_PRO_${randomID}_${currentUpscale}x.${finalFormat.split('/')[1]}`;
    link.href = dataUrl; link.click(); showToast("Photo Downloaded Successfully!");
};

downloadPdfBtn.onclick = () => {
    const { jsPDF } = window.jspdf; let isA4 = paperSize.value === 'a4';
    const doc = new jsPDF('p', 'mm', [isA4 ? 210:102, isA4 ? 297:152]);
    let tempCanvas = getCleanCanvasData(); const imgData = tempCanvas.toDataURL('image/jpeg', 1.0);
    const printW = (targetW / currentUpscale) * (25.4 / 300); const printH = (targetH / currentUpscale) * (25.4 / 300);
    const gap = 4; const margin = isA4 ? 8 : 5; let x = margin; let y = margin;
    if(printCropMarks.checked) { doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.1); doc.setLineDash([1, 1]); }
    
    for(let i=0; i<printPhotoCount; i++) {
        doc.addImage(imgData, 'JPEG', x, y, printW, printH);
        if(printCropMarks.checked) doc.rect(x, y, printW, printH);
        x += printW + gap; 
        if(x + printW > (isA4?210:102) - margin) { x = margin; y += printH + gap; }
        if(y + printH > (isA4?297:152) - margin && i < printPhotoCount-1) { doc.addPage(); x = margin; y = margin; }
    }
    let randomID = Math.floor(Math.random() * 900) + 100; doc.save(`PixelPass_Print_${randomID}.pdf`); 
    printModal.style.display = 'none'; showToast("PDF Downloaded!");
};

// ==========================================
// BACKGROUND REMOVAL API & PRESETS
// ==========================================
removeBGBtn.addEventListener('click', async () => {
    if (!loadedImg) return showToast("Please upload a photo first!", "exclamation-triangle");

    const originalContent = removeBGBtn.innerHTML;
    removeBGBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    removeBGBtn.style.pointerEvents = 'none';
    removeBGBtn.style.opacity = '0.7';
    showToast("Removing background... This may take a few seconds.", "magic");

    try {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = loadedImg.width; tempCanvas.height = loadedImg.height;
        const tCtx = tempCanvas.getContext('2d');
        tCtx.drawImage(loadedImg, 0, 0);

        const blob = await new Promise(resolve => tempCanvas.toBlob(resolve, 'image/png'));
        const formData = new FormData();
        formData.append('size', 'auto'); 
        formData.append('crop', 'false'); // Prevents API crop, keeps resolution/scale relative layout intact
        formData.append('image_file', blob);

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: { 'X-Api-Key': 'F2r58KGQV9kvStRGBvjeemDT' },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors[0].title || "API Error");
        }

        const resultBlob = await response.blob();
        const objectURL = URL.createObjectURL(resultBlob);

        const newImg = new Image();
        newImg.onload = () => {
            const oldW = loadedImg.width;
            loadedImg = newImg; 
            
            // Adjust ratio automatically to prevent 'zoom out' effect of API quality drop
            let ratio = newImg.width / oldW;
            scale = scale / ratio;
            
            transparentBgToggle.checked = true;
            imgFormat.value = 'image/png'; 
            
            isFastModeActive = false;
            scheduleRender(); // Notice: NO resetLayout() here, so your image stays exact where it was!
            showToast("Background Removed Successfully!", "check-circle");
            
            removeBGBtn.innerHTML = originalContent;
            removeBGBtn.style.pointerEvents = 'auto';
            removeBGBtn.style.opacity = '1';
        };
        newImg.src = objectURL;

    } catch (error) {
        console.error("Remove BG Error:", error);
        showToast("Error: " + error.message, "times-circle");
        removeBGBtn.innerHTML = originalContent;
        removeBGBtn.style.pointerEvents = 'auto';
        removeBGBtn.style.opacity = '1';
    }
});

aiEnhanceBtn.onclick = () => {
    if(!loadedImg) return showToast("Upload photo first!", "exclamation-triangle");
    brightnessInp.value = 110; contrastInp.value = 115; saturationInp.value = 110; blurInp.value = 0;
    isFastModeActive = false; scheduleRender(); showToast("Auto Fix Applied", "check-circle");
};

if(aiColorBtn) aiColorBtn.onclick = () => {
    if(!loadedImg) return showToast("Upload photo first!", "exclamation-triangle");
    saturationInp.value = 130; contrastInp.value = 110; tempInp.value = 10;
    isFastModeActive = false; scheduleRender(); showToast("Auto Color Applied", "palette");
};

if(aiBrightBtn) aiBrightBtn.onclick = () => {
    if(!loadedImg) return showToast("Upload photo first!", "exclamation-triangle");
    brightnessInp.value = 120; exposureInp.value = 110; contrastInp.value = 105;
    isFastModeActive = false; scheduleRender(); showToast("Brighten Applied", "sun");
};

if(aiSharpBtn) aiSharpBtn.onclick = () => {
    if(!loadedImg) return showToast("Upload photo first!", "exclamation-triangle");
    contrastInp.value = 125; saturationInp.value = 105; blurInp.value = 0;
    isFastModeActive = false; scheduleRender(); showToast("Sharp & Clear Applied", "adjust");
};

if(aiPortraitBtn) aiPortraitBtn.onclick = () => {
    if(!loadedImg) return showToast("Upload photo first!", "exclamation-triangle");
    brightnessInp.value = 105; contrastInp.value = 105; tempInp.value = 15; blurInp.value = 0.5; studioGlowInp.value = 5;
    isFastModeActive = false; scheduleRender(); showToast("Portrait Applied", "user");
};

// ==========================================
// TABS & MOBILE CONTROLLER
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const panels = document.querySelectorAll('.panel-card');
    const desktopTabs = document.querySelectorAll('.sidebar-nav .nav-tab');
    const mobileTabs = document.querySelectorAll('.mobile-bottom-nav .nav-tab');
    const panelsContainer = document.getElementById('panelsContainer');

    function switchTab(index) {
        if (window.innerWidth > 900) {
            panels.forEach((p, i) => p.style.display = (i === index) ? 'block' : 'none');
        } else {
            const targetPanel = panels[index];
            if(targetPanel) panelsContainer.scrollTo({ left: targetPanel.offsetLeft, behavior: 'smooth' });
        }
        desktopTabs.forEach((t, i) => t.classList.toggle('active', i === index));
        mobileTabs.forEach((t, i) => t.classList.toggle('active', i === index));
    }

    desktopTabs.forEach(tab => tab.addEventListener('click', () => switchTab(parseInt(tab.dataset.index))));
    mobileTabs.forEach(tab => tab.addEventListener('click', () => switchTab(parseInt(tab.dataset.index))));

    panelsContainer.addEventListener('scroll', () => {
        if(window.innerWidth <= 900) {
            let index = Math.round(panelsContainer.scrollLeft / window.innerWidth);
            mobileTabs.forEach((t, i) => t.classList.toggle('active', i === index));
            desktopTabs.forEach((t, i) => t.classList.toggle('active', i === index));
        }
    });
    if(window.innerWidth > 900) switchTab(0);
    window.addEventListener('resize', () => {
        if(window.innerWidth > 900) {
            let activeIdx = Array.from(desktopTabs).findIndex(t => t.classList.contains('active'));
            switchTab(activeIdx > -1 ? activeIdx : 0);
        } else { panels.forEach(p => p.style.display = 'block'); }
    });
});
