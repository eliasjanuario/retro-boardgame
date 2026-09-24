// Board coordinates, square helpers and piece rendering.

const mapCoordinates = [
  { x: "19.97%", y: "4.50%" }, // 0: START
  { x: "25.37%", y: "5.03%" }, // 1
  { x: "30.36%", y: "5.21%" }, // 2
  { x: "32.93%", y: "4.67%" }, // 3
  { x: "37.38%", y: "4.85%" }, // 4
  { x: "41.70%", y: "4.50%" }, // 5
  { x: "46.02%", y: "4.85%" }, // 6
  { x: "49.80%", y: "4.50%" }, // 7
  { x: "53.85%", y: "4.67%" }, // 8
  { x: "57.89%", y: "4.67%" }, // 9
  { x: "62.62%", y: "5.03%" }, // 10
  { x: "65.18%", y: "8.79%" }, // 11
  { x: "65.45%", y: "13.61%" }, // 12
  { x: "62.89%", y: "17.73%" }, // 13
  { x: "60.19%", y: "21.48%" }, // 14
  { x: "57.22%", y: "25.41%" }, // 15
  { x: "53.31%", y: "25.24%" }, // 16
  { x: "49.39%", y: "24.70%" }, // 17
  { x: "44.53%", y: "25.77%" }, // 18
  { x: "39.81%", y: "25.59%" }, // 19
  { x: "36.03%", y: "25.59%" }, // 20
  { x: "32.66%", y: "25.59%" }, // 21
  { x: "27.80%", y: "24.88%" }, // 22
  { x: "24.83%", y: "25.41%" }, // 23
  { x: "20.38%", y: "25.06%" }, // 24
  { x: "16.73%", y: "24.88%" }, // 25
  { x: "13.63%", y: "28.63%" }, // 26
  { x: "10.12%", y: "33.46%" }, // 27
  { x: "12.42%", y: "36.32%" }, // 28
  { x: "15.65%", y: "39.54%" }, // 29
  { x: "18.08%", y: "44.01%" }, // 30
  { x: "22.67%", y: "44.73%" }, // 31
  { x: "27.13%", y: "43.65%" }, // 32
  { x: "31.17%", y: "43.65%" }, // 33
  { x: "34.82%", y: "43.47%" }, // 34
  { x: "38.46%", y: "43.47%" }, // 35
  { x: "42.91%", y: "43.47%" }, // 36
  { x: "47.23%", y: "43.29%" }, // 37
  { x: "51.01%", y: "43.47%" }, // 38
  { x: "54.93%", y: "43.47%" }, // 39
  { x: "60.73%", y: "43.65%" }, // 40
  { x: "61.81%", y: "40.61%" }, // 41
  { x: "64.24%", y: "35.96%" }, // 42
  { x: "67.61%", y: "31.49%" }, // 43
  { x: "70.18%", y: "28.63%" }, // 44
  { x: "73.55%", y: "23.27%" }, // 45
  { x: "77.87%", y: "24.34%" }, // 46
  { x: "81.65%", y: "24.70%" }, // 47
  { x: "85.43%", y: "24.88%" }, // 48
  { x: "89.47%", y: "25.06%" }, // 49
  { x: "92.85%", y: "24.88%" }, // 50
  { x: "97.17%", y: "28.99%" }, // 51
  { x: "97.17%", y: "34.35%" }, // 52
  { x: "93.93%", y: "37.75%" }, // 53
  { x: "91.90%", y: "41.86%" }, // 54
  { x: "88.53%", y: "45.62%" }, // 55
  { x: "86.64%", y: "49.55%" }, // 56
  { x: "82.19%", y: "48.84%" }, // 57
  { x: "75.84%", y: "49.02%" }, // 58
  { x: "73.68%", y: "48.84%" }, // 59
  { x: "70.72%", y: "52.41%" }, // 60
  { x: "67.88%", y: "56.17%" }, // 61
  { x: "65.32%", y: "60.46%" }, // 62
  { x: "62.21%", y: "64.21%" }, // 63
  { x: "60.59%", y: "67.61%" }, // 64
  { x: "57.22%", y: "72.08%" }, // 65
  { x: "52.77%", y: "71.90%" }, // 66
  { x: "48.45%", y: "71.55%" }, // 67
  { x: "44.13%", y: "71.55%" }, // 68
  { x: "40.22%", y: "71.37%" }, // 69
  { x: "36.57%", y: "71.72%" }, // 70
  { x: "32.12%", y: "71.72%" }, // 71
  { x: "27.67%", y: "71.72%" }, // 72
  { x: "25.10%", y: "71.55%" }, // 73
  { x: "20.92%", y: "71.72%" }, // 74
  { x: "16.06%", y: "71.72%" }, // 75
  { x: "13.36%", y: "67.61%" }, // 76
  { x: "9.99%", y: "63.68%" }, // 77
  { x: "6.61%", y: "64.04%" }, // 78
  { x: "3.64%", y: "68.15%" }, // 79
  { x: "3.51%", y: "73.51%" }, // 80
  { x: "6.48%", y: "76.73%" }, // 81
  { x: "9.31%", y: "80.84%" }, // 82
  { x: "12.28%", y: "84.60%" }, // 83
  { x: "14.71%", y: "87.82%" }, // 84
  { x: "16.87%", y: "92.64%" }, // 85
  { x: "19.70%", y: "97.47%" }, // 86
  { x: "24.43%", y: "96.58%" }, // 87
  { x: "27.94%", y: "96.58%" }, // 88
  { x: "32.52%", y: "96.22%" }, // 89
  { x: "36.03%", y: "96.04%" }, // 90
  { x: "40.22%", y: "96.04%" }, // 91
  { x: "45.21%", y: "96.04%" }, // 92
  { x: "47.91%", y: "96.04%" }, // 93
  { x: "52.50%", y: "96.22%" }, // 94
  { x: "56.14%", y: "96.40%" }, // 95
  { x: "60.59%", y: "96.22%" }, // 96
  { x: "65.18%", y: "96.22%" }, // 97
  { x: "69.23%", y: "96.40%" }, // 98
  { x: "71.66%", y: "92.64%" }, // 99
  { x: "74.36%", y: "88.71%" }, // 100: END
  { x: "78.00%", y: "84.42%" }, // Bonus / final adjustment
];

