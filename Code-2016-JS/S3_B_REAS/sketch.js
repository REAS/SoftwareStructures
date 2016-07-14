/* 
   
   Structure 3 
   
   A surface filled with one hundred medium to small sized circles. 
   Each circle has a different size and direction, but moves at the same slow rate. 
   Display: 
   A. The instantaneous intersections of the circles 
   >>> B. The aggregate intersections of the circles 
   
   Ported to p5.js by Casey Reas
   11 July 2016
   p5.js 0.5.2
  
   Restored by Casey Reas <http://reas.com> 
   22 June 2016 
   Processing v.3.1.1 <http://processing.org> 
   
   Implemented by Casey Reas <http://groupc.net> 
   8 March 2004 
   Processing v.68 <http://processing.org> 
 
*/

var numCircle = 100;
var circles = [];

function setup() {
  createCanvas(800, 600);
  frameRate(30);
  for (var i = 0; i < numCircle; i++) {
    var x = random(width);
    var y = random(height);
    var r = random(20, 60);
    var xspeed = random(-0.25, 0.25);
    var yspeed = random(-0.25, 0.25);
    circles[i] = new Circle(x, y, r, xspeed, yspeed, i);
  }
  background(255);
}

function draw() {
  for (var i = 0; i < circles.length; i++) {
    circles[i].update();
  }
  for (var j = 0; j < circles.length; j++) {
    circles[j].move();
  }
}

function Circle(px, py, pr, psp, pysp, pid) {
  this.x = px;
  this.y = py;
  this.r = pr;
  this.r2 = this.r * this.r;
  this.sp = psp;
  this.ysp = pysp;
  this.id = pid;

  this.update = function() {
    for (var i = this.id + 1; i < numCircle; i++) {
      intersect(circles[this.id], circles[i]);
    }
  }

  this.makePoint = function() {
    stroke(0);
    point(this.x, this.y);
  }

  this.move = function() {
    this.x += this.sp;
    this.y += this.ysp;
    if (this.sp > 0) {
      if (this.x > width + this.r) {
        this.x = -this.r;
      }
    } else {
      if (this.x < -this.r) {
        this.x = width + this.r;
      }
    }
    if (this.ysp > 0) {
      if (this.y > height + this.r) {
        this.y = -this.r;
      }
    } else {
      if (this.y < -this.r) {
        this.y = height + this.r;
      }
    }
  }
}

function intersect(cA, cB) {

  var dx = cA.x - cB.x;
  var dy = cA.y - cB.y;
  var d2 = dx * dx + dy * dy;
  var d = sqrt(d2);

  if ((d > cA.r + cB.r) || (d < abs(cA.r - cB.r))) {
    return; // no solution 
  }

  var a = (cA.r2 - cB.r2 + d2) / (2 * d);
  var h = sqrt(cA.r2 - a * a);
  var x2 = cA.x + a * (cB.x - cA.x) / d;
  var y2 = cA.y + a * (cB.y - cA.y) / d;

  var paX = x2 + h * (cB.y - cA.y) / d;
  var paY = y2 - h * (cB.x - cA.x) / d;
  var pbX = x2 - h * (cB.y - cA.y) / d;
  var pbY = y2 + h * (cB.x - cA.x) / d;

  stroke(dist(paX, paY, pbX, pbY)*4, 12); 
  line(paX, paY, pbX, pbY);

}