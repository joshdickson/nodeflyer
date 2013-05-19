/*
 * flyer.js
 *
 * @author Joshua Dickson
 * 
 * The main JavaScript file for the nodeflyer application. This file contains the
 * functionality to build the game engine and start animations, as well as add
 * additional elements such as event listeners to the page.
 */


/* A variable for holding this client's skyflyer */
var thisFlyer;

/* A variable for holding this client's skyflyer rendering image */
var thisFlyerImage;

/* A variable for holding other skyflyer images*/
var otherFlyerImage;

/* An array for holding information about other skyflyers in the swarm */
var swarm = new Array();

/* An array for holding information about targets this client has found as well
   as other targets known from swarm updates */
var targets = new Array();

/* A global variable to control animation of the canvas for future builds */
var motion;

/* A variable for holding the amount of damage done to a target when attacked by a 
   node flyer */
var damage = 0.6;



/* 
 * A function that, when the html document has been loaded, begins the game
 */
$(document).ready(function() {
	
	/*
	 * Configure this client's flyer object and flyer related attributes
	 */
	function configureFlyer() {
		thisFlyerImage = new Image();
		thisFlyerImage.src = '../img/fighter_active.png';
		otherFlyerImage = new Image();
		otherFlyerImage.src = '../img/fighter.png';
		thisFlyer = new Flyer();
	};

	/* 
	 * A function that configures the animation action for this client's flyer's
	 * flight
	 */
	function runThisFlyer() {
		motion = setTimeout(setInMotion, 30);
		function setInMotion() {
			makeMove();
			motion = setTimeout(setInMotion, 30);
		};
	};

	configureFlyer();
	doCanvasSetup('canvas');
	runThisFlyer();
	setupServerComm();
	setupEventListeners();
});

/* 
 * A function that constructs a Flyer object
 */
function Flyer() {
	this.rotationAngle = generateRandomWholeNumberFromZeroTo(360);
	this.travelDistance = 4;
	this.xCoord = 200;
	this.yCoord = 200;
	this.key = generateHexKeyOfLength(16);
	this.destination = -1;
}

/* 
 * A function that constructs a Target object
 */
function Target(x, y) {
	this.xCoord = x;
	this.yCoord = y;
	this.lives = 30;
	this.radius= 20;
	this.key = generateHexKeyOfLength(16);
	this.r = generateRandomWholeNumberFromZeroTo(255);
	this.g = generateRandomWholeNumberFromZeroTo(255);
	this.b = generateRandomWholeNumberFromZeroTo(255);
}

/* 
 * A function that instantiates a new target and announces the target's presence to
 * the server 
 */
function newTarget(x, y) {
	var newTarget = new Target(x, y);
	targets.push(newTarget);
	sendTarget(newTarget);
};

/*
 * A function that moves the plane from its current location to its next location
 */
