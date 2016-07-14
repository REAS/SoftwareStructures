/* 
   
   A surface filled with one hundred medium to small sized circles. 
   Each circle has a different size and direction, but moves at the same slow rate. 
   Display: 
   >>> A. The instantaneous intersections of the circles 
   B. The aggregate intersections of the circles 
   
   Ported to p5.js by Casey Reas
   11 July 2016
   p5.js 0.5.2
   
   Restored by Casey Reas <http://reas.com> 
   22 June 2016 
   Processing v.3.1.1 <http://processing.org> 
   
   Implemented by Robert Hodgin <http://flight404.com> 
   6 April 2004 
   Processing v.68 <http://processing.org> 
 
*/


// ******************************************************************************** 
// INITIALIZE VARIABLES 
// ******************************************************************************** 

var xStage = 600; // x dimension of applet 
var yStage = 600; // y dimension of applet 

var xMid = xStage / 2; // x midpoint of applet 
var yMid = yStage / 2; // y midpoint of applet 

var totalCircles = 100; // total number of circles 
var circle = []; // Circle object array 

var gravity; // Strength of gravitational pull 
var xGrav; // x point of center of gravity 
var yGrav; // y point of center of gravity 
var xGravOffset;

var angleOffset;
var initRadius;
var maxDistance;

var bgColor;

// ******************************************************************************** 
// SETUP FUNCTION 
// ******************************************************************************** 

function setup() {
  createCanvas(600, 600);
  bgColor = 255;
  background(bgColor);
  frameRate(30);
  createCircles();
}

// ******************************************************************************** 
// MAIN LOOP FUNCTION 
// ******************************************************************************** 

function draw() {
  if (mouseIsPressed) {
    createCircles();
  }
  background(bgColor);
  tellCirclesToBehave();
}

function createCircles() {
  gravity = .075;
  maxDistance = 150;
  angleOffset = random(360);
  //circle                         = new Circle[totalCircles]; 
  initRadius = 150;
  for (var i = 0; i < totalCircles; i++) {
    var initAngle = i * 3.6 + angleOffset + random(10);
    var initTheta = (-((initAngle) * PI)) / 180;
    var initxv = cos(initTheta) * initRadius;
    var inityv = sin(initTheta) * initRadius;
    var xPos = xMid + initxv;
    var yPos = yMid + inityv;
    circle[i] = new Circle(xPos, yPos, 0, 0, i);
  }
}

function tellCirclesToBehave() {
  for (var i = 0; i < totalCircles; i++) {
    circle[i].behave();
  }
}

