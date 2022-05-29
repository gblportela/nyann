var canvas = document.querySelector('canvas')
var sec = document.querySelector('section')
var placar = document.getElementById('placar')
let buttonsMove = document.getElementsByClassName('button-move')
let endScreen
canvas.width = sec.clientWidth
canvas.height = sec.clientHeight

window.onresize = () => {
   canvas.width = document.body.clientWidth
   canvas.height = document.body.clientHeight
}

var c = canvas.getContext('2d')

var imgCat = new Image()
imgCat.src = 'imagens/cat.png'

function is_touch_device() {  
    try {  
      document.createEvent("TouchEvent");  
      return true;  
    } catch (e) {  
      return false;  
    }  
  }

if(!is_touch_device()){
   document.getElementById("controls").style.display = "none"
   document.getElementById("shot").style.display = "none"
}

let pontuacao = 0
var perdeu = 0;
var vidas = 10;
var v = false;
var tocou = false;
function getRandom(max, min) {
   return Math.floor(Math.random() * (max - min + 1) + min)

}
let colorArray = [
   'blue',
   'yellow',
   'green',
   'red',
   'white',
   'black',
   'grey'
]

window.addEventListener("keyup", function(e) {

   const keyUp = e.code
   const moveFalse = accptedMovesUp[keyUp]
   if(moveFalse){
      moveFalse()
   }
})
window.addEventListener("keydown", function(e) {

   const keyPressedDown = e.code;
   const moveTrue = accptedMovesDown[keyPressedDown];
   if(moveTrue){
      moveTrue()
   }
})

buttonsMove = Array.from(buttonsMove)
buttonsMove.forEach(addTouchStart)
buttonsMove.forEach(addTouchEnd)

addTouchStart(document.getElementById('shot'))

function addTouchStart(e){
   e.ontouchstart = () =>{
      const keyPressedDown = e.getAttribute('key')
      const moveTrue = accptedMovesDown[keyPressedDown]
      if(moveTrue){
         moveTrue()
      }
   }
}

function addTouchEnd(e){
   e.ontouchend = () =>{
      const keyPressedUp = e.getAttribute('key')
      const moveFalse = accptedMovesUp[keyPressedUp]
      if(moveFalse){
         moveFalse()
      }
   }
}

const accptedMovesUp = {
   KeyD(){
      papa.moveDireita = false;
   },
   KeyA(){
      papa.moveEsquerda = false;
   },
   KeyW(){
      papa.moveCima = false;
   },
   KeyS(){
      papa.moveBaixo = false;
   }
   
}
const accptedMovesDown = {
   KeyD(){
      papa.moveDireita = true;
   },
   KeyA(){
      papa.moveEsquerda = true;
   },
   KeyW(){
      papa.moveCima = true;
   },
   KeyS(){
      papa.moveBaixo = true;
   },
   Space(){
      if(bala.length < 2){
         makeBullet();   
      }
      
   }
}

function verify(ballx,bally,radius){
   var centerx = Math.abs(papa.x + papa.papaWidth / 2);
   var centery = Math.abs(papa.y + papa.papaHeight / 2);
   var centerbx = Math.abs(ballx + 40);
   var centerby = Math.abs(bally + 40);
   var vx = Math.abs(centerx - centerbx);
   var vy = Math.abs(centery - centerby);
   if(vx < radius + papa.papaWidth/2.5 && vy < radius + papa.papaHeight/2.5){
      for(let i = 0; i < 20; i++){
         destrocos.push(new Destroco(centerbx + getRandom(40,-40), centerby + getRandom(40,-40)));
      }
      vidas--;
      placar.innerHTML = 'Vidas: '+ vidas;
      perdeu++;
      v = true;
   }else{
      v = false;
   }
   return v;
}
function verifyBala(meteorX, meteorY, meteorWidth, meteorHeight){
      for(l = 0; l < bala.length; l++){
         var centerMeteorX = meteorX + meteorWidth / 2;
         var centerMeteorY = meteorY + meteorHeight / 2;
         var centerBalaX = bala[l].x + bala[l].width;
         var centerBalaY = bala[l].y + bala[l].height;
         var vx = Math.abs(centerBalaX - centerMeteorX);
         var vy = Math.abs(centerBalaY - centerMeteorY);
         if(vx < 40 && vy < 40){
            vb = true;
            bala.splice(l,1);
            pontuacao += getRandom(20, 10)
            for(let i = 0; i < 20; i++){
               destrocos.push(new Destroco(centerMeteorX + getRandom(40,-40), centerMeteorY + getRandom(40,-40)))
            }
            l--;
            return vb;
         }
      }
}
 

let bala = []
function makeBullet(){
   bala.push(new Bullet(papa.x + papa.papaWidth / 2, papa.y + papa.papaHeight / 2))
}
var imgBullet = new Image();
imgBullet.src = 'imagens/spell.png';

