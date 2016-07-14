/* 
   
   A surface filled with one hundred medium to small sized circles. 
   Each circle has a different size and direction, but moves at the same slow rate. 
   Display: 
   A. The instantaneous intersections of the circles 
   >>> B. The aggregate intersections of the circles 
 
   Restored by Casey Reas <http://reas.com> 
   22 June 2016 
   Processing v.3.1.1 <http://processing.org> 
   
   Implemented by Robert Hodgin <http://flight404.com> 
   7 April 2004 
   Processing v.68 <http://processing.org> 
 
*/ 
 
// ******************************************************************************** 
// INITIALIZE VARIABLES 
// ******************************************************************************** 
 
int xStage         = 900;             // x dimension of applet 
int yStage         = 500;             // y dimension of applet 
 
int xMid           = xStage/2;        // x midpoint of applet 
int yMid           = yStage/2;        // y midpoint of applet 
 
int totalCircles   = 100;             // total number of circles 
Circle[] circle;                      // Circle object array 
 
float gravity;                        // Strength of gravitational pull 
float xGrav;                          // x point of center of gravity 
float yGrav;                          // y point of center of gravity 
float xGravOffset;                    // offset var to warp gravitational field 
 
float angleOffset;                    // sets the initial point of rotation for the creation of the circles 
float initRadius;                     // the starting radius of the creation of the circles 
float maxDistance;                    // maximum distance allowed for connections 
 
color bgColor; 
 
// BOOLEANS FOR TESTING PURPOSES 
boolean clear      = false; 
 
int timer          = 0; 
int timerPause     = 750; 
int timerMax       = 775; 
 
// ******************************************************************************** 
// SETUP FUNCTION 
// ******************************************************************************** 
 
void setup() 
{ 
  size(900, 500); 
  bgColor = color(20,20,20); 
  background(bgColor); 
  smooth(); 
  colorMode(RGB, 255); 
  //ellipseMode(CENTER_RADIUS);
  noStroke(); 
  frameRate(30);
  createCircles(); 
} 
 
// ******************************************************************************** 
// MAIN LOOP FUNCTION 
// ******************************************************************************** 
 
void draw() 
{ 
  if (clear){ 
    background(bgColor); 
  } 
  dealWithTimer(); 
  if (timer < timerPause){ 
    tellCirclesToBehave(); 
  } 
 
} 
 
void createCircles(){ 
  gravity                        = random(0.005,0.1); 
  xGrav                          = xMid + random(-50,50); 
  yGrav                          = yMid + random(-50,50); 
  xGravOffset                    = random(1.0, 1.24); 
  maxDistance                    = random(75, 150); 
  angleOffset                    = random(360); 
  circle                         = new Circle[totalCircles]; 
  initRadius                     = random(100,140); 
  for (int i=0; i<totalCircles; i++){ 
    float initAngle              = i * 3.6 + angleOffset; 
    float initTheta              = (-((initAngle) * PI))/180; 
 
    float initxv                 = cos(initTheta) * initRadius; 
    float inityv                 = sin(initTheta) * initRadius; 
    float xPos = xMid + initxv; 
    float yPos = yMid + inityv; 
    circle[i] = new Circle(xPos, yPos,0,0, i); 
  } 
} 
 
void tellCirclesToBehave(){ 
  for (int i=0; i<totalCircles; i++){ 
    circle[i].behave(); 
  } 
} 
 
void dealWithTimer(){ 
  if (timer > timerMax){ 
    timer = 0; 
    background(bgColor); 
    createCircles(); 
  } 
  timer ++; 
} 
 
class Circle 
{ 
  int index;                    // Circle global ID 
 
  float x;                      // Circle x position 
  float y;                      // Circle y position 
  float r;                      // Circle radius 
  float rBase;                  // Circle original radius 
  
  float angle;                  // Angle of movement in degrees 
  float theta;                  // Angle of movement in radians 
  float speed;                  // Speed of movement 
  
  float xv;                     // Current velocity along x axis 
  float yv;                     // Current velocity along y axis 
 
  boolean[] mightCollide;       // Collision might happen 
  boolean[] hasCollided;        // Collision is happening 
  
  float[] distances;            // Storage for the distance between circles 
  float[] angles;               // Storage for the angle between two connected circles 
  float[] thetas;               // Storage for the radians between two connected circles 
  int numCollisions;            // Number of collisions in one frame 
  int numConnections;           // Total number of collisions 
 
  float xd;                     // Distance to target along x axis 
  float yd;                     // Distance to target along y axis 
  float d;                      // Distance to target 
  
  float alphaVar;               // Late addition variable for alpha modification 
 
  float cAngle;                 // Angle of collision in degrees 
  float cTheta;                 // Angle of collision in radians 
  float cxv;                    // Collision velocity along x axis 
  float cyv;                    // Collision velocity along y axis 
  
  float gAngle;                 // Angle to gravity center in degrees 
  float gTheta;                 // Angle to gravity center in radians 
  float gxv;                    // Gravity velocity along x axis 
  float gyv;                    // Gravity velocity along y axis 
 
