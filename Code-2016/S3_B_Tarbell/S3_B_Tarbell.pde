/* 

   A surface filled with one hundred medium to small sized circles. 
   Each circle has a different size and direction, but moves at the same slow rate. 
   Display: 
   A. The instantaneous intersections of the circles 
   >>> B. The aggregate intersections of the circles 
 
   Restored by Casey Reas <http://reas.com> 
   22 June 2016 
   Processing v.3.1.1 <http://processing.org> 
   
   Implemented by J. Tarbell <http://levitated.net> 
   8 April 2004 
   Processing v.68 <http://processing.org> 
   
*/ 
 
// widthensions 
int num = 100; 
int time = 0; 
 
// display flag 
boolean showStructure = false; 
 
// object array 
Disc[] discs; 
 
 
// methods 
void setup() { 
  size(500, 500); 
  colorMode(RGB,255); 
  //ellipseMode(CENTER_RADIUS); 
  background(0); 
  frameRate(30); 
  
  // make 100 discs 
  discs = new Disc[num]; 
 
  // arrange linearly 
  for (int i=0;i<num;i++) { 
    float x = random(width); 
    float y = random(width); 
    float fy = 0; 
    float fx = random(-1.0,1.0); 
    float r = 20+random(20); 
    
    discs[i] = new Disc(i,x,y,fx,fy,r); 
  } 
} 
 
// main 
void draw() { 
  if (showStructure) { 
    background(0); 
    // render circles and intersections 
    for (int c=0;c<num;c++) { 
      discs[c].draw(); 
    } 
  } 
  // move discs 
  for (int c=0;c<num;c++) { 
    discs[c].move(); 
    discs[c].render(); 
  } 
  time++; 
} 
 
void keyReleased () { 
  if (key==' ') { 
    background(0); 
    if (showStructure) { 
      showStructure = false; 
    } else { 
      showStructure = true; 
    } 
  } 
} 
 
// translucent point 
void tpoint(int x1, int y1, int gc, float a) { 
  noStroke(); 
  fill(gc,a*255); 
  rect(x1,y1,1,1); 
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
 
  // sand painters 
  int numsands = 1; 
  SandPainter[] sands = new SandPainter[numsands]; 
 
  Disc(int Id, float X, float Y, float Vx, float Vy, float R) { 
    // construct 
    id=Id; 
    x=X; 
    y=Y; 
    vx=Vx; 
    vy=Vy; 
    dr=R; 
    r=1.0; 
    
    // create sand painters 
    for (int n=0;n<numsands;n++) { 
      sands[n] = new SandPainter(); 
    } 
  } 
 
  void draw() { 
    stroke(64); 
    noFill(); 
    ellipse(x,y,r,r); 
  } 
 
  void render() { 
    // find intersecting points with all ascending discs 
    for (int n=id+1;n<num;n++) { 
      // find distance to other disc 
      float dx = discs[n].x-x; 
      float dy = discs[n].y-y; 
      float d = sqrt(dx*dx+dy*dy); 
      // intersection test 
      if (d<(discs[n].r+r)) { 
        // complete containment test 
        if (d>abs(discs[n].r-r)) { 
          // find circle intersection solutions 
          float a = (r*r - discs[n].r*discs[n].r + d*d ) / (2*d); 
          
          float p2x = x + a*(discs[n].x - x)/d; 
          float p2y = y + a*(discs[n].y - y)/d; 
          
          float h = sqrt(r*r - a*a); 
          
          float p3ax = p2x + h*(discs[n].y - y)/d; 
          float p3ay = p2y - h*(discs[n].x - x)/d; 
          
          float p3bx = p2x - h*(discs[n].y - y)/d; 
          float p3by = p2y + h*(discs[n].x - x)/d; 
          // P3a and P3B may be identical - ignore this case (for now) 
 
          if (showStructure) { 
            stroke(255); 
            point(p3ax,p3ay); 
            point(p3bx,p3by); 
          } else { 
            tpoint(int(p3ax-1),int(p3ay),255,0.21); 
            tpoint(int(p3ax+1),int(p3ay),0,0.21); 
            tpoint(int(p3bx-1),int(p3by),255,0.21); 
            tpoint(int(p3ax+1),int(p3ay),0,0.21); 
          } 
          // draw sand painters 
          for (int s=0;s<numsands;s++) { 
            sands[s].render(p3ax,p3ay,p3bx,p3by); 
          } 
        } 
      } 
    } 
  } 
 
  void move() { 
    // move radius towards destination radius 
    if (r<dr) r+=0.02; 
    // add velocity to position 
    x+=vx; 
    y+=vy; 
    // bound check 
    if (x+r<0) { 
      x+=width+r+r; 
      y=random(width); 
    } 
    if (x-r>width) { 
      x-=width+r+r; 
      y=random(width); 
     } 
    if (y+r<0) { 
      y+=width+r+r; 
      x=random(width); 
    } 
    if (y-r>width) { 
      y-=width+r+r; 
      x=random(width); 
    } 
  } 
  
} 
 
// sandpainter object 
class SandPainter { 
 
  float p; 
  float g; 
  int c; 
 
  SandPainter() { 
    p = random(1.0); 
    c = int(random(256)); 
    g = random(0.01,0.1); 
  } 
 
  void render(float x, float y, float ox, float oy) { 
    // draw painting sweeps 
    tpoint(int(ox+(x-ox)*sin(p)),int(oy+(y-oy)*sin(p)),c,0.11); 
 
    g+=random(-0.050,0.050); 
    float maxg = 0.5; 
    if (g<-maxg) g=-maxg; 
    if (g>maxg) g=maxg; 
    p+=random(-0.050,0.050); 
    if (p<0) p=0; 
    if (p>1.0) p=1.0; 
 
    float w = g/10.0; 
    for (int i=0;i<11;i++) { 
      tpoint(int(ox+(x-ox)*sin(p + sin(i*w))),int(oy+(y-oy)*sin(p + sin(i*w))),c,0.1-i/110); 
      tpoint(int(ox+(x-ox)*sin(p - sin(i*w))),int(oy+(y-oy)*sin(p - sin(i*w))),c,0.1-i/110); 
    } 
  } 
} 
 