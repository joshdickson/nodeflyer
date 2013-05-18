/*
 * flyer.js
 * @author Joshua Dickson
 */

$(document).ready(function() {
	configureFlyer();

	doCanvasSetup();
	
});

/*************** CONSTANTS *****************/
var WINDOW_MAX_WIDTH = 1000;
var WINDOW_MAX_HEIGHT = 1000;
var ZONE_MIN = 400;
var ZONE_MAX = 600;

var thisFlyer;

var thisFlyerImage;

function configureFlyer() {

	

	thisFlyerImage = new Image();
	thisFlyerImage.src = '../img/fighter.png';

	TO_RADIANS = Math.PI / 180;




	console.log('Configuring this flyer....');
	thisFlyer = new Flyer();
	var motion = setTimeout(setInMotion, 10);

	function setInMotion() {
		makeMove();
		motion = setTimeout(setInMotion, 10);
	};
}

var canvas;
var context;

function doCanvasSetup() {
	canvas = $('#canvas');
	context = canvas.get(0).getContext('2d');
}



/* 
 * A function that constructs a Flyer object
 */
function Flyer() {
	this.rotationAngle = getRandomNumber(360);
	this.travelDistance = 3;
	this.xCoord = 10;
	this.yCoord = 10;
}



function makeMove() {

	thisFlyer.xCoord += thisFlyer.travelDistance * Math.cos(thisFlyer.rotationAngle.toRad());
	thisFlyer.yCoord += thisFlyer.travelDistance * Math.sin(thisFlyer.rotationAngle.toRad());
	

	context.clearRect(0,0,canvas.width(),canvas.height());
	drawRotatedImage(thisFlyerImage, thisFlyer.xCoord, (canvas.height() - thisFlyer.yCoord), ((-1 * thisFlyer.rotationAngle) + 90));
	context.fillRect(498, 498, 4, 4);

	positiveRotationAngle = 90 - (Math.atan2(500 - thisFlyer.xCoord, 500 - thisFlyer.yCoord)).toDeg();
	// positiveRotationAngle += 180;

		deltaAngle = positiveRotationAngle - thisFlyer.rotationAngle;



		//do delta angle fix for 0 < da < 360
		while(deltaAngle > 360) {
			deltaAngle = deltaAngle - 360;
		}
		while(deltaAngle < 0) {
			deltaAngle = deltaAngle + 360;
		}

		while(thisFlyer.rotationAngle > 360) {
			thisFlyer.rotationAngle = thisFlyer.rotationAngle - 360;
		}
		while(thisFlyer.rotationAngle < 0) {
			thisFlyer.rotationAngle = thisFlyer.rotationAngle + 360;
		}

		// now DA between 0 and 360

		// if between 0 and 180 rotate one way else rotate the other way

		if(deltaAngle < 180) {
			thisFlyer.rotationAngle += .6;
		} else {
			thisFlyer.rotationAngle -= 0.6;
		}



}

function drawRotatedImage(image, x, y, angle) { 

		// save the current co-ordinate system 
		// before we screw with it
		context.save(); 

		// move to the middle of where we want to draw our image
		context.translate(x, y);

		// rotate around that point, converting our 
		// angle from degrees to radians 
		context.rotate(angle * Math.PI / 180);

		// draw it up and to the left by half the width
		// and height of the image 
		context.drawImage(image, -(image.width/2), -(image.height/2));

		// and restore the co-ords to how they were when we began
		context.restore(); 
	}



function getRandomNumber(max) {
	return Math.floor(Math.random() * (max + 1));
};


/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

if (typeof(Number.prototype.toDeg) === "undefined") {
  Number.prototype.toDeg = function() {
    return this * 180 / Math.PI;
  }
}