#include "ofApp.h"

#ifndef _Circle_H_
#define _Circle_H_

#define numCircle 200

class Circle
{
public:
    
    float x, y, r, r2, xSpeed, ySpeed;
    int id;
    
    Circle **others;
    
    Circle();
    Circle(float, float, float, float, float, int, Circle *[numCircle], int, int);
    void update();
    void move();
    void makePoint();
    void intersect(Circle *, Circle *);
    float distance(float, float, float, float);
    
}; 

#endif

