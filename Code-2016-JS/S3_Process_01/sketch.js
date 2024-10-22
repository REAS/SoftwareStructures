/*

  Circle Intersection 
  by William Ngan <contact@metaphorical.net>, 
  modified by Casey Reas
  
  Ported to p5.js by Casey Reas
  11 July 2016
  p5.js 0.5.2
  
  Restored by Casey Reas <http://reas.com> 
  22 June 2016 
  Processing v.3.1.1 <http://processing.org> 
   
*/

var circleA, circleB;

function setup() {
  createCanvas(300, 300); 
  frameRate(30); 
  circleA = new Circle(150, 150, 50); 
  circleB = new Circle(150, 150, 60); 
  noStroke(); 
}

function draw() {
  background(226); 
 
  fill(153, 150); 
  ellipse(circleA.x, circleA.y, circleA.r*2, circleA.r*2); 
  ellipse(circleB.x, circleB.y, circleB.r*2, circleB.r*2); 
 
  circleB.x = mouseX; 
  circleB.y = mouseY; 
 
  intersect(circleA, circleB); 
}

function Circle (px, py, pr) { 
  this.x = px;
  this.y = py;
  this.r = pr;
  this.r2 = this.r * this.r;
}
 
function intersect(cA, cB) { 
 
  var dx = cA.x - cB.x; 
  var dy = cA.y - cB.y; 
  var d2 = dx*dx + dy*dy; 
  var d = sqrt( d2 ); 
 
  if ( (d > cA.r+cB.r) || (d < abs(cA.r-cB.r)) ) {
    return; // no solution 
  }
  
  var a = (cA.r2 - cB.r2 + d2) / (2*d); 
  var h = sqrt( cA.r2 - a*a ); 
  var x2 = cA.x + a*(cB.x - cA.x)/d; 
  var y2 = cA.y + a*(cB.y - cA.y)/d; 
 
  noStroke(); 
  fill(0); 
  rect( x2, y2, 5, 5 ); 
 
  var paX = x2 + h*(cB.y - cA.y)/d; 
  var paY = y2 - h*(cB.x - cA.x)/d; 
  var pbX = x2 - h*(cB.y - cA.y)/d; 
  var pbY = y2 + h*(cB.x - cA.x)/d; 
 
  ellipse( paX, paY, 10, 10 ); 
  ellipse( pbX, pbY, 10, 10 ); 
 
} 