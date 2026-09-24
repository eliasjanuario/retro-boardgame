// Board square events (advance / setback) and square evaluation.

const advanceEvents = {
  4: {
    title: "BEGINNER'S LUCK!",
    desc: "Você achou uma ficha valiosa no tapete. Avance 2 casas.",
    spaces: 2,
  },
  9: {
    title: "PERFECT BLUFF!",
    desc: "Seu poker face funcionou e todo mundo correu. Avance 3 casas.",
    spaces: 3,
  },
  14: {
    title: "VIP ACCESS!",
    desc: "O segurança gostou de você e abriu a corda de veludo. Vá para a casa 18.",
    spaces: 4,
  },
  19: {
    title: "MINI JACKPOT!",
    desc: "As frutas alinharam no caça-níquel. Avance 4 casas.",
    spaces: 4,
  },
  24: {
    title: "DRINKS ON THE HOUSE!",
    desc: "Um drink energético e um bônus de velocidade. Avance 3 casas.",
    spaces: 3,
  },
  29: {
    title: "BULLSEYE!",
    desc: "A roleta parou bem no seu número da sorte. Avance 3 casas.",
    spaces: 3,
  },
  34: {
    title: "FREE SPIN!",
    desc: "O caça-níquel te deu um giro grátis. Avance 2 casas.",
    spaces: 2,
  },
  39: {
    title: "ARCADE GLITCH!",
    desc: "Um bug na máquina de pinball: vidas infinitas. Avance 3 casas.",
    spaces: 3,
  },
  44: {
    title: "VIP HOLOGRAM!",
    desc: "Você virou VIP virtual. Vá para a casa 53.",
    spaces: 9,
  },
  49: {
    title: "ROYAL FLUSH!",
    desc: "A melhor mão do pôquer. A mesa inteira chora. Avance 4 casas.",
    spaces: 4,
  },
  54: {
    title: "LUCKY DICE!",
    desc: "Você soprou os dados e tirou um 7 perfeito. Avance 2 casas.",
    spaces: 2,
  },
  59: {
    title: "MATH GENIUS!",
    desc: "Você contou as cartas na perfeição. Avance 3 casas.",
    spaces: 3,
  },
  64: {
    title: "GOLD CHIP!",
    desc: "Achou uma ficha de $1000 e colocou no bolso. Avance 3 casas.",
    spaces: 3,
  },
  69: {
    title: "IMPECCABLE POKER FACE!",
    desc: "Ninguém leu você. Levou o prêmio sem mostrar as cartas. Avance 4 casas.",
    spaces: 4,
  },
  74: {
    title: "EASTER EGG FOUND!",
    desc: "Um atalho secreto no pinball do fliperama. Avance 3 casas.",
    spaces: 3,
  },
  79: {
    title: "ALL-IN AND VICTORY!",
    desc: "Adrenalina pura: você arriscou tudo e dobrou o dinheiro. Avance 3 casas.",
    spaces: 3,
  },
  84: {
    title: "THE MAGIC BINDER!",
    desc: "Um atalho no tapete brilhante do cassino. Avance 3 casas.",
    spaces: 3,
  },
  89: {
    title: "THE MAGIC BINDER!",
    desc: "Outro atalho no tapete do cassino. Avance 5 casas.",
    spaces: 5,
  },
  94: {
    title: "HOT STREAK!",
    desc: "A mesa esquenta a seu favor. Avance 3 casas.",
    spaces: 3,
  },
  99: {
    title: "ONE STEP FROM GLORY!",
    desc: "O segurança piscou e você achou a brecha perfeita. Avance 2 casas rumo ao fim.",
    spaces: 2,
  },
};

