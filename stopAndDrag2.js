console.log("Hello World");

var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var tx = canvas.clientWidth;
var ty = canvas.clientHeight;
var offsetX = canvas.offsetLeft;
var offsetY = canvas.offsetTop;
var isMouseBeingDown = false;
var mousex = 0;
var mousey = 0;
var ballCapture = 0;
var insideBox = false;
var countBall = 0;
var result = [];
result.push("Waiting for result!");
var idArray = ["first", "second", "third", "fourth", "fifth", "sixth"];

function fillResult(location, value) {
  $("#" + idArray[location]).html(value);
}

addEventListener("mousedown", function(e) {
  isMouseBeingDown = true;
  mousex = parseInt(e.clientX - offsetX);
  mousey = parseInt(e.clientY - offsetY);
});

addEventListener("mousemove", function(e) {
  if (isMouseBeingDown) {
    mousex = parseInt(e.clientX - offsetX);
    mousey = parseInt(e.clientY - offsetY);
  }  
});

addEventListener("mouseup", function() {
  if (isMouseBeingDown) {
    isMouseBeingDown = false;
  }
});

var grav = 0.95; // to prevent other balls from reaching the box
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

//ctx.rect(tx/2, ty/2, 100, 100);

function Ball() {
  this.color = randomColor();
  this.radius = Math.random() * 15 + 10;
  this.startradius = this.radius;
  this.x = Math.random() * (tx - this.radius * 2) + this.radius;
  this.y = Math.random() * (ty - this.radius);
  this.dy = Math.random() * 2;
  this.dx = Math.round((Math.random() - 0.5) * 10);
  this.vel = Math.random() /5;
  this.mouseClicked = false;
  this.value = Math.floor(Math.random() * 49);
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

function checkInsideBox(boxX, boxY, ballX, ballY) {
  if (Math.abs(ballX - boxX) <= 50 && Math.abs(ballY - boxY) <= 35) {
    return true;
  }
  return false;
}

function checkMouseOverBall(mouseX, mouseY, ballX, ballY) {
  if (mouseX > ballX - 20 && mouseX < ballX + 20 &&
    mouseY > ballY - 50 && mouseY < ballY + 50) {
    return true;
  }
  return false;
}

function animate() {    
  if (tx != canvas.clientWidth || ty != canvas.clientHeight) {
    tx = canvas.clientWidth;
    ty = canvas.clientHeight;
  }
  requestAnimationFrame(animate);
  c.clearRect(0, 0, tx, ty);
  c.fillStyle = 'red';
  c.fillRect(0, 0, 100, 70);  
  c.fillStyle = "black";
  c.font = "30px Arial"
  c.fillText(result[countBall], 200, 50);
  //c.fillText("Hello world", 200, 50, 100);

  for (var i = 0; i < bal.length; i++) {
    bal[i].update(); // draw out the ball
    // if mouse over the ball
    // mouse click -> stop
    // mouse stops click -> move
    //console.log("initial ball capture " + ballCapture);
    if(checkMouseOverBall(mousex, mousey, bal[i].x, bal[i].y) && isMouseBeingDown){
          if (!bal[i].mouseClicked && ballCapture === 0) {
              bal[i].mouseClicked = true;
              bal[i].radius += 8;
              ballCapture += 1;
          }
          if (bal[i].mouseClicked && checkInsideBox(20,20,bal[i].x, bal[i].y) && countBall <=5) {
            //console.log("Ball value " + bal[i].value);
            let toFill = (bal[i].value > 0) ? bal[i].value : (bal[i].value + 1);
            fillResult(countBall,toFill);
            countBall += 1;
            result.push(bal[i].value);
            bal.splice(i, 1);
            bal.push(new Ball());
            ballCapture -= 1;
          }
        }
      else {
        if(bal[i].radius > bal[i].startradius && !isMouseBeingDown){
          bal[i].radius += - 8;
          bal[i].mouseClicked = false;
          ballCapture -= 1;
        }    
        if(bal[i].mouseClicked && isMouseBeingDown && ballCapture === 1) {
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
      }//forloop end
  }//animation end
}
animate();