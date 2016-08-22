#include "Circle.h"

Circle::Circle(float px, float py, float pr, float psp, float pysp, int pid, Circle *circles[numCircle], int pw, int ph) {
    x = px;
    y = py;
    r = pr;
    r2 = r * r;
    xSpeed = psp;
    ySpeed = pysp;
    id = pid;
    others = circles;
    width = pw;
    height = ph;
}

void Circle::update() {
    for (int i = id+1; i < numCircle; i++) {
        intersect( others[id], others[i] );
    }
}

void Circle::move() {
    x += xSpeed;
    y += ySpeed;

    if(xSpeed > 0) {
        if (x > width+r) {
            x = -r;
        }
    } else {
        if (x < -r) {
            x = width+r;
        }
    }
    
    if(ySpeed < 0) {
        if (y < -r) {
            y = height+r;
        }
    } else {
        if (y > height+r) {
            y = -r;
        }
    }
}

void Circle::intersect(Circle *cA, Circle *cB) {
    float dx = cA->x - cB->x;
    float dy = cA->y - cB->y;
    float d2 = dx*dx + dy*dy;
    float d = sqrt( d2 );
    
    if ( d > (cA->r + cB->r) || d < (fabs(cA->r - cB->r)) ) {
        return;  // No solution
    }

    float a = (cA->r2 - cB->r2 + d2) / (2*d);
    float h = sqrt( cA->r2 - a*a );
    float x2 = cA->x + a*(cB->x - cA->x)/d;
    float y2 = cA->y + a*(cB->y - cA->y)/d;
    
    float paX = x2 + h*(cB->y - cA->y)/d;
    float paY = y2 - h*(cB->x - cA->x)/d;
    float pbX = x2 - h*(cB->y - cA->y)/d;
    float pbY = y2 + h*(cB->x - cA->x)/d;
    
    float dist = distance(paX, paY, pbX, pbY);
    float gray = 255 - dist;
    ofSetColor(gray, gray, gray, 20);
    ofDrawLine(paX, paY, pbX, pbY);
} 

float Circle::distance(float x1, float y1, float x2, float y2) { 
	return sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)); 
}