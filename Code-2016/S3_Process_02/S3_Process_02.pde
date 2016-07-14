/* 
 
   Structure 3 (work in progress) 
   
   A surface filled with one hundred medium to small sized circles. 
   Each circle has a different size and direction, but moves at the same slow rate. 
   Display: 
   A. The instantaneous intersections of the circles 
   B. The aggregate intersections of the circles 
 
   Restored by Casey Reas <http://reas.com> 
   22 June 2016 
   Processing v.3.1.1 <http://processing.org> 
  
   Implemented by Casey Reas <http://groupc.net> 
   Uses circle intersection code from William Ngan <http://metaphorical.net> 
   Processing v.68 <http://processing.org> 
 
*/ 
 
 
Circle circleA, circleB; 
 
void setup() 
{ 
  size( 300, 300 ); 
  frameRate( 30 ); 
 
  circleA = new Circle( 150, 150, 90 ); 
  circleB = new Circle( 150, 150, 120 ); 
 
  //ellipseMode(CENTER_DIAMETER); 
  //rectMode(CENTER_DIAMETER); 
  noStroke(); 
  //smooth(); 
} 
 
 
void draw() 
{ 
  background(226); 
  
  //circleB.x = mouseX; 
  //circleB.y = mouseY; 
  
  circleA.update(); 
  circleB.update(); 
    
  fill( 153, 150 ); 
  ellipse( circleA.x, circleA.y, circleA.r*2, circleA.r*2 ); 
  ellipse( circleB.x, circleB.y, circleB.r*2, circleB.r*2 ); 
  
  intersect( circleA, circleB ); 
} 
 
 
class Circle 
{ 
  float x, y, r, r2; 
  float xspeed, yspeed; 
 
  Circle( float px, float py, float pr ) { 
    x = px; 
    y = py; 
    r = pr; 
    r2 = r*r; 
    xspeed = random(-2.0, 2.0); 
    yspeed = random(-2.0, 2.0); 
  } 
  
  void update() { 
    x += xspeed; 
    //y += yspeed + random(-0.1, 0.1); 
    
    if(x > width + r) { 
      x = -r; 
    } 
    if(x < -r) { 
      x = width+r; 
    } 
    if(y > height + r) { 
      y = -r; 
    } 
    if(y < -r) { 
      y = height+r; 
    } 
    
  } 
} 
 
 
void intersect( Circle cA, Circle cB ) { 
 
  float dx = cA.x - cB.x; 
  float dy = cA.y - cB.y; 
  float d2 = dx*dx + dy*dy; 
  float d = sqrt( d2 ); 
 
  if ( d>cA.r+cB.r || d<abs(cA.r-cB.r) ) return; // no solution 
  
  float a = (cA.r2 - cB.r2 + d2) / (2*d); 
  float h = sqrt( cA.r2 - a*a ); 
  float x2 = cA.x + a*(cB.x - cA.x)/d; 
  float y2 = cA.y + a*(cB.y - cA.y)/d; 
 
  noStroke(); 
  fill(0); 
  rect( x2, y2, 5, 5 ); 
 
  float paX = x2 + h*(cB.y - cA.y)/d; 
  float paY = y2 - h*(cB.x - cA.x)/d; 
  float pbX = x2 - h*(cB.y - cA.y)/d; 
  float pbY = y2 + h*(cB.x - cA.x)/d; 
 
  ellipse( paX, paY, 10, 10 ); 
  ellipse( pbX, pbY, 10, 10 ); 
 
} 