console.log("Hello World");console.log("Hello World");

var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var tx = window.innerWidth;
var ty = window.innerHeight;
canvas.width = tx;
canvas.height = ty;
//c.lineWidth= 5;
//c.globalAlpha = 0.5;

var isMouseBeingDown = false;
var mousex = 0;
var mousey = 0;

addEventListener("mousedown", function(event) {
  isMouseBeingDown = true;
  mousex = event.clientX;
  mousey = event.clientY;
});

addEventListener("mousemove", function(event) {
  if (isMouseBeingDown) {
    mousex = event.clientX;
    mousey = event.clientY;
  }  
});

addEventListener("mouseup", function() {
  if (isMouseBeingDown) {
    isMouseBeingDown = false;
  }
});

var grav = 0.99;
c.strokeWidth=5;
function randomColor() {
  return (
    "rgb(" +
    Math.round(Math.random() * 250) +
    "," +
    Math.round(Math.random() * 250) +
    "," +
    Math.round(Math.random() * 250) +
    ")"
  );
}

function Ball() {
  this.color = randomColor();
  this.radius = Math.random() * 20 + 14;
  this.startradius = this.radius;
  this.x = Math.random() * (tx - this.radius * 2) + this.radius;
  this.y = Math.random() * (ty - this.radius);
  this.dy = Math.random() * 2;
  this.dx = Math.round((Math.random() - 0.5) * 10);
  this.vel = Math.random() /5;
  this.mouseClicked = false;
  this.update = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    c.fillStyle = this.color;
    c.fill();
  };
}

var bal = [];
// console.log("startDx " + startDx);
for (var i=0; i<10; i++){
    bal.push(new Ball());
}

function animate() {    
  if (tx != window.innerWidth || ty != window.innerHeight) {
    tx = window.innerWidth;
    ty = window.innerHeight;
    canvas.width = tx;
    canvas.height = ty;
  }
  requestAnimationFrame(animate);
  c.clearRect(0, 0, tx, ty);
  for (var i = 0; i < bal.length; i++) {
    bal[i].update(); // draw out the ball
    // if mouse over the ball
    // mouse click -> stop
    // mouse stops click -> move
    if(mousex > bal[i].x - 20 && mousex < bal[i].x + 20 &&
        mousey > bal[i].y -50 && mousey < bal[i].y +50 &&
        bal[i].radius < 70 && isMouseBeingDown){
        //bal[i].x += +1;
          if (!bal[i].mouseClicked ) {
              bal[i].mouseClicked = true;
              bal[i].radius +=5;
          }
        }
      else {
        if(bal[i].radius > bal[i].startradius && !isMouseBeingDown){
          bal[i].radius += -5;
          bal[i].mouseClicked = false;
        }    
        if(bal[i].mouseClicked && isMouseBeingDown) {
            bal[i].x = mousex;
            bal[i].y = mousey;
        } else {
          bal[i].y += bal[i].dy;
          bal[i].x += bal[i].dx;
          // if touches window walls
          if (bal[i].y + bal[i].radius >= ty) {
              bal[i].dy = -bal[i].dy * grav;
          } else {
              bal[i].dy += bal[i].vel;
          }    
          if(bal[i].x + bal[i].radius > tx || bal[i].x - bal[i].radius < 0){
              bal[i].dx = -bal[i].dx;
          }
        }     
      }       
//forloop end
  }
//animation end
}
animate();