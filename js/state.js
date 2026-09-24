// Global game state, runtime flags and test mode.

function toggleTestMode() {
  gameState.testMode = !gameState.testMode;
  updatePanel();
}

let gameState = {
  currentRound: 1,
  currentTurn: 0,
  players: createPlayers(),
  testMode: false,
  shuffleEachRound: false,
  remainingLightQuestions: shuffleList(createLightQuestionDeck()),
  remainingDarkQuestions: shuffleList(createDarkQuestionDeck()),
  pictionaryDB: createPictionaryDB(),
};

let pictionaryActive = false;
let pictionaryTimerId = null;
let pendingPictionaryPlayer = null;

/** After the dice reveal: { playerIndex, delta, finalRoll } — choose to move or use the card */
let pendingRoll = null;

let spinningRoulette = false;
let drawnRoulettePower = null;

/** Roulette target selection: { onConfirm(target) } */
let pendingTargetSelection = null;

let pendingModal = null;
let rollingDice = false;
let activatingCard = false;
