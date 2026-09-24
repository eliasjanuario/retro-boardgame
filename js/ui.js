// HUD, side panel, turn banner and generic modal.

function updateHUDAlert(player, idx) {
  const card = document.querySelector(`[data-hud-index="${idx}"]`);
  if (!card) {
    return;
  }

  let alertEl = card.querySelector(".player-alert");
  if (!alertEl) {
    alertEl = document.createElement("p");
    alertEl.className = "player-alert";
    alertEl.textContent = "⚠️ Efeito Ativo!";
    const header = card.querySelector(".player-header");
    header?.insertAdjacentElement("afterend", alertEl);
  }

  alertEl.hidden = !hasActiveStatus(player);
}

function createHUDCard(player, idx) {
  const card = document.createElement("div");
  card.className = "player-card";
  card.dataset.hudIndex = String(idx);

  if (idx === gameState.currentTurn) {
    card.classList.add("is-active");
  }

  if (hasSpecialReady(player)) {
    card.classList.add("aura-vip-card");
  }

  const header = document.createElement("div");
  header.className = "player-header";

  const name = document.createElement("span");
  name.className = "player-name";
  name.textContent = `P${idx + 1} · ${player.name.toUpperCase()}`;
  name.title = `Player ${idx + 1}: ${player.name}`;

  const accumulated = player.accumulatedRounds ?? 0;
  const badge = document.createElement("span");
  badge.className = "rodadas-acumuladas";
  badge.textContent = `+${accumulated}`;
  badge.hidden = accumulated <= 0;
  badge.title = "Rodadas acumuladas";

  header.append(name, badge);

  const alertEl = document.createElement("p");
  alertEl.className = "player-alert";
  alertEl.textContent = "⚠️ Efeito Ativo!";
  alertEl.hidden = !hasActiveStatus(player);

  const content = document.createElement("div");
  content.className = "player-content";

  const spellWrap = document.createElement("div");
  spellWrap.className = "spell-card-wrapper";

  const spellImg = document.createElement("img");
  spellImg.className = "ui-spell-card";
  spellImg.src = `assets/cards/${player.personalCard}.png`;
  spellImg.alt = player.cardRevealed
    ? `Carta de ${player.name}`
    : `Carta secreta de ${player.name}`;
  if ((player.cardUses ?? 0) === 0) {
    spellImg.classList.add("card-esgotada");
  }
  if (!player.cardRevealed) {
    spellImg.classList.add("card-secreta");
    spellImg.style.cursor = "default";
  }

  const counter = document.createElement("span");
  counter.className = "card-counter";
  counter.textContent = `x${player.cardUses ?? 0}`;

  spellWrap.append(spellImg, counter);
  content.append(spellWrap);
  card.append(header, alertEl, content);

  spellImg.addEventListener("click", (event) => {
    event.stopPropagation();
    openCardPreview(player);
  });

  return card;
}

function openCardPreview(player) {
  if (!player.cardRevealed) {
    return;
  }

  cardPreviewImage.src = `assets/cards/${player.personalCard}.png`;
  cardPreviewImage.alt = `Carta de ${player.name}`;
  cardPreviewCaption.textContent = `${player.name.toUpperCase()} · x${player.cardUses ?? 0}`;
  cardPreviewOverlay.hidden = false;
  cardPreviewOverlay.setAttribute("aria-hidden", "false");
}

function closeCardPreview() {
  cardPreviewOverlay.hidden = true;
  cardPreviewOverlay.setAttribute("aria-hidden", "true");
}

function renderHUD() {
  const sidebar = document.querySelector(".sidebar-left");
  sidebar.innerHTML = "";

  gameState.players.forEach((player, idx) => {
    sidebar.appendChild(createHUDCard(player, idx));
  });
}

function updateHUD() {
  document.querySelectorAll(".player-card").forEach((card) => {
    const idx = Number(card.dataset.hudIndex);
    const player = gameState.players[idx];

    card.classList.toggle("is-active", idx === gameState.currentTurn);
    card.classList.toggle("aura-vip-card", hasSpecialReady(player));

    const spellImg = card.querySelector(".ui-spell-card");
    const counter = card.querySelector(".card-counter");
    const badge = card.querySelector(".rodadas-acumuladas");
    const uses = player.cardUses ?? 0;
    const accumulated = player.accumulatedRounds ?? 0;

    if (counter) {
      counter.textContent = `x${uses}`;
    }

    if (spellImg) {
      spellImg.classList.toggle("card-esgotada", uses === 0);
      spellImg.classList.toggle("card-secreta", !player.cardRevealed);
      spellImg.alt = player.cardRevealed
        ? `Carta de ${player.name}`
        : `Carta secreta de ${player.name}`;
      spellImg.style.cursor = player.cardRevealed ? "zoom-in" : "default";
    }

    if (badge) {
      badge.textContent = `+${accumulated}`;
      badge.hidden = accumulated <= 0;
    }

    updateHUDAlert(player, idx);
  });
}

