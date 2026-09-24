// DOM element references shared by all modules.

const playersContainer = document.querySelector(".players-container");
const modal = document.querySelector("#game-modal");
const modalTitle = document.querySelector("#modal-title");
const modalText = document.querySelector("#modal-text");
const modalOkButton = document.querySelector("#modal-ok");
const loadButton = document.querySelector("#btn-load-save");
const saveButton = document.querySelector("#btn-save");
const rollButton = document.querySelector("#btn-roll");
const cardButton = document.querySelector("#btn-special-card");
const rouletteButton = document.querySelector("#btn-roleta");
const accumulateButton = document.querySelector("#btn-acumular-rodada");
const testModeButton = document.querySelector("#btn-modo-teste");
const inputSave = document.querySelector("#input-save");
const attackModal = document.querySelector("#attack-modal");
const targetSelect = document.querySelector("#attack-target");
const confirmAttackButton = document.querySelector("#attack-confirm");
const attackModalTitle = document.querySelector("#attack-modal-title");
const attackModalText = document.querySelector("#attack-modal-text");
const rouletteModal = document.querySelector("#roulette-modal");
const rouletteResult = document.querySelector("#roulette-result");
const roulettePowerList = document.querySelector("#roulette-power-list");
const rouletteDescription = document.querySelector("#roulette-description");
const tryLuckButton = document.querySelector("#btn-tentar-sorte");
const applyRouletteButton = document.querySelector("#btn-aplicar-roleta");
const turnBanner = document.querySelector("#turn-banner");
const diceDisplay = document.querySelector("#dice-display");
const diceModifierText = document.querySelector("#dice-modifier-text");
const cardActivationModal = document.querySelector("#card-activation-modal");

const pictionaryCategoryModal = document.querySelector(
  "#pictionary-category-modal"
);

const activatedCardImg = document.querySelector("#activated-card-image");
const cardActivationTitle = document.querySelector("#card-activation-title");
const cardEffectText = document.querySelector("#card-effect-text");
const closeActivationButton = document.querySelector("#btn-fechar-ativacao");
const cardPreviewOverlay = document.querySelector("#card-preview-overlay");
const cardPreviewImage = document.querySelector("#card-preview-image");
const cardPreviewCaption = document.querySelector("#card-preview-caption");
const closePreviewButton = document.querySelector("#card-preview-close");
const board = document.querySelector(".board-container");
const boardViewport = document.querySelector(".board-viewport");
const recenterButton = document.querySelector("#btn-recenter-board");
const turnOrderModal = document.querySelector("#turn-order-modal");
const turnOrderTitle = document.querySelector("#turn-order-title");
const turnOrderText = document.querySelector("#turn-order-text");
const turnOrderList = document.querySelector("#turn-order-list");
const keepOrderButton = document.querySelector("#btn-keep-order");
const shuffleOrderButton = document.querySelector("#btn-shuffle-order");
const turnOrderContinueButton = document.querySelector("#btn-turn-order-continue");
