// Special spell cards and the attack / target modal.

const spellCards = {
  ana: {
    name: "Esse é o futebol que temos",
    desc: "Alvo sob efeito: qualquer número que ele rolar neste turno não pode passar de 3.",
    effect(target) {
      ensureStatus(target).maxRoll = 3;
    },
  },
  deni: {
    name: "Pô velho!",
    desc: "Alvo sob efeito: o dado é virado de cabeça para baixo (1 vira 6, 2 vira 5, etc.).",
    effect(target) {
      ensureStatus(target).invertDiceFace = true;
    },
  },
  elias: {
    name: "Desgraaaça",
    desc: "Alvo sob efeito: o movimento deste turno é invertido e ele anda para trás.",
    effect(target) {
      ensureStatus(target).moveBackwards = true;
    },
  },
  filipe: {
    name: "Marrávilhôso",
    desc: "Alvo sob efeito: no próximo turno, subtrai 2 do resultado do dado (mínimo 1 casa).",
    effect(target) {
      ensureStatus(target).modifier = 2;
    },
  },
  jessica: {
    name: "Jesuuuuuuuus",
    desc: "Alvo sob efeito: nos próximos 2 turnos, qualquer rolagem é reduzida à metade (arredondada para cima).",
    effect(target) {
      ensureStatus(target).halveRoll = 2;
    },
  },
  sara: {
    name: "Uma CHAPADA na cara!",
    desc: "Alvo atordoado: não pode atacar nem ativar efeitos no próximo turno.",
    effect(target) {
      ensureStatus(target).silenced = true;
    },
  },
  sergio: {
    name: "Mete a p#*a aí!",
    desc: "Alvo sob efeito: neste turno o movimento fica limitado a no máximo 1 casa.",
    effect(target) {
      ensureStatus(target).maxRoll = 1;
    },
  },
  soares: {
    name: "Meu Deus, que desagradável",
    desc: "Alvo é forçado a voltar todas as casas que avançou neste turno.",
    effect(target) {
      const retreat = target.lastMove || 0;
      target.currentPosition = clampSquare(target.currentPosition - retreat);
      target.lastMove = 0;
    },
  },
};

function populateAttackTargets() {
  const currentIndex = gameState.currentTurn;

  targetSelect.innerHTML = "";
  gameState.players.forEach((player, idx) => {
    if (idx === currentIndex) {
      return;
    }

    const option = document.createElement("option");
    option.value = String(idx);
    option.textContent = player.name;
    targetSelect.appendChild(option);
  });
}

function openTargetModal(sourcePlayer, filter, onConfirm) {
  const sourceIndex = gameState.players.indexOf(sourcePlayer);
  targetSelect.innerHTML = "";

  gameState.players.forEach((player, idx) => {
    if (idx === sourceIndex) {
      return;
    }

    if (filter === "frente" && player.currentPosition <= sourcePlayer.currentPosition) {
      return;
    }

    const option = document.createElement("option");
    option.value = String(idx);
    option.textContent = `${player.name} (casa ${player.currentPosition})`;
    targetSelect.appendChild(option);
  });

  if (!targetSelect.options.length) {
    alert(
      filter === "frente"
        ? "Não há jogadores à tua frente."
        : "Não há alvos disponíveis."
    );
    onConfirm(null);
    return;
  }

  pendingTargetSelection = { onConfirm };
  attackModalTitle.textContent =
    filter === "frente" ? "Blefe Perfeito" : "Receita Federal";
  attackModalText.textContent =
    filter === "frente"
      ? "Escolhe um jogador à frente para trocar de posição."
      : "Escolhe um alvo para recuar 10 casas.";
  confirmAttackButton.textContent = "Confirmar";
  attackModal.hidden = false;
  attackModal.setAttribute("aria-hidden", "false");
}

function restoreAttackModalTexts() {
  attackModalTitle.textContent = "Modo de Ataque";
  attackModalText.textContent =
    "Escolha um alvo para usar sua carta especial.";
  confirmAttackButton.textContent = "Confirmar Ataque";
}

function useCard() {
  const player = gameState.players[gameState.currentTurn];

  if (
    player.cardUses <= 0 ||
    player.status?.silenced ||
    pendingModal ||
    !attackModal.hidden ||
    activatingCard ||
    spinningRoulette ||
    pictionaryActive ||
    rollingDice
  ) {
    return;
  }

  // Using the card after the dice roll discards the pending move
  if (pendingRoll) {
    pendingRoll = null;
  }

  playSound("card");
  pendingTargetSelection = null;
  restoreAttackModalTexts();
  populateAttackTargets();
  attackModal.hidden = false;
  attackModal.setAttribute("aria-hidden", "false");
  rollButton.disabled = true;
  cardButton.disabled = true;
  accumulateButton.disabled = true;
}

function closeAttackModal() {
  attackModal.hidden = true;
  attackModal.setAttribute("aria-hidden", "true");
}

function showCardActivation(player, target, spellCard) {
  activatingCard = true;
  rollButton.disabled = true;
  cardButton.disabled = true;

  activatedCardImg.src = `assets/cards/${player.personalCard}.png`;
  activatedCardImg.alt = `Carta de ${player.name}`;
  cardActivationTitle.textContent =
    player.name + " usou " + spellCard.name.toUpperCase() + " em " + target.name + "!";
  cardEffectText.textContent = spellCard.desc;

  // Restarts the animation if the card is used again in the same game.
  activatedCardImg.style.animation = "none";
  void activatedCardImg.offsetWidth;
  activatedCardImg.style.animation = "";

  cardActivationModal.hidden = false;
  cardActivationModal.setAttribute("aria-hidden", "false");
  playSound("cardHit");

  closeActivationButton.onclick = () => {
    cardActivationModal.hidden = true;
    cardActivationModal.setAttribute("aria-hidden", "true");
    activatingCard = false;

    spellCard.effect(target);
    player.cardUses -= 1;
    player.cardRevealed = true;
    renderPlayers();
    updateHUD();
    advanceTurn();
  };
}

function confirmAttack() {
  if (activatingCard) {
    return;
  }

  if (pendingTargetSelection) {
    confirmRouletteTargetSelection();
    return;
  }

  const player = gameState.players[gameState.currentTurn];
  const targetIndex = Number(targetSelect.value);
  const target = gameState.players[targetIndex];
  const spellCard = spellCards[player.personalCard];

  if (!target || targetIndex === gameState.currentTurn || !spellCard) {
    return;
  }

  if (isPlayerImmune(target)) {
    alert(`${target.name} está imune (Acesso VIP)! Escolhe outro alvo.`);
    return;
  }

  closeAttackModal();
  showCardActivation(player, target, spellCard);
}
