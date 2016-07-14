/* 
   
   A surface filled with one hundred medium to small sized circles. 
   Each circle has a different size and direction, but moves at the same slow rate. 
   Display: 
   >>> A. The instantaneous intersections of the circles 
   B. The aggregate intersections of the circles 
   
   Ported to p5.js by Casey Reas
   13 July 2016
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

var xStage = 900; // x dimension of applet 
var yStage = 500; // y dimension of applet 

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

// BOOLEANS FOR TESTING PURPOSES 
var clearScreen = false;

var timer = 0;
var timerPause = 750;
var timerMax = 775;

// ******************************************************************************** 
// SETUP FUNCTION 
// ******************************************************************************** 

function setup() {
  createCanvas(900, 500);
  bgColor = 20;
  background(bgColor);
  frameRate(30);
  createCircles();
}

// ******************************************************************************** 
// MAIN LOOP FUNCTION 
// ******************************************************************************** 

function draw() {
  if (clearScreen) {
    background(bgColor);
  }
  dealWithTimer();
  if (timer < timerPause) {
    tellCirclesToBehave();
  }
}

function createCircles() {
  gravity = random(0.005, 0.1);
  xGrav = xMid + random(-50, 50);
  yGrav = yMid + random(-50, 50);
  xGravOffset = random(1.0, 1.24);
  maxDistance = random(75, 150);
  angleOffset = random(360);
  initRadius = random(130, 140);
  for (var i = 0; i < totalCircles; i++) {
    var initAngle = i * 3.6 + angleOffset;
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

function dealWithTimer(){ 
  if (timer > timerMax){ 
    timer = 0; 
    background(bgColor); 
    createCircles(); 
  } 
  timer++; 
}

function Circle(xSent, ySent, xvSent, yvSent, indexSent) {
  this.index = indexSent; // Circle global ID 
  
  this.x = xSent; // Circle x position
  this.y = ySent; // Circle y position 
  this.r = 4; // Circle radius 
  
  this.xv = xvSent; // Current velocity along x axis
  this.yv = yvSent; // Current velocity along y axis 

  this.mightCollide = []; // Collision might happen 
  this.hasCollided = []; // Collision is happening 

  this.distances = []; // Storage for the distance between circles 
  this.angles = []; // Storage for the angle between two connected circles
  this.thetas = []; // Storage for the radians between two connected circles 

  this.numCollisions = 0; // Number of collisions in one frame 
  this.numConnections = 0; // Total number of collisions 

  this.xd = 0; // Distance to target along x axis 
  this.yd = 0; // Distance to target along y axis 
  this.d = 0; // Distance to target 

  this.alphaVar = random(35); // Late addition variable for alpha modification 

  this.cAngle = 0; // Angle of collision in degrees 
  this.cTheta = 0; // Angle of collision in radians 
  this.cxv = 0; // Collision velocity along x axis 
  this.cyv = 0; // Collision velocity along y axis 

  this.gAngle = 0; // Angle to gravity center in degrees 
  this.gTheta = 0; // Angle to gravity center in radians 
  this.gxv = 0; // Gravity velocity along x axis 
  this.gyv = 0; // Gravity velocity along y axis 


  this.behave = function() {
    this.move();
    this.areWeClose();
    this.areWeColliding();  // This is the current area of trouble
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
    this.gAngle = findAngle(this.x, this.y, xGrav, yGrav);
    this.gTheta = (-(this.gAngle * PI)) / 180;
    this.gxv = cos(this.gTheta) * gravity * xGravOffset;
    this.gyv = sin(this.gTheta) * gravity;
    this.xv += this.gxv;
    this.yv += this.gyv;
  }

  this.move = function() {
    this.x += this.xv;
    this.y += this.yv;
  }

  this.render = function() {

    noFill(); 
    this.d = findDistance(this.x, this.y, xMid, yMid); 
    if (this.d > initRadius){ 
      stroke(255 - this.d, this.d - this.alphaVar); 
    } else { 
      stroke(this.d, this.d - this.alphaVar); 
    } 
    point(this.x,this.y); 
    noStroke(); 
    if (this.numCollisions > 0){ 
      fill(255, 4); 
      ellipse(this.x, this.y, this.r * 5.0, this.r * 5.0 + 5); 
      ellipse(this.x, this.y, this.r * 3.0, this.r * 3.0 + 5); 
      if (this.d > initRadius){ 
        fill(255,255); 
      } else { 
        fill(0,255); 
      } 
      ellipse(this.x, this.y, this.r * 0.5, this.r * 0.5); 
    } 
    
    for (var i = 0; i < totalCircles; i++){ 
      if (this.hasCollided[i] && i < this.index){ 
        stroke(abs(this.angles[i] - 180)*1.3, 5); 
        line (this.x, this.y, circle[i].x, circle[i].y); 
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