let rastrobala = [];
class RastroBala {
   constructor(x,y){
      this.x = x;
      this.y = y;
      this.dx = 4;
      this.color = colorArray[Math.floor(getRandom(5,0))];
   }
   draw(){
      c.beginPath();
      c.fillRect(this.x, this.y, 3, 3);
      c.fill();
   }
   update(){
      this.x -= this.dx;
      this.draw();
   }
}

class Bullet{
   constructor(x, y){
      this.x = x;
      this.y = y;
      this.dx = 20;
      this.width = 20;
      this.height = 20;
      
   }
   draw(){
      c.beginPath();
      c.drawImage(imgBullet, this.x, this.y, this.width,this.height);
      c.fill();
   }
   update(){
      /*if(rastrobala.length < 50){
         rastrobala.push(new RastroBala(this.x, this.y + getRandom(5,-5)))
      }*/
      this.x += this.dx;
      this.draw();
   }
}
class Papa{
   constructor(){
      this.x = 80;
      this.y = canvas.height /2;
      this.papaWidth = 80;
      this.papaHeight = 40;
      this.moveCima = false;
      this.moveBaixo = false;
      this.moveDireita = false;
      this.moveEsquerda = false;
      this.dy = 5;
      this.dx = 5;
   }
   
   draw(){
      c.drawImage(imgCat, this.x, this.y, this.papaWidth, this.papaHeight);
   }
   update(){
      if(this.moveCima && this.y > 0){
         this.y -= this.dy;
      }
      if(this.moveBaixo && this.y + this.papaHeight + this.dy < canvas.height){
         this.y += this.dy;
      }
      if(this.moveDireita && this.x + this.papaWidth + this.dx < canvas.width){
         this.x += this.dx;
      }
      if(this.moveEsquerda && this.x > 0){
         this.x -= this.dx;
      }
      this.draw();
   }

}
let destrocos = [];
class Destroco{
   constructor(x,y){
      this.x = x;
      this.y = y;
      this.dx = 4;
      this.color = colorArray[Math.floor(getRandom(7,5))];
   }
   draw(){
      c.beginPath();
      c.fillStyle = this.color;
      c.fillRect(this.x, this.y, 5, 5);
      c.fill();
   }
   update(){
      this.x += -this.dx;
      this.draw();
   }
}

class Rastro {
   constructor(x,y){
      this.x = x;
      this.yAntigo = y;
      this.y = y;
      this.dx = -6;
      this.dy = getRandom(6,-6);
      
      this.color = colorArray[Math.floor(getRandom(4,0))];
      
   }
   draw(){
      c.beginPath();
      c.fillStyle = this.color;
      c.fillRect(this.x, this.y, 4, 4);
      c.fill();
   }
   update(){
      
      if(this.y > this.yAntigo + getRandom(10,-4) || this.y < this.yAntigo - getRandom(10, -4)){
         this.dy = -this.dy;
      }else{
         this.dy += getRandom(5,-5);
      }
      
      this.x += this.dx;
      this.y += this.dy;

      
      this.draw();
   }
}

let rastro = [];

function makeRastro(){
   for(let i = 0; i < 1; i++){
      var x = papa.x;
      var y = papa.y + 33 + getRandom(4,-4);
      rastro.push(new Rastro(x,y));
   }
   
}
let nyan = []
let rastronyan = [];
class rastroNyan{
   constructor(x,y,color){
      this.x = x + 20;
      this.y = y + 15 + getRandom(5,-5);
      this.dx = -2;
      this.color = color;
   }
   draw(){
      c.fillStyle = this.color;
      c.fillRect(this.x,this.y,2,2);
   }
   update(){
      this.x += this.dx;
      this.draw();
   }
}
function makeNyan(){
   var y = getRandom(canvas.height - 30, 30);
   let naynArrayImg = ['imagens/_nyan/nyan.png'];
   var imgNyan = new Image();
   imgNyan.src = naynArrayImg[Math.floor(getRandom(0,0))]
   nyan.push(new Nyan(y, imgNyan));
}
class Nyan{
   constructor(y, imgNyan){
      this.x = canvas.width;
      this.dx = -3;
      this.y = y;
      this.imgNyan = imgNyan;
       
   }
   draw(){
      c.drawImage(this.imgNyan, this.x, this.y, 40, 30);
   }
   update(){
      this.x += this.dx;
      if(Math.floor(getRandom(4,0)) == 2){
         rastronyan.push(new rastroNyan(this.x, this.y, colorArray[Math.floor(getRandom(4,0))]));
      }
      this.draw();

   }
}
class Neve{
    constructor(x,y,dx,dy,radius){
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }
   draw(){
      c.beginPath();
      c.arc(this.x,this.y,this.radius,0,Math.PI * 2, false);
      c.fillStyle = 'white';
      
      c.fill();
      
   }
   update(){
      this.draw();
      this.x += this.dx;
      
    }
}

