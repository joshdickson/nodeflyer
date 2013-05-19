/*
 * flyer.js
 * @author Joshua Dickson
 */

$(document).ready(function() {
	configureFlyer();
	doCanvasSetup('canvas');
	runThisFlyer();
	setupServerComm();
	setupEventListeners();
});

/*************** CONSTANTS *****************/

var thisFlyer;
var thisFlyerImage;
var swarm = new Array();
var targets = new Array();
var motion;

var headingX=500;
var headingY=500;

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
	this.travelDistance = 6;
	this.xCoord = 200;
	this.yCoord = 200;
	this.key = generateHexKeyOfLength(16);
	this.destination = -1;
}

function Target(x, y) {
	this.xCoord = x;
	this.yCoord = y;
	this.lives = 30;
	this.key = generateHexKeyOfLength(16);
}


function newTarget(x, y) {
	var newTarget = new Target(x, y);
	targets.push(newTarget);
	sendTarget(newTarget);
};


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

	largestTargetIndex = -1;

	if(thisFlyer.destination < 0) {
		// if this flyer doesn't have a destination, assign it the largest target if one is > 0
		
		for(targetIndex = 0; targetIndex < targets.length; targetIndex++) {
			
			if(targets[targetIndex].lives > 0) {

				// init if necessary
				if(largestTargetIndex = -1) {
					largestTargetIndex = targetIndex;
				} else if (targets[targetIndex].lives > targets[largestTargetIndex]) {
					largestTargetIndex = targetIndex;
				}

			}
		}

		thisFlyer.destination = largestTargetIndex;

		// if we still didn't find any, no destination set
		// if we did find a largest target, add it to the destination
		// if(largestTargetIndex > -1) {
		// 	thisFlyer.destination = targets[largestTargetIndex];
		// }
	}

	if(thisFlyer.destination > -1) {

		// if the destination doesn't exist anymore (no more kills) just remove the destination
		if(targets[thisFlyer.destination].lives > -1) {
			setHeadingTo(targets[thisFlyer.destination].xCoord, targets[thisFlyer.destination].yCoord);

		} else {
			setHeadingTo(250 + generateRandomWholeNumberFromZeroTo(500),250 + generateRandomWholeNumberFromZeroTo(500));
		}

		// fly to the destination
		
	} else {
		// fly home to 500 500
		setHeadingTo(250 + generateRandomWholeNumberFromZeroTo(500),250 + generateRandomWholeNumberFromZeroTo(500));
	}



	// knock down the lives by 1 of any target this is in range of, if a change is made send the new Target object
	// back up to the server so the other flyers know
	for(targetIndex = 0; targetIndex < targets.length; targetIndex++) {
		if(targets[targetIndex].lives > 0) {
			deltaX = targets[targetIndex].xCoord - thisFlyer.xCoord;
			deltaY = targets[targetIndex].yCoord - thisFlyer.yCoord;

			distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

			if(distance < 10) {
				targets[targetIndex].lives--;
				sendTarget(targets[targetIndex]);
				thisFlyer.destination = -1;
			}

		}
	}

	doTheDraw();

};

function doTheDraw() {
	context.clearRect(0,0,canvas.width(),canvas.height());

	// draw this flyer
	drawRotatedImage(thisFlyerImage , thisFlyer.xCoord, (canvas.height() - thisFlyer.yCoord), 
		((-1 * thisFlyer.rotationAngle) + 90));
		context.fillRect(headingX-4, headingY-4, 4, 4);


	// draw all of the other flyers
	for(swarmIndex = 0; swarmIndex < swarm.length; swarmIndex++) {
		if(new Date().getTime() < (swarm[swarmIndex].lastUpdate + 150)) {
			drawRotatedImage(thisFlyerImage , swarm[swarmIndex].xCoord, (canvas.height() - swarm[swarmIndex].yCoord), 
			((-1 * swarm[swarmIndex].rotationAngle) + 90));
		}
	}

	// draw all of the targets
	for(targetIndex = 0; targetIndex < targets.length; targetIndex++) {
		if(targets[targetIndex].lives > 0) {
			context.fillRect(targets[targetIndex].xCoord, canvas.height() - targets[targetIndex].yCoord, 4, 4);
			// console.log(targets[targetIndex].lives);
		}
	}


	context.fillRect(199, 1000 - 199, 2, 2);
};
