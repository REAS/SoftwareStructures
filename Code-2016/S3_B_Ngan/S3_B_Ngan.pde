/* 
   
   A surface filled with one hundred medium to small sized circles. 
   Each circle has a different size and direction, but moves at the same slow rate. 
   Display: 
   A. The instantaneous intersections of the circles 
   >>> B. The aggregate intersections of the circles 
 
   Restored by Casey Reas <http://reas.com> 
   22 June 2016 
   Processing v.3.1.1 <http://processing.org> 
   
   Implemented by William Ngan <http://metaphorical.net> 
   4 April 2004 
   Processing v.68 <http://processing.org> 
 
*/ 
 
 
float[][] field; 
int[][] fieldShade; 
int gaph, gapv; 
int marginh, marginv; // margin 
float cnt = 0; 
 
float[] sintable = new float[628]; 
float[] costable = new float[628]; 
final float PI2 = 2*PI; 
float tiltAngle = 0; 
 
Circle[] circles; 
 
float counter = 0; 
 
int cCounter = 0; 
int cTimer = 0; 
 
void setup() 
{ 
  size( 500, 500 ); 
  frameRate( 30 ); 
 
  gaph = 3; 
  gapv = 3; 
  marginh = 20; 
  marginv = 20; 
 
  // lookup table 
  for (int i=0; i<sintable.length; i++) { 
    sintable[i] = sin( i/100.0f ); 
  } 
 
  for (int i=0; i<costable.length; i++) { 
    costable[i] = cos( i/100.0f ); 
  } 
 
  // field 
  field = new float[(width-marginh*2)/gaph][(height-marginv*2)/gapv]; 
  fieldShade = new int[field.length][field[0].length]; 
 
  for (int i=0; i<field.length; i++) { 
    for (int k=0; k<field[0].length; k++) { 
      field[i][k] = PI2-PI/3; 
      fieldShade[i][k] = 1; 
    } 
  } 
 
  circles = new Circle[100]; 
 
  //ellipseMode( CENTER_DIAMETER ); 
  noFill(); 
} 
 
void draw() 
{ 
  background( 50 ); 
  stroke(255,255,255,50); 
 
  int ax, ay; 
  cTimer++; 
  if (cTimer>5 && cCounter<circles.length-1) { 
    circles[cCounter] = new Circle( 250, 250, 40, cCounter ); 
    cCounter++; 
    cTimer = 0; 
  } 
 
  float len = 10; 
 
  for (int i=0; i<field.length; i++) { 
    for (int k=0; k<field[0].length; k++) { 
      ax = marginh + i*gaph; 
      ay = marginv + k*gapv; 
      line( ax, ay, ax+len*getCos(field[i][k]), ay+len*getSin(field[i][k]) ); 
    } 
  } 
 
  noStroke(); 
  noFill(); 
 
  for (int i =0; i<cCounter; i++) { 
    circles[i].draw(); 
    circles[i].getGrid(); 
  } 
 
} 
 
int[] getLocation( int i, int k ) 
{ 
return new int[]{ marginh+i*gaph, marginv+k*gapv }; 
} 
 
float getSin( float val ) 
{ 
  if (val<0) val = 6.28 + val; 
  if (val>=6.28) val -= 6.28; 
  val = min( 6.27, max( 0, val ) ); 
  return sintable[ (int)floor(val*100) ]; 
} 
 
float getCos( float val ) 
{ 
  if (val<0) val = 6.28 + val; 
  if (val>=6.28) val -= 6.28; 
  val = min( 6.27, max( 0, val ) ); 
 
  return costable[ (int)floor(val*100) ]; 
} 
 
class Circle 
{ 
  float x, y, r, d, rr; 
  float ac1, ac2, ac3; 
  float sp1, sp2, sp3; 
  int id; 
 
  float inx = 0; 
  float iny = 0; 
  boolean over = true; 
 
  Circle( float px, float py, float pr, int id ) { 
    x = px; 
    y = py; 
    r = pr; 
    d = r*2; 
    rr = r*r; 
 
    this.id = id; 
 
    sp1 = random(2); 
    sp2 = random(2); 
    sp3 = random(2); 
 
    ac1 = random(0.5)-random(0.5); 
    ac2 = random(0.5)-random(0.5); 
    ac3 = random(0.5)-random(0.5); 
 
  } 
 
  void draw() { 
    move(); 
    ellipse( x, y, d, d ); 
  } 
 
  void move() { 
    float angle = sin( sp1 ) - cos(sp2); 
 
    sp1+=ac1; 
    sp2+=ac2; 
    sp3+=ac3; 
 
    angle = (angle<0) ? angle+PI2 : ( (angle>=PI2) ? angle-PI2 : angle ); 
 
    x = x + getSin(angle); 
    y = y + getCos(angle); 
 
    checkBounds(); 
    checkOverlap(); 
 
  } 
 
  void checkBounds() { 
    if ( x > width ) x = 0; 
    if ( x < 0 ) x = width; 
    if ( y > height ) y = 0; 
    if ( y < 0 ) y = height; 
  } 
 
  void repel( float angle ) { 
    x = x + getCos(angle)/10; 
    y = y + getSin(angle)/10; 
  } 
 
  void setState( float px, float py ) { 
    inx = px; 
    iny = py; 
    over = true; 
  } 
 
  void checkOverlap() { 
 
    for ( int i=id+1; i<cCounter; i++ ) { 
      if ( i!=id ) { 
        float dx = circles[i].x - x; 
        float dy = circles[i].y - y; 
        float drr = dx*dx + dy*dy; 
        float brr = circles[i].rr + 2*circles[i].r*r + rr; 
        float d = sqrt( drr ); 
 
        if ( d>r+circles[i].r || d<abs(r-circles[i].r) ) continue; // no solution 
 
        float ang = atan2( dy, dx ); 
        repel( ang+PI ); 
        circles[i].repel( ang); 
 
        float a = (rr - circles[i].rr + drr) / (2*d); 
        float h = sqrt( rr - a*a ); 
        float x2 = x + a*(circles[i].x - x)/d; 
        float y2 = y + a*(circles[i].y - y)/d; 
 
        setState( x2, y2 ); 
        circles[i].setState( x2, y2 ); 
      } 
    } 
  } 
 
  void getGrid() { 
 
    int sx = (int)ceil((x-r-marginh)/gaph); 
    int sy = (int)ceil((y-r-marginv)/gapv); 
 
    int numx = (int)floor(d/gaph); 
    int numy = (int)floor(d/gapv); 
 
    int[] pos; 
    float dx, dy, ang; 
 
    for (int i=sx; i<sx+numx; i++) { 
      if (i>=0 && i<field.length) { 
        for (int k=sy; k<sy+numy; k++) { 
          if (k>=0 && k<field[0].length) { 
            if (over) { 
              pos = getLocation(i, k); 
              dx = pos[0]-x; 
              dy = pos[1]-y; 
 
              if (dist( x, y, pos[0], pos[1]) < r) { 
                float da = atan2( pos[1]-iny, pos[0]-inx ); 
                if (field[i][k] < da) field[i][k] += PI/20; 
                else if (field[i][k] > da) field[i][k] -= PI/20; 
                fieldShade[i][k] = 2; 
              } 
            } 
          } 
        } 
      } 
    } 
    over = false; 
  } 
} 