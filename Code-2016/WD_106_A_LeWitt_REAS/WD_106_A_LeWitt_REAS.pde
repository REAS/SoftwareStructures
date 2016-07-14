/* 
 
  106. Arcs from the midpoints of two sides of the wall. (ACG 8). 
  Black pencil. 
  First Drawn by: SL 
  Collection: Dr and Mrs Lorenzo 
  Bonomo, Spoleto, Italy. 
  August, 1971 
  
  Restored by Casey Reas <http://reas.com> 
  22 June 2016 
  Processing v.3.1.1 <http://processing.org> 
   
  Implemented as software by Casey Reas <http://groupc.net> 
  March, 2004 
  Processing v.68 <http://processing.org> 
  
*/ 
 
void setup() { 
  size(800, 600); 
  noFill(); 
  stroke(0); 
} 
 
void draw() { 
  background(255);
  int maximum_radius = int(dist(0, height/2, width, 0)); 
  int density = int(width/100.0); 
  for (int i=density; i<=maximum_radius; i+=density) { 
    ellipse(0, height/2, i, i); 
    ellipse(width, height/2, i, i); 
  } 
} 