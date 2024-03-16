document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('grid-container');
  const message = document.getElementById('message');
  const difficultySpan = document.getElementById('difficulty');
  const clicksSpan = document.getElementById('clicks');

  let difficulty = 'Easy';
  let numRows = 4; // Default number of rows
  let numCols = 4; // Default number of columns
  let groundhogPosition = -1;
  let timer;
  let clicks = 0;
  let cards = [];

  const difficultySettings = {
    Easy: { speed: 800, appearanceInterval: 3000, distractionChance: 0.2 },
    Medium: { speed: 600, appearanceInterval: 2500, distractionChance: 0.4 },
    Hard: { speed: 400, appearanceInterval: 2000, distractionChance: 0.6 },
  };

  const distractions = ['🍃', '🌻', '🐦', '🐝', '🦉', '🦋', '🐞', '🐢'];
  const nuts = ['🌰', '🥜', '🍂'];

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function createGrid() {
    gridContainer.innerHTML = '';
    cards = Array.from({ length: numRows * numCols }, () => ({
      content: '',
      revealed: false,
    }));

    gridContainer.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
    gridContainer.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;

    for (let i = 0; i < numRows * numCols; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.index = i;
      gridContainer.appendChild(cell);
      cell.addEventListener('click', () => handleCellClick(i));
    }
  }

  function handleCellClick(position) {
    const cell = gridContainer.children[position];

    if (cards[position].revealed) return;

    clicks++;
    clicksSpan.textContent = clicks;

    if (position === groundhogPosition) {
      clearInterval(timer);
      message.textContent = `Congratulations! You caught the groundhog in ${clicks} clicks!`;
      cell.classList.add('caught');
      revealSquares();
    } else {
      cards[position].revealed = true;

      if (position === groundhogPosition + 1 || position === groundhogPosition - 1 ||
          position === groundhogPosition + numCols || position === groundhogPosition - numCols) {
        cards[position].content = nuts[getRandomInt(0, nuts.length - 1)];
        message.textContent = "Hint: The groundhog is near the nuts!";
      } else {
        cards[position].content = distractions[getRandomInt(0, distractions.length - 1)];
        message.textContent = '';
      }

      cell.textContent = cards[position].content;
      cell.style.animation = 'revealAnimation 1s ease forwards';
      cell.classList.add('clicked');
    }
  }

  function setDifficulty(selectedDifficulty) {
    clicks = 0;
    clicksSpan.textContent = clicks;
    difficulty = selectedDifficulty;
    difficultySpan.textContent = difficulty;
    
    if (difficulty === 'Medium') {
      numRows = 5;
      numCols = 5;
    } else if (difficulty === 'Hard') {
      numRows = 6;
      numCols = 6;
    } else {
      numRows = 4;
      numCols = 4;
    }
    
    createGrid();
    startGame();
    message.textContent = 'Click on the groundhog to catch it!';
  }

  function hideGroundhog() {
    const groundhogElement = document.querySelector('.groundhog');
    if (groundhogElement) {
      groundhogElement.remove();
    }
  }

  function createDistraction() {
    const distractionCell = getRandomInt(0, 15);

    if (!cards[distractionCell].revealed && Math.random() < difficultySettings[difficulty].distractionChance) {
      cards[distractionCell].content = distractions[getRandomInt(0, distractions.length - 1)];
    }
  }

  function startGame() {
    relocateItems();
    showGroundhog();
    timer = setInterval(moveGroundhog, difficultySettings[difficulty].speed);
    setInterval(createDistraction, difficultySettings[difficulty].appearanceInterval);
  }

  function revealSquares() {
    cards.forEach((card, index) => {
      gridContainer.children[index].classList.add('caught');
      if (!card.revealed) {
        gridContainer.children[index].textContent = card.content;
        gridContainer.children[index].style.animation = 'revealAnimation 1s ease forwards';
        card.revealed = true;
      }
    });

    showPartyEmojis(); // Show celebratory party emojis

    setTimeout(() => {
      relocateItems();
      hideGroundhog();
      startGame();
      clicks = 0;
      clicksSpan.textContent = clicks;
      hidePartyEmojis(); // Hide the party emojis
    }, 5000); // Adjust this value to control how long the party emojis stay visible
  }

  function relocateItems() {
    cards.forEach((card, index) => {
      card.revealed = false;
      card.content = '';
      gridContainer.children[index].textContent = '';
      gridContainer.children[index].classList.remove('caught', 'clicked');
      gridContainer.children[index].style.animation = '';
    });

    groundhogPosition = getRandomInt(0, 15);
    cards[groundhogPosition].content = '🦔';
  }

  function promptDifficulty() {
    const input = window.prompt('Select Difficulty: Easy, Medium, or Hard', 'Easy');
    const normalizedInput = input.trim().toLowerCase();
    if (normalizedInput === 'easy' || normalizedInput === 'medium' || normalizedInput === 'hard') {
      setDifficulty(normalizedInput.charAt(0).toUpperCase() + normalizedInput.slice(1));
    } else {
      promptDifficulty();
    }
  }

  promptDifficulty();
});
