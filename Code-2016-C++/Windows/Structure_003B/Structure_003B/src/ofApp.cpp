#include "ofApp.h"
#include "circle.h"

Circle *circles[numCircle];

void ofApp::setup() {
    ofSetBackgroundAuto(false);
    ofBackground(126);
    ofHideCursor();
    for (int i = 0; i < numCircle; i++) {
        circles[i] = new Circle(ofRandom(0, ofGetWidth()), ofRandom(0, ofGetHeight()),
                                ofRandom(20, 126),
                                ofRandom(-0.25, 0.25), ofRandom(-0.25, 0.25), i, circles,
                                ofGetWidth(), ofGetHeight());
    }
}

void ofApp::update() {

}

void ofApp::draw() {
    for (int i = 0; i < numCircle; i++) {
        circles[i]->update();
        circles[i]->move();
    }
}

