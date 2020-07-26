var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var tx = canvas.clientWidth;
var ty = canvas.clientHeight;
var radius = 70;
// draw a series of shifts
var changeIntervals = [];
var controlPointsL1 = [];
var controlPointsL2 = [];
var controlPointsR1 = [];
var controlPointsR2 = [];
var startX = 300; // start point is startX, startY
var startY = 50;
var endY = startY + radius*2; // end point is startX, endY
var turnRate = 0.4
var stop = startX + radius/turnRate/2;

for (let i = stop; i>= startX; i-=turnRate) {
  changeIntervals.push(i);
}
for (let i = startX; i< stop; i+=turnRate) {
  changeIntervals.push(i);
}

for (let i = 0; i<changeIntervals.length; i++) {
  controlPointsL1.push({x: (startX - changeIntervals[i] + startX), y: startY});
  controlPointsL2.push({x: (startX - changeIntervals[i] + startX), y: (startY + radius*2)});
  controlPointsR1.push({x: (startX + changeIntervals[i] - startX), y: startY});
  controlPointsR2.push({x: (startX + changeIntervals[i] - startX), y: (startY + radius*2)});
}

var count = 0;

function animate() {    
  requestAnimationFrame(animate);
  c.clearRect(0, 0, tx, ty);
  draw(startX,startY,startX,endY,controlPointsL1[count], controlPointsL2[count], controlPointsR1[count], controlPointsR2[count]);
  // 
  count++;
}

function draw(sX, sY, eX, eY, ctrL1, ctrL2, ctrR1, ctrR2) {
  c.beginPath();
  c.moveTo(sX, sY);
  c.bezierCurveTo(ctrL1.x, ctrL1.y, ctrL2.x, ctrL2.y, eX, eY);
  c.moveTo(sX, sY);
  c.bezierCurveTo(ctrR1.x, ctrR1.y, ctrR2.x, ctrR2.y, eX, eY);
  c.fillStyle = 'red';
  c.fill();
}

animate();