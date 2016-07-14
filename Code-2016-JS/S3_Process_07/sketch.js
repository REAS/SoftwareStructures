/* 
 
   Structure 3 (work in progress) 
   
   A surface filled with one hundred medium to small sized circles. 
   Each circle has a different size and direction, but moves at the same slow rate. 
   Display: 
   A. The instantaneous intersections of the circles 
   B. The aggregate intersections of the circles 
 
   Ported to p5.js by Casey Reas
   11 July 2016
   p5.js 0.5.2
  
   Restored by Casey Reas <http://reas.com> 
   22 June 2016 
   Processing v.3.1.1 <http://processing.org> 
  
   Implemented by Casey Reas <http://groupc.net> 
   Processing v.68 <http://processing.org> 
 
*/

var numCircle = 100;
var circles = [];

function setup() {
  createCanvas(640, 480);
  frameRate(30);
  for (var i = 0; i < numCircle; i++) {
    var x = random(width);
    var y = random(height);
    var r = random(20, 60);
    var xspeed = random(-2, 2);
    var yspeed = random(-2, 2);
    circles[i] = new Circle(x, y, r, xspeed, yspeed);
  }
}

function draw() {
  background(255);
  stroke(0, 10);
  for (var i = 0; i < circles.length; i++) {
    circles[i].move();
  }
}

function Circle(px, py, pr, psp, pysp) {
  this.x = px;
  this.y = py;
  this.r = pr;
  this.sp = psp;
  this.ysp = pysp;

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

    stroke(0);
    noFill();
    ellipse(this.x, this.y, this.r, this.r);
  }
}