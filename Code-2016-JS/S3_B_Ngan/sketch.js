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
   
   Implemented by William Ngan <http://metaphorical.net> 
   4 April 2004 
   Processing v.68 <http://processing.org> 
 
*/

var field = [];
var fieldShade = [];
var gaph, gapv;
var marginh, marginv; // margin 
var cnt = 0;

var circles = new Array(100);

var counter = 0;
var cCounter = 0;
var cTimer = 0;

function setup() {
  createCanvas(500, 500);
  frameRate(30);

  gaph = 3;
  gapv = 3;
  marginh = 20;
  marginv = 20;

  // field 
  field = new Array(int((width - marginh * 2) / gaph));
  for (var i = 0; i < field.length; i++) {
    field[i] = new Array(int((height - marginv * 2) / gapv));
  }
  fieldShade = new Array(field.length);
  for (var i = 0; i < fieldShade.length; i++) {
    fieldShade[i] = new Array(field[0].length);
  }

  for (var i = 0; i < field.length; i++) {
    for (var k = 0; k < field[0].length; k++) {
      field[i][k] = TWO_PI - PI / 3;
      fieldShade[i][k] = 1;
    }
  }
}

function draw() {
  background(50);

  var ax, ay;
  cTimer++;

  if (cTimer > 5 && cCounter < circles.length - 1) {
    circles[cCounter] = new Circle(250, 250, 40, cCounter);
    cCounter++;
    cTimer = 0;
  }

  var len = 10;

  stroke(255, 255, 255, 50);
  // Draw every other one for better frame rate
  for (var i = 0; i < field.length; i += 2) {  
    for (var k = 0; k < field[0].length; k += 2) {
      ax = marginh + i * gaph;
      ay = marginv + k * gapv;
      line(ax, ay, ax + len * cos(field[i][k]), ay + len * sin(field[i][k]));
    }
  }

  noStroke();
  noFill();
  for (var i = 0; i < cCounter; i++) {
    circles[i].draw();
    circles[i].getGrid();
  }

}

function getLocation(i, k) {
  return [marginh + i * gaph, marginv + k * gapv];
}

function Circle(px, py, pr, id) {

  this.x = px;
  this.y = py;
  this.r = pr;
  this.rr = this.r * this.r;
  this.d = this.r * 2;
  this.d2 = this.d * this.d;

  this.id = id;

  this.sp1 = random(2);
  this.sp2 = random(2);
  this.sp3 = random(2);

  this.ac1 = random(0.5) - random(0.5);
  this.ac2 = random(0.5) - random(0.5);
  this.ac3 = random(0.5) - random(0.5);

  this.inx = 0;
  this.iny = 0;

  this.over = true;

  this.draw = function() {
    this.move();
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
    this.checkOverlap();
  }

  this.checkBounds = function() {
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;
  }

  this.repel = function(angle) {
    this.x = this.x + cos(angle) / 10.0;
    this.y = this.y + sin(angle) / 10.0;
  }

  this.setState = function(px, py) {
    this.inx = px;
    this.iny = py;
    this.over = true;
  }

  this.checkOverlap = function() {

    for (var i = this.id + 1; i < cCounter; i++) {

      var dx = circles[i].x - this.x;
      var dy = circles[i].y - this.y;
      var drr = dx * dx + dy * dy;
      var ds = sqrt(drr);

      if (ds > this.r + circles[i].r || ds < abs(this.r - circles[i].r)) {
        continue; // no solution 
      }

      var ang = atan2(dy, dx);
      this.repel(ang + PI);
      circles[i].repel(ang);

      var a = (this.rr - circles[i].rr + drr) / (2 * ds);
      var x2 = this.x + (a * (circles[i].x - this.x) / ds);
      var y2 = this.y + (a * (circles[i].y - this.y) / ds);

      this.setState(x2, y2);
      circles[i].setState(x2, y2);
    }
  }

  this.getGrid = function() {

    var sx = Math.ceil((this.x - this.r - marginh) / gaph);
    var sy = Math.ceil((this.y - this.r - marginv) / gapv);

    var numx = Math.floor(this.d / gaph);
    var numy = Math.floor(this.d / gapv);

    var pos = [];

    for (var i = sx; i < sx + numx; i++) {
      if (i >= 0 && i < field.length) {
        for (var k = sy; k < sy + numy; k++) {
          if (k >= 0 && k < field[0].length) {
            if (this.over) {
              pos = getLocation(i, k);
              var dx = pos[0] - this.x;
              var dy = pos[1] - this.y;
              if (dist(this.x, this.y, pos[0], pos[1]) < this.r) {
                var da = atan2(pos[1] - this.iny, pos[0] - this.inx);
                if (field[i][k] < da) {
                  field[i][k] += PI / 20;
                } else if (field[i][k] > da) {
                  field[i][k] -= PI / 20;
                }
                fieldShade[i][k] = 2;
              }
            }
          }
        }
      }
    }
    this.over = false;
  }

}