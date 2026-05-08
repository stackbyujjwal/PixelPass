// --- DOM ELEMENTS ---
const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');
const themeToggle = document.getElementById('themeToggle');

// Sidebar (Left)
const ratioSelect = document.getElementById('ratioSelect');
const customSizeWrapper = document.getElementById('customSizeWrapper');
const customUnit = document.getElementById('customUnit');
const customW = document.getElementById('customW');
const customH = document.getElementById('customH');
const addBorderToggle = document.getElementById('addBorderToggle');
const borderWidthInp = document.getElementById('borderWidth');
const showGuideToggle = document.getElementById('showGuideToggle'); // NEW
const addTextToggle = document.getElementById('addTextToggle');
const photoName = document.getElementById('photoName');
const photoDate = document.getElementById('photoDate');
const paperSize = document.getElementById('paperSize');
const printCropMarks = document.getElementById('printCropMarks'); // NEW
const targetKB = document.getElementById('targetKB');
const imgFormat = document.getElementById('imgFormat');

// Sidebar (Right)
const rightSidebar = document.getElementById('rightSidebar');
const bgColor = document.getElementById('bgColor');
const brightnessInp = document.getElementById('brightness');
const contrastInp = document.getElementById('contrast');
const saturationInp = document.getElementById('saturation');
const rotationInp = document.getElementById('rotation');
const flipHBtn = document.getElementById('flipHBtn');
const flipVBtn = document.getElementById('flipVBtn');

const tempInp = document.getElementById('temperature'); // NEW
const hueInp = document.getElementById('hue');
const grayInp = document.getElementById('grayscale');
const blurInp = document.getElementById('blur');
const sepiaInp = document.getElementById('sepia');
const vignetteInp = document.getElementById('vignette'); // NEW

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

// --- STATE VARIABLES ---
let loadedImg = null;
let targetW = 413, targetH = 531; 
let scale = 1, imgX = 0, imgY = 0;
let rotation = 0, flipH = 1, flipV = 1; 
let printPhotoCount = 8;
let isExporting = false; // FLAG TO HIDE UI ELEMENTS DURING DOWNLOAD

// Drag & Resize State
let isDragging = false, isResizing = false;
let resizeHandle = '', startX = 0, startY = 0, originalScale = 1;
const handleSize = 12;

// Init Main Canvas
canvas.width = targetW; canvas.height = targetH;
renderEngine();

// --- THEME ---
themeToggle.onclick = () => {
    const isDark = document.body.dataset.theme === 'dark';
    document.body.dataset.theme = isDark ? 'light' : 'dark';
    themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
};

// --- DIMENSION CALCULATOR ---
function updateDimensions() {
    if (ratioSelect.value === 'custom') {
        customSizeWrapper.style.display = 'block';
        let valW = parseFloat(customW.value) || 400;
        let valH = parseFloat(customH.value) || 400;
        let unit = customUnit.value;

        if (unit === 'inch') { targetW = Math.round(valW * 300); targetH = Math.round(valH * 300); } 
        else if (unit === 'cm') { targetW = Math.round((valW * 300) / 2.54); targetH = Math.round((valH * 300) / 2.54); } 
        else { targetW = valW; targetH = valH; }
    } else {
        customSizeWrapper.style.display = 'none';
        let [w, h] = ratioSelect.value.split('x');
        targetW = parseInt(w); targetH = parseInt(h);
    }
    resetLayout();
}

ratioSelect.addEventListener('change', updateDimensions);
customW.addEventListener('input', updateDimensions);
customH.addEventListener('input', updateDimensions);
customUnit.addEventListener('change', updateDimensions);

addTextToggle.addEventListener('change', (e) => {
    document.getElementById('textInputsWrapper').style.display = e.target.checked ? 'flex' : 'none';
    renderEngine();
});

