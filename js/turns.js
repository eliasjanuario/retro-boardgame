// Turn flow: advancing, finishing plays, accumulating rounds.

function advanceTurn() {
  const outgoingPlayer = gameState.players[gameState.currentTurn];
  if (outgoingPlayer.status) {
    outgoingPlayer.status.silenced = false;

    if (outgoingPlayer.status.immune && outgoingPlayer.status.immune.turns > 0) {
      outgoingPlayer.status.immune.turns -= 1;
      if (outgoingPlayer.status.immune.turns <= 0) {
        outgoingPlayer.status.immune = null;
      }
    }
  }

  pendingRoll = null;
  drawnRoulettePower = null;

  const total = gameState.players.length;
  let skips = 0;

  do {
    gameState.currentTurn = (gameState.currentTurn + 1) % total;

    if (gameState.currentTurn === 0) {
      gameState.currentRound += 1;
    }

    const currentPlayer = gameState.players[gameState.currentTurn];

    if ((currentPlayer.penaltyTurns ?? 0) > 0) {
      alert(
        `${currentPlayer.name} está atordoado pela Bancarrota e perde a vez! (Restam ${currentPlayer.penaltyTurns} turnos)`
      );
      currentPlayer.penaltyTurns -= 1;
      skips += 1;
      continue;
    }

    break;
  } while (skips < total);

  updatePanel();
}

/** Ends a full play. If there are accumulated rounds, consumes 1 and keeps the turn. */
function finishPlay() {
  const player = gameState.players[gameState.currentTurn];
  const accumulated = player.accumulatedRounds ?? 0;

  if (accumulated > 0) {
    player.accumulatedRounds = accumulated - 1;
    updatePanel();
    return;
  }

  advanceTurn();
}

function accumulateRound() {
  if (
    rollingDice ||
    activatingCard ||
    spinningRoulette ||
    pictionaryActive ||
    pendingRoll ||
    pendingModal ||
    !attackModal.hidden ||
    !cardActivationModal.hidden ||
    !pictionaryCategoryModal.hidden ||
    !rouletteModal.hidden
  ) {
    return;
  }

  const player = gameState.players[gameState.currentTurn];
  player.accumulatedRounds = (player.accumulatedRounds ?? 0) + 1;
  clearDiceMagicFeedback();
  advanceTurn();
}