function Circle(xSent, ySent, xvSent, yvSent, indexSent) {
  this.x = xSent;  // Circle x position
  this.y = ySent;  // Circle y position 
  this.r = 2;  // Circle radius 
  this.index = indexSent;  // Circle global ID 
  this.xv = xvSent;// Current velocity along x axis
  this.yv = yvSent;// Current velocity along y axis 

  this.mightCollide = [];// Collision might happen 
  this.hasCollided = []; // Collision is happening 
  
  this.distances = []; // Storage for the distance between circles 
  this.angles = [];// Storage for the angle between two connected circles
  this.thetas = [];// Storage for the radians between two connected circles 
  
  this.numCollisions; // Number of collisions in one frame 
  this.numConnections; // Total number of collisions 

  this.xd; // Distance to target along x axis 
  this.yd; // Distance to target along y axis 
  this.d; // Distance to target 

  this.alphaVar; // Late addition variable for alpha modification 

  this.cAngle; // Angle of collision in degrees 
  this.cTheta; // Angle of collision in radians 
  this.cxv; // Collision velocity along x axis 
  this.cyv; // Collision velocity along y axis 

  this.gAngle; // Angle to gravity center in degrees 
  this.gTheta; // Angle to gravity center in radians 
  this.gxv; // Gravity velocity along x axis 
  this.gyv; // Gravity velocity along y axis 


  this.behave = function() {
    this.move();
    this.areWeClose();
    this.areWeColliding();
    this.areWeConnected();
    this.applyGravity();
    this.render();
    this.reset();
  }

  this.areWeClose = function() {
    for (var i = 0; i < totalCircles; i++) {
      if (i != this.index) {
        if (abs(this.x - circle[i].x) < 50 && abs(this.y - circle[i].y) < 50) {
          this.mightCollide[i] = true;
        } else {
          this.mightCollide[i] = false;
        }
      }
    }
  }

  this.areWeColliding = function() {
    for (var i = 0; i < totalCircles; i++) {
      if (this.mightCollide[i] && i != this.index) {
        this.distances[i] = findDistance(this.x, this.y, circle[i].x, circle[i].y);
        if (this.distances[i] < (this.r + circle[i].r) * 1.1) {
          this.hasCollided[i] = true;
          circle[i].hasCollided[this.index] = true;

          this.angles[i] = findAngle(this.x, this.y, circle[i].x, circle[i].y);
          this.thetas[i] = (-(this.angles[i] * PI)) / 180.0;
          this.cxv += cos(this.thetas[i]) * ((circle[i].r + this.r) / 2.0);
          this.cyv += sin(this.thetas[i]) * ((circle[i].r + this.r) / 2.0);
          this.numCollisions += 1;
        }
      }
    }

    if (this.numCollisions > 0) {
      this.xv = -this.cxv / this.numCollisions;
      this.yv = -this.cyv / this.numCollisions;
    }

    this.cxv = 0.0;
    this.cyv = 0.0;

  }

  this.areWeConnected = function() {
    for (var i = 0; i < totalCircles; i++) {
      if (this.hasCollided[i] && i != this.index) {
        this.distances[i] = findDistance(this.x, this.y, circle[i].x, circle[i].y);
        if (this.distances[i] < maxDistance) {
          this.angles[i] = findAngle(this.x, this.y, circle[i].x, circle[i].y);
          this.thetas[i] = (-(this.angles[i] * PI)) / 180.0;
          this.cxv += cos(this.thetas[i]) * (circle[i].r / 8.0);
          this.cyv += sin(this.thetas[i]) * (circle[i].r / 8.0);
          this.numConnections += 1;
        } else {
          this.hasCollided[i] = false;
          circle[i].hasCollided[this.index] = false;
        }
      }
    }
    if (this.numConnections > 0) {
      this.xv += (this.cxv / this.numConnections) / 4.0;
      this.yv += (this.cyv / this.numConnections) / 4.0;
    }

    this.cxv = 0.0;
    this.cyv = 0.0;

    this.r = this.numConnections * .85 + 2;
  }


  this.applyGravity = function() {
    this.gAngle = findAngle(this.x, this.y, xMid, yMid);
    this.gTheta = (-(this.gAngle * PI)) / 180;
    this.gxv = cos(this.gTheta) * gravity;
    this.gyv = sin(this.gTheta) * gravity;
    this.xv += this.gxv;
    this.yv += this.gyv;
  }

  this.move = function() {
    this.x += this.xv;
    this.y += this.yv;
  }

  this.render = function() {

    noStroke();
    fill(0, 25);
    ellipse(this.x, this.y, this.r, this.r);
    fill(0 + this.r * 10, 50);
    ellipse(this.x, this.y, this.r * .5, this.r * .5);
    fill(0 + this.r * 10);
    ellipse(this.x, this.y, this.r * .3, this.r * .3);

    if (this.numCollisions > 0) {
      noStroke();
      fill(0, 25);
      ellipse(this.x, this.y, this.r, this.r);

      fill(0, 55);
      ellipse(this.x, this.y, this.r * .85, this.r * .85);
      fill(0);
      ellipse(this.x, this.y, this.r * .7, this.r * .7);
    }
    
    for (var i = 0; i < totalCircles; i++) {
      if (this.hasCollided[i] && i < this.index) {
        this.xd = this.x - circle[i].x;
        this.yd = this.y - circle[i].y;
        stroke(0, 150 - this.distances[i] * 2.0);
        noFill();
        beginShape();
        vertex(this.x, this.y);
        vertex(this.x - this.xd * .25 + random(-1.0, 1.0), this.y - this.yd * .25 + random(-1.0, 1.0));
        vertex(this.x - this.xd * .5 + random(-3.0, 3.0), this.y - this.yd * .5 + random(-3.0, 3.0));
        vertex(this.x - this.xd * .75 + random(-1.0, 1.0), this.y - this.yd * .75 + random(-1.0, 1.0));
        vertex(circle[i].x, circle[i].y);
        endShape();
        //line (x, y, circle[i].x, circle[i].y); 
      }
    }
    noStroke();
  }

  this.reset = function() {
    this.numCollisions = 0;
    this.numConnections = 0;
  }
}

function findDistance(x1, y1, x2, y2) {
  var xd = x1 - x2;
  var yd = y1 - y2;
  var td = sqrt(xd * xd + yd * yd);
  return td;
}

function findAngle(x1, y1, x2, y2) {
  var xd = x1 - x2;
  var yd = y1 - y2;
  var t = atan2(yd, xd);
  var a = (180 + (-(180 * t) / PI));
  return a;
}