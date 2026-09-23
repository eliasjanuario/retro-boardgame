// Pictionary (mímica) flow: category, QR code and timer.

function clearPictionaryTimer() {
  if (pictionaryTimerId) {
    clearInterval(pictionaryTimerId);
    pictionaryTimerId = null;
  }
}

function clearPictionaryPanel() {
  clearPictionaryTimer();
  const zone = document.querySelector("#event-zone");
  if (zone) {
    zone.innerHTML = "";
    zone.classList.remove("has-pictionary");
  }
}

function closePictionaryCategoryModal() {
  pictionaryCategoryModal.hidden = true;
  pictionaryCategoryModal.setAttribute("aria-hidden", "true");
}

function openPictionaryCategoryModal(player) {
  const container = document.querySelector("#pictionary-category-buttons");
  container.innerHTML = "";

  Object.keys(gameState.pictionaryDB).forEach((id) => {
    const category = gameState.pictionaryDB[id];
    const categoryButton = document.createElement("button");
    categoryButton.type = "button";
    categoryButton.className = "btn btn--secondary pictionary-category-btn";
    categoryButton.textContent = category.name;
    categoryButton.disabled = category.words.length === 0;
    categoryButton.addEventListener("click", () => {
      closePictionaryCategoryModal();
      generatePictionaryQRCode(player, Number(id));
    });
    container.appendChild(categoryButton);
  });

  pictionaryCategoryModal.hidden = false;
  pictionaryCategoryModal.setAttribute("aria-hidden", "false");
}

function startPictionary(player, diceNumber) {
  pictionaryActive = true;
  pendingPictionaryPlayer = player;
  rollButton.disabled = true;
  cardButton.disabled = true;
  accumulateButton.disabled = true;

  const dieValue = Number(diceNumber) || 1;

  if (dieValue === 6) {
    openPictionaryCategoryModal(player);
    return;
  }

  if (dieValue >= 1 && dieValue <= 5) {
    generatePictionaryQRCode(player, dieValue);
    return;
  }

  generatePictionaryQRCode(player, 1);
}

function generatePictionaryQRCode(player, categoryId) {
  const category = gameState.pictionaryDB[categoryId];

  if (!category || category.words.length === 0) {
    alert("Todas as palavras desta categoria já foram usadas!");
    pictionaryActive = false;
    pendingPictionaryPlayer = null;
    updatePanel();
    finishPlay();
    return;
  }

  const index = Math.floor(Math.random() * category.words.length);
  const drawnWord = category.words[index];

  if (!gameState.testMode) {
    category.words.splice(index, 1);
  }

  const hiddenText = buildPictionaryQRPayload(
    category.name,
    drawnWord
  );
  renderPictionaryPanel(player, hiddenText, category.name);
}

function toAsciiQR(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E\n]/g, "");
}

function buildPictionaryQRPayload(categoryName, word) {
  // Word only: the category is already shown on the PC screen
  return toAsciiQR(word);
}

function formatPictionaryTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function renderPictionaryPanel(player, hiddenText, categoryName) {
  const zone = document.querySelector("#event-zone");
  clearPictionaryTimer();
  zone.classList.add("has-pictionary");
  zone.innerHTML = `
    <p class="pictionary-title">MÍMICA: ${player.name}</p>
    <p class="pictionary-category">${categoryName || ""}</p>
    <div id="qrcode-container" class="pictionary-qr"></div>
    <p class="pictionary-qr-hint">Lê com a câmara do telemóvel</p>
    <div id="timer-display" class="pictionary-timer">01:30</div>
    <button type="button" id="btn-iniciar-timer" class="btn btn--primary pictionary-btn">
      Iniciar 1:30
    </button>
    <button type="button" id="btn-concluir-pictionary" class="btn btn--secondary pictionary-btn">
      Concluir mímica
    </button>
  `;

  const qrHost = document.getElementById("qrcode-container");
  qrHost.innerHTML = "";

  try {
    if (typeof QRCode === "undefined") {
      throw new Error("QRCode lib em falta");
    }
    new QRCode(qrHost, {
      text: hiddenText,
      width: 140,
      height: 140,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.L,
    });
  } catch (err) {
    console.warn("Falha ao gerar QR:", err);
    qrHost.textContent = hiddenText;
    qrHost.classList.add("pictionary-qr--fallback");
  }

  const timerDisplay = document.getElementById("timer-display");
  const timerButton = document.getElementById("btn-iniciar-timer");
  const finishButton = document.getElementById("btn-concluir-pictionary");
  let secondsLeft = 90;
  let timeUp = false;

  timerButton.addEventListener("click", () => {
    if (pictionaryTimerId || timeUp) {
      return;
    }

    timerButton.disabled = true;
    secondsLeft = 90;
    timerDisplay.textContent = formatPictionaryTime(secondsLeft);

    pictionaryTimerId = setInterval(() => {
      secondsLeft -= 1;
      timerDisplay.textContent = formatPictionaryTime(
        Math.max(0, secondsLeft)
      );

      if (secondsLeft <= 0) {
        clearPictionaryTimer();
        timeUp = true;
        timerDisplay.classList.add("is-finished");
        timerButton.textContent = "Tempo esgotado!";
        finishButton.textContent = "Falhou — Continuar";
      }
    }, 1000);
  });

  finishButton.addEventListener("click", () => {
    const success = !timeUp;
    finishPictionary(player, success);
  });
}

function finishPictionary(player, success) {
  clearPictionaryPanel();
  pictionaryActive = false;
  pendingPictionaryPlayer = null;

  if (success) {
    player.currentPosition = clampSquare(player.currentPosition + 1);
    renderPlayers();
    openModal({
      title: "Mímica!",
      text: `${player.name} acertou a tempo! Avança 1 casa.`,
      type: "verde",
      onConfirm: finishPlay,
    });
    return;
  }

  openModal({
    title: "Mímica",
    text: `${player.name} não acertou a tempo. Fica no mesmo sítio.`,
    type: "vermelho",
    onConfirm: finishPlay,
  });
}
