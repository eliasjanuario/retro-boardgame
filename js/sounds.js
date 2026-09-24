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

const MUSIC_FILES = {
  opening: "sounds/opening.mp3",
};

const MUSIC_VOLUME = 0.5;

let currentMusic = null;
let pendingMusicUnlock = null;

function clearMusicUnlock() {
  if (!pendingMusicUnlock) {
    return;
  }
  document.removeEventListener("pointerdown", pendingMusicUnlock, true);
  document.removeEventListener("keydown", pendingMusicUnlock, true);
  pendingMusicUnlock = null;
}

function playMusic(key) {
  const file = MUSIC_FILES[key];
  if (!file) {
    return;
  }

  stopMusic();
  currentMusic = new Audio(file);
  currentMusic.loop = true;
  currentMusic.volume = MUSIC_VOLUME;

  const music = currentMusic;
  music.play().catch(() => {
    // Autoplay was blocked: start on the first user interaction instead.
    pendingMusicUnlock = () => {
      clearMusicUnlock();
      if (currentMusic === music) {
        music.play().catch(() => {});
      }
    };
    document.addEventListener("pointerdown", pendingMusicUnlock, true);
    document.addEventListener("keydown", pendingMusicUnlock, true);
  });
}

function stopMusic() {
  clearMusicUnlock();
  if (!currentMusic) {
    return;
  }
  currentMusic.pause();
  currentMusic.currentTime = 0;
  currentMusic = null;
}
