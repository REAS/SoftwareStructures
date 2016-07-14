/* 
   
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
   
   Implemented by J. Tarbell <http://levitated.net> 
   8 April 2004 
   Processing v.68 <http://processing.org> 
   
*/

// widthensions 
var num = 100;
var time = 0;

// display flag 
var showStructure = false;

// object array 
var discs = [];


function setup() {
  createCanvas(500, 500);
  background(0);
  frameRate(30);

  // arrange linearly 
  for (var i = 0; i < num; i++) {
    var x = random(width);
    var y = random(width);
    var fy = 0;
    var fx = random(-1.0, 1.0);
    var r = 20 + random(20);
    discs[i] = new Disc(i, x, y, fx, fy, r);
    discs[i].createPainters();
  }
}

function draw() {
  if (showStructure) {
    background(0);
    // render circles and intersections 
    for (var c = 0; c < num; c++) {
      discs[c].draw();
    }
  }
  // move discs 
  for (var c = 0; c < num; c++) {
    discs[c].move();
    discs[c].render();
  }
  time++;
}

function keyReleased() {
  if (key == ' ') {
    background(0);
    if (showStructure) {
      showStructure = false;
    } else {
      showStructure = true;
    }
  }
}

// translucent point 
function tpoint(x1, y1, gc, a) {
  noStroke();
  fill(gc, a * 255);
  rect(x1, y1, 1, 1);
}

// disc object 
function Disc(Id, X, Y, Vx, Vy, R) {

  this.id = Id;
  this.x = X;
  this.y = Y;
  this.vx = Vx;
  this.vy = Vy;
  this.dr = R;
  this.r = 1.0;

  // sand painters 
  this.numsands = 1;
  this.sands = [];
  //SandPainter[] sands = new SandPainter[numsands];

  this.createPainters = function() {
    for (var n = 0; n < this.numsands; n++) {
      this.sands[n] = new SandPainter();
    }
  }

  this.draw = function() {
    stroke(64);
    noFill();
    ellipse(this.x, this.y, this.r, this.r);
  }

  this.render = function() {
    // find intersecting points with all ascending discs 
    for (var n = this.id + 1; n < num; n++) {
      // find distance to other disc 
      var dx = discs[n].x - this.x;
      var dy = discs[n].y - this.y;
      var d = sqrt(dx * dx + dy * dy);
      // intersection test 
      if (d < (discs[n].r + this.r)) {
        // complete containment test 
        if (d > abs(discs[n].r - this.r)) {
          // find circle intersection solutions 
          var a = (this.r * this.r - discs[n].r * discs[n].r + d * d) / (2 * d);

          var p2x = this.x + a * (discs[n].x - this.x) / d;
          var p2y = this.y + a * (discs[n].y - this.y) / d;

          var h = sqrt(this.r * this.r - a * a);

          var p3ax = p2x + h * (discs[n].y - this.y) / d;
          var p3ay = p2y - h * (discs[n].x - this.x) / d;

          var p3bx = p2x - h * (discs[n].y - this.y) / d;
          var p3by = p2y + h * (discs[n].x - this.x) / d;
          // P3a and P3B may be identical - ignore this case (for now) 

          if (showStructure) {
            stroke(255);
            point(p3ax, p3ay);
            point(p3bx, p3by);
          } else {
            tpoint(int(p3ax - 1), int(p3ay), 255, 0.21);
            tpoint(int(p3ax + 1), int(p3ay), 0, 0.21);
            tpoint(int(p3bx - 1), int(p3by), 255, 0.21);
            tpoint(int(p3ax + 1), int(p3ay), 0, 0.21);
          }
          // draw sand painters 
          for (var s = 0; s < this.numsands; s++) {
            this.sands[s].render(p3ax, p3ay, p3bx, p3by);
          }
        }
      }
    }
  }

  this.move = function() {
    // move radius towards destination radius 
    if (this.r < this.dr) this.r += 0.02;
    // add velocity to position 
    this.x += this.vx;
    this.y += this.vy;
    // bound check 
    if (this.x + this.r < 0) {
      this.x += width + this.r + this.r;
      this.y = random(width);
    }
    if (this.x - this.r > width) {
      this.x -= width + this.r + this.r;
      this.y = random(width);
    }
    if (this.y + this.r < 0) {
      this.y += width + this.r + this.r;
      this.x = random(width);
    }
    if (this.y - this.r > width) {
      this.y -= width + this.r + this.r;
      this.x = random(width);
    }
  }

}

// sandpainter object 
function SandPainter() {

  this.p = random(1.0);
  this.c = int(random(256));
  this.g = random(0.01, 0.1);

  this.render = function(x, y, ox, oy) {
    // draw painting sweeps 
    tpoint(int(ox + (x - ox) * sin(this.p)), int(oy + (y - oy) * sin(this.p)), this.c, 0.11);

    this.g += random(-0.050, 0.050);
    var maxg = 0.5;
    if (this.g < -maxg) g = -maxg;
    if (this.g > maxg) g = maxg;
    this.p += random(-0.050, 0.050);
    if (this.p < 0) this.p = 0;
    if (this.p > 1.0) this.p = 1.0;

    var w = this.g / 10.0;
    for (var i = 0; i < 11; i++) {
      tpoint(int(ox + (x - ox) * sin(this.p + sin(i * w))), int(oy + (y - oy) * sin(this.p + sin(i * w))), this.c, 0.1 - i / 110);
      tpoint(int(ox + (x - ox) * sin(this.p - sin(i * w))), int(oy + (y - oy) * sin(this.p - sin(i * w))), this.c, 0.1 - i / 110);
    }
  }
}