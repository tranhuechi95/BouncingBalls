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
var ballCapturedByMouse = 0;
var insideBox = false;
var ballCountInBox = 0;
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

var grav = 0.99; // to prevent other balls from reaching the box
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
  this.radius = Math.random() * 15 + 10;
  this.startradius = this.radius;
  this.x = Math.random() * (tx - this.radius * 2) + this.radius;
  this.y = Math.random() * (ty - this.radius);
  this.dy = Math.random() * 2;
  this.dx = Math.round((Math.random() - 0.5) * 10);
  this.vel = Math.random() /5;
  this.mouseClicked = false;
  this.value = Math.floor(Math.random() * 49);
  this.changeIntervals = [];
  this.controlPointsL1 = [];
  this.controlPointsL2 = [];
  this.controlPointsR1 = [];
  this.controlPointsR2 = [];
  this.isRotating = false;
  this.rotateCount = 0;
  this.rotateRadius = 30;
  this.update = function() { // draw circle
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    c.fill();
  };
  this.rotate = function(index) { // rotate circle 
    c.beginPath(); 
    c.fillStyle = this.color;
    c.moveTo(75, 50 - this.rotateRadius); // box is 150 * 100
    c.bezierCurveTo(this.controlPointsL1[index].x,this.controlPointsL1[index].y,this.controlPointsL2[index].x, this.controlPointsL2[index].y, 75, 50 + this.rotateRadius);
    c.moveTo(75, 50 - this.rotateRadius);
    c.bezierCurveTo(this.controlPointsR1[index].x, this.controlPointsR1[index].y,this.controlPointsR1[index].x, this.controlPointsR2[index].y, 75, 50 + this.rotateRadius);
    c.fill();
  };
}

function ballRotationUpdate(ball) {
  var radius = ball.rotateRadius;
  var changeIntervals = ball.changeIntervals;
  var controlPointsL1 = ball.controlPointsL1;
  var controlPointsL2 = ball.controlPointsL2;
  var controlPointsR1 = ball.controlPointsR1;
  var controlPointsR2 = ball.controlPointsR2;
  var startX = 75;
  var startY = 50 - radius;
  var turnRate = 0.4
  var stop = startX + radius/turnRate/2;

  for (let i = stop; i>= startX; i-=turnRate) { // rotate 180 deg
    changeIntervals.push(i);
  }
  for (let i = startX; i< stop; i+=turnRate) { // rotate another 180 deg
    changeIntervals.push(i);
  }
  for (let i = 0; i< 30; i++) { // keep still to show the Ball's value
    changeIntervals.push(changeIntervals[changeIntervals.length - 1]);
  }
  for (let j = 0; j<changeIntervals.length; j++) {
    controlPointsL1.push({x: (startX - changeIntervals[j] + startX), y: startY});
    controlPointsL2.push({x: (startX - changeIntervals[j] + startX), y: (startY + radius*2)});
    controlPointsR1.push({x: (startX + changeIntervals[j] - startX), y: startY});
    controlPointsR2.push({x: (startX + changeIntervals[j] - startX), y: (startY + radius*2)});
  }
}

var bal = [];
for (var i=0; i<30; i++){
    bal.push(new Ball());
}

function checkInsideBox(boxX, boxY, ballX, ballY) {
  if (Math.abs(ballX - boxX) <= 75 && Math.abs(ballY - boxY) <= 50) {
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
  c.fillStyle = 'black';
  c.fillRect(0, 0, 150, 100); // draw box
  c.font = "30px Arial"
  var textFill = (result[ballCountInBox] != undefined) ? result[ballCountInBox] : "Waiting for result";
  c.fillText(textFill, 200, 50); // display Ball's value

  for (var i = 0; i < bal.length; i++) {
    if (bal[i].isRotating && bal[i].rotateCount < bal[i].changeIntervals.length) {
      bal[i].rotate(bal[i].rotateCount); // rotate the ball instead
      if (bal[i].rotateCount > bal[i].changeIntervals.length - 29) {
        bal[i].rotate(bal[i].rotateCount); // rotate the ball instead
        c.fillStyle = 'white';
        c.font = "20px Arial";
        c.fillText(bal[i].value, 65, 55);
      }
        bal[i].rotateCount++;
    }
    else { 
      // finish rotating -> show value and ball disappear -> update ball count
      if(bal[i].isRotating && bal[i].rotateCount >= bal[i].changeIntervals.length) {
        let toFill = (bal[i].value > 0) ? bal[i].value : (bal[i].value + 1);
        fillResult(ballCountInBox - 1,toFill);
        result.push(bal[i].value);
        bal.splice(i, 1);
        bal.push(new Ball());
        ballCapturedByMouse -= 1; 
      }
      // draw out the ball
      bal[i].update();
      if(checkMouseOverBall(mousex, mousey, bal[i].x, bal[i].y) && isMouseBeingDown){
          if (!bal[i].mouseClicked && ballCapturedByMouse === 0) {
              bal[i].mouseClicked = true;
              bal[i].radius += 8;
              ballCapturedByMouse += 1;
          }
          if (bal[i].mouseClicked && checkInsideBox(20,20,bal[i].x, bal[i].y) && ballCountInBox <=5) {
            bal[i].isRotating = true;
            ballRotationUpdate(bal[i]); // generate the rotation set for the ball
            ballCountInBox += 1;
          }
      }
      else {
          if(bal[i].radius > bal[i].startradius && !isMouseBeingDown){
              bal[i].radius += - 8;
              bal[i].mouseClicked = false;
              ballCapturedByMouse -= 1;
          }    
          if(bal[i].mouseClicked && isMouseBeingDown && ballCapturedByMouse === 1) {
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
    }//forloop end
  }//animation end
}
animate();
setInterval(function() {
  bal.push(new Ball());
  bal.pop();
}, 500);