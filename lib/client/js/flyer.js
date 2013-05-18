/*
 * flyer.js
 * @author Joshua Dickson
 */

$(document).ready(function() {
	configureFlyer();
	doCanvasSetup('canvas');
	runThisFlyer();
});

/*************** CONSTANTS *****************/

var thisFlyer;
var thisFlyerImage;

var motion;

function configureFlyer() {

	thisFlyerImage = new Image();
	thisFlyerImage.src = '../img/fighter.png';

	thisFlyer = new Flyer();
	
};

function runThisFlyer() {
	motion = setTimeout(setInMotion, 30);
	function setInMotion() {
		makeMove();
		motion = setTimeout(setInMotion, 30);
	};
};



/* 
 * A function that constructs a Flyer object
 */
function Flyer() {
	this.rotationAngle = generateRandomWholeNumberFromZeroTo(360);
	this.travelDistance = 4;
	this.xCoord = 200;
	this.yCoord = 200;
}


/*
 * A function that moves the plane from its current location to its next location
 */
function makeMove() {

	// Fly the plane on its current course with its current heading for its given travel distance
	function fly() {
		thisFlyer.xCoord += thisFlyer.travelDistance * Math.cos(thisFlyer.rotationAngle.toRad());
		thisFlyer.yCoord += thisFlyer.travelDistance * Math.sin(thisFlyer.rotationAngle.toRad());
	}

	// Set the heading of this plane to fly it in the direction of the given (x, y) coordinate
	function setHeadingTo(x, y) {
		positiveRotationAngle = 90 - (Math.atan2(x - thisFlyer.xCoord, y - thisFlyer.yCoord)).toDeg();
		thisFlyer.rotationAngle = normalizeDegreeValue(thisFlyer.rotationAngle);

		if(normalizeDegreeValue(positiveRotationAngle - thisFlyer.rotationAngle) < 180) {
			thisFlyer.rotationAngle += 2;
		} else {
			thisFlyer.rotationAngle -= 2;
		}
	};

	fly();	
	setHeadingTo(500, 500);

	context.clearRect(0,0,canvas.width(),canvas.height());
	drawRotatedImage(thisFlyerImage , thisFlyer.xCoord, (canvas.height() - thisFlyer.yCoord), 
		((-1 * thisFlyer.rotationAngle) + 90));
	context.fillRect(498, 498, 4, 4);

};
