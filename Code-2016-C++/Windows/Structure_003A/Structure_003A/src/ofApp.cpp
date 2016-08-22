#include "ofApp.h"
#include "circle.h"

Circle *circles[numCircle];

void ofApp::setup() {
    ofBackground(255);
    ofHideCursor();
    for (int i = 0; i < numCircle; i++) {
        circles[i] = new Circle(ofRandom(0, ofGetWidth()), ofRandom(0, ofGetHeight()),
                                ofRandom(20, 126),
                                ofRandom(-0.5, 0.5), ofRandom(-0.5, 0.5), i, circles,
                                ofGetWidth(), ofGetHeight());
    }
}

void ofApp::update() {

}

void ofApp::draw() {
    for (int i = 0; i < numCircle; i++) {
        circles[i]->update();
        circles[i]->move();
        circles[i]->makePoint();
    }
}

