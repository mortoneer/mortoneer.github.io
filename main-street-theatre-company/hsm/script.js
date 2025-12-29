let homeScore = parseInt(localStorage.getItem('homeScore')) || 42;
let awayScore = parseInt(localStorage.getItem('awayScore')) || 38;
let boxWidth = parseInt(localStorage.getItem('boxWidth')) || 200;
let fontSize = parseInt(localStorage.getItem('fontSize')) || 53;
let vsSize = parseInt(localStorage.getItem('vsSize')) || 24;
let pressedKeys = new Set();

const homeElement = document.querySelector('.team:first-child .score');
const awayElement = document.querySelector('.team:last-child .score');
const scoreElements = document.querySelectorAll('.score');
const vsElement = document.querySelector('.vs');

// Apply stored values
homeElement.textContent = homeScore.toString().padStart(2, '0');
awayElement.textContent = awayScore.toString().padStart(2, '0');
scoreElements.forEach(el => {
    el.style.width = boxWidth + 'px';
    el.style.fontSize = fontSize + 'vh';
});
vsElement.style.fontSize = vsSize + 'px';

function savePreset(num) {
    localStorage.setItem(`preset${num}`, JSON.stringify({homeScore, awayScore, boxWidth, fontSize, vsSize}));
}

function loadPreset(num) {
    const preset = JSON.parse(localStorage.getItem(`preset${num}`));
    if (preset) {
        homeScore = preset.homeScore;
        awayScore = preset.awayScore;
        boxWidth = preset.boxWidth;
        fontSize = preset.fontSize;
        vsSize = preset.vsSize;
        homeElement.textContent = homeScore.toString().padStart(2, '0');
        awayElement.textContent = awayScore.toString().padStart(2, '0');
        scoreElements.forEach(el => {
            el.style.width = boxWidth + 'px';
            el.style.fontSize = fontSize + 'vh';
        });
        vsElement.style.fontSize = vsSize + 'px';
    }
}

document.addEventListener('keydown', (e) => {
    if (pressedKeys.has(e.key)) return;
    pressedKeys.add(e.key);
    
    if (/^[0-9]$/.test(e.key)) {
        setTimeout(() => {
            if (pressedKeys.has(e.key)) savePreset(e.key);
        }, 500);
        return;
    }
    
    if (e.key === 'w') {
        homeScore++;
        homeElement.textContent = homeScore.toString().padStart(2, '0');
        localStorage.setItem('homeScore', homeScore);
    }
    if (e.key === 's') {
        homeScore--;
        homeElement.textContent = homeScore.toString().padStart(2, '0');
        localStorage.setItem('homeScore', homeScore);
    }
    if (e.key === 'ArrowUp') {
        awayScore++;
        awayElement.textContent = awayScore.toString().padStart(2, '0');
        localStorage.setItem('awayScore', awayScore);
    }
    if (e.key === 'ArrowDown') {
        awayScore--;
        awayElement.textContent = awayScore.toString().padStart(2, '0');
        localStorage.setItem('awayScore', awayScore);
    }
    if (e.key === 'x') {
        boxWidth += 20;
        scoreElements.forEach(el => el.style.width = boxWidth + 'px');
        localStorage.setItem('boxWidth', boxWidth);
    }
    if (e.key === 'z') {
        boxWidth = Math.max(100, boxWidth - 20);
        scoreElements.forEach(el => el.style.width = boxWidth + 'px');
        localStorage.setItem('boxWidth', boxWidth);
    }
    if (e.key === 'm') {
        fontSize += 1;
        scoreElements.forEach(el => el.style.fontSize = fontSize + 'vh');
        localStorage.setItem('fontSize', fontSize);
    }
    if (e.key === 'n') {
        fontSize = Math.max(10, fontSize - 1);
        scoreElements.forEach(el => el.style.fontSize = fontSize + 'vh');
        localStorage.setItem('fontSize', fontSize);
    }
    if (e.key === 'v') {
        vsSize += 2;
        vsElement.style.fontSize = vsSize + 'px';
        localStorage.setItem('vsSize', vsSize);
    }
    if (e.key === 'c') {
        vsSize = Math.max(8, vsSize - 2);
        vsElement.style.fontSize = vsSize + 'px';
        localStorage.setItem('vsSize', vsSize);
    }
});

document.addEventListener('keyup', (e) => {
    if (/^[0-9]$/.test(e.key) && pressedKeys.has(e.key)) {
        loadPreset(e.key);
    }
    pressedKeys.delete(e.key);
});