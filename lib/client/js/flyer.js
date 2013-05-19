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
	playSound();
});

//sound variables and functions
var fighterSound = new Audio("../sounds/fighter_plane.wav"); // buffers automatically when created
var blastSound = new Audio("../sounds/blast_sound.wav"); // buffers automatically when created

function playSound()
{
	fighterSound.play();
	setTimeout(playSound, 10000);
}
/*************** CONSTANTS *****************/

var thisFlyer;
var thisFlyerImage;
var otherFlyerImage;
var swarm = new Array();
var targets = new Array();
var motion;

var headingX=500;
var headingY=500;

//Arsani- Maxmimum target radius and life
var maxRadius = 20.0;
var maxLives = 30.0;
var damage = 0.6;

function configureFlyer() {

	thisFlyerImage = new Image();
	thisFlyerImage.src = '../img/fighter_active.png';
	otherFlyerImage = new Image();
	otherFlyerImage.src = '../img/fighter.png';

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
	this.key = generateHexKeyOfLength(16);
	this.destination = -1;
}

function Target(x, y) {
	this.xCoord = x;
	this.yCoord = y;
	this.lives = maxLives;
	this.radius= maxRadius;
	this.key = generateHexKeyOfLength(16);

	this.r = generateRandomWholeNumberFromZeroTo(255);
	this.g = generateRandomWholeNumberFromZeroTo(255);
	this.b = generateRandomWholeNumberFromZeroTo(255);
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
			thisFlyer.rotationAngle += 3;
		} else {
			thisFlyer.rotationAngle -= 3;
		}
	};

	fly();	

	largestTargetIndex = -1;

	if(thisFlyer.destination < 0) {
		// if this flyer doesn't have a destination, assign it the largest target 
		
		for(targetIndex = 0; targetIndex < targets.length; targetIndex++) {
			
			if(targets[targetIndex].lives > 0) { 

				if(largestTargetIndex = -1) {
					largestTargetIndex = targetIndex;
					console.log('Assigning to the first with lives...');
				} else if (targets[targetIndex].lives > targets[largestTargetIndex].lives) {
					console.log('Found a larger target that\'s not the first one');
					largestTargetIndex = targetIndex;
				}

			}
		}

		thisFlyer.destination = largestTargetIndex;

	
	}

	if(thisFlyer.destination > -1) {

		// if the destination doesn't exist anymore (no more kills) just remove the destination
		if(targets[thisFlyer.destination].lives >= 0) {
			setHeadingTo(targets[thisFlyer.destination].xCoord, targets[thisFlyer.destination].yCoord);
		} else {
			thisFlyer.destination = -1;
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

			if(distance < 16) {
				//decrese life
				targets[targetIndex].lives-= damage;
				//decrease radius
				targets[targetIndex].radius =  Math.round(maxRadius * targets[targetIndex].lives / maxLives);
				console.log ("life = "+ targets[targetIndex].lives+ "/"+maxLives);
				console.log ("radius = "+ targets[targetIndex].radius);
				sendTarget(targets[targetIndex]);
				thisFlyer.destination = -1;
			}

		}
	}

	doTheDraw();

};

function doTheDraw() {
	context.clearRect(0,0,canvas.width(),canvas.height());

	// draw all of the targets
	for(targetIndex = 0; targetIndex < targets.length; targetIndex++) {
		if(targets[targetIndex].lives > 0) {

			//context.fillRect(targets[targetIndex].xCoord, canvas.height() - targets[targetIndex].yCoord, 4, 4);
			// draw circle!!
			// console.log(targets[targetIndex].lives);}
			drawThisTarget(targets[targetIndex]);
		}
	}

	// draw this flyer
	drawRotatedImage(thisFlyerImage , thisFlyer.xCoord, (canvas.height() - thisFlyer.yCoord), 
		((-1 * thisFlyer.rotationAngle) + 90));
	
	// draw all of the other flyers
	for(swarmIndex = 0; swarmIndex < swarm.length; swarmIndex++) {
		if(new Date().getTime() < (swarm[swarmIndex].lastUpdate + 150)) {
			drawRotatedImage(otherFlyerImage , swarm[swarmIndex].xCoord, (canvas.height() - swarm[swarmIndex].yCoord), 
			((-1 * swarm[swarmIndex].rotationAngle) + 90));
		}
	}

	function drawThisTarget(aTarget)
	{
		var centerX = aTarget.xCoord;
		var centerY = canvas.height() - aTarget.yCoord;
		var radius = aTarget.radius ;//* aTarget.lives / aTarget.maxLives;


		context.beginPath();
      	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      	context.fillStyle = "rgba("+aTarget.r+","+aTarget.g+","+aTarget.b+",0.5)";
      	context.fill();
      	context.lineWidth = 3;
      	context.strokeStyle = '#003300';
      	context.stroke();
	}


};
