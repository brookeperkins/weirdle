'use strict'

let wordsList = [
    'other',
    'lunch',
    'their',
    'about',
    'maybe',
    'which',
    'clown',
    'scowl',
    'every',
    'ivory',
    'imbue',
    'aback',
    'boxed',
    'chuck',
    'dozen',
    'equal',
    'flaky',
    'glaze',
    'hijab',
    'joker',
    'kicks',
    'lucky',
    'mixup',
    'newly',
    'obeys',
    'picky',
    'quirk',
    'rowdy',
    'sixth',
    'toxic',
    'unfit',
    'pizza',
    'crabs',
    'vowed',
    'woozy',
    'xerox',
    'yacht',
    'zesty'
]

let randomIndex = Math.floor(Math.random() * wordsList.length);
let secretWord = wordsList[randomIndex];

let currentAttempt = '';
let attempts = [];

function handleKeyDown(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) {
        return
}
    handleKey(e.key)
}

function handleKey(key) {
    if (attempts.length === 6) {
        return
}
    if (isAnimating) {
        return
}
let letter = key.toLowerCase()
if (letter === 'enter') {
    if (currentAttempt.length < 5) {
        return
}
    if (!wordsList.includes(currentAttempt)) {
        alert('Try a different word!');
        return;
}
    if (
        attempts.length === 5 &&
        currentAttempt !== secretWord
        ) {
            alert(secretWord);
}
    attempts.push(currentAttempt);
    currentAttempt = '';
    updateKeyboard();
    saveGame();
    pauseInput();
    } else if (letter === 'backspace') {
        currentAttempt = currentAttempt.slice(0, currentAttempt.length - 1);
    } else if (/^[a-z]$/.test(letter)) {
        if (currentAttempt.length < 5) {
            currentAttempt += letter;
            animatePress(currentAttempt.length - 1);
        }
    }
    updateGrid();
}

let isAnimating = false;
function pauseInput() {
    if (isAnimating) throw Error('Error!');
    isAnimating = true;
    setTimeout(() => {
        isAnimating = false
    }, 2000);
}

function buildGrid() {
    for (let i = 0; i < 6; i++) {
        let row = document.createElement('section');
    for (let j = 0; j < 5; j++) {
        let tile = document.createElement('p');
        tile.className = 'tile';
        let front = document.createElement('span');
        front.className = 'front';
        let back = document.createElement('span');
        back.className = 'back';
        let surface = document.createElement('section');
        surface.className = 'surface';
        surface.style.transitionDelay = (j * 300) + 'ms';
        surface.appendChild(front);
        surface.appendChild(back);
        tile.appendChild(surface);
        row.appendChild(tile);
}
    grid.appendChild(row);
}
}

function updateGrid() {
    for (let i = 0; i < 6; i++) {
        let row = grid.children[i];
        if (i < attempts.length) {
            drawAttempt(row, attempts[i], true);
        } else if (i === attempts.length) {
            drawAttempt(row, currentAttempt, false);
        } else {
            drawAttempt(row, '', false);
        }
    }
}

function drawAttempt(row, attempt, solved) {
    for (let i = 0; i < 5; i++) {
        let tile = row.children[i];
        let surface = tile.firstChild;
        let front = surface.children[0];
        let back = surface.children[1];
        if (attempt[i] !== undefined) {
            front.textContent = attempt[i];
            back.textContent = attempt[i];
    } else {
    // lol
        front.innerHTML = '<span style="opacity: 0">X</span>';
        back.innerHTML = '<span style="opacity: 0">X</span>';
        clearAnimation(tile);
    }
        front.style.backgroundColor = BLACK;
        front.style.borderColor = '';
        if (attempt[i] !== undefined) {
            front.style.borderColor = MIDDLEGREY;
    }
    back.style.backgroundColor = getBgColor(attempt, i);
    back.style.borderColor = getBgColor(attempt, i);
    if (solved) {
            tile.classList.add('solved');
        } else {
            tile.classList.remove('solved');
        }
    }
}

let BLACK = '#111';
let GREY = '#555555';
let MIDDLEGREY = '#666';
let LIGHTGREY = '#888';
let GREEN = '#538d4e';
let YELLOW = '#b59f3b';

function getBgColor(attempt, i) {
    let correctLetter = secretWord[i];
    let attemptLetter = attempt[i];
    if (
        attemptLetter === undefined ||
        secretWord.indexOf(attemptLetter) === -1
    ) {
    return GREY;
}
    if (correctLetter === attemptLetter) {
    return GREEN;
    }
    return YELLOW;
}

function buildKeyboard() {
    buildKeyboardRow('qwertyuiop', false);
    buildKeyboardRow('asdfghjkl', false);
    buildKeyboardRow('zxcvbnm', true);
}

function buildKeyboardRow(letters, isLastRow) {
    let row = document.createElement('section');
    if (isLastRow) {
        let button = document.createElement('button');
        button.className = 'button';
        button.textContent = 'Enter';
        button.style.backgroundColor = LIGHTGREY;
        button.onclick = () => {
            handleKey('enter');
        };
        row.appendChild(button);
}
    for (let letter of letters) {
    let button = document.createElement('button');
    button.className = 'button';
    button.textContent = letter;
    button.style.backgroundColor = LIGHTGREY;
    button.onclick = () => {
        handleKey(letter);
    };
    keyboardButtons.set(letter, button)
    row.appendChild(button);
}
    if (isLastRow) {
    let button = document.createElement('button');
    button.className = 'button';
    button.textContent = 'Backspace';
    button.style.backgroundColor = LIGHTGREY;
    button.onclick = () => {
        handleKey('backspace');
    };
    row.appendChild(button);
    }
    keyboard.appendChild(row);
}

function determineColor(a, b) {
    if (a === GREEN || b === GREEN) {
        return GREEN;
    }
    if (a === YELLOW || b === YELLOW) {
        return YELLOW;
    }
        return GREY;
}

function updateKeyboard() {
    let colorOptions = new Map();
    for (let attempt of attempts) {
    for (let i = 0; i < attempt.length; i++) {
        let color = getBgColor(attempt, i);
        let key = attempt[i];
        let bestColor = colorOptions.get(key);
        colorOptions.set(key, determineColor(color, bestColor));
    }
}
    for (let [key, button] of keyboardButtons) {
    button.style.backgroundColor = colorOptions.get(key);
    button.style.borderColor = colorOptions.get(key);
}
}

function animatePress(index) {
    let rowIndex = attempts.length;
    let row = grid.children[rowIndex];
    let tile = row.children[index];
    tile.style.animationName = 'press';
    tile.style.animationDuration = '100ms';
    tile.style.animationTimingFunction = 'ease-out';
}

function clearAnimation(tile) {
    tile.style.animationName = '';
    tile.style.animationDuration = '';
    tile.style.animationTimingFunction = '';
}

function loadGame() {
    let data;
    try {
        data = JSON.parse(localStorage.getItem('data'));
    } catch { }
    if (data != null) {
        if (data.secretWord === secretWord) {
            attempts = data.attempts;
    }
}
}

function saveGame() {
let data = JSON.stringify({
    secretWord,
    attempts
})
try {
    localStorage.setItem('data', data)
} catch { }
}

let grid = document.getElementById('grid');
let keyboard = document.getElementById('keyboard');
let keyboardButtons = new Map();
loadGame();
buildGrid();
buildKeyboard();
updateGrid();
updateKeyboard();
window.addEventListener('keydown', handleKeyDown);