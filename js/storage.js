// Save / load of the game state (JSON file).

function saveGame() {
  const json = JSON.stringify(gameState, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "casino-save.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const LEGACY_SAVE_KEYS = {
  rodadaAtual: "currentRound",
  turnoAtual: "currentTurn",
  jogadores: "players",
  modoTeste: "testMode",
  perguntasClarasRestantes: "remainingLightQuestions",
  perguntasEscurasRestantes: "remainingDarkQuestions",
  perguntasRestantes: "remainingQuestions",
  nome: "name",
  posicaoAtual: "currentPosition",
  cartaPessoal: "personalCard",
  usosCarta: "cardUses",
  ultimoMovimento: "lastMove",
  rodadasAcumuladas: "accumulatedRounds",
  cartaRevelada: "cardRevealed",
  usouRoleta: "usedRoulette",
  turnosPunicao: "penaltyTurns",
  efeitos: "effects",
  imune: "immune",
  turnos: "turns",
  palavras: "words",
};

/** Saves created before the English refactor use Portuguese keys. */
function migrateLegacySaveKeys(value) {
  if (Array.isArray(value)) {
    return value.map(migrateLegacySaveKeys);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const migrated = {};
  Object.keys(value).forEach((key) => {
    migrated[LEGACY_SAVE_KEYS[key] ?? key] = migrateLegacySaveKeys(value[key]);
  });
  return migrated;
}

function loadGame(file) {
  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const savedData = migrateLegacySaveKeys(JSON.parse(reader.result));
    gameState = savedData;
    gameState.players = gameState.players.map((player) => ({
      ...player,
      personalCard: player.personalCard ?? player.name.toLowerCase(),
      cardUses: player.cardUses ?? 2,
      lastMove: player.lastMove ?? 0,
      accumulatedRounds: player.accumulatedRounds ?? 0,
      cardRevealed:
        player.cardRevealed ?? (player.cardUses ?? 2) < 2,
      usedRoulette: Boolean(player.usedRoulette),
      penaltyTurns: player.penaltyTurns ?? 0,
      status: player.status ?? player.effects ?? {},
    }));
    if (!Array.isArray(gameState.remainingLightQuestions)) {
      gameState.remainingLightQuestions =
        gameState.remainingQuestions ??
        shuffleList(createLightQuestionDeck());
    }
    if (!Array.isArray(gameState.remainingDarkQuestions)) {
      gameState.remainingDarkQuestions = shuffleList(
        createDarkQuestionDeck()
      );
    }
    delete gameState.remainingQuestions;
    gameState.testMode = Boolean(gameState.testMode);
    if (!gameState.pictionaryDB) {
      gameState.pictionaryDB = createPictionaryDB();
    }
    pendingRoll = null;
    clearPictionaryPanel();
    renderPlayers();
    renderHUD();
    updatePanel();
  };

  reader.readAsText(file);
}
