//Configurações da biblioteca
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

//Criação das variáveis
let engine;
let world;
var ground;
var rope, rope2, rope3;
var fruit;
var fruit_con, fruit_con2, fruit_con3;
var imagemFundo, comida, coelho;
var spriteCoelho;
var button, button2, button3;
var piscando;
var comendo;
var triste;
var musica;
var corta;
var chorando;
var alimentando;
var ar;
var balao;
var mute;

//Função para carregar os arquivos
function preload(){
  //Carregando imagens
  imagemFundo = loadImage("background.png");
  comida = loadImage("cenoura.png");
  coelho = loadImage("Rabbit-01.png");
  //Carregando animações
  piscando = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  comendo = loadAnimation("eat_0.png","eat_1.png","eat_2.png", "eat_3.png", "eat_4.png");
  triste = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  //Configurações das animações
  piscando.playing = true;
  comendo.playing = true;
  triste.playing = true;
  comendo.looping = false;
  triste.looping = false;
  //Carregando os sons
  musica = loadSound("sound1.mp3");
  corta = loadSound("rope_cut.mp3");
  chorando = loadSound("sad.wav");
  alimentando = loadSound("eating_sound.mp3");
  ar = loadSound("air.wav");
}

//Função para configurações
function setup() 
{
  //Vamos verificar se está no celular ou pc
  var estaNoCelular = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(estaNoCelular){
    //Se estiver no celular, ajusta o tamanho da tela
    canW = displayWidth;
    canH = displayHeight;
    //Criando a tela
    createCanvas(displayWidth+80, displayHeight);
  } else {
    //Se estiver no pc, ajusta o tamanho da tela
    canW = windowWidth;
    canH = windowHeight;
    //Criando a tela
    createCanvas(windowWidth+80, windowHeight);
  }

  //Colocando a música para tocar
  musica.play();
  //Ajustando o volume
  musica.setVolume(0.5);

  //Configuração da biblioteca Matter
  engine = Engine.create();
  world = engine.world;

  //Configuração de posição dos elementos
  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);

  //Velocidade das animações
  piscando.frameDelay = 15;
  comendo.frameDelay = 15;

  //Criando o chão
  ground = new Ground(200, canH, 600, 20);
  //Criando as cordas
  rope = new Rope(8, {x: 40, y: 30});
  rope2 = new Rope(7, {x: 370, y: 40});
  rope3 = new Rope(4, {x: 400, y: 225});

  //Configurando a cenoura
  var fruit_config = {
    density: 0.001
  }
  //Criando a cenoura
  fruit = Bodies.circle(300,300,15,fruit_config);
  //Adicionando a cenoura à corda
  Matter.Composite.add(rope.body, fruit);
  //Ligando as cordas com a cenoura
  fruit_con = new Link(rope, fruit);
  fruit_con2 = new Link(rope2, fruit);
  fruit_con3 = new Link(rope3, fruit);

  //Criando o sprite do coelho
  spriteCoelho = createSprite(170,canH-80,100,100);
  //Adicionando imagem ao sprite do coelho
  spriteCoelho.addImage(coelho);
  //Ajustando a escala (tamanho) do coelho
  spriteCoelho.scale = 0.2;
  //Adicionar as animações do coelho
  spriteCoelho.addAnimation("piscando", piscando);
  spriteCoelho.addAnimation("comendo", comendo);
  spriteCoelho.addAnimation("triste", triste);
  //Mudar para a animação piscando
  spriteCoelho.changeAnimation("piscando");

  //Criando a imagem para ser o botão
  button = createImg("cut_button.png");
  //Definindo a posição do botão
  button.position(20,30);
  //Definindo o tamanho do botão
  button.size(50,50);
  //Quando o botão é clicado, chama a função
  button.mouseClicked(derrubarComida);

  //Criando a imagem para ser o botão
  button2 = createImg("cut_button.png");
  //Definindo a posição do botão
  button2.position(330,35);
  //Definindo o tamanho do botão
  button2.size(50,50);
  //Quando o botão é clicado, chama a função
  button2.mouseClicked(derrubarComida2);

  //Criando a imagem para ser o botão
  button3 = createImg("cut_button.png");
  //Definindo a posição do botão
  button3.position(360,200);
  //Definindo o tamanho do botão
  button3.size(50,50);
  //Quando o botão é clicado, chama a função
  button3.mouseClicked(derrubarComida3);
  
  //Criando a imagem para ser o botão
  //balao = createImg("balloon.png");
  //Definindo a posição do botão
  //balao.position(10,230);
  //Definindo o tamanho do botão
  //balao.size(150,100);
  //Quando o botão é clicado, chama a função
  //balao.mouseClicked(soprando);

  //Criando a imagem para ser o botão
  mute = createImg("mute.png");
  //Definindo a posição do botão
  mute.position(450,20);
  //Definindo o tamanho do botão
  mute.size(50,50);
  //Quando o botão é clicado, chama a função
  mute.mouseClicked(mutando);
}

