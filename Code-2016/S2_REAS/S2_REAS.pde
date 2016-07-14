/* 
 
 Structure 2 
 
 A grid of points in the top half of the surface. 
 Each point moves downward and returns to the top when it falls off the 
 bottom edge. Beginning in the upper-left, each row and column moves 
 faster than the previous one. The speeds combine so that the point in the 
 upper-left is the slowest and the point in the lower-right is the 
 fastest. Copy and flip the grid across a central vertical axis and 
 display simultaneously. 
 
 Implemented by Casey Reas <http://groupc.net> 
 16 April 2004 
 Processing v.68 <http://processing.org> 
 
 */

Pixel[] pix; 

void setup() 
{ 
  size(800, 600); 
  pix = new Pixel[width/10 * height/20]; 
  frameRate(30); 

  for (int i=0; i<width/10; i++) { 
    for (int j=0; j<height/20; j++) { 
      pix[i*(height/20)+j] = new Pixel(i*10, j*10, i/100.0*j/100 * 8.0, true);
    }
  }
} 

void draw() 
{ 
  background(0); 
  for (int i=height/10; i<(height/20 * width/10); i++) { 
    pix[i].update(); 
    pix[i].display();
  }
} 

class Pixel 
{ 
  float x; 
  float y; 
  float speed; 
  boolean curve; 

  Pixel(float x, float y, float speed, boolean curve) { 
    this.x = x; 
    this.y = y; 
    this.speed = speed; 
    this.curve = curve;
  } 

  void update() { 
    y+=speed; 
    if (y > height) { 
      y = 0;
    }
  } 

  void display() { 
    stroke(255); 
    point(x, y+5); 
    point(width-x, y+5);
  }
} 