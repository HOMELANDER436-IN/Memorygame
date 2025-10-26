const grid = document.getElementById('grid');
const restartBtn = document.getElementById('restart');
const flipSound = document.getElementById('flipSound');
const matchSound = document.getElementById('matchSound');
const winSound = document.getElementById('winSound');
const player1El = document.getElementById('player1');
const player2El = document.getElementById('player2');
const score1El = document.getElementById('score1');
const score2El = document.getElementById('score2');

let firstCard = null;
let lock = false;
let score1 = 0, score2 = 0;
let currentPlayer = 1;

function randomImages() {
  const ids = Array.from({ length: 100 }, (_, i) => i + 1);
  const shuffled = ids.sort(() => Math.random() - 0.5).slice(0, 24);
  const urls = shuffled.map(id => `https://picsum.photos/id/${id}/200`);
  return [...urls, ...urls].sort(() => Math.random() - 0.5);
}

let images = randomImages();

function createBoard() {
  grid.innerHTML = '';
  images.forEach(img => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front" style="background-image:url('${img}')"></div>
        <div class="card-back">?</div>
      </div>`;
    card.dataset.img = img;
    card.addEventListener('click', flipCard);
    grid.appendChild(card);
  });
}

function flipCard() {
  if (lock || this.classList.contains('flipped')) return;
  flipSound.currentTime = 0;
  flipSound.play();

  this.classList.add('flipped');
  if (!firstCard) {
    firstCard = this;
    return;
  }
  checkMatch(this);
}

function checkMatch(secondCard) {
  const match = firstCard.dataset.img === secondCard.dataset.img;
  if (match) {
    matchSound.play();
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    addScore();
    resetTurn();
    checkWin();
  } else {
    lock = true;
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      switchPlayer();
      resetTurn();
    }, 800);
  }
}

function addScore() {
  if (currentPlayer === 1) {
    score1++;
    score1El.textContent = score1;
  } else {
    score2++;
    score2El.textContent = score2;
  }
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  player1El.classList.toggle('active');
  player2El.classList.toggle('active');
}

function resetTurn() {
  [firstCard, lock] = [null, false];
}

function checkWin() {
  const flipped = document.querySelectorAll('.flipped').length;
  if (flipped === images.length) {
    winSound.play();
    setTimeout(() => {
      alert(
        score1 > score2
          ? `🏆 Player 1 wins ${score1} – ${score2}!`
          : score2 > score1
          ? `🏆 Player 2 wins ${score2} – ${score1}!`
          : "🤝 It's a draw!"
      );
    }, 400);
  }
}

restartBtn.addEventListener('click', () => {
  score1 = score2 = 0;
  score1El.textContent = score2El.textContent = 0;
  currentPlayer = 1;
  player1El.classList.add('active');
  player2El.classList.remove('active');
  images = randomImages();
  createBoard();
});

createBoard();