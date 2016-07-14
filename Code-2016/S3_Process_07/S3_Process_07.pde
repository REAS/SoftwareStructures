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
   Processing v.68 <http://processing.org> 
 
*/ 
 
int numCircle = 100; 
Circle[] circles = new Circle[numCircle]; 
 
void setup() 
{ 
  size(640, 480); 
  frameRate(30); 
  for(int i=0; i<numCircle; i++) { 
    circles[i] = new Circle(random(width), random(height), random(2, 6)*10, 
                            random(-2.0, 2.0), random(-2.0, 2.0)); 
  } 
  //ellipseMode(CENTER_DIAMETER); 
  background(255); 
} 
 
 
void draw() 
{ 
  background(255); 
  
  for(int i=0; i<numCircle; i++) { 
    circles[i].move(); 
  } 
} 
 
 
class Circle { 
 
  float x, y, r, sp, ysp; 
 
  Circle( float px, float py, float pr, float psp, float pysp) { 
    x = px; 
    y = py; 
    r = pr; 
    sp = psp; 
    ysp = pysp; 
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
    
    stroke(0); 
    noFill(); 
    ellipse(x, y, r, r); 
  } 
} 