showGuideToggle.addEventListener('change', renderEngine);
printCropMarks.addEventListener('change', () => { if(printModal.style.display === 'flex') renderPrintPreview(); });

// Event Listeners for UI
[photoName, photoDate, addBorderToggle, borderWidthInp, bgColor, brightnessInp, contrastInp, saturationInp, hueInp, grayInp, blurInp, sepiaInp, tempInp, vignetteInp].forEach(el => el.addEventListener('input', renderEngine));

rotationInp.addEventListener('input', (e) => { rotation = parseInt(e.target.value); renderEngine(); });
flipHBtn.onclick = () => { flipH *= -1; renderEngine(); };
flipVBtn.onclick = () => { flipV *= -1; renderEngine(); };

// --- UPLOAD ---
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

// --- MASTER RENDER ENGINE (GOD LEVEL) ---
function renderEngine() {
    canvas.width = targetW; canvas.height = targetH;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Background
    ctx.filter = 'none'; ctx.fillStyle = bgColor.value; ctx.fillRect(0, 0, targetW, targetH);

    if(loadedImg) {
        ctx.filter = `
            brightness(${brightnessInp.value}%) 
            contrast(${contrastInp.value}%) 
            saturate(${saturationInp.value}%) 
            hue-rotate(${hueInp.value}deg) 
            grayscale(${grayInp.value}%) 
            blur(${blurInp.value}px) 
            sepia(${sepiaInp.value}%)
        `;
        
        ctx.save();
        let cx = imgX + (loadedImg.width * scale) / 2;
        let cy = imgY + (loadedImg.height * scale) / 2;
        
        ctx.translate(cx, cy);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.scale(flipH, flipV);
        
        ctx.drawImage(
            loadedImg, 
            -(loadedImg.width * scale) / 2, 
            -(loadedImg.height * scale) / 2, 
            loadedImg.width * scale, 
            loadedImg.height * scale
        );
        ctx.restore();

        // 1. TEMPERATURE (Skin Tone Warmth/Coolness)
        let tempVal = parseInt(tempInp.value);
        if (tempVal !== 0) {
            ctx.save();
            ctx.globalCompositeOperation = 'overlay';
            // Postive = Orange/Warm, Negative = Blue/Cool
            ctx.fillStyle = tempVal > 0 ? `rgba(255, 140, 0, ${tempVal/200})` : `rgba(0, 130, 255, ${-tempVal/200})`;
            ctx.fillRect(0, 0, targetW, targetH);
            ctx.restore();
        }

        // 2. VIGNETTE (Dark Edges)
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

        // Name & Date Strip
        if (addTextToggle.checked) {
            ctx.filter = 'none';
            let stripH = targetH * 0.15;
            ctx.fillStyle = '#ffffff'; ctx.fillRect(0, targetH - stripH, targetW, stripH);
            ctx.fillStyle = '#000000'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            
            ctx.font = `bold ${stripH * 0.35}px Arial`;
            ctx.fillText(photoName.value || "Name", targetW / 2, targetH - stripH * 0.65);
            ctx.font = `600 ${stripH * 0.25}px Arial`;
            ctx.fillText(photoDate.value || "DD/MM/YYYY", targetW / 2, targetH - stripH * 0.25);
        }

        // BIOMETRIC FACE GUIDE (Only visible in editor, hidden on export)
        if (showGuideToggle.checked && !isExporting) {
            ctx.save();
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)'; // Green Pro Color
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            
            // Head Oval
            ctx.beginPath();
            ctx.ellipse(targetW/2, targetH * 0.45, targetW * 0.35, targetH * 0.32, 0, 0, Math.PI*2);
            ctx.stroke();
            
            // Eye Level Line
            ctx.beginPath();
            ctx.moveTo(targetW * 0.1, targetH * 0.4);
            ctx.lineTo(targetW * 0.9, targetH * 0.4);
            ctx.stroke();
            
            // Center Alignment Line
            ctx.beginPath();
            ctx.moveTo(targetW/2, targetH * 0.05);
            ctx.lineTo(targetW/2, targetH * 0.85);
            ctx.stroke();
            
            // Guide Text
            ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
            ctx.font = `bold ${targetW * 0.04}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText("EYE LEVEL", targetW/2, targetH * 0.38);
            ctx.restore();
        }

        // Bounding Box UI
        if(!isExporting) drawBoundingBox();
    }

    // Cutting Border
    if (addBorderToggle.checked) {
        ctx.filter = 'none'; ctx.strokeStyle = '#000000'; 
        ctx.setLineDash([]);
        ctx.lineWidth = parseInt(borderWidthInp.value) || 2;
        ctx.strokeRect(0, 0, targetW, targetH);
    }

    // Update UI Stats
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
}

// --- BOUNDING BOX ---
function getHandles() {
    if(!loadedImg) return [];
    let w = loadedImg.width * scale, h = loadedImg.height * scale;
    return [
        { type: 'nw', x: imgX - handleSize/2, y: imgY - handleSize/2, cursor: 'nwse-resize' },
        { type: 'ne', x: imgX + w - handleSize/2, y: imgY - handleSize/2, cursor: 'nesw-resize' },
        { type: 'sw', x: imgX - handleSize/2, y: imgY + h - handleSize/2, cursor: 'nesw-resize' },
        { type: 'se', x: imgX + w - handleSize/2, y: imgY + h - handleSize/2, cursor: 'nwse-resize' }
    ];
}

function drawBoundingBox() {
    let w = loadedImg.width * scale, h = loadedImg.height * scale;
    ctx.filter = 'none';
    ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 2; ctx.setLineDash([]);
    ctx.strokeRect(imgX, imgY, w, h);
    
    ctx.fillStyle = '#ffffff';
    getHandles().forEach(handle => {
        ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
        ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
    });
}

// Mouse Events for Resize/Drag
canvas.addEventListener('mousemove', (e) => {
    if (!loadedImg) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    
    if (isResizing) {
        let dx = mx - startX, dy = my - startY;
        let dir = 1;
        if (resizeHandle === 'se') dir = (dx > 0) ? 1 : -1;
        if (resizeHandle === 'nw') dir = (dx < 0) ? 1 : -1;
        if (resizeHandle === 'ne') dir = (dx > 0) ? 1 : -1;
        if (resizeHandle === 'sw') dir = (dx < 0) ? 1 : -1;

        let distance = Math.sqrt(dx*dx + dy*dy);
        let scaleChange = (distance / 500) * dir; 
        
        scale = Math.max(0.1, originalScale + scaleChange);
        
        let newW = loadedImg.width * scale, newH = loadedImg.height * scale;
        let oldW = loadedImg.width * originalScale, oldH = loadedImg.height * originalScale;
        
        imgX -= (newW - oldW) / 2; imgY -= (newH - oldH) / 2;
        
        originalScale = scale; startX = mx; startY = my;
        renderEngine();
        return;
    }
    
    if (isDragging) {
        imgX = mx - startX; imgY = my - startY;
        renderEngine();
        return;
    }

    let handles = getHandles();
    let hoveringHandle = handles.find(h => mx >= h.x && mx <= h.x+handleSize && my >= h.y && my <= h.y+handleSize);
    
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
    
    let handles = getHandles();
    let clickedHandle = handles.find(h => mx >= h.x && mx <= h.x+handleSize && my >= h.y && my <= h.y+handleSize);

    if (clickedHandle) {
        isResizing = true; resizeHandle = clickedHandle.type;
        startX = mx; startY = my; originalScale = scale;
    } else if (mx > imgX && mx < imgX + loadedImg.width * scale && my > imgY && my < imgY + loadedImg.height * scale) {
        isDragging = true; startX = mx - imgX; startY = my - imgY;
    }
});
window.addEventListener('mouseup', () => { isDragging = false; isResizing = false; });

// --- Helper for generating pure image data (No UI/Guides) ---
function getCleanCanvasData() {
    isExporting = true;
    renderEngine();
    
    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = targetW; tempCanvas.height = targetH;
    let tCtx = tempCanvas.getContext('2d');
    tCtx.imageSmoothingEnabled = true;
    tCtx.imageSmoothingQuality = 'high';
    tCtx.putImageData(ctx.getImageData(0,0,targetW,targetH), 0, 0);
    
    isExporting = false;
    renderEngine(); // Restore UI on main canvas
    return tempCanvas;
}

// --- MODAL & PRINT PREVIEW LOGIC ---
function renderPrintPreview() {
    let isA4 = paperSize.value === 'a4';
    let pdfW = isA4 ? 210 : 102; 
    let pdfH = isA4 ? 297 : 152;
    
    previewCanvas.width = pdfW * 3; previewCanvas.height = pdfH * 3;
    previewCanvas.style.height = isA4 ? "350px" : "250px";

    pCtx.fillStyle = '#ffffff';
    pCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

    let tempCanvas = getCleanCanvasData();

    const printW = (targetW * (25.4 / 300)) * 3; const printH = (targetH * (25.4 / 300)) * 3;
    const gap = 4 * 3, margin = (isA4 ? 8 : 5) * 3;
    let x = margin, y = margin;

    for(let i=0; i < printPhotoCount; i++) {
        pCtx.drawImage(tempCanvas, x, y, printW, printH);
        
        // Print Crop Marks Outline
        if(printCropMarks.checked) {
            pCtx.strokeStyle = 'rgba(0,0,0,0.15)'; // Light grey cut line
            pCtx.lineWidth = 1;
            pCtx.setLineDash([4, 4]);
            pCtx.strokeRect(x, y, printW, printH);
        }

        x += printW + gap;
        if(x + printW > previewCanvas.width - margin) { x = margin; y += printH + gap; }
    }
}

openPrintModalBtn.onclick = () => {
    if(!loadedImg) return alert("Upload a photo first!");
    printModal.style.display = 'flex';
    previewCountText.innerText = printPhotoCount;
    renderPrintPreview();
};
closeModalBtn.onclick = () => { printModal.style.display = 'none'; };
btnPlus.onclick = () => { printPhotoCount++; previewCountText.innerText = printPhotoCount; renderPrintPreview(); };
btnMinus.onclick = () => { if(printPhotoCount > 1) { printPhotoCount--; previewCountText.innerText = printPhotoCount; renderPrintPreview(); } };

// --- PERFECTED KB RESIZER & DOWNLOADER ---
downloadBtn.onclick = () => {
    if(!loadedImg) return alert("Bhai, pehle photo to upload kar lijiye!");
    
    let tempCanvas = getCleanCanvasData();
    const format = imgFormat.value;
    const sizeLimit = parseInt(targetKB.value) || 0;
    let finalFormat = format;
    let dataUrl = tempCanvas.toDataURL(finalFormat, 1.0);

    if (sizeLimit > 0) {
        if(format === 'image/png') {
            alert("Perfect KB limit ke liye hum JPG auto-select kar rahe hain!");
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
                
                if (kb <= sizeLimit) {
                    bestDataUrl = testUrl;
                    minQ = midQ; 
                } else {
                    maxQ = midQ; 
                }
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
    link.download = `StackByUjjwal-Export.${finalFormat.split('/')[1]}`;
    link.href = dataUrl; link.click();
};

downloadPdfBtn.onclick = () => {
    const { jsPDF } = window.jspdf;
    let isA4 = paperSize.value === 'a4';
    const doc = new jsPDF('p', 'mm', [isA4 ? 210:102, isA4 ? 297:152]);
    
    let tempCanvas = getCleanCanvasData();
    const imgData = tempCanvas.toDataURL('image/jpeg', 1.0);

    const printW = targetW * (25.4 / 300); const printH = targetH * (25.4 / 300);
    const gap = 4, margin = isA4 ? 8 : 5;
    let x = margin, y = margin;

    // Optional Cut lines logic for PDF
    if(printCropMarks.checked) {
        doc.setDrawColor(200, 200, 200); 
        doc.setLineWidth(0.1);
        doc.setLineDash([1, 1]); // Dashed line for PDF
    }

    for(let i=0; i<printPhotoCount; i++) {
        doc.addImage(imgData, 'JPEG', x, y, printW, printH);
        
        // Draw Crop Box on PDF
        if(printCropMarks.checked) {
            doc.rect(x, y, printW, printH);
        }

        x += printW + gap;
        if(x + printW > (isA4?210:102) - margin) { x = margin; y += printH + gap; }
        if(y + printH > (isA4?297:152) - margin && i < printPhotoCount-1) { doc.addPage(); x = margin; y = margin; }
    }
    doc.save(`StackByUjjwal-PrintSheet-${printPhotoCount}x.pdf`);
    printModal.style.display = 'none';
};

// --- CORE ACTIONS ---

aiEnhanceBtn.addEventListener('click', () => {
    if(!loadedImg) return alert("Bhai photo to upload karo pehle!");
    brightnessInp.value = 110; 
    contrastInp.value = 110; 
    saturationInp.value = 115;
    
    hueInp.value = 0; grayInp.value = 0; blurInp.value = 0; sepiaInp.value = 0;
    tempInp.value = 5; // Halka sa warmth for better skin tone
    vignetteInp.value = 0;
    
    renderEngine();
    
    const oldHTML = aiEnhanceBtn.innerHTML;
    aiEnhanceBtn.innerHTML = '<i class="fas fa-check"></i> Pro Adjusted!';
    aiEnhanceBtn.style.background = "#10b981"; aiEnhanceBtn.style.color = "#ffffff";
    setTimeout(() => { 
        aiEnhanceBtn.innerHTML = oldHTML; 
        aiEnhanceBtn.style.background = ""; aiEnhanceBtn.style.color = "";
    }, 2000);
});

removeBGBtn.addEventListener('click', async () => {
    const apiKey = "tMh4m4Tfn23vMpRXCkJyo92y"; 
    
    const file = imageInput.files[0];
    if(!file) return alert("Upload a photo first.");

    const oldHTML = removeBGBtn.innerHTML;
    removeBGBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Removing BG...';
    removeBGBtn.disabled = true;

    const formData = new FormData();
    formData.append("image_file", file); 
    formData.append("size", "auto"); 

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
            removeBGBtn.style.background = "#10b981"; removeBGBtn.style.color = "#ffffff";
        } else { 
            alert("Remove.bg API limit ho gayi hai. Try updating key."); 
            removeBGBtn.innerHTML = oldHTML; 
        }
    } catch (err) { 
        alert("Network Error! Check your internet."); 
        removeBGBtn.innerHTML = oldHTML; 
    } finally {
        removeBGBtn.disabled = false;
    }
});

resetFiltersBtn.onclick = () => { 
    brightnessInp.value = 100; contrastInp.value = 100; saturationInp.value = 100; 
    rotationInp.value = 0; rotation = 0; flipH = 1; flipV = 1;
    
    hueInp.value = 0; grayInp.value = 0; blurInp.value = 0; sepiaInp.value = 0;
    tempInp.value = 0; vignetteInp.value = 0;
    
    resetLayout(); 
    
    aiEnhanceBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Auto Adjust';
    aiEnhanceBtn.style.background = ""; aiEnhanceBtn.style.color = "";
    removeBGBtn.innerHTML = '<i class="fas fa-eraser"></i> Cutout BG';
    removeBGBtn.style.background = ""; removeBGBtn.style.color = "";
};