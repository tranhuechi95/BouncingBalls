console.log("Hello World");console.log("Hello World");

var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var tx = window.innerWidth;
var ty = window.innerHeight;
canvas.width = tx;
canvas.height = ty;
//c.lineWidth= 5;
//c.globalAlpha = 0.5;

var mousex = 0;
var mousey = 0;

addEventListener("mousemove", function() {
  mousex = event.clientX;
  mousey = event.clientY;
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
  this.b4MouseDx;
  this.b4MouseDy;
  this.b4MouseVel;
  this.mouseClicked = false;
  this.update = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    c.fillStyle = this.color;
    c.fill();
    //c.stroke(); //ball with outline
  };
}

var bal = [];
// console.log("startDx " + startDx);
for (var i=0; i<30; i++){
    bal.push(new Ball());
}

function animate() {    
  if (tx != window.innerWidth || ty != window.innerHeight) {
    tx = window.innerWidth;
    ty = window.innerHeight;
    canvas.width = tx;
    canvas.height = ty;
  }
  /*
  1) Check whether a ball is clicked by mouse before
    a) No -> proceed to update x,y location, dy dx if collide into wall
    b) Yes -> need to get back its previous dy, dx and vel 
        -> update x, y location, dy dx if collide into wall
  */ 
  requestAnimationFrame(animate);
  c.clearRect(0, 0, tx, ty);
  for (var i = 0; i < bal.length; i++) {
    bal[i].update(); // draw out the ball

    // if mouse over the ball
    // mouse click -> stop
    // mouse stops click -> move
    if(mousex > bal[i].x - 20 && 
        mousex < bal[i].x + 20 &&
        mousey > bal[i].y -50 &&
        mousey < bal[i].y +50 &&
        bal[i].radius < 70){
        //bal[i].x += +1;
          if (!bal[i].mouseClicked) {
              bal[i].mouseClicked = true;
          }
          else { 
              if (bal[i].radius == bal[i].startradius) {
                bal[i].radius +=10; 
              }
              bal[i].x = mousex;
              bal[i].y = mousey;
          }
        }
      else {
          if(bal[i].radius > bal[i].startradius){
              bal[i].radius += -10;
          }
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
        
//forloop end
  }
//animation end
}

animate();