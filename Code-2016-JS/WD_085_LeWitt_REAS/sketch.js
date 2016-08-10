/* 
 
  85. Same as 63, but with four colors. 
  
  63. A Wall is divided into four horizontal 
  parts. In the top row are four equal divisions, 
  each with with lines in a different direction. 
  In the second row, six double combinations; 
  in the third row, four triple combinations; 
  in the bottom row, all four combinations 
  superimposed. 
  
  Ported to p5.js by Casey Reas
  11 July 2016
  p5.js 0.5.2
  
  Restored by Casey Reas <http://reas.com> 
  22 June 2016 
  Processing v.3.1.1 <http://processing.org> 
   
  Implemented as software by Casey Reas 
  March, 2004 
  Processing v.68 <http://processing.org> 
  
  Colors adjusted for RGB (additive color model) 
  
*/ 

function setup() {

  createCanvas(768, 768); 
  noFill(); 
  background(255); 
     
  var x1 = 0; 
  var x2 = width/4; 
  var y1 = 0; 
  var y2 = height/4; 
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

function horizonal(x1, x2, y1, y2) { 
  stroke(0); 
  var increment = 4; 
  for (i = y1; i <= y2; i += increment) { 
    line(x1, i, x2, i); 
  } 
} 

function vertical(x1, x2, y1, y2) { 
  stroke(255, 0, 0); 
  var increment = 4; 
  stroke(0, 255, 0); 
  for (i = x1; i <= x2; i += increment) { 
    line(i, y1, i, y2); 
  } 
} 
 
function leftDiagonal(x1, x2, y1, y2) { 
  // This code is not general and only works for 
  // square and horizontal display areas 
  
  var increment = 6; 
  stroke(0, 0, 255); 
  var w = x2 - x1; 
  var p = dist(0, 0, w, w); 
 
  for(i = 0; i <= w; i += increment) { 
 
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
 
function rightDiagonal(x1, x2, y1, y2) { 
  // This code is not general and only works for 
  // square and horizontal display areas 
 
  var increment = 6; 
  stroke(255, 0, 0); 
  var w = x2 - x1; 
    
  for (i = 0; i <= w; i += increment) { 
 
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