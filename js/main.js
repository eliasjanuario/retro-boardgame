// Event listener wiring and game start.

function startGame() {
  renderHUD();
  renderPlayers();
  updatePanel();
}

closePreviewButton.addEventListener("click", (event) => {
  event.stopPropagation();
  closeCardPreview();
});

cardPreviewOverlay.addEventListener("click", (event) => {
  if (event.target === cardPreviewOverlay) {
    closeCardPreview();
  }
});

cardPreviewImage.addEventListener("click", (event) => {
  event.stopPropagation();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !cardPreviewOverlay.hidden) {
    closeCardPreview();
  }
});

saveButton.addEventListener("click", saveGame);
rollButton.addEventListener("click", rollDice);
cardButton.addEventListener("click", useCard);
rouletteButton.addEventListener("click", openVipRoulette);
tryLuckButton.addEventListener("click", spinVipRoulette);
applyRouletteButton.addEventListener("click", applyRouletteEffect);
accumulateButton.addEventListener("click", accumulateRound);
testModeButton.addEventListener("click", toggleTestMode);
modalOkButton.addEventListener("click", confirmModal);
confirmAttackButton.addEventListener("click", confirmAttack);

loadButton.addEventListener("click", () => {
  inputSave.click();
});

inputSave.addEventListener("change", (event) => {
  const file = event.target.files[0];
  loadGame(file);
  event.target.value = "";
});

startGame();
