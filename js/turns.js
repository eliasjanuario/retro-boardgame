// Turn flow: advancing, finishing plays, accumulating rounds.

function advanceTurn() {
  const outgoingPlayer = gameState.players[gameState.currentTurn];
  if (outgoingPlayer.status) {
    outgoingPlayer.status.silenced = false;
  }

  pendingRoll = null;
  drawnRoulettePower = null;

  const total = gameState.players.length;
  const penaltyNotices = [];
  let skips = 0;
  let reshuffled = false;

  do {
    gameState.currentTurn = (gameState.currentTurn + 1) % total;

    if (gameState.currentTurn === 0) {
      gameState.currentRound += 1;
      if (gameState.shuffleEachRound) {
        shufflePlayerOrder(outgoingPlayer);
        reshuffled = true;
      }
    }

    const currentPlayer = gameState.players[gameState.currentTurn];

    if ((currentPlayer.penaltyTurns ?? 0) > 0) {
      penaltyNotices.push({
        title: "☠️ BANCARROTA ☠️",
        text: `${currentPlayer.name} está atordoado pela Bancarrota e perde a vez! (Restam ${currentPlayer.penaltyTurns} turnos)`,
        type: "vermelho",
      });
      currentPlayer.penaltyTurns -= 1;
      skips += 1;
      continue;
    }

    break;
  } while (skips < total);

  if (reshuffled) {
    revealRoundOrder(() => {
      updatePanel();
      openModalSequence(penaltyNotices);
    });
    return;
  }

  updatePanel();
  openModalSequence(penaltyNotices);
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
