// Turn order screen: shown only when starting or loading a game.

const ORDER_SHUFFLE_DURATION_MS = 1400;
const ORDER_SHUFFLE_STEP_MS = 90;

let turnOrderOnDone = null;
let shufflingOrder = false;

function isTurnOrderOpen() {
  return !turnOrderModal.hidden;
}

function renderTurnOrderList(players, doneCount = 0) {
  turnOrderList.innerHTML = "";

  players.forEach((player, idx) => {
    const item = document.createElement("li");
    item.className = "turn-order-item";
    item.classList.toggle("is-done", idx < doneCount);
    item.classList.toggle("is-current", idx === doneCount);

    const position = document.createElement("span");
    position.className = "turn-order-item__pos";
    position.textContent = `${idx + 1}º`;

    const avatar = document.createElement("img");
    avatar.className = "turn-order-item__avatar";
    avatar.src = `assets/pieces/${player.name.toLowerCase()}_avatar.png`;
    avatar.alt = player.name;

    const name = document.createElement("span");
    name.className = "turn-order-item__name";
    name.textContent = player.name;

    item.append(position, avatar, name);
    turnOrderList.appendChild(item);
  });
}

/** Shuffles only who still has to play this round; earlier turns keep their places. */
function shuffleRemainingTurns() {
  const done = gameState.players.slice(0, gameState.currentTurn);
  const remaining = gameState.players.slice(gameState.currentTurn);
  gameState.players = [...done, ...shuffleList(remaining)];
}

function animateOrderShuffle() {
  const doneCount = gameState.currentTurn;
  const done = gameState.players.slice(0, doneCount);
  const remaining = gameState.players.slice(doneCount);

  shufflingOrder = true;
  turnOrderContinueButton.disabled = true;
  turnOrderList.classList.add("is-shuffling");
  playSound("dice");

  const intervalId = setInterval(() => {
    renderTurnOrderList([...done, ...shuffleList(remaining)], doneCount);
  }, ORDER_SHUFFLE_STEP_MS);

  setTimeout(() => {
    clearInterval(intervalId);
    turnOrderList.classList.remove("is-shuffling");
    renderTurnOrderList(gameState.players, doneCount);
    shufflingOrder = false;
    turnOrderContinueButton.disabled = false;
  }, ORDER_SHUFFLE_DURATION_MS);
}

function openTurnOrderModal({ title, text, mode, onDone }) {
  const isSetup = mode === "setup";

  turnOrderOnDone = onDone;
  turnOrderTitle.textContent = title;
  turnOrderText.textContent = text;
  keepOrderButton.hidden = !isSetup;
  shuffleOrderButton.hidden = !isSetup;
  turnOrderContinueButton.hidden = isSetup;
  turnOrderContinueButton.textContent = "Começar!";
  renderTurnOrderList(gameState.players, gameState.currentTurn);

  turnOrderModal.hidden = false;
  turnOrderModal.setAttribute("aria-hidden", "false");
}

function closeTurnOrderModal() {
  const onDone = turnOrderOnDone;

  turnOrderOnDone = null;
  turnOrderModal.hidden = true;
  turnOrderModal.setAttribute("aria-hidden", "true");
  stopMusic();
  renderHUD();
  renderPlayers();
  onDone?.();
}

/** Closes the screen without running its callback (e.g. when a save is loaded). */
function dismissTurnOrderModal() {
  turnOrderOnDone = null;
  turnOrderModal.hidden = true;
  turnOrderModal.setAttribute("aria-hidden", "true");
  stopMusic();
}

function openTurnOrderSetup({ loaded = false } = {}) {
  const text = loaded
    ? `Jogo carregado! Rodada ${gameState.currentRound}, vez de ${gameState.players[gameState.currentTurn].name}. Mantenha a sequência ou deixe a sorte decidir a ordem!`
    : "Esta é a ordem das peças. Mantenha a sequência ou deixe a sorte decidir a ordem!";

  openTurnOrderModal({
    title: "Ordem de Jogo",
    text,
    mode: "setup",
    onDone: updatePanel,
  });
  playMusic("opening");
}

function keepTurnOrder() {
  if (shufflingOrder) {
    return;
  }

  closeTurnOrderModal();
}

function chooseShuffledOrder() {
  if (shufflingOrder) {
    return;
  }

  shuffleRemainingTurns();

  keepOrderButton.hidden = true;
  shuffleOrderButton.hidden = true;
  turnOrderContinueButton.hidden = false;
  turnOrderText.textContent = "A sorte decidiu! Esta será a ordem do jogo.";
  animateOrderShuffle();
}

function continueTurnOrder() {
  if (shufflingOrder) {
    return;
  }

  closeTurnOrderModal();
}
