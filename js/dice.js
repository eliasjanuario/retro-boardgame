// Dice roll calculation, animation and movement.

function calculateRoll(player) {
  const status = ensureStatus(player);
  const reasons = [];
  let originalRoll;
  let finalRoll;
  let usedDoubleRoll = false;

  if (status.doubleRoll && status.doubleRoll.turns > 0) {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    originalRoll = d1 + d2;
    finalRoll = originalRoll;
    usedDoubleRoll = true;
    reasons.push(`Dados Viciados (${d1}+${d2})!`);
    status.doubleRoll.turns -= 1;
    if (status.doubleRoll.turns <= 0) {
      status.doubleRoll = null;
    }
  } else {
    originalRoll = Math.floor(Math.random() * 6) + 1;
    finalRoll = originalRoll;
  }

  if (status.maxRoll) {
    const limit = status.maxRoll;
    if (finalRoll > limit) {
      finalRoll = limit;
      reasons.push(
        limit === 1
          ? "Limitado a 1 (Sérgio)!"
          : `Limitado a ${limit} (Ana)!`
      );
    }
    status.maxRoll = 0;
  }

  if (status.invertDiceFace) {
    if (!usedDoubleRoll) {
      finalRoll = 7 - finalRoll;
      reasons.push("Pô velho! (Dado Invertido)");
    }
    status.invertDiceFace = false;
  }

  if (status.modifier) {
    const amount = status.modifier;
    finalRoll = Math.max(1, finalRoll - amount);
    reasons.push(`-${amount} (Marrávilhôso)!`);
    status.modifier = 0;
  }

  if (status.halveRoll > 0) {
    finalRoll = Math.ceil(finalRoll / 2);
    reasons.push("Metade (Jesuuuuuuuus)!");
    status.halveRoll -= 1;
  }

  const invertMove = Boolean(status.moveBackwards);
  if (invertMove) {
    reasons.push("Desgraaaça! (Anda para trás)");
  }
  status.moveBackwards = false;

  return {
    originalRoll,
    finalRoll,
    changeReason: reasons.join(" · "),
    delta: invertMove ? -finalRoll : finalRoll,
  };
}

function clearDiceMagicFeedback() {
  diceDisplay.classList.remove("dice-magic-change");
  diceModifierText.hidden = true;
  diceModifierText.textContent = "";
}

function moveAfterRoll(player, playerIndex, delta, finalRoll) {
  clearDiceMagicFeedback();
  player.currentPosition = clampSquare(player.currentPosition + delta);
  player.lastMove = Math.max(0, delta);
  renderPlayers();

  setTimeout(() => {
    rollingDice = false;
    evaluateSquare(playerIndex, finalRoll);
  }, MOVE_DURATION_MS);
}

/** After the dice reveal: if the player has a card, choose to move or use it. */
function afterDiceReveal(player, playerIndex, delta, finalRoll) {
  const canUseCard =
    (player.cardUses ?? 0) > 0 && !player.status?.silenced;

  if (!canUseCard) {
    moveAfterRoll(player, playerIndex, delta, finalRoll);
    return;
  }

  rollingDice = false;
  pendingRoll = { playerIndex, delta, finalRoll };
  updatePanel();
}

function confirmPendingMove() {
  if (!pendingRoll) {
    return;
  }

  const { playerIndex, delta, finalRoll } = pendingRoll;
  const player = gameState.players[playerIndex];

  pendingRoll = null;
  rollingDice = true;
  rollButton.disabled = true;
  cardButton.disabled = true;
  accumulateButton.disabled = true;
  rollButton.textContent = "Rolar Dado";
  moveAfterRoll(player, playerIndex, delta, finalRoll);
}

function rollDice() {
  if (pendingRoll) {
    confirmPendingMove();
    return;
  }

  if (
    rollingDice ||
    activatingCard ||
    spinningRoulette ||
    pictionaryActive ||
    pendingModal ||
    !attackModal.hidden ||
    !cardActivationModal.hidden ||
    !pictionaryCategoryModal.hidden ||
    !rouletteModal.hidden
  ) {
    return;
  }

  const playerIndex = gameState.currentTurn;
  const player = gameState.players[playerIndex];
  const { originalRoll, finalRoll, changeReason, delta } =
    calculateRoll(player);
  playSound("dice");

  rollingDice = true;
  rollButton.disabled = true;
  cardButton.disabled = true;
  accumulateButton.disabled = true;
  clearDiceMagicFeedback();
  diceDisplay.classList.add("shake");

  const diceAnimation = setInterval(() => {
    diceDisplay.textContent = String(Math.floor(Math.random() * 6) + 1);
  }, 100);

  setTimeout(() => {
    clearInterval(diceAnimation);
    diceDisplay.classList.remove("shake");
    diceDisplay.textContent = String(originalRoll);

    const wasModified =
      originalRoll !== finalRoll || Boolean(changeReason);

    if (wasModified) {
      setTimeout(() => {
        diceDisplay.classList.add("dice-magic-change");
        diceDisplay.textContent = String(finalRoll);
        diceModifierText.textContent = changeReason;
        diceModifierText.hidden = false;

        setTimeout(() => {
          afterDiceReveal(player, playerIndex, delta, finalRoll);
        }, 1500);
      }, 1000);
      return;
    }

    setTimeout(() => {
      afterDiceReveal(player, playerIndex, delta, finalRoll);
    }, 1000);
  }, 1500);
}
