// Player creation and status helpers.

const PLAYER_NAMES = [
  "Ana",
  "Deni",
  "Elias",
  "Filipe",
  "Jessica",
  "Sara",
  "Sergio",
  "Soares",
];

function createPlayers() {
  return PLAYER_NAMES.map((name) => ({
    name,
    currentPosition: 0,
    avatar: `assets/pieces/${name.toLowerCase()}_avatar.png`,
    personalCard: name.toLowerCase(),
    cardUses: 2,
    lastMove: 0,
    accumulatedRounds: 0,
    cardRevealed: false,
    usedRoulette: false,
    penaltyTurns: 0,
    status: {},
  }));
}

function hasSpecialReady(player) {
  return (
    (player.cardUses ?? 0) === 0 &&
    player.currentPosition >= 50 &&
    !player.usedRoulette
  );
}

function isPlayerImmune(player) {
  return Boolean(player.status?.immune && player.status.immune.turns > 0);
}

function ensureStatus(player) {
  if (!player.status) {
    player.status = {};
  }

  return player.status;
}

function hasActiveStatus(player) {
  const status = player.status || {};

  return Boolean(
    status.moveBackwards ||
      status.invertDiceFace ||
      status.silenced ||
      status.halveRoll ||
      status.modifier ||
      status.maxRoll ||
      (status.immune && status.immune.turns > 0) ||
      (status.doubleRoll && status.doubleRoll.turns > 0) ||
      (player.penaltyTurns ?? 0) > 0
  );
}
