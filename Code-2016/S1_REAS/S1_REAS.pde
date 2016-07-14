/* 
   
   Structure 1 
   
   Every possible pairing of these sixteen curves: 

   ix = 1.0 - x
   
   [x^2][1.0-x^2][ix^2][1.0-ix^2]
   [x^3][1.0-x^3][ix^3][1.0-ix^3]
   [x^4][1.0-x^4][ix^4][1.0-ix^4]
   [x^5][1.0-x^5][ix^5][1.0-ix^5]
   
   Use the additive numeric values from each curve to set the 
   value of a series of horizontal lines from values of white 
   to black. 
 
   Restored by Casey Reas <http://reas.com> 
   22 June 2016 
   Processing v.3.1.1 <http://processing.org> 
   
   Implemented by Casey Reas <http://groupc.net> 
   10 April 2004 
   Processing v.68 <http://processing.org> 
 
*/ 
 
float x = 0.0; 
int numnubs; 
Nub[] nubs; 
 
void setup() 
{ 
  size(900, 360); 
  noStroke(); 
  fill(102); 
  colorMode(RGB, 2.0); 
  background(2.0, 2.0, 2.0); 
  frameRate(30.0); 
 
  nubs = new Nub[120]; 
  
  int pat1 = 1; 
  int pat2 = 2; 
 
  for(int i=0; i<120; i++) { 
    nubs[i] = new Nub(0, i*3, width, 3, pat1, pat2); 
    pat2++; 
    if(pat2 > 16) { 
      pat1 = pat1 + 1; 
      pat2 = pat1 + 1; 
    } 
  }
  noLoop();
} 
 
float dir = 1; 
 
void draw() 
{ 
  x += (0.005 * dir); 
  if(x >= 1.0 || x <= 0.0) { 
    dir = dir * -1; 
  } 
  
  for(int i=0; i<120; i++) { 
    nubs[i].update(x); 
    nubs[i].display(); 
  } 
} 
 
class Nub 
{ 
  int x, y;  // xpos, ypos 
  int w, h;  // width, height 
  float val; // current value 
  int pat1, pat2; // each Nub has two patterns 
  
  Nub(int x, int y, int w, int h, int pat1, int pat2) { 
    this.x = x; 
    this.y = y; 
    this.w = w; 
    this.h = h; 
    this.pat1 = pat1; 
    this.pat2 = pat2; 
  } 
  
  void update(float x) { 
    
    val = 0; 
    float ix = 1.0 - x;  // Inverse of X 
    println(ix);
    
    if(pat1 == 1 || pat2 == 1) { 
      val += x*x; 
    } 
    if(pat1 == 2 || pat2 == 2) { 
      val += 1.0 - x*x; 
    } 
    if(pat1 == 3 || pat2 == 3) { 
      val += ix*ix; 
    } 
    if(pat1 == 4 || pat2 == 4) { 
      val += 1.0 - ix*ix; 
    } 
    if(pat1 == 5 || pat2 == 5) { 
      val += x*x*x; 
    } 
    if(pat1 == 6 || pat2 == 6) { 
      val += 1.0 - x*x*x; 
    } 
    if(pat1 == 7 || pat2 == 7) { 
      val += ix*ix*ix; 
    } 
    if(pat1 == 8 || pat2 == 8) { 
      val += 1.0 - ix*ix*ix; 
    } 
    if(pat1 == 9 || pat2 == 9) { 
      val += x*x*x*x; 
    } 
    if(pat1 == 10 || pat2 == 10) { 
      val += 1.0 - x*x*x*x; 
    } 
    if(pat1 == 11 || pat2 == 11) { 
      val += ix*ix*ix*ix; 
    } 
    if(pat1 == 12 || pat2 == 12) { 
      val += 1.0 - ix*ix*ix*ix; 
    } 
    if(pat1 == 13 || pat2 == 13) { 
      val += x*x*x*x*x; 
    } 
    if(pat1 == 14 || pat2 == 14) { 
      val += 1.0 - x*x*x*x*x; 
    } 
    if(pat1 == 15 || pat2 == 15) { 
      val += ix*ix*ix*ix*ix; 
    } 
    if(pat1 == 16 || pat2 == 16) { 
      val += 1.0 - ix*ix*ix*ix*ix; 
    } 
 
  } 
  
  void display() { 
    fill(val); 
    rect(x, y, w, h); 
  } 
 
} 