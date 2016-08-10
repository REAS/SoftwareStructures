/* 
 
  106. Arcs from the midpoints of two sides of the wall. (ACG 8). 
  Black pencil. 
  First Drawn by: SL 
  Collection: Dr and Mrs Lorenzo 
  Bonomo, Spoleto, Italy. 
  August, 1971 
  
  Ported to p5.js by Casey Reas
  11 July 2016
  p5.js 0.5.2
  
  Restored by Casey Reas <http://reas.com> 
  22 June 2016 
  Processing v.3.1.1 <http://processing.org> 
   
  Implemented as software by Casey Reas 
  March, 2004 
  Processing v.68 <http://processing.org> 
  
*/

function setup() {
  createCanvas(800, 600);
  noFill();
  stroke(0);
}

function draw() {
  background(255);
  var maximum_radius = dist(0, height / 2, width, 0);
  var density = constrain(mouseX, 2, width);
  for (var i = density; i <= maximum_radius; i += density) {
    ellipse(0, height / 2, i, i);
    ellipse(width, height / 2, i, i);
  }
}