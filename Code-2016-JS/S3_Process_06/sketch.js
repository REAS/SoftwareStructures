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
  
   Implemented by Casey Reas 
   Processing v.68 <http://processing.org> 
 
*/

var numCircle = 100;
var circles = []; 

function setup() {
  createCanvas(640, 480);
  frameRate(30);
  for (var i = 0; i < numCircle; i++) { 
    circles[i] = new Circle(random(width), random(height), random(2,6)*10); 
  }
}

function draw() {
  background(255);
  stroke(0, 10); 
  for (var i = 0; i < circles.length; i++) { 
    circles[i].update(); 
  } 
}

function Circle(px, py, pr) {
  this.x = px;
  this.y = py;
  this.r = pr;

  this.update = function() {
    noFill();
    stroke(0);
    ellipse(this.x, this.y, this.r, this.r);
  }
}
