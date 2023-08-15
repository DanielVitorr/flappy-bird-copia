const som_HIT = new Audio()
som_HIT.src = './efeitos/hit.wav'

const sprites = new Image();
sprites.src = './sprites.png';

let frame = 0

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// PLano de fundo
const planoDeFundo = {
  spritesX: 390,
  spritesY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = '#70c5ce'
    contexto.fillRect(0, 0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spritesX, planoDeFundo.spritesY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura
    )

    contexto.drawImage(
      sprites,
      planoDeFundo.spritesX, planoDeFundo.spritesY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura
    )
  }
}

// Chão
function criaChao() {
  const chao = {
    spritesX: 0,
    spritesY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza() {
      const movimentoDoChao = 1
      const repeteEm = chao.largura / 2 
      const movimentacao = chao.x = chao.x - movimentoDoChao

      chao.x = movimentacao % repeteEm
    },
    desenha() {
      contexto.drawImage(
        sprites,
        chao.spritesX, chao.spritesY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura
      )
  
      contexto.drawImage(
        sprites,
        chao.spritesX, chao.spritesY,
        chao.largura, chao.altura,
        (chao.x + chao.largura), chao.y,
        chao.largura, chao.altura
      )
    }
  }
  return chao
}

function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura
  const chaoY = chao.y

  if(flappyBirdY >= chaoY) {
    return true
  }
}

// Passaro
function criaFlappyBird() {
  const flappyBird = {
    spritesX: 0,
    spritesY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    gravidade: 0.12,
    velocidade: 0,
    pulo: 3.6,
    atualiza() {
      if(fazColisao(flappyBird, globais.chao)) {
        som_HIT.play()
        mudaParaTela(Telas.GAMEOVER)
        return
      }
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade
      flappyBird.y = flappyBird.y + flappyBird.velocidade
    },
    movimentos: [
      {spriteX: 0, spriteY: 0},
      {spriteX: 0, spriteY: 26},
      {spriteX: 0, spriteY: 52},
    ],
    frameAtual: 0,
    atualizaOFrameAtual() {
      const intervaloDeFrames = 10
      const passouOIntervalo = frame % intervaloDeFrames === 0

      if(passouOIntervalo) {
        const baseDoIncremento = 1
        const incremento = baseDoIncremento + flappyBird.frameAtual
        const baseRepeticao = flappyBird.movimentos.length
        flappyBird.frameAtual = incremento % baseRepeticao
      }
    },
    desenha() {
      flappyBird.atualizaOFrameAtual()
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual]
      contexto.drawImage(
        sprites,
        spriteX, spriteY,
        flappyBird.largura, flappyBird.altura,
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura
      )
    },
    pula() {
      flappyBird.velocidade = - flappyBird.pulo
    }
  }
  return flappyBird
}

// Canos
function criaCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spritesX: 0,
      spritesY: 169,
    },
    ceu: {
      spritesX: 52,
      spritesY: 169,
    },
    espaco: 80,
    desenha() {
      canos.pares.forEach(function(par) {
        const yAteatorio = par.y
        const espacamentoEntreOCano = canos.espaco;
  
        const canoCeuX = par.x
        const canoCeuY = yAteatorio
        contexto.drawImage(
          sprites,
          canos.ceu.spritesX, canos.ceu.spritesY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura
        )
  
        const canoChaoX = par.x
        const canoChaoY = canos.altura + espacamentoEntreOCano + yAteatorio
        contexto.drawImage(
          sprites,
          canos.chao.spritesX, canos.chao.spritesY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura
          )

          par.canoCeu = {
            x: canoCeuX,
            y: canos.altura + canoCeuY
          }
          par.canoChao = {
            x: canoChaoX,
            y: canoChaoY
          }
      })
    },
    temColisaoComOFlappyBird(par) {
      const cabecaDoFlappy = globais.flappyBird.y
      const peDoFlappy = globais.flappyBird.y + (globais.flappyBird.altura - 5)
      
      if(globais.flappyBird.x == par.x) {
        globais.placar.pontuacao += 1
      }

      if(globais.flappyBird.x + (globais.flappyBird.largura - 2) >= par.x) {
        if(cabecaDoFlappy <= par.canoCeu.y) {
          return true
        }

        if(peDoFlappy >= par.canoChao.y) {
          return true
        }
      }
    },
    pares: [],
    atualiza() {
      const passou100Frames = frame % 100 === 0
      if(passou100Frames) {
        canos.pares.push(
          {
            x: canvas.width,
            y: -150 * (Math.random() + 1),
          }
        )
      }

      canos.pares.forEach(function(par) {
        par.x = par.x - 2
        
        if(canos.temColisaoComOFlappyBird(par)) {
          som_HIT.play()
          mudaParaTela(Telas.GAMEOVER)
          return
        }

        if(par.x + canos.largura <= 0) {
          canos.pares.shift()
        }
      })
    }
  }
  return canos
}

