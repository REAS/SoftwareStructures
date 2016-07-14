/* 
   
   A surface filled with one hundred medium to small sized circles. 
   Each circle has a different size and direction, but moves at the same slow rate. 
   Display: 
   >>> A. The instantaneous intersections of the circles 
   B. The aggregate intersections of the circles 
 
   Restored by Casey Reas <http://reas.com> 
   22 June 2016 
   Processing v.3.1.1 <http://processing.org> 
   
   Implemented by William Ngan <http://metaphorical.net> 
   4 April 2004 
   Processing v.68 <http://processing.org> 
 
*/ 
 
Circle[] cc; 
 
void setup() 
{ 
  size( 600, 600 ); 
  frameRate( 30 ); 
  cc = new Circle[100]; 
  for (int i=0; i<cc.length; i++) { 
    cc[i] = new Circle( random(width), random(height), 15+random(20), i ); 
  } 
  //ellipseMode(CENTER_DIAMETER); 
  rectMode(CENTER); 
  noFill(); 
} 
 
void draw() 
{ 
  background(255); 
 
  noStroke(); 
  fill(0); 
 
  for (int i=0; i<cc.length; i++) { 
    cc[i].draw(); 
  } 
 
  noFill(); 
  stroke(255); 
 
  for (int i=0; i<cc.length; i++) { 
    cc[i].drawHair(); 
  } 
} 
 
class Circle { 
 
  float x, y, r, r2, d, d2; 
  float lastx, lasty; 
 
  float ac1, ac2, ac3; 
  float sp1, sp2, sp3; 
 
  float inx = 0; 
  float iny = 0; 
 
  boolean hasIntersect = false; 
  Hair[] hairs; 
 
  int gray; 
 
  int id; 
 
  Circle( float px, float py, float pr, int id ) { 
    x = px; 
    y = py; 
    r = pr; 
    r2 = r*r; 
    d = r*2; 
    d2 = d*d; 
 
    this.id = id; 
 
    gray = 0; 
 
    hairs = new Hair[30]; 
    float stepA =  2*PI/hairs.length;; 
    for (int i=0; i<hairs.length; i++) { 
 
      hairs[i] = new Hair( cos(stepA*i)*r, sin(stepA*i)*r, 5, stepA*i+PI, this ); 
    } 
 
    sp1 = random(2); 
    sp2 = random(2); 
    sp3 = random(2); 
 
    ac1 = random(0.5)-random(0.5); 
    ac2 = random(0.5)-random(0.5); 
    ac3 = random(0.5)-random(0.5); 
  } 
 
  void draw() { 
    ellipse(x, y, d, d); 
    move(); 
  } 
 
  void drawHair() { 
 
    for (int i=0; i<hairs.length; i++) { 
      hairs[i].updatePos(); 
      hairs[i].draw(); 
    } 
  } 
 
  void move() { 
    float angle = sin( sp1 ) - cos(sp2); 
 
    sp1+=ac1; 
    sp2+=ac2; 
    sp3+=ac3; 
 
    angle = (angle<0) ? angle+TWO_PI : ( (angle>=TWO_PI) ? angle-TWO_PI : angle ); 
 
    x += sin(angle); 
    y -= cos(angle); 
 
    checkBounds(); 
 
    checkIntersect(); 
 
  } 
 
  void checkIntersect() { 
 
    boolean flag = false; 
    boolean flag2 = false; 
    for (int i=0; i<cc.length; i++) { 
      if (i!=id) { 
        flag = intersect( cc[i]); 
        if (!flag2) flag2 = flag; 
      } 
    } 
 
    if (flag2) { 
      hairFocus(inx, iny); 
    } else if ( hasIntersect ) { 
      hairFocus(); 
    } 
 
    hasIntersect = flag2; 
 
  } 
 
  boolean intersect( Circle cB ) { 
 
    float dx = x - cB.x; 
    float dy = y - cB.y; 
    float d2 = dx*dx + dy*dy; 
    float d = sqrt( d2 ); 
 
    if ( d>r+cB.r || d<abs(r-cB.r) ) return false; 
 
    float a = (r2 - cB.r2 + d2) / (2*d); 
    float h = sqrt( r2 - a*a ); 
    float x2 = x + a*(cB.x - x)/d; 
    float y2 = y + a*(cB.y - y)/d; 
 
    float paX = x2 + h*(cB.y - y)/d; 
    float paY = y2 - h*(cB.x - x)/d; 
    //float pbX = x2 - h*(cB.y - y)/d; 
    //float pbY = y2 + h*(cB.x - x)/d; 
 
    repel( atan2( dy, dx) ); 
 
    ellipse( paX, paY, 15, 15 ); 
    //ellipse( pbX, pbY, 20, 20 ); 
 
    //if ( cB.id > id ) { 
      inx = x2; 
      iny = y2; 
 
    //} else { 
      //inx = pbX; 
      //iny = pbY; 
    //} 
 
    return true; 
 
  } 
 
  void repel( float angle ) { 
    x = x + cos(angle)/4; 
    y = y + sin(angle)/4; 
 
  } 
 
  void hairFocus( float px, float py) { 
 
    for (int i=0; i<hairs.length; i++) { 
      hairs[i].focus( px, py ); 
    } 
 
  } 
 
  void hairFocus() { 
    for (int i=0; i<hairs.length; i++) { 
      hairs[i].revertFocus(); 
    } 
  } 
 
  void checkBounds() { 
    //x = Math.min( width, Math.max( 0, x ) ); 
    //y = Math.min( height, Math.max( 0, y ) ); 
 
    if ( x > width ) x = 0; 
    if ( x < 0 ) x = width; 
    if ( y > height ) y = 0; 
    if ( y < 0 ) y = height; 
 
  } 
 
} 
 
class Hair { 
 
  float repel_speed; 
 
  float radius, origRadius; 
  float angle, origAngle; 
  float x, y, regX, regY, nextX, nextY, lastx, lasty; 
 
  float speedFactor = 5; 
 
  Circle parent; 
 
  Hair( float rx, float ry, float r, float a, Circle parent ) { 
    radius = r; 
    origRadius = r; 
 
    angle = a; 
    origAngle = a; 
 
    this.parent = parent; 
 
    regX = rx; 
    regY = ry; 
 
    nextX = parent.x+regX+cos(angle)*radius; 
    nextY = parent.y+regY+sin(angle)*radius; 
 
    x = nextX; 
    y = nextY; 
 
  } 
 
  void updatePos() { 
 
    nextX = parent.x+regX+cos(angle)*radius; 
    nextY = parent.y+regY+sin(angle)*radius; 
 
    float dx = nextX - x; 
    float dy = nextY - y; 
    if (abs(dx)>1) { 
      x += dx/speedFactor; 
      y += dy/speedFactor; 
    } 
 
    if (abs(dx)>200 || abs(dy)>200) { 
      x = nextX; 
      y = nextY; 
    } 
 
  } 
 
  void draw() { 
    stroke(255);
    line( parent.x+regX, parent.y+regY, x, y ); 
  } 
 
  void focus( float px, float py ) { 
    float dx = px-(parent.x+regX); 
    float dy = py-(parent.y+regY); 
 
    angle = atan2( dy, dx ); 
    radius = dist( px, py, parent.x+regX, parent.y+regY ); 
  } 
 
  void revertFocus() { 
    angle = origAngle; 
    radius = origRadius; 
  } 
} 