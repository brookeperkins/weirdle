let grid = document.getElementById('grid');

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

buildGrid();
updateGrid();
window.addEventListener('keydown', handleKeyDown);

function handleKeyDown(e) {
  console.log(e);
  let letter = e.key.toLowerCase();
  if (letter === 'enter') {
    if (currentAttempt.length < 5) {
      return
    }
    if (!wordsList.includes(currentAttempt)) {
      alert('Try a different word!');
      return
    }
    attempts.push(currentAttempt);
    currentAttempt = '';
  } else if (letter === 'backspace') {
    currentAttempt = currentAttempt.slice(0, currentAttempt.length - 1);
  } else if (/^[a-z]+$/.test(letter)) {
    if(currentAttempt.length < 5) {
      currentAttempt += letter;
    }
  }
  updateGrid();
}

function buildGrid() {
  for(let i = 0; i < 6; i++) {
    let row = document.createElement('section');
      for(let j = 0; j < 5; j++) {
        let tile = document.createElement('p');
        tile.className = 'tile';
        tile.textContent = '';
        row.appendChild(tile);
      }
      grid.appendChild(row);
  }
}

function updateGrid() {
  let row = grid.firstChild;
  for (let attempt of attempts) {
    drawAttempt(row, attempt, false)
    row = row.nextSibling;
  }
  drawAttempt(row, currentAttempt, true);
}

function drawAttempt(row, attempt, isCurrent) {
  for(let i = 0; i < 5; i++) {
    let tile = row.children[i];
    if(attempt[i] !== undefined) {
      tile.textContent = attempt[i];
    }
    if (isCurrent) {
      tile.style.backgroundColor = '#222';    
    } else {
      tile.style.backgroundColor = getBgColor(attempt, i);
    }
  }
}

  function getBgColor(attempt, i) {
    let correctLetter = secretWord[i];
    let guessedLetter = attempt[i];
    if (secretWord.indexOf(guessedLetter) === -1) {
      return '#939598';
    } else if (guessedLetter === correctLetter) {
      return '#538d4e'
    } else {
      return '#b59f3b'
    }
  }