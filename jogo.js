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
const chao = {
  spritesX: 0,
  spritesY: 610,
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112,
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

// Passaro
const flappyBird = {
  spritesX: 0,
  spritesY: 0,
  largura: 33,
  altura: 24,
  x: 10,
  y: 50,
  gravidade: 0.25,
  velocidade: 0,
  atualiza() {
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
  }
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
let telaAtiva = {}
function mudaParaTela(novaTela) {
  telaAtiva = novaTela
}
const Telas = {
  INICIO: {
    desenha() {
      planoDeFundo.desenha()
      chao.desenha()
      flappyBird.desenha()
      mensagemGetReady.desenha()
    },
    click() {
      mudaParaTela(Telas.JOGO)
    },
    atualiza() {

    }
  }
}

Telas.JOGO = {
  desenha() {
    planoDeFundo.desenha()
    chao.desenha()
    flappyBird.desenha()
  },
  atualiza() {
    flappyBird.atualiza()
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