//Função de desenho
function draw() 
{
  //Colocando as configurações do fundo
  background(51);
  image(imagemFundo, width/2, height/2, displayWidth+80, displayHeight);

  //Atualizando a parte de física do jogo
  Engine.update(engine);
  
  //Mostra o chão e as cordas
  ground.show();
  rope.show();
  rope2.show();
  rope3.show();

  //Coloca a imagem da cenoura
  if(fruit !== null){
    image(comida, fruit.position.x, fruit.position.y, 50, 80);
  }

  //Se a cenoura colidiu com o coelho, ele vai comer
  if(verColisao(fruit, spriteCoelho) === true){
    spriteCoelho.changeAnimation("comendo");
    //Toca o som do coelho comendo
    alimentando.play();
  }

  //Se a cenoura colidiu com o chão, ele vai ficar triste
  if(fruit !== null && fruit.position.y >= height-70){
    spriteCoelho.changeAnimation("triste");
    fruit = null;
    //Toca o som do coelho triste e para a musica
    musica.stop();
    chorando.play();
  }
  
  //Desenha todos os sprites
  drawSprites();
}

//Função para derrubar a comida
function derrubarComida(){
  //Toca o som da corda cortada
  corta.play();
  //Quebra a corda
  rope.break();
  //Corta a ligação entre a cenoura e a corda
  fruit_con.cortar();
  fruit_con = null;
}

//Função para derrubar a comida
function derrubarComida2(){
  //Toca o som da corda cortada
  corta.play();
  //Quebra a corda
  rope2.break();
  //Corta a ligação entre a cenoura e a corda
  fruit_con2.cortar();
  fruit_con2 = null;
}

//Função para derrubar a comida
function derrubarComida3(){
  //Toca o som da corda cortada
  corta.play();
  //Quebra a corda
  rope3.break();
  //Corta a ligação entre a cenoura e a corda
  fruit_con3.cortar();
  fruit_con3 = null;
}

//Função para ver a colisão da cenoura com o coelho
function verColisao(cenoura, coelho){
  //Se a cenoura existe
  if(cenoura !== null){
    //Calcula a distância entre a cenoura e o coelho
    var distancia = dist(cenoura.position.x, cenoura.position.y,
                         coelho.position.x, coelho.position.y);
    //Se a distância for menor ou igual a 80
    if(distancia <= 80){
      //Apaga a cenoura
      World.remove(engine.world, fruit);
      fruit = null;
      //Retorna um valor verdadeiro
      return true;
      //Senão
    } else {
      //Retorna um valor falso
      return false;
    }
  }
}

//Função para soprar a fruta
function soprando(){
  //aplica uma força na fruta para a direita
  Matter.Body.applyForce(fruit, {x: 0, y: 0}, {x: 0.01, y: 0});
  //Comando para tocar o som de ar
  ar.play();
}

//Função para mutar a música
function mutando(){
  //Se a música estiver tocando
  if(musica.isPlaying()){
    //Para a música
    musica.stop();
    //Senão
  } else {
    //Toca a música
    musica.play();
  }
}
