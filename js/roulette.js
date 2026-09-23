// VIP Roulette (late-game bonus).

const roulettePowers = [
  {
    name: "O Blefe Perfeito",
    effect(player, state) {
      const leader = state.players.reduce((prev, current) =>
        prev.currentPosition > current.currentPosition ? prev : current
      );

      if (player === leader) {
        player.currentPosition = clampSquare(player.currentPosition + 6);
        const sorted = [...state.players].sort(
          (a, b) => b.currentPosition - a.currentPosition
        );
        const runnerUp = sorted.find((j) => j !== player) || sorted[1];
        if (runnerUp) {
          runnerUp.currentPosition = clampSquare(runnerUp.currentPosition - 3);
        }
        return;
      }

      return new Promise((resolve) => {
        openTargetModal(player, "frente", (target) => {
          if (target) {
            const temp = player.currentPosition;
            player.currentPosition = target.currentPosition;
            target.currentPosition = temp;
          }
          resolve();
        });
      });
    },
  },
  {
    name: "Acesso VIP",
    effect(player) {
      ensureStatus(player).immune = { turns: 2 };
    },
  },
  {
    name: "Dados Viciados",
    effect(player) {
      ensureStatus(player).doubleRoll = { turns: 2 };
    },
  },
  {
    name: "A Receita Federal",
    effect(player) {
      return new Promise((resolve) => {
        openTargetModal(player, "qualquer", (target) => {
          if (target) {
            target.currentPosition = clampSquare(target.currentPosition - 10);
          }
          resolve();
        });
      });
    },
  },
  {
    name: "Blackout no Cassino",
    effect(player, state) {
      state.players.forEach((j) => {
        if (j !== player) {
          j.currentPosition = clampSquare(j.currentPosition - 3);
        }
      });
    },
  },
  {
    name: "Ficha de Ouro",
    effect(player) {
      if (player.currentPosition >= lastSquare) {
        return;
      }

      do {
        player.currentPosition = clampSquare(player.currentPosition + 1);
      } while (
        player.currentPosition % 5 !== 4 &&
        player.currentPosition < lastSquare
      );
    },
  },
  {
    name: "☠️ BANCARROTA ☠️",
    effect(player) {
      player.currentPosition = clampSquare(player.currentPosition - 5);
      player.penaltyTurns = (player.penaltyTurns ?? 0) + 2;
    },
  },
];

function openRouletteModal() {
  rouletteModal.hidden = false;
  rouletteModal.setAttribute("aria-hidden", "false");
  rouletteResult.classList.remove("is-final");
  rouletteResult.textContent = "...";
  applyRouletteButton.disabled = true;
}

function closeRouletteModal() {
  rouletteModal.hidden = true;
  rouletteModal.setAttribute("aria-hidden", "true");
  spinningRoulette = false;
  applyRouletteButton.disabled = true;
}

function spinVipRoulette() {
  const player = gameState.players[gameState.currentTurn];

  if (
    !hasSpecialReady(player) ||
    spinningRoulette ||
    rollingDice ||
    activatingCard ||
    pictionaryActive ||
    pendingRoll ||
    pendingModal
  ) {
    return;
  }

  player.usedRoulette = true;
  spinningRoulette = true;
  drawnRoulettePower = null;
  renderPlayers();
  updateHUD();
  updatePanel();
  openRouletteModal();

  const startTime = Date.now();
  const duracao = 2500;
  const spinInterval = setInterval(() => {
    const power =
      roulettePowers[Math.floor(Math.random() * roulettePowers.length)];
    rouletteResult.textContent = power.name;

    if (Date.now() - startTime >= duracao) {
      clearInterval(spinInterval);
      drawnRoulettePower =
        roulettePowers[Math.floor(Math.random() * roulettePowers.length)];
      rouletteResult.textContent = drawnRoulettePower.name;
      rouletteResult.classList.add("is-final");
      applyRouletteButton.disabled = false;
    }
  }, 50);
}

async function applyRouletteEffect() {
  const player = gameState.players[gameState.currentTurn];
  const power = drawnRoulettePower;

  if (!power || applyRouletteButton.disabled) {
    return;
  }

  applyRouletteButton.disabled = true;
  closeRouletteModal();

  try {
    await Promise.resolve(power.effect(player, gameState));
  } catch (err) {
    console.warn("Erro ao aplicar roleta:", err);
  }

  drawnRoulettePower = null;
  renderPlayers();
  renderHUD();
  finishPlay();
}

function confirmRouletteTargetSelection() {
  if (!pendingTargetSelection) {
    return;
  }

  const targetIndex = Number(targetSelect.value);
  const target = gameState.players[targetIndex];
  const { onConfirm } = pendingTargetSelection;

  pendingTargetSelection = null;
  closeAttackModal();
  restoreAttackModalTexts();
  onConfirm(target || null);
}
