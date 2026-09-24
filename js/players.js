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
    lastRolledRound: 0,
    accumulatedRounds: 0,
    cardRevealed: false,
    usedRoulette: false,
    penaltyTurns: 0,
    status: {},
  }));
}

function hasPlayedThisRound(player) {
  return player.lastRolledRound === gameState.currentRound;
}

/** Retroactively limits the target's last dice move to `limit` squares. */
function capLastMove(player, limit) {
  const excess = (player.lastMove || 0) - limit;
  if (excess > 0) {
    player.currentPosition = clampSquare(player.currentPosition - excess);
    player.lastMove = limit;
  }
}

function hasSpecialReady(player) {
  return (
    (player.cardUses ?? 0) === 0 &&
    player.currentPosition >= 50 &&
    !player.usedRoulette
  );
}

function isPlayerImmune(player) {
  return Boolean(player.status?.immune);
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
      Boolean(status.immune) ||
      (status.doubleRoll && status.doubleRoll.turns > 0) ||
      (player.penaltyTurns ?? 0) > 0
  );
}