class Ball{
   constructor(x,y,dx,dy, imgMeteor){
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.radius = 40;
      this.meteorWidth = 80;
      this.meteorHeight = 80;
      this.imgMeteor = imgMeteor;
   }
   draw(){
      
      c.drawImage(this.imgMeteor, this.x, this.y, this.meteorWidth, this.meteorHeight);
   }
   update(){
      this.v = verify(this.x,this.y,this.radius,this.dx,this.dy);
      if(bala.length > 0){
         this.vb = verifyBala(this.x, this.y, this.meteorWidth, this.meteorHeight);
      }
      if (this.v === true && tocou === false){
         tocou = true;
         return true;
      }
      if(this.y + this.meteorHeight >= canvas.height || this.y <= 0){
         this.dy = -this.dy;
      }
      this.x += this.dx;
      this.y += this.dy;
      this.draw();
      return this.vb;
   }
}
let neve = [];
let ball = [];
let papa = new Papa();


function delBall(){
   ball.splice(0,2);
}
function makeBall(){
   if(ball.length < 7){
      for(let i = 0; i < 7; i++){
         var x = getRandom(canvas.width + 2000, canvas.width);
         var y = getRandom(canvas.height - 60, 60);
         var dx = getRandom(-10,-14);
         var dy = getRandom(1,-1);
         let meteorArray = ['imagens/1.png','imagens/2.png','imagens/3.png','imagens/4.png','imagens/5.png','imagens/6.png','imagens/7.png','imagens/8.png','imagens/9.png','imagens/10.png','imagens/11.png','imagens/12.png','imagens/13.png','imagens/14.png','imagens/15.png'];
         var imgMeteor = new Image();

         imgMeteor.src = meteorArray[getRandom(6, 0)]
         ball.push(new Ball(x, y, dx, dy, imgMeteor));
      }
   }
}
function init(){
   placar.innerHTML = 'Vidas: '+ vidas;
   if(neve.length < 50){
      for (let i  = 0; i <= 4; i++){
         var radius = getRandom(0.04, 0.02);
         var x = getRandom(canvas.width - radius, radius);
         var y = getRandom(canvas.height - radius, radius);
         var dx = getRandom(-2,-1);
         
         neve.push(new Neve(x,y,dx,0,radius));
      }
   }
}


function animate(){
   if(perdeu < 10){
      requestAnimationFrame(animate);
      c.clearRect(0,0,sec.clientWidth, sec.clientHeight);
      
      for(let i = 0; i < neve.length; i++){
         neve[i].update();
         if(neve[i].x < 0){
            neve.splice(i,1);
            init();
         }
      }
      
      if(rastronyan.length > 0){
         for(let i = 0; i < rastronyan.length; i++){
            rastronyan[i].update();
            
            if(rastronyan[i].x < -2){
               rastronyan.splice(i,1);
            }
         }
      }
      if(nyan.length > 0){
         for(let i = 0; i < nyan.length; i++){
            nyan[i].update();
            if(nyan[i].x < -30){
               nyan.splice(i,1);
            }
         }
      }
      for(let i = 0; i < rastro.length; i++){
         rastro[i].update();
         if(rastro[i].x < 0){
            rastro.splice(i,1);
         }
      }

      if(destrocos.length > 0){
         for(let i = 0; i < destrocos.length; i++){
            destrocos[i].update();
            if(destrocos[i].x < 0){
               destrocos.splice(i,1);
            }
         }
      }

      for(let i = 0; i < ball.length; i++){
         ball[i].update();
         if(ball[i].x < -60 || ball[i].v === true || ball[i].vb === true){
            
            //ball.splice(i,1);
            ball[i].x = getRandom(canvas.width + 1500, canvas.width)
            ball[i].y = getRandom(canvas.height, 60)
            //i--;
            //makeBall();
         }

      }
      if(bala.length > 0){
         for(let i = 0; i < bala.length; i++){
            bala[i].update();
            if(bala[i].x > canvas.width){
               bala.splice(i,1);
               if((Math.floor(getRandom(3, 0))) == 2){
                  makeNyan();
               }
            }
         }
      }
      for(let i = 0; i < rastrobala.length; i++){
         rastrobala[i].update();
         if(rastrobala[i].x < 0){
            rastrobala.splice(i,1);
         }
      };
      
      papa.update();
      makeRastro();
   }else{
      document.getElementById('pontuacao').innerHTML = pontuacao
      document.getElementById('end-screen').style.display = "flex"
      perdeu = 0;
      pontuacao = 0
      vidas = 10;
      v = false;
      tocou = false;
      ball = []
      papa.x = 70
      papa.y = canvas.height/2
   }
}

function restart(){
   document.getElementById('end-screen').style.display = "none"
   init()
   makeBall();
   makeRastro();
   animate();
}


init();
makeBall();
makeRastro();
animate();

