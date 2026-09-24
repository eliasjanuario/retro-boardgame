// VIP Roulette (late-game bonus).

const roulettePowers = [
  {
    name: "O Blefe Perfeito",
    desc: "Troca de lugar com um jogador à sua frente. Se você for o líder da partida, o efeito muda: você avança 6 casas e o segundo colocado recua 3 casas.",
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
    desc: "Concede imunidade persistente. Fica protegido contra o próximo efeito de carta de outro jogador: o efeito é bloqueado e a imunidade se desfaz.",
    effect(player) {
      ensureStatus(player).immune = true;
    },
  },
  {
    name: "Dados Viciados",
    desc: "Nos seus próximos 2 turnos, você rola dois dados simultaneamente, podendo avançar entre 2 e 12 casas.",
    effect(player) {
      ensureStatus(player).doubleRoll = { turns: 2 };
    },
  },
  {
    name: "Auditoria Surpresa",
    desc: "Você escolhe um adversário. Ele é pego pela segurança do cassino e é forçado a recuar 10 casas imediatamente, sem direito a defesa.",
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
    desc: "Um ataque em área que atinge a mesa inteira. Todos os outros 7 jogadores recuam 3 casas cada um, enquanto você permanece intacto na sua posição.",
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
    desc: "Teleporta você automaticamente para a próxima Casa Verde (evento positivo) à sua frente, garantindo a recompensa daquela casa de imediato.",
    triggersLandingSquare: true,
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
    desc: "A única fatia negativa. A jogada fracassa miseravelmente, você recua 5 casas e fica atordoado, perdendo a vez por 2 turnos inteiros.",
    effect(player) {
      player.currentPosition = clampSquare(player.currentPosition - 5);
      player.penaltyTurns = (player.penaltyTurns ?? 0) + 2;
    },
  },
];

function renderRoulettePowerList() {
  roulettePowerList.innerHTML = "";

  roulettePowers.forEach((power) => {
    const item = document.createElement("li");
    item.className = "roulette-power-list__item";

    const name = document.createElement("strong");
    name.className = "roulette-power-list__name";
    name.textContent = power.name;

    const desc = document.createElement("span");
    desc.className = "roulette-power-list__desc";
    desc.textContent = power.desc;

    item.append(name, desc);
    roulettePowerList.appendChild(item);
  });
}

function openRouletteModal() {
  renderRoulettePowerList();
  roulettePowerList.hidden = false;
  rouletteResult.hidden = true;
  rouletteResult.classList.remove("is-final");
  rouletteResult.textContent = "...";
  rouletteDescription.hidden = true;
  rouletteDescription.textContent = "";
  tryLuckButton.hidden = false;
  tryLuckButton.disabled = false;
  applyRouletteButton.hidden = true;
  applyRouletteButton.disabled = true;
  rouletteModal.hidden = false;
  rouletteModal.setAttribute("aria-hidden", "false");
}

function closeRouletteModal() {
  rouletteModal.hidden = true;
  rouletteModal.setAttribute("aria-hidden", "true");
  spinningRoulette = false;
  applyRouletteButton.disabled = true;
}

function openVipRoulette() {
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

  drawnRoulettePower = null;
  openRouletteModal();
  updatePanel();
}

function spinVipRoulette() {
  const player = gameState.players[gameState.currentTurn];

  if (
    rouletteModal.hidden ||
    !hasSpecialReady(player) ||
    spinningRoulette ||
    drawnRoulettePower
  ) {
    return;
  }

  player.usedRoulette = true;
  spinningRoulette = true;
  tryLuckButton.disabled = true;
  tryLuckButton.hidden = true;
  roulettePowerList.hidden = true;
  rouletteResult.hidden = false;
  renderPlayers();
  updateHUD();
  updatePanel();

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
      rouletteDescription.textContent = drawnRoulettePower.desc;
      rouletteDescription.hidden = false;
      applyRouletteButton.hidden = false;
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

  if (power.triggersLandingSquare && player.currentPosition % 5 === 4) {
    setTimeout(() => {
      evaluateSquare(gameState.currentTurn);
    }, MOVE_DURATION_MS);
    return;
  }

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