function makeMove() {

	/* 
	 * A function that flys the plane on its current course with its current heading for its given 
	 * travel distance
	 */
	function fly() {
		thisFlyer.xCoord += thisFlyer.travelDistance * Math.cos(thisFlyer.rotationAngle.toRad());
		thisFlyer.yCoord += thisFlyer.travelDistance * Math.sin(thisFlyer.rotationAngle.toRad());
	}

	/* 
	 * A function that sets the current heading angle for this flyer depending on the location
	 * of this flyer's destination coordinates and the flyer coordinates
	 */
	function setHeadingTo(x, y) {
		positiveRotationAngle = 90 - (Math.atan2(x - thisFlyer.xCoord, y - thisFlyer.yCoord)).toDeg();
		thisFlyer.rotationAngle = normalizeDegreeValue(thisFlyer.rotationAngle);

		if(normalizeDegreeValue(positiveRotationAngle - thisFlyer.rotationAngle) < 180) {
			if(normalizeDegreeValue(positiveRotationAngle - thisFlyer.rotationAngle) < 5) {
				thisFlyer.rotationAngle += normalizeDegreeValue(positiveRotationAngle - thisFlyer.rotationAngle);
			} else {
				thisFlyer.rotationAngle += 5;
			}
		} else {
			thisFlyer.rotationAngle -= 5;
		}
	};

	/* 
	 * A function for checking the validity of the current flyers destination
	 */
	function checkDestination() {
		largestTargetIndex = -1;
		if(thisFlyer.destination < 0) {
			for(targetIndex = 0; targetIndex < targets.length; targetIndex++) {
				if(targets[targetIndex].lives > 0) { 
					if(largestTargetIndex == -1) {
						largestTargetIndex = targetIndex;
					} else if (targets[targetIndex].lives > targets[largestTargetIndex].lives) {
						largestTargetIndex = targetIndex;
					}
				}
			}
			thisFlyer.destination = largestTargetIndex;
		}
	}

	/* 
	 * Modify the current flyer's flight characteristics to keep it on track for its
	 * arrival at its destination
	 */
	function modifyFlightCharacteristics() {
		if(thisFlyer.destination > -1) {
			if(targets[thisFlyer.destination].lives >= 0) {
				setHeadingTo(targets[thisFlyer.destination].xCoord, targets[thisFlyer.destination].yCoord);
			} else {
				thisFlyer.destination = -1;
				setHeadingTo(250 + generateRandomWholeNumberFromZeroTo(500),250 + generateRandomWholeNumberFromZeroTo(500));
			}
		} else {
			setHeadingTo(250 + generateRandomWholeNumberFromZeroTo(500),250 + generateRandomWholeNumberFromZeroTo(500));
		}
	}

	/* 
	 * A function that damages targets that are located near the current flyer's position
	 */
	function hitNearTargets() {
		for(targetIndex = 0; targetIndex < targets.length; targetIndex++) {
			if(targets[targetIndex].lives > 0) {
				deltaX = targets[targetIndex].xCoord - thisFlyer.xCoord;
				deltaY = targets[targetIndex].yCoord - thisFlyer.yCoord;
				distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
				if(distance < 16) {
					targets[targetIndex].lives-= damage;
					targets[targetIndex].radius =  Math.round(20 * targets[targetIndex].lives / 30);
					sendTarget(targets[targetIndex]);
					thisFlyer.destination = -1;
				}
			}
		}
	}

	fly();	
	checkDestination();
	modifyFlightCharacteristics();
	hitNearTargets();
	draw();

};

/* A function that paints the HTML5 canvas */
function draw() {
	context.clearRect(0,0,canvas.width(),canvas.height());

	/* A function that draws the current targets */
	function drawTargets() {

		/* A function for drawing round shapes with colors representing targets */
		function drawThisTarget(aTarget) {
			var centerX = aTarget.xCoord;
			var centerY = canvas.height() - aTarget.yCoord;
			var radius = aTarget.radius ;
			context.beginPath();
	      	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	      	context.fillStyle = "rgba("+aTarget.r+","+aTarget.g+","+aTarget.b+",0.5)";
	      	context.fill();
	      	context.lineWidth = 3;
	      	context.strokeStyle = '#003300';
	      	context.stroke();
		}

		for(targetIndex = 0; targetIndex < targets.length; targetIndex++) {
			if(targets[targetIndex].lives > 0) {
				drawThisTarget(targets[targetIndex]);
			}	
		}
	}

	/* A function that draws active members of the swarm */
	function drawSwarm() {
		for(swarmIndex = 0; swarmIndex < swarm.length; swarmIndex++) {
			if(new Date().getTime() < (swarm[swarmIndex].lastUpdate + 150)) {
				drawRotatedImage(otherFlyerImage , swarm[swarmIndex].xCoord, (canvas.height() - swarm[swarmIndex].yCoord), 
				((-1 * swarm[swarmIndex].rotationAngle) + 90));
			}
		}
	}

	drawTargets();

	drawRotatedImage(thisFlyerImage , thisFlyer.xCoord, (canvas.height() - thisFlyer.yCoord), 
		((-1 * thisFlyer.rotationAngle) + 90));
	
	drawSwarm();

};