const setbackEvents = {
  5: {
    title: "Dealer Has Blackjack!",
    desc: "Você apostou alto, mas a casa sempre vence. Volte 2 casas.",
    spaces: -2,
  },
  10: {
    title: "Slot Machine Tilt!",
    desc: "A máquina engoliu sua ficha de $100 e a tela congelou. Volte 3 casas.",
    spaces: -3,
  },
  15: {
    title: "Caught Counting Cards!",
    desc: "A gerência mandou te tirar da mesa de blackjack. Volte 3 casas.",
    spaces: -3,
  },
  20: {
    title: "Desperate All-In!",
    desc: "Você apostou o salário do mês no vermelho, mas caiu no preto. Volte 4 casas.",
    spaces: -4,
  },
  25: {
    title: "Fake Chips!",
    desc: "O caixa percebeu o truque e chamou a segurança. Volte 4 casas.",
    spaces: -4,
  },
  30: {
    title: "Bounced Check!",
    desc: "O cassino descobriu que sua conta está vazia. Volte 4 casas.",
    spaces: -4,
  },
  35: {
    title: "Cold Deck!",
    desc: "O baralho inteiro veio contra você. Volte 3 casas.",
    spaces: -3,
  },
  40: {
    title: "ATM Declined!",
    desc: '"Saldo insuficiente." A máquina apita na frente dos high rollers. Volte 4 casas.',
    spaces: -4,
  },
  45: {
    title: "Distracted by the Buffet!",
    desc: "O cheiro do camarão te fez esquecer as fichas no buffet. Vá para a casa 58.",
    spaces: 13,
  },
  50: {
    title: "Spilled Drink!",
    desc: "Você foi all-in no preto, mas a roleta parou no 00 verde. Volte 5 casas.",
    spaces: -5,
  },
  55: {
    title: "VIP Area Denied!",
    desc: "O segurança conferiu a lista e o seu nome não está nela. Volte 4 casas.",
    spaces: -4,
  },
  60: {
    title: "Snake Eyes!",
    desc: "Você soprou os dados por sorte e tirou dois uns. Volte 5 casas.",
    spaces: -5,
  },
  65: {
    title: "Bad Bluff!",
    desc: "O oponente leu o seu poker face pixelado. Volte 3 casas.",
    spaces: -3,
  },
  70: {
    title: "Jackpot Jam!",
    desc: "A máquina travou no instante do prêmio. Volte 4 casas.",
    spaces: -4,
  },
  75: {
    title: "Marked Cards!",
    desc: "O Pit Boss viu o canto marcado no seu Ás e anulou a mão. Volte 4 casas.",
    spaces: -4,
  },
  80: {
    title: "Lost Ticket!",
    desc: "Você perdeu o comprovante da aposta e precisa voltar seus passos. Volte 6 casas.",
    spaces: -6,
  },
  85: {
    title: "High Roller Hustled!",
    desc: "Um tubarão do poker levou tudo o que você tinha. Volte 5 casas.",
    spaces: -5,
  },
  90: {
    title: "Comp Card Expired!",
    desc: "Acabaram os drinks grátis e a sorte secou. Volte 4 casas.",
    spaces: -4,
  },
  95: {
    title: "Security Escort!",
    desc: "Você comemorou alto demais e foi escoltado para fora. Vá para a casa 85.",
    spaces: -10,
  },
  100: {
    title: "The House Always Wins!",
    desc: "Você bateu o jackpot, mas a máquina estava desligada. Volte 10 casas.",
    spaces: -10,
  },
};

function drawItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function evaluateSquare(playerIndex, diceNumber) {
  const player = gameState.players[playerIndex];
  const square = player.currentPosition;
  const squareType = square % 5;

  if (squareType === 1) {
    openModal({
      title: "Would You Rather?",
      text: drawLightQuestion(),
      type: "pergunta",
      onConfirm: finishPlay,
    });
    return;
  }

  if (squareType === 3) {
    openModal({
      title: "Would You Rather? (Dark)",
      text: drawDarkQuestion(),
      type: "pergunta",
      onConfirm: finishPlay,
    });
    return;
  }

  if (squareType === 4) {
    const event = advanceEvents[square];
    playSound("advantage");

    if (!event) {
      finishPlay();
      rollButton.disabled = false;
      return;
    }

    openModal({
      title: event.title,
      text: event.desc,
      type: "verde",
      onConfirm: () => {
        player.currentPosition = clampSquare(player.currentPosition + event.spaces);
        renderPlayers();
        finishPlay();
      },
    });
    return;
  }

  if (squareType === 0) {
    const event = setbackEvents[square];
    playSound("setback");

    if (!event) {
      finishPlay();
      rollButton.disabled = false;
      return;
    }

    openModal({
      title: event.title,
      text: event.desc,
      type: "vermelho",
      onConfirm: () => {
        player.currentPosition = clampSquare(player.currentPosition + event.spaces);
        renderPlayers();
        finishPlay();
      },
    });
    return;
  }

  if (squareType === 2) {
    startPictionary(player, diceNumber ?? 1);
    return;
  }

  finishPlay();
  rollButton.disabled = false;
}
