/* 
   
   Structure 2 
   
   A grid of points in the top half of the surface. 
   Each point moves downward and returns to the top when it falls off the 
   bottom edge. Beginning in the upper-left, each row and column moves 
   faster than the previous one. The speeds combine so that the point in the 
   upper-left is the slowest and the point in the lower-right is the 
   fastest. Copy and flip the grid across a central vertical axis and 
   display simultaneously. 
   
   Ported to p5.js by Casey Reas
   14 July 2016
   p5.js 0.5.2
 
   Restored by Casey Reas <http://reas.com> 
   22 June 2016 
   Processing v.3.1.1 <http://processing.org> 
 
   Implemented by Casey Reas <http://groupc.net> 
   16 April 2004 
   Processing v.68 <http://processing.org> 
 
*/

var pix = [];

function setup() {
  createCanvas(800, 600);
  frameRate(30);

  for (var i = 0; i < width / 10; i++) {
    for (var j = 0; j < height / 20; j++) {
      pix[i * (height / 20) + j] = new Pixel(i * 10, j * 10, i / 100.0 * j / 100 * 8.0, true);
    }
  }
}

function draw() {
  background(0);
  for (var i = height / 10; i < pix.length; i++) {
    pix[i].update();
    pix[i].display();
  }
}

function Pixel(x, y, speed, curve) {

  this.x = x;
  this.y = y;
  this.speed = speed;
  this.curve = curve;

  this.update = function() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = 0;
    }
  }

  this.display = function() {
    stroke(255);
    point(this.x, this.y + 5);
    point(width - this.x, this.y + 5);
  }

}