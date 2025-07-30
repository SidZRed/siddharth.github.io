let heaps = [];
let selectedHeapIndex = -1;
let grundy = {};
let gameOver = false;
let selectedDifficultyButton = null;

function computeGrundy(n) {
  if (n in grundy) return grundy[n];
  const seen = new Set();
  for (let i = 1; i < n; i++) {
    let j = n - i;
    if (i !== j) {
      seen.add(computeGrundy(i) ^ computeGrundy(j));
    }
  }
  let g = 0;
  while (seen.has(g)) g++;
  grundy[n] = g;
  return g;
}

function startGame(n, button) {
  // Reset game state
  heaps = [n];
  grundy = {};
  selectedHeapIndex = -1;
  gameOver = false;

  if (selectedDifficultyButton) {
    selectedDifficultyButton.classList.remove("selected");
  }
  selectedDifficultyButton = button;
  selectedDifficultyButton.classList.add("selected");

  updateHeaps();
  updateSlider();
  document.getElementById("game-status").textContent = "";
}

function updateHeaps() {
  const container = document.getElementById("heaps-container");
  container.innerHTML = "";
  heaps.forEach((heap, idx) => {
    const btn = document.createElement("button");
    btn.className = "heap-button";
    btn.textContent = heap;
    btn.onclick = () => {
      if (gameOver) return;
      selectedHeapIndex = idx;
      updateSlider(heap);
    };
    container.appendChild(btn);
  });

  if (isGameOver()) {
    gameOver = true;
    const winner = "Computer";
    document.getElementById("game-status").textContent =
      `Game Over! Hehe, you thought you could beat me!`;
    disableGame();
  }
}

function updateSlider(heapSize = 1) {
  const slider = document.getElementById("move-slider");
  slider.min = 1;
  slider.max = heapSize - 1;
  slider.value = 1;
  document.getElementById("slider-value").textContent = "1";
}

document.getElementById("move-slider").addEventListener("input", (e) => {
  document.getElementById("slider-value").textContent = e.target.value;
});

function makeMove() {
  if (gameOver || selectedHeapIndex === -1) return;

  const heapSize = heaps[selectedHeapIndex];
  const split = parseInt(document.getElementById("move-slider").value);
  const other = heapSize - split;

  if (split === other || split <= 0 || other <= 0) return;

  // Replace selected heap with two new heaps
  heaps.splice(selectedHeapIndex, 1);
  heaps.push(split);
  heaps.push(other);

  selectedHeapIndex = -1;
  updateHeaps();

  if (!gameOver) {
    setTimeout(computerMove, 500); // Let computer move after brief delay
  }
}

function computerMove() {
  if (gameOver) return;

  for (let i = 0; i < heaps.length; i++) {
    const g = computeGrundy(heaps[i]);
    const totalGrundy = heaps.reduce((a, h, idx) => a ^ (idx === i ? g : computeGrundy(h)), 0);
    for (let j = 1; j < heaps[i]; j++) {
      let k = heaps[i] - j;
      if (j !== k) {
        const newGrundy = totalGrundy ^ computeGrundy(heaps[i]) ^ (computeGrundy(j) ^ computeGrundy(k));
        if (newGrundy === 0) {
          // Valid move found
          heaps.splice(i, 1);
          heaps.push(j);
          heaps.push(k);
          updateHeaps();
          return;
        }
      }
    }
  }

  // If no winning move, just make any valid move
  for (let i = 0; i < heaps.length; i++) {
    if (heaps[i] >= 2) {
      for (let j = 1; j < heaps[i]; j++) {
        let k = heaps[i] - j;
        if (j !== k) {
          heaps.splice(i, 1);
          heaps.push(j);
          heaps.push(k);
          updateHeaps();
          return;
        }
      }
    }
  }
}

function isGameOver() {
  return !heaps.some(h => h >= 2 && hasUnequalSplit(h));
}

function hasUnequalSplit(n) {
  for (let i = 1; i < n; i++) {
    if (i !== n - i) return true;
  }
  return false;
}

function disableGame() {
  // Disable slider and buttons
  document.querySelectorAll(".heap-button").forEach(btn => btn.disabled = true);
  document.getElementById("move-slider").disabled = true;
}
    