/*
 * flyer.js
 * @author Joshua Dickson
 */


$(document).ready(function() {
	configureFlyer();
	
});

/*************** CONSTANTS *****************/
var WINDOW_MAX_WIDTH = 1000;
var WINDOW_MAX_HEIGHT = 1000;
var ZONE_MIN = 400;
var ZONE_MAX = 600;

var thisFlyer;
var canvas;
var context;
var thisFlyerImage;
var TO_RADIANS;

function configureFlyer() {

	canvas = $('#canvas');
	context = canvas.get(0).getContext('2d');

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



/* 
 * A function that constructs a Flyer object
 */
function Flyer() {
	this.rotationAngle = getRandomNumber(360);
	// console.log('Setting the current rotation to: ' + this.rotationAngle + ' deg.');
	this.travelDistance = 0.2;
	this.xCoord = 0;
	this.yCoord = 0;
}



function makeMove() {

	thisFlyer.xCoord += 3 * Math.cos(thisFlyer.rotationAngle.toRad());
	thisFlyer.yCoord += 3 * Math.sin(thisFlyer.rotationAngle.toRad());
	
	console.log('X: ' + thisFlyer.xCoord + '  Y: ' + thisFlyer.yCoord + '  Rot: ' + thisFlyer.rotationAngle);

	context.clearRect(0,0,canvas.width(),canvas.height());
	drawRotatedImage(thisFlyerImage, thisFlyer.xCoord, (canvas.height() - thisFlyer.yCoord), ((-1 * thisFlyer.rotationAngle) + 90));
	context.fillRect(498, 498, 4, 4);

	console.log('Vector to 500,500 - (' + (500 - thisFlyer.yCoord) + ', ' + (500 - thisFlyer.xCoord) + ')');

	// console.log(X)

	// var angleToCenter = 180 + (180 / Math.PI * Math.atan2(500 - thisFlyer.yCoord, 500 - thisFlyer.xCoord));

	// var deltaAngle = angleToCenter - thisFlyer.rotationAngle;
	// console.log(deltaAngle);

	// if(thisFlyer.xCoord < 400 || thisFlyer.xCoord > 600 || thisFlyer.yCoord < 400 || thisFlyer.yCoord > 600) {

		positiveRotationAngle = 270 - (180 / Math.PI * Math.atan2(500 - thisFlyer.xCoord, 500 - thisFlyer.yCoord));
		positiveRotationAngle += 180;



		// difference between angle to center and current
		deltaAngle = positiveRotationAngle - thisFlyer.rotationAngle;

		// while(deltaAngle > 360) {
		// 	deltaAngle -= 360;
		// }

		console.log('I need to turn this far to fly to target: ' + deltaAngle);

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
			thisFlyer.rotationAngle += 1;
		} else {
			thisFlyer.rotationAngle -= 1;
		}

		



	// // change the rotationAngle
	// if(deltaAngle > 1) {
	// 	thisFlyer.rotationAngle += 1;
	// } else if(deltaAngle < -1) {
	// 	thisFlyer.rotationAngle -= 1;
	// }

	// while(thisFlyer.rotationAngle > 360) {
	// 	thisFlyer.rotationAngle -= 360;
	// } 

	// while (thisFlyer.rotationAngle < -360) {
	// 	thisFlyer.rotationAngle += 360;
	// }

	// }


}

function drawRotatedImage(image, x, y, angle) { 

		// save the current co-ordinate system 
		// before we screw with it
		context.save(); 

		// move to the middle of where we want to draw our image
		context.translate(x, y);

		// rotate around that point, converting our 
		// angle from degrees to radians 
		context.rotate(angle * TO_RADIANS);

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