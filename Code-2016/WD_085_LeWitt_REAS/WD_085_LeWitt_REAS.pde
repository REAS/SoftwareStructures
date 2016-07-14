/* 
 
  85. Same as 63, but with four colors. 
  
  63. A Wall is divided into four horizontal 
  parts. In the top row are four equal divisions, 
  each with with lines in a different direction. 
  In the second row, six double combinations; 
  in the third row, four triple combinations; 
  in the bottom row, all four combinations 
  superimposed. 
  
  Restored by Casey Reas <http://reas.com> 
  22 June 2016 
  Processing v.3.1.1 <http://processing.org> 
   
  Implemented as software by Casey Reas <http://groupc.net> 
  March, 2004 
  Processing v.68 <http://processing.org> 
  
  Colors adjusted for RGB (additive color model) 
  
*/ 
 
void setup() 
{ 
  size(768, 768); 
  noFill(); 
  background(255); 
} 
 
void draw() 
{ 
  float x1 = 0; 
  float x2 = width/4; 
  float y1 = 0; 
  float y2 = height/4; 
  horizonal(x1, x2, y1, y2); 
  
  x1 = x2; 
  x2 = x2 + width/4; 
  vertical(x1, x2, y1, y2); 
  
  x1 = x2; 
  x2 = x2 + width/4; 
  leftDiagonal(x1, x2, y1, y2); 
  
  x1 = x2; 
  x2 = x2 + width/4; 
  rightDiagonal(x1, x2, y1, y2); 
  
  
  // Row two 
  
  x1 = 0; 
  x2 = width/6; 
  y1 = height/4; 
  y2 = y1 + height/4; 
  horizonal(x1, x2, y1, y2); 
  vertical(x1, x2, y1, y2); 
  
  x1 = x2; 
  x2 = width/3; 
  horizonal(x1, x2, y1, y2); 
  leftDiagonal(x1, x2, y1, y2); 
  
  x1 = x2; 
  x2 = width/2; 
  horizonal(x1, x2, y1, y2); 
  rightDiagonal(x1, x2, y1, y2); 
  
  x1 = x2; 
  x2 = width/2+width/6; 
  vertical(x1, x2, y1, y2); 
  leftDiagonal(x1, x2, y1, y2); 
  
  x1 = x2; 
  x2 = width/2+width/3; 
  vertical(x1, x2, y1, y2); 
  rightDiagonal(x1, x2, y1, y2); 
  
  x1 = x2; 
  x2 = width; 
  leftDiagonal(x1, x2, y1, y2); 
  rightDiagonal(x1, x2, y1, y2); 
  
  // Row three 
  x1 = 0; 
  x2 = width/4; 
  y1 = height/2; 
  y2 = height - height/4; 
  horizonal(x1, x2, y1, y2); 
  leftDiagonal(x1, x2, y1, y2); 
  vertical(x1, x2, y1, y2); 
  
  x1 = x2; 
  x2 = width/2; 
  horizonal(x1, x2, y1, y2); 
  rightDiagonal(x1, x2, y1, y2); 
  vertical(x1, x2, y1, y2); 
  
  x1 = x2; 
  x2 = width/2+width/4; 
  horizonal(x1, x2, y1, y2); 
  leftDiagonal(x1, x2, y1, y2); 
  rightDiagonal(x1, x2, y1, y2); 
  
  x1 = x2; 
  x2 = width; 
  vertical(x1, x2, y1, y2); 
  leftDiagonal(x1, x2, y1, y2); 
  rightDiagonal(x1, x2, y1, y2); 
  
  // Row four 
  
  x1 = 0; 
  x2 = width; 
  y1 = height - height/4; 
  y2 = height; 
  horizonal(x1, x2, y1, y2); 
  vertical(x1, x2, y1, y2); 
  leftDiagonal(x1, x2, y1, y2); 
  rightDiagonal(x1, x2, y1, y2); 
} 
 
void horizonal(float x1, float x2, float y1, float y2) 
{ 
  stroke(0); 
  int increment = 4; 
  for(int i=int(y1); i<=y2; i+=increment) { 
    line(x1, i, x2, i); 
  } 
} 
 
void vertical(float x1, float x2, float y1, float y2) 
{ 
  stroke(255, 0, 0); 
  int increment = 4; 
  stroke(0, 255, 0); 
  for(int i=int(x1); i<=x2; i+=increment) { 
    line(i, y1, i, y2); 
  } 
} 
 
void leftDiagonal(float x1, float x2, float y1, float y2) 
{ 
  // This code is not general and only works for 
  // square and horizontal display areas 
  
  int increment = 6; 
  stroke(0, 0, 255); 
  float w = x2 - x1; 
  float p = dist(0, 0, w, w); 
 
  for(int i=0; i<=w; i+=increment) { 
 
    // Upper left corner 
    if(i <= y2-y1) { 
      line(x1, y1+i, x1+i, y1); 
    } 
    
    // Middle filler for vertical areas 
    if(y2-y1 > x2-x1 && y2-i-w > y1) { 
      //line(x1, y2-i, x2, y1+w-i); 
      line(x1, y2-i, x2, y2-i-w); 
    } 
    
    // Middle filler for horizontal areas 
    if(x2-x1 > y2-y1) { 
      line(x1+i, y2, x1+i+y2-y1, y1); 
    } 
    
    // Lower right corner 
    if(w-i < y2-y1) {  
      line(x1+i, y2, x2, y2-(w-i)); 
    } 
    
  } 
} 
 
void rightDiagonal(float x1, float x2, float y1, float y2) 
{ 
  // This code is not general and only works for 
  // square and horizontal display areas 
 
  int increment = 6; 
  stroke(255, 0, 0); 
  float w = x2 - x1; 
    
  for(int i=0; i<=w; i+=increment) { 
 
    // Upper right corner 
    if(w-i < y2-y1) {  
      line(x1+i, y1, x2, y1+(w-i)); 
    } 
    
    // Lower left corner 
    if(y2-i >= y1) { 
      line(x1, y2-i, x1+i, y2); 
    } 
    
    // Middle filler vertical 
    if(y2-y1 > x2-x1 && y1+w+i < y2) { 
      line(x1, y1+i, x2, y1+w+i); 
    } 
    
    // Middle filler horizontal 
    if((x2-x1 > y2-y1) && (i <= w-(y2-y1))) { 
      line(x1+i, y1, x1+i+y2-y1, y2); 
    } 
    
  } 
} 