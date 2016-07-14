/* 
   
   A surface filled with one hundred medium to small sized circles. 
   Each circle has a different size and direction, but moves at the same slow rate. 
   Display: 
   >>> A. The instantaneous intersections of the circles 
   B. The aggregate intersections of the circles 
   
   Ported to p5.js by Casey Reas
   11 July 2016
   p5.js 0.5.2
 
   Restored by Casey Reas <http://reas.com> 
   22 June 2016 
   Processing v.3.1.1 <http://processing.org> 
   
   Implemented by William Ngan <http://metaphorical.net> 
   4 April 2004 
   Processing v.68 <http://processing.org> 
 
*/

var cc = [];
var numCircles = 100;

function setup() {
  createCanvas(600, 600);
  frameRate(30);
  for (var i = 0; i < numCircles; i++) {
    cc[i] = new Circle(random(width), random(height), 15 + random(20), i);
    cc[i].makeHairs();
  }
}

function draw() {
  background(255);

  noStroke();
  fill(0);

  for (var i = 0; i < cc.length; i++) {
    cc[i].draw();
  }

  noFill();
  stroke(255);

  for (var i = 0; i < cc.length; i++) {
    cc[i].drawHair();
  }
}

function Circle(px, py, pr, id) {

  this.x = px;
  this.y = py;
  this.r = pr;
  this.r2 = this.r * this.r;
  this.d = this.r * 2;
  this.d2 = this.d * this.d;

  this.id = id;

  this.gray = 0;

  this.hairs = [];
  this.numHairs = 30;

  this.stepA = 2 * PI / this.numHairs;

  this.sp1 = random(2);
  this.sp2 = random(2);
  this.sp3 = random(2);

  this.ac1 = random(0.5) - random(0.5);
  this.ac2 = random(0.5) - random(0.5);
  this.ac3 = random(0.5) - random(0.5);

  this.inx = 0;
  this.iny = 0;

  this.hasIntersect = false;

  this.makeHairs = function() {
    for (var i = 0; i < this.numHairs; i++) {
      this.hairs[i] = new Hair(cos(this.stepA * i) * this.r,
        sin(this.stepA * i) * this.r, 5, this.stepA * i + PI, cc[this.id]);
    }
  }

  this.draw = function() {
    fill(0);
    noStroke();
    ellipse(this.x, this.y, this.d, this.d);
    this.move();
  }

  this.drawHair = function() {
    for (var i = 0; i < this.hairs.length; i++) {
      this.hairs[i].updatePos();
      this.hairs[i].draw();
    }
  }
  
  this.move = function() {
    var angle = sin(this.sp1) - cos(this.sp2);

    this.sp1 += this.ac1;
    this.sp2 += this.ac2;
    this.sp3 += this.ac3;

    angle = (angle < 0) ? angle + TWO_PI : ((angle >= TWO_PI) ? angle - TWO_PI : angle);

    this.x += sin(angle);
    this.y -= cos(angle);

    this.checkBounds();
    this.checkIntersect();
  }

  this.checkIntersect = function() {

    var flag = false;
    var flag2 = false;
    for (var i = 0; i < cc.length; i++) {
      if (i != this.id) {
        flag = this.intersect(cc[i]);
        if (!flag2) {
          flag2 = flag;
        }
      }
    }

    if (flag2) {
      this.hairFocus(this.inx, this.iny);
    } else if (this.hasIntersect) {
      this.hairFocusRevert();
    }

    this.hasIntersect = flag2;

  }

  this.intersect = function(cB) {

    var dx = this.x - cB.x;
    var dy = this.y - cB.y;
    var d2 = dx * dx + dy * dy;
    var d = sqrt(d2);

    if (d > this.r + cB.r || d < abs(this.r - cB.r)) return false;

    var a = (this.r2 - cB.r2 + d2) / (2 * d);
    var h = sqrt(this.r2 - a * a);
    var x2 = this.x + a * (cB.x - this.x) / d;
    var y2 = this.y + a * (cB.y - this.y) / d;

    var paX = x2 + h * (cB.y - this.y) / d;
    var paY = y2 - h * (cB.x - this.x) / d;

    this.repel(atan2(dy, dx));

    fill(0);
    ellipse(paX, paY, 15, 15);

    this.inx = x2;
    this.iny = y2;

    return true;
  }

  this.repel = function(angle) {
    this.x = this.x + cos(angle) / 4;
    this.y = this.y + sin(angle) / 4;
  }

  this.hairFocus = function(px, py) {
    for (var i = 0; i < this.hairs.length; i++) {
      this.hairs[i].focus(px, py);
    }
  }

  this.hairFocusRevert = function() {
    for (var i = 0; i < this.hairs.length; i++) {
      this.hairs[i].revertFocus();
    }
  }

  this.checkBounds = function() {
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;
  }

}

function Hair(rx, ry, r, a, parentCircle) {

  this.regX = rx;
  this.regY = ry;

  this.radius = r;
  this.origRadius = r;

  this.angle = a;
  this.origAngle = a;

  this.pc = parentCircle;  // Parent circle

  this.nextX = this.pc.x + this.regX + cos(this.angle) * this.radius;
  this.nextY = this.pc.y + this.regY + sin(this.angle) * this.radius;

  this.x = this.nextX;
  this.y = this.nextY;

  this.speedFactor = 5;

  this.updatePos = function() {

    this.nextX = this.pc.x + this.regX + cos(this.angle) * this.radius;
    this.nextY = this.pc.y + this.regY + sin(this.angle) * this.radius;

    var dx = this.nextX - this.x;
    var dy = this.nextY - this.y;
    
    if (abs(dx) > 1) {
      this.x += dx / this.speedFactor;
      this.y += dy / this.speedFactor;
    }

    if (abs(dx) > 200 || abs(dy) > 200) {
      this.x = this.nextX;
      this.y = this.nextY;
    }

  }

  this.draw = function() {
    stroke(255);
    line(this.pc.x+this.regX, this.pc.y+this.regY, this.x, this.y);
  }

  this.focus = function(px, py) {
    var dx = px - (this.pc.x + this.regX);
    var dy = py - (this.pc.y + this.regY);
    this.angle = atan2(dy, dx);
    this.radius = dist(px, py, this.pc.x+this.regX, this.pc.y+this.regY);
  }

  this.revertFocus = function() {
    this.angle = this.origAngle;
    this.radius = this.origRadius;
  }
}
