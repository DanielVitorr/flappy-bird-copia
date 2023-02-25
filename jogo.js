const som_HIT = new Audio()
som_HIT.src = './efeitos/hit.wav'

const sprites = new Image();
sprites.src = './sprites.png';

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
  return false
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
    gravidade: 0.25,
    velocidade: 0,
    pulo: 4.6,
    atualiza() {
      if(fazColisao(flappyBird, chao)) {
        som_HIT.play()
        mudaParaTela(Telas.INICIO)
        return
      }
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade
      flappyBird.y = flappyBird.y + flappyBird.velocidade
    },
    desenha() {
      contexto.drawImage(
        sprites,
        flappyBird.spritesX, flappyBird.spritesY,
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
    },
    desenha() {
      planoDeFundo.desenha()
      globais.chao.desenha()
      globais.flappyBird.desenha()
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
  desenha() {
    planoDeFundo.desenha()
    globais.chao.desenha()
    globais.flappyBird.desenha()
  },
  click() {
    globais.flappyBird.pula()
  },
  atualiza() {
    globais.flappyBird.atualiza()
  }
}

function loop() {
  telaAtiva.desenha()
  telaAtiva.atualiza()
  requestAnimationFrame(loop)
}

window.addEventListener('click', function() {
  if(telaAtiva.click) {
    telaAtiva.click()
  }
})
mudaParaTela(Telas.INICIO)
loop()