// Tela de get ready
const mensagemGetReady = {
  spritesX: 134,
  spritesY: 0,
  largura: 174,
  altura: 152,
  x: (canvas.width / 2) - 174 /2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.spritesX, mensagemGetReady.spritesY,
      mensagemGetReady.largura, mensagemGetReady.altura,
      mensagemGetReady.x, mensagemGetReady.y,
      mensagemGetReady.largura, mensagemGetReady.altura
    )
  }
}

// Tela de get ready
const mensagemGameOver = {
  spritesX: 134,
  spritesY: 153,
  largura: 226,
  altura: 200,
  x: (canvas.width / 2) - 226 /2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGameOver.spritesX, mensagemGameOver.spritesY,
      mensagemGameOver.largura, mensagemGameOver.altura,
      mensagemGameOver.x, mensagemGameOver.y,
      mensagemGameOver.largura, mensagemGameOver.altura
    )
  },
  atualiza() {
    globais.placar.atualiza()
  }
}

// Placar de pontos
function criaPlacar() {
  const placar = {
    pontuacao: 0,
    desenha() {
      contexto.font = '35px "VT323"'
      contexto.textAlign = 'right'
      contexto.fillStyle = '#fff'
      contexto.fillText(`Pontuação: ${placar.pontuacao}`, canvas.width - 10, 35)
    },
    atualiza() {  
      contexto.font = '35px "VT323"'
      contexto.textAlign = 'right'
      contexto.fillStyle = '#000'
      contexto.fillText(placar.pontuacao, canvas.width - 70, 147)
    }
  }
  return placar
}

// Medalhas
const medalha = {
  spritesX: 0,
  spritesY: 78,
  largura: 44,
  altura: 44,
  x: 73,
  y: 136,
  medalhas: [
    { spriteX: 0, spriteY: 78 },
    { spriteX: 48, spriteY: 124 },
    { spriteX: 48, spriteY: 78 },
    { spriteX: 0, spriteY: 124 }
  ],
  pontosAcumulado: 0,
  tipoMedalha: 0,
  atualizaMedalha() {
    const totalDePontos = globais.placar.pontuacao


    if(totalDePontos) {
      const baseTipoMedalha = 1
      const incrementoMedalha = baseTipoMedalha + medalha.tipoMedalha
      const baseMostramedalha = medalha.medalhas.length
      medalha.tipoMedalha = incrementoMedalha % baseMostramedalha
      console.log(medalha.tipoMedalha)
    }
    
  },
  desenha() {
    const { spriteX, spriteY } = medalha.medalhas[medalha.tipoMedalha]
    
    if(medalha.atualizaMedalha()) {
      contexto.drawImage(
        sprites,
        spriteX, spriteY,
        medalha.largura, medalha.altura,
        medalha.x, medalha.y,
        medalha.largura, medalha.altura
      )
    }
  }
}


//
// Telas
//
const globais = {}
let telaAtiva = {}
function mudaParaTela(novaTela) {
  telaAtiva = novaTela

  if(telaAtiva.inicializa) {
    telaAtiva.inicializa()
  }
}

const Telas = {
  INICIO: {
    inicializa() {
      globais.flappyBird = criaFlappyBird()
      globais.chao = criaChao()
      globais.canos = criaCanos()
    },
    desenha() {
      planoDeFundo.desenha()
      globais.flappyBird.desenha()
      globais.chao.desenha()
      mensagemGetReady.desenha()
    },
    click() {
      mudaParaTela(Telas.JOGO)
    },
    atualiza() {
      globais.chao.atualiza()
    }
  }
}

Telas.JOGO = {
  inicializa() {
    globais.placar = criaPlacar()
  },
  desenha() {
    planoDeFundo.desenha()
    globais.canos.desenha()
    globais.placar.desenha()
    globais.flappyBird.desenha()
    globais.chao.desenha()
  },
  click() {
    globais.flappyBird.pula()
  },
  atualiza() {
    globais.flappyBird.atualiza()
    globais.chao.atualiza()
    globais.canos.atualiza()
  }
}

Telas.GAMEOVER = {
  desenha() {
    planoDeFundo.desenha()
    mensagemGameOver.desenha()
    globais.chao.desenha()
    medalha.desenha()
  },
  atualiza() {
    mensagemGameOver.atualiza()
  },
  click() {
    mudaParaTela(Telas.INICIO)
  }
}

function loop() {
  telaAtiva.desenha()
  telaAtiva.atualiza()

  frame = frame + 1
  requestAnimationFrame(loop)
}

window.addEventListener('click', function() {
  if(telaAtiva.click) {
    telaAtiva.click()
  }
})
mudaParaTela(Telas.INICIO)
loop()
