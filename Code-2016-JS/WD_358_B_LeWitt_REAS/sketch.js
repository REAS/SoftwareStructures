/* 
 
  358. A 12" (30 cm) grid covering the wall. 
  Within each 12" (30 cm) square, one arc from 
  the corner. (The direction of the arcs and 
  their placement are determined by the draftsman.) 
  
  (Inches must be translated into pixels) 
  
  Ported to p5.js by Casey Reas
  11 July 2016
  p5.js 0.5.2
  
  Restored by Casey Reas <http://reas.com> 
  22 June 2016 
  Processing v.3.1.1 <http://processing.org> 
  
  Implemented as software by Casey Reas <http://groupc.net> 
  March, 2004 
  Processing v.68 <http://processing.org> 
 
*/

var res = 50; // Resolution of grid 
var arcres = 48; // Resolution of the arc 

function setup() {
  createCanvas(800, 600);
  noFill();
  stroke(255);
  frameRate(4);
}

function draw() {
  background(0);
  for (var i = 0; i < height; i += res) {
    for (var j = 0; j < width; j += res) {
      var r = Math.floor(random(4));
      if (r === 0) {
        arc_0(j, i, res);
      } else if (r === 1) {
        arc_1(j, i, res);
      } else if (r === 2) {
        arc_2(j, i, res);
      } else if (r === 3) {
        arc_3(j, i, res);
      }
    }
  }
}

function arc_0(xC, yC, r) {
  var x = 0,
    y = r,
    u = 1,
    v = 2 * r - 1,
    E = 0;
  while (x < y) {
    point(xC + y, yC - x + res); // ESE 
    x++;
    E += u;
    u += 2;
    if (v < 2 * E) {
      y--;
      E -= v;
      v -= 2;
    }
    if (x > y) break;
    point(xC + x, yC - y + res); // SSE 
  }
}

function arc_1(xC, yC, r) {
  var x = 0,
    y = r,
    u = 1,
    v = 2 * r - 1,
    E = 0;
  while (x < y) {
    point(xC + x, yC + y); // NNE 
    x++;
    E += u;
    u += 2;
    if (v < 2 * E) {
      y--;
      E -= v;
      v -= 2;
    }
    if (x > y) break;
    point(xC + y, yC + x); // ENE 
  }

}

function arc_2(xC, yC, r) {
  var x = 0,
    y = r,
    u = 1,
    v = 2 * r - 1,
    E = 0;
  while (x < y) {
    point(xC - y + res, yC + x); // WNW 
    x++;
    E += u;
    u += 2;
    if (v < 2 * E) {
      y--;
      E -= v;
      v -= 2;
    }
    if (x > y) break;
    point(xC - x + res, yC + y); // NNW 
  }
}

function arc_3(xC, yC, r) {
  var x = 0,
    y = r,
    u = 1,
    v = 2 * r - 1,
    E = 0;
  while (x < y) {
    point(xC - x + res, yC - y + res); // SSW 
    x++;
    E += u;
    u += 2;
    if (v < 2 * E) {
      y--;
      E -= v;
      v -= 2;
    }
    if (x > y) break;
    point(xC - y + res, yC - x + res); // WSW 
  }
}