const lastSquare = mapCoordinates.length - 1;
const MOVE_DURATION_MS = 500;

function clampSquare(position) {
  return Math.min(Math.max(position, 0), lastSquare);
}

function applyAvatarAura(avatar, player) {
  const status = player.status || {};

  avatar.classList.toggle(
    "aura-roxa",
    Boolean(status.moveBackwards || status.invertDiceFace)
  );
  avatar.classList.toggle("aura-amarela", Boolean(status.silenced));
  avatar.classList.toggle(
    "aura-vermelha",
    Boolean(status.halveRoll || status.modifier || status.maxRoll)
  );
  avatar.classList.toggle("aura-vip-piece", hasSpecialReady(player));
}

function renderPlayers() {
  let anyMoved = false;
  let anyAuraGained = false;

  gameState.players.forEach((player, idx) => {
    const square = Math.min(Math.max(player.currentPosition, 0), lastSquare);
    const coord = mapCoordinates[square];
    let avatar = playersContainer.querySelector(
      `[data-player="${player.name}"]`
    );
    const isNewAvatar = !avatar;

    if (!avatar) {
      avatar = document.createElement("img");
      avatar.className = "player-avatar";
      avatar.dataset.player = player.name;
      avatar.src = `assets/pieces/${player.name.toLowerCase()}_avatar.png`;
      avatar.alt = player.name;
      playersContainer.appendChild(avatar);
    }

    const hadVipAura = avatar.classList.contains("aura-vip-piece");
    applyAvatarAura(avatar, player);
    updateHUDAlert(player, idx);

    if (!isNewAvatar) {
      if (!hadVipAura && avatar.classList.contains("aura-vip-piece")) {
        anyAuraGained = true;
      }
      if (avatar.dataset.square !== String(square)) {
        anyMoved = true;
      }
    }

    avatar.dataset.square = String(square);
    avatar.style.left = coord.x;
    avatar.style.top = coord.y;
    avatar.style.zIndex = String(idx + 1);
  });

  if (anyMoved) {
    playSound("jump");
  }
  if (anyAuraGained) {
    playSound("powerUp");
  }
}
