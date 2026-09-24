// Sound effects for game actions.

const SOUND_FILES = {
  jump: "sounds/jump-sound.wav",
  advantage: "sounds/advantage.wav",
  setback: "sounds/game-over.wav",
  powerUp: "sounds/power-up.wav",
  card: "sounds/card.wav",
  dice: "sounds/dice-rolling-on-table.wav",
  cardHit: "sounds/game-over.wav",
};

const soundCache = {};

function playSound(key) {
  const file = SOUND_FILES[key];
  if (!file) {
    return;
  }

  if (!soundCache[key]) {
    soundCache[key] = new Audio(file);
    soundCache[key].preload = "auto";
  }

  const audio = soundCache[key];
  audio.currentTime = 0;
  // Browsers reject play() before the first user interaction.
  audio.play().catch(() => {});
}