function updatePanel() {
  const player = gameState.players[gameState.currentTurn];
  const remaining = player.cardUses ?? 0;
  const stunned = Boolean(player.status?.silenced);
  const busy =
    rollingDice ||
    activatingCard ||
    spinningRoulette ||
    pictionaryActive ||
    Boolean(pendingModal) ||
    Boolean(pendingTargetSelection) ||
    !attackModal.hidden ||
    !cardActivationModal.hidden ||
    !pictionaryCategoryModal.hidden ||
    !rouletteModal.hidden;

  if (rouletteButton) {
    rouletteButton.style.display = hasSpecialReady(player) ? "block" : "none";
    rouletteButton.disabled = busy || Boolean(pendingRoll);
  }

  if (pendingRoll) {
    const amount = pendingRoll.finalRoll;
    rollButton.textContent = `Andar (${amount})`;
    rollButton.disabled = busy;
    cardButton.textContent = "Usar Carta (Restam: " + remaining + ")";
    cardButton.disabled = remaining <= 0 || stunned || busy;
    accumulateButton.disabled = true;
    testModeButton.textContent = gameState.testMode
      ? "Modo Teste: ON"
      : "Modo Teste: OFF";
    testModeButton.classList.toggle("is-active-test", Boolean(gameState.testMode));
    updateHUD();
    return;
  }

  rollButton.textContent = "Rolar Dado";
  cardButton.textContent = "Usar Carta (Restam: " + remaining + ")";
  cardButton.disabled = remaining <= 0 || stunned || busy;
  rollButton.disabled = busy;
  accumulateButton.disabled = busy;
  testModeButton.textContent = gameState.testMode
    ? "Modo Teste: ON"
    : "Modo Teste: OFF";
  testModeButton.classList.toggle("is-active-test", Boolean(gameState.testMode));
  updateHUD();
  showTurnBanner();
}

let bannerTimeouts = [];

function clearBannerTimeouts() {
  bannerTimeouts.forEach((id) => clearTimeout(id));
  bannerTimeouts = [];
}

function showTurnBanner() {
  const player = gameState.players[gameState.currentTurn];
  const accumulated = player.accumulatedRounds ?? 0;
  const extra =
    accumulated > 0 ? ` (+${accumulated} acumulada${accumulated > 1 ? "s" : ""})` : "";

  clearBannerTimeouts();
  turnBanner.hidden = false;
  turnBanner.classList.remove("is-in", "is-out");
  void turnBanner.offsetWidth;
  turnBanner.classList.add("is-in");
  turnBanner.textContent = `Vez de: ${player.name}!${extra}`;

  bannerTimeouts.push(
    setTimeout(() => {
      turnBanner.classList.remove("is-in");
      turnBanner.classList.add("is-out");
      bannerTimeouts.push(
        setTimeout(() => {
          turnBanner.classList.remove("is-out");
          turnBanner.hidden = true;
        }, 450)
      );
    }, 2000)
  );
}

function openModal({ title, text, type, onConfirm }) {
  pendingModal = { onConfirm };
  modalTitle.textContent = title;
  modalText.textContent = text;
  modal.classList.toggle("modal--red", type === "vermelho");
  modal.classList.toggle("modal--green", type === "verde");
  modal.classList.toggle("modal--question", type === "pergunta");
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  rollButton.disabled = true;
  cardButton.disabled = true;
}

function openModalSequence(notices, onDone) {
  if (!notices.length) {
    onDone?.();
    return;
  }

  const [first, ...rest] = notices;
  openModal({
    ...first,
    onConfirm: () => openModalSequence(rest, onDone),
  });
}

function closeModal() {
  pendingModal = null;
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  rollButton.disabled = false;
  updatePanel();
}

function confirmModal() {
  if (!pendingModal) {
    return;
  }

  const { onConfirm } = pendingModal;
  closeModal();
  onConfirm?.();
}
