/* 
   
   Structure 3 
   
   A surface filled with one hundred medium to small sized circles. 
   Each circle has a different size and direction, but moves at the same slow rate. 
   Display: 
   >>> A. The instantaneous intersections of the circles 
   B. The aggregate intersections of the circles 
 
   Restored by Casey Reas <http://reas.com> 
   22 June 2016 
   Processing v.3.1.1 <http://processing.org> 
   
   Implemented by Casey Reas <http://groupc.net> 
   8 March 2004 
   Processing v.68 <http://processing.org> 
 
*/ 
 
int numCircle = 100; 
Circle[] circles = new Circle[numCircle]; 
 
void setup() { 
  size(800, 600); 
  frameRate(30); 
  for(int i=0; i<numCircle; i++) { 
    circles[i] = new Circle(random(width), (float)height/(float)numCircle * i, 
                            int(random(1, 6))*10, random(-1.0, 1.0), random(-1.0, 1.0), i); 
  } 
  //ellipseMode(CENTER); 
  background(255); 
} 
 
 
void draw() { 
  background(255); 
  for(int i=0; i<numCircle; i++) { 
    circles[i].update(); 
  } 
  for(int i=0; i<numCircle; i++) { 
    circles[i].move(); 
  } 
  for(int i=0; i<numCircle; i++) { 
    circles[i].makepoint(); 
  } 
} 
 
 
class Circle {
  
  float x, y, r, r2, sp, ysp; 
  int id; 
 
  Circle( float px, float py, float pr, float psp, float pysp, int pid ) { 
    x = px; 
    y = py; 
    r = pr; 
    r2 = r*r; 
    id = pid; 
    sp = psp; 
    ysp = pysp; 
  } 
  
  void update() { 
    for(int i=0; i<numCircle; i++) { 
      if(i != id) { 
        intersect( this, circles[i] ); 
      } 
    } 
  } 
  
  void makepoint() { 
     stroke(0); 
     point(x, y); 
  } 
  
  void move() { 
    x += sp; 
    y += ysp; 
    if(sp > 0) { 
      if(x > width+r) { 
        x = -r; 
      }   
    } else { 
      if(x < -r) { 
        x = width+r; 
      } 
    } 
    if(ysp > 0) { 
      if(y > height+r) { 
        y = -r; 
      } 
    } else { 
      if(y < -r) { 
        y = height+r; 
      } 
    } 
  } 
} 
 
void intersect( Circle cA, Circle cB ) { 
  float dx = cA.x - cB.x; 
  float dy = cA.y - cB.y; 
  float d2 = dx*dx + dy*dy; 
  float d = sqrt( d2 ); 
 
  if ( d>cA.r+cB.r || d<abs(cA.r-cB.r) ) { 
    return; // no solution 
  } 
  
  float a = (cA.r2 - cB.r2 + d2) / (2*d); 
  float h = sqrt( cA.r2 - a*a ); 
  float x2 = cA.x + a*(cB.x - cA.x)/d; 
  float y2 = cA.y + a*(cB.y - cA.y)/d; 
 
  float paX = x2 + h*(cB.y - cA.y)/d; 
  float paY = y2 - h*(cB.x - cA.x)/d; 
  float pbX = x2 - h*(cB.y - cA.y)/d; 
  float pbY = y2 + h*(cB.x - cA.x)/d; 
 
  stroke(255-dist(paX, paY, pbX, pbY)*4); 
  line(paX, paY, pbX, pbY); 
} 