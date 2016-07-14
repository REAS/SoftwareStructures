/* 
   
   A surface filled with one hundred medium to small sized circles. 
   Each circle has a different size and direction, but moves at the same slow rate. 
   Display: 
   >>> A. The instantaneous intersections of the circles 
   B. The aggregate intersections of the circles 
   
   Ported to p5.js by Casey Reas
   13 July 2016
   p5.js 0.5.2
   
   Note about the JavaScript port to p5.js:
   This software is now significantly different because
   the "glow" effects created by Tarbell worked well as
   in a Java Applet in 2004, but this same process made
   the code too slow in JavaScript in 2016. Early Processing 
   from 2004 was quick with pixel operations. 
 
   Restored by Casey Reas <http://reas.com> 
   22 June 2016 
   Processing v.3.1.1 <http://processing.org> 
   
   Implemented by J. Tarbell <http://levitated.net> 
   8 April 2004 
   Processing v.68 <http://processing.org> 
 
*/

var num = 100;
var time = 0;

// object array 
var discs = [];

// initialization 
function setup() {
  createCanvas(500, 500);
  frameRate(30);

  // make discs, arrange in anti-collapsing circle 
  for (var i = 0; i < num; i++) {
    var fx = 0.4 * width * cos(TWO_PI * i / num);
    var fy = 0.4 * width * sin(TWO_PI * i / num);
    var x = random(width / 2) + fx;
    var y = random(width / 2) + fy;
    var r = 5 + random(45);
    var bt = 1;
    if (random(100) < 50) {
      bt = -1;
    }
    discs[i] = new Disc(i, x, y, bt * fx / 1000.0, bt * fy / 1000.0, r);
    discs[i].createPixelRiders();
  }
}

// main 
function draw() {
  background(0);
  loadPixels();  // Added CR -- 13 July 2016
  // move discs 
  for (var c = 0; c < num; c++) {
    discs[c].move();
    discs[c].render();
    discs[c].renderPxRiders();
  }
  time++;
}

// disc object 
function Disc(Id, X, Y, Vx, Vy, R) {

  this.id = Id;
  this.x = X;
  this.y = Y;
  this.vx = Vx;
  this.vy = Vy;
  this.dr = R;
  this.r = 0;

  this.numr = 0;
  this.maxr = 40;
  this.pxRiders = [];

  this.createPixelRiders = function() {
    this.numr = int(R / 1.62);
    if (this.numr > this.maxr) {
      this.numr = this.maxr;
    }

    // create pixel riders 
    for (var n = 0; n < this.maxr; n++) {
      this.pxRiders[n] = new PxRider();
    }
  }

  this.draw = function() {
    stroke(0, 50);
    noFill();
    ellipse(this.x, this.y, this.r, this.r);
  }

  this.render = function() {
    // find intersecting points with all ascending discs 
    for (var n = this.id + 1; n < num; n++) {
      if (n != this.id) {
        // find distance to other disc 
        var dx = discs[n].x - this.x;
        var dy = discs[n].y - this.y;
        var d = sqrt(dx * dx + dy * dy);
        // intersection test 
        if (d < (discs[n].r + this.r)) {
          // complete containment test 
          if (d > abs(discs[n].r - this.r)) {
            // find solutions 
            var a = (this.r * this.r - discs[n].r * discs[n].r + d * d) / (2 * d);

            var p2x = this.x + a * (discs[n].x - this.x) / d;
            var p2y = this.y + a * (discs[n].y - this.y) / d;

            var h = sqrt(this.r * this.r - a * a);

            var p3ax = p2x + h * (discs[n].y - this.y) / d;
            var p3ay = p2y - h * (discs[n].x - this.x) / d;

            var p3bx = p2x - h * (discs[n].y - this.y) / d;
            var p3by = p2y + h * (discs[n].x - this.x) / d;

            // P3a and P3B may be identical - ignore this case (for now) 
            stroke(255, 204); // Modified CR -- 13 July 2016
            strokeWeight(4); // Modified CR -- 13 July 2016
            point(p3ax, p3ay);
            point(p3bx, p3by);
          }
        }
      }
    }
  }

  this.move = function() {
    // add velocity to position 
    this.x += this.vx;
    this.y += this.vy;
    // bound check 
    if (this.x + this.r < 0) this.x += width + this.r + this.r;
    if (this.x - this.r > width) this.x -= width + this.r + this.r;
    if (this.y + this.r < 0) this.y += width + this.r + this.r;
    if (this.y - this.r > width) this.y -= width + this.r + this.r;

    // increase to destination radius 
    if (this.r < this.dr) {
      this.r += 0.1;
    }
  }

  this.renderPxRiders = function() {
    for (var n = 0; n < this.numr; n++) {
      this.pxRiders[n].move(this.x, this.y, this.r);
    }
  }
}

// pixel rider object  
function PxRider() {

  this.t = random(TWO_PI);
  this.vt = 0.0;
  this.mycharge = 0.0;

  this.move = function(x, y, r) {
    strokeWeight(1);

    // add velocity to theta 
    this.t = (this.t + this.vt + PI) % TWO_PI - PI;
    this.vt += random(-0.001, 0.001);

    // apply friction brakes 
    if (abs(this.vt) > 0.02) this.vt *= 0.9;

    // draw      
    var px = int(x + r * cos(this.t));
    var py = int(y + r * sin(this.t));
    //var c = get(int(px), int(py));  // Removed CR -- 13 July 2016
    var c = pixels[py * height + px];  // Added CR -- 13 July 2016
    //if (brightness(c) > 48) {  // Removed CR -- 13 July 2016
    if (int(c) > 48) {  // Modified CR -- 13 July 2016
      //glowpoint(px, py);  // Removed CR -- 13 July 2016
      this.mycharge = 164;
    } else {
      stroke(this.mycharge);
      point(px, py);
      this.mycharge *= 0.98;
    }

  }
}

// methods 
function glowpoint(px, py) { // Too slow in browser 13 July 2016
  for (var i = -2; i < 3; i++) {
    for (var j = -2; j < 3; j++) {
      var a = 0.8 - i * i * 0.1 - j * j * 0.1;
      tpoint(int(px + i), int(py + j), '#FFFFFF', a);
    }
  }
}

function tpoint(x1, y1, mycolor, a) {
  // place translucent point 
  var r, g, b;
  var c;
  var myc = color(mycolor);
  c = get(x1, y1);
  r = int(red(c) + (red(myc) - red(c)) * a);
  g = int(green(c) + (green(myc) - green(c)) * a);
  b = int(blue(c) + (blue(myc) - blue(c)) * a);
  var nc = color(r, g, b);
  stroke(nc);
  stroke(255, 204, 0);
  point(x1, y1);
}