/* 
   
   A surface filled with one hundred medium to small sized circles. 
   Each circle has a different size and direction, but moves at the same slow rate. 
   Display: 
   >>> A. The instantaneous intersections of the circles 
   B. The aggregate intersections of the circles 
 
   Restored by Casey Reas <http://reas.com> 
   22 June 2016 
   Processing v.3.1.1 <http://processing.org> 
   
   Implemented by J. Tarbell <http://levitated.net> 
   8 April 2004 
   Processing v.68 <http://processing.org> 
 
*/ 
 
int num = 100; 
int time = 0; 
 
// object array 
Disc[] discs; 
 
// initialization 
void setup() { 
  size(500, 500); 
  colorMode(RGB,255); 
  //ellipseMode(CENTER_RADIUS); 
  background(0); 
  frameRate(30); 
 
  // make some discs 
  discs = new Disc[num]; 
  
  // arrange in anti-collapsing circle 
  for (int i=0;i<num;i++) { 
    float fx = 0.4*width*cos(TWO_PI*i/num); 
    float fy = 0.4*width*sin(TWO_PI*i/num); 
    float x = random(width/2) + fx; 
    float y = random(width/2) + fy; 
    float r = 5+random(45); 
    int bt = 1; 
    if (random(100)<50) bt=-1; 
    discs[i] = new Disc(i,x,y,bt*fx/1000.0,bt*fy/1000.0,r); 
  } 
} 
 
// main 
void draw() { 
  background(0); 
  // move discs 
  for (int c=0;c<num;c++) { 
    discs[c].move(); 
    discs[c].render(); 
    discs[c].renderPxRiders(); 
  } 
  time++; 
} 
 
// disc object 
class Disc { 
  // index identifier 
  int id; 
  // position 
  float x,y; 
  // radius 
  float r, dr; 
  // velocity 
  float vx,vy; 
 
  //  pixel riders  
  int numr; 
  int maxr = 40; 
  PxRider[] pxRiders; 
 
  Disc(int Id, float X, float Y, float Vx, float Vy, float R) { 
    // construct 
    id=Id; 
    x=X; 
    y=Y; 
    vx=Vx; 
    vy=Vy; 
    dr=R; 
    r=0; 
    
    numr = int(R/1.62); 
    if (numr>maxr) numr=maxr; 
    
    // create pixel riders 
    pxRiders = new PxRider[maxr]; 
    for (int n=0;n<maxr;n++) { 
      pxRiders[n] = new PxRider(); 
    } 
  } 
 
  void draw() { 
    stroke(0,50); 
    noFill(); 
    ellipse(x,y,r,r); 
  } 
 
  void render() { 
    // find intersecting points with all ascending discs 
    for (int n=id+1;n<num;n++) { 
      if (n!=id) { 
      // find distance to other disc 
      float dx = discs[n].x-x; 
      float dy = discs[n].y-y; 
      float d = sqrt(dx*dx+dy*dy); 
      // intersection test 
      if (d<(discs[n].r+r)) { 
        // complete containment test 
        if (d>abs(discs[n].r-r)) { 
          // find solutions 
          float a = (r*r - discs[n].r*discs[n].r + d*d ) / (2*d); 
          
          float p2x = x + a*(discs[n].x - x)/d; 
          float p2y = y + a*(discs[n].y - y)/d; 
          
          float h = sqrt(r*r - a*a); 
          
          float p3ax = p2x + h*(discs[n].y - y)/d; 
          float p3ay = p2y - h*(discs[n].x - x)/d; 
          
          float p3bx = p2x - h*(discs[n].y - y)/d; 
          float p3by = p2y + h*(discs[n].x - x)/d; 
          
          // P3a and P3B may be identical - ignore this case (for now) 
          stroke(255); 
          point(p3ax,p3ay); 
          point(p3bx,p3by); 
        } 
      } 
      } 
    } 
  } 
 
  void move() { 
    // add velocity to position 
    x+=vx; 
    y+=vy; 
    // bound check 
    if (x+r<0) x+=width+r+r; 
    if (x-r>width) x-=width+r+r; 
    if (y+r<0) y+=width+r+r; 
    if (y-r>width) y-=width+r+r; 
 
    // increase to destination radius 
    if (r<dr) { 
      r+=0.1; 
    } 
  } 
  
  void renderPxRiders() { 
    for (int n=0;n<numr;n++) { 
      pxRiders[n].move(x,y,r); 
    } 
  } 
 
  // pixel rider object  
  class PxRider { 
    float t; 
    float vt; 
    int mycharge; 
    
    PxRider() { 
      t=random(TWO_PI); 
      vt=0.0; 
    } 
    
    void move(float x, float y, float r) { 
      // add velocity to theta 
      t=(t+vt+PI)%TWO_PI - PI; 
      
      vt+=random(-0.001,0.001); 
    
      // apply friction brakes 
      if (abs(vt)>0.02) vt*=0.9; 
 
      // draw      
      float px = x+r*cos(t); 
      float py = y+r*sin(t); 
      color c = get(int(px),int(py)); 
      if (brightness(c)>48) { 
        glowpoint(px,py); 
        mycharge = 164; 
      } else { 
        stroke(mycharge); 
        point(px,py); 
        mycharge*=0.98; 
      } 
 
    } 
  } 
} 
 
 
// methods 
void glowpoint(float px, float py) { 
  for (int i=-2;i<3;i++) { 
    for (int j=-2;j<3;j++) { 
      float a = 0.8 - i*i*0.1 - j*j*0.1; 
      tpoint(int(px+i),int(py+j),#FFFFFF,a); 
    } 
  } 
} 
 
void tpoint(int x1, int y1, color myc, float a) { 
  // place translucent point 
  int r, g, b; 
  color c; 
 
  c = get(x1, y1); 
 
  r = int(red(c) + (red(myc) - red(c)) * a); 
  g = int(green(c) +(green(myc) - green(c)) * a); 
  b = int(blue(c) + (blue(myc) - blue(c)) * a); 
  color nc = color(r, g, b); 
  stroke(nc); 
  point(x1,y1); 
} 