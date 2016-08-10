/* 
   
   Structure 1 
   
   Every possible pairing of these sixteen curves: 

   ix = 1.0 - x
   
   [x^2][1.0-x^2][ix^2][1.0-ix^2]
   [x^3][1.0-x^3][ix^3][1.0-ix^3]
   [x^4][1.0-x^4][ix^4][1.0-ix^4]
   [x^5][1.0-x^5][ix^5][1.0-ix^5]
   
   Use the additive numeric values from each curve to set the 
   value of a series of horizontal lines from values of white 
   to black. 
   
   Ported to p5.js by Casey Reas
   14 July 2016
   p5.js 0.5.2
 
   Restored by Casey Reas <http://reas.com> 
   22 June 2016 
   Processing v.3.1.1 <http://processing.org> 
   
   Implemented by Casey Reas
   10 April 2004 
   Processing v.68 <http://processing.org> 
 
*/

var x = 0.0;
var numnubs = 120;
var nubs = [];
var dir = 1;

function setup() {
  createCanvas(900, 360);
  noStroke();
  fill(102);
  colorMode(RGB, 2.0);
  background(2.0, 2.0, 2.0);
  frameRate(30.0);
  noSmooth();

  var pat1 = 1;
  var pat2 = 2;

  for (var i = 0; i < numnubs; i++) {
    nubs[i] = new Nub(0, i * 3, width, 3, pat1, pat2);
    pat2++;
    if (pat2 > 16) {
      pat1 = pat1 + 1;
      pat2 = pat1 + 1;
    }
  }
}

function draw() {
  x += (0.005 * dir);
  if (x >= 1.0 || x <= 0.0) {
    dir = dir * -1;
  }

  for (var i = 0; i < 120; i++) {
    nubs[i].update(x);
    nubs[i].display();
  }
}

function Nub(x, y, w, h, pat1, pat2) {

  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.pat1 = pat1;
  this.pat2 = pat2;
  this.val = 0;
  this.ix = 0.2;

  this.update = function(n) {

    this.val = 0;
    this.ix = 1.0 - n; // Inverse of X

    if (this.pat1 == 1 || this.pat2 == 1) {
      this.val += n * n;
    }
    if (this.pat1 == 2 || pat2 == 2) {
      this.val += 1.0 - n * n;
    }
    if (this.pat1 == 3 || this.pat2 == 3) {
      this.val += this.ix * this.ix;
    }
    if (this.pat1 == 4 || this.pat2 == 4) {
      this.val += 1.0 - this.ix * this.ix;
    }
    if (this.pat1 == 5 || this.pat2 == 5) {
      this.val += n * n * n;
    }
    if (this.pat1 == 6 || this.pat2 == 6) {
      this.val += 1.0 - n * n * n;
    }
    if (this.pat1 == 7 || this.pat2 == 7) {
      this.val += this.ix * this.ix * this.ix;
    }
    if (this.pat1 == 8 || this.pat2 == 8) {
      this.val += 1.0 - this.ix * this.ix * this.ix;
    }
    if (this.pat1 == 9 || this.pat2 == 9) {
      this.val += n * n * n * n;
    }
    if (this.pat1 == 10 || this.pat2 == 10) {
      this.val += 1.0 - n * n * n * n;
    }
    if (this.pat1 == 11 || this.pat2 == 11) {
      this.val += this.ix * this.ix * this.ix * this.ix;
    }
    if (this.pat1 == 12 || this.pat2 == 12) {
      this.val += 1.0 - this.ix * this.ix * this.ix * this.ix;
    }
    if (this.pat1 == 13 || this.pat2 == 13) {
      this.val += n * n * n * n * n;
    }
    if (this.pat1 == 14 || this.pat2 == 14) {
      this.val += 1.0 - n * n * n * n * n;
    }
    if (this.pat1 == 15 || this.pat2 == 15) {
      this.val += this.ix * this.ix * this.ix * this.ix * this.ix;
    }
    if (this.pat1 == 16 || this.pat2 == 16) {
      this.val += 1.0 - this.ix * this.ix * this.ix * this.ix * this.ix;
    }

  }

  this.display = function() {
    fill(this.val);
    rect(this.x, this.y, this.w, this.h);
  }

}