  Circle (float xSent, float ySent, float xvSent, float yvSent, int indexSent){ 
    x               = xSent; 
    y               = ySent; 
    r               = 4; 
    
    index           = indexSent; 
 
    xv              = xvSent; 
    yv              = yvSent; 
    
    alphaVar        = random(35); 
    
    mightCollide    = new boolean[totalCircles]; 
    hasCollided     = new boolean[totalCircles]; 
    distances       = new float[totalCircles]; 
    angles          = new float[totalCircles]; 
    thetas          = new float[totalCircles]; 
  } 
  
  void behave(){ 
    move(); 
    areWeClose(); 
    areWeColliding(); 
    areWeConnected(); 
    applyGravity(); 
    render(); 
    reset(); 
  } 
 
  void areWeClose(){ 
    for(int i=0; i<totalCircles; i++){ 
      if (i != index){ 
        if (abs(x - circle[i].x) < 50 && abs(y - circle[i].y) < 50){ 
          mightCollide[i] = true; 
        } else { 
          mightCollide[i] = false; 
        } 
      } 
    } 
  } 
 
  void areWeColliding(){ 
    for(int i=0; i<totalCircles; i++){ 
      if (mightCollide[i] && i != index){ 
        distances[i] = findDistance(x, y, circle[i].x, circle[i].y); 
        if (distances[i] < (r + circle[i].r) * 1.1){ 
          hasCollided[i]               = true; 
          circle[i].hasCollided[index] = true; 
 
          angles[i]                    = findAngle(x,y,circle[i].x,circle[i].y); 
          thetas[i]                    = (-(angles[i] * PI))/180.0; 
          cxv                         += cos(thetas[i]) * ((circle[i].r + r)/2.0); 
          cyv                         += sin(thetas[i]) * ((circle[i].r + r)/2.0); 
          numCollisions               += 1; 
        } 
      } 
    } 
    
    if (numCollisions > 0){ 
      xv = -cxv/numCollisions; 
      yv = -cyv/numCollisions; 
    } 
 
    cxv = 0.0; 
    cyv = 0.0; 
    
  } 
  
  void areWeConnected(){ 
    for(int i=0; i<totalCircles; i++){ 
      if (hasCollided[i] && i != index){ 
        distances[i] = findDistance(x, y, circle[i].x, circle[i].y); 
        if (distances[i] < maxDistance){ 
          angles[i]                    = findAngle(x,y,circle[i].x,circle[i].y); 
          thetas[i]                    = (-(angles[i] * PI))/180.0; 
          cxv                         += cos(thetas[i]) * (circle[i].r/10.0); 
          cyv                         += sin(thetas[i]) * (circle[i].r/10.0); 
          numConnections              += 1; 
        } else { 
          hasCollided[i]               = false; 
          circle[i].hasCollided[index] = false; 
        } 
      } 
    } 
    if (numConnections > 0){ 
      xv += (cxv/numConnections)/4.0; 
      yv += (cyv/numConnections)/4.0; 
    } 
    
    cxv = 0.0; 
    cyv = 0.0; 
    
    r = numConnections + 1; 
  } 
 
  
  void applyGravity(){ 
    gAngle        = findAngle(x,y,xGrav,yGrav); 
    gTheta        = (-(gAngle * PI))/180; 
    gxv           = cos(gTheta) * gravity * xGravOffset; 
    gyv           = sin(gTheta) * gravity; 
    xv += gxv; 
    yv += gyv; 
  } 
  
  void move(){ 
    x += xv; 
    y += yv; 
  } 
 
  void render(){ 
    noFill(); 
    d = findDistance(x, y, xMid, yMid); 
    if (d > initRadius){ 
      stroke(255 - d, d - alphaVar); 
    } else { 
      stroke(d, d - alphaVar); 
    } 
    point(x,y); 
    noStroke(); 
    //fill(255,255); 
    //ellipse(x, y, r, r); 
    if (numCollisions > 0){ 
      fill(255,4); 
      ellipse(x, y, r * 5.0, r * 5.0 + 5); 
      ellipse(x, y, r * 3.0, r * 3.0 + 5); 
      if (d > initRadius){ 
        fill(255,255); 
      } else { 
        fill(0,255); 
      } 
      ellipse(x, y, r * 0.5, r * 0.5); 
    } 
    
    for(int i=0; i<totalCircles; i++){ 
      if (hasCollided[i] && i < index){ 
        stroke(abs(angles[i] - 180)*1.3, 5); 
        //stroke(abs(255 - d*.75),6); 
        line (x, y, circle[i].x, circle[i].y); 
      } 
    } 
    noStroke(); 
  } 
  
  void reset(){ 
    numCollisions = 0; 
    numConnections = 0; 
  } 
} 
 
float findDistance(float x1, float y1, float x2, float y2){ 
  float xd = x1 - x2; 
  float yd = y1 - y2; 
  float td = sqrt(xd * xd + yd * yd); 
  return td; 
} 
  
float findAngle(float x1, float y1, float x2, float y2){ 
  float xd = x1 - x2; 
  float yd = y1 - y2; 
 
  float t = atan2(yd,xd); 
  float a = (180 + (-(180 * t) / PI)); 
  return a; 
} 