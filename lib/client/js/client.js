/*
 * client.js
 * 
 * @author Arsani Gaied, Joshua Dickson
 *
 * A file that provides functionality for working with node.js sockets via sockets.io 
 */



/*
 * A global variable that holds the socket this client is using for communication with the
 * node.js server implementation
 */
var socket;




/* 
 * A function that contains logic and utilities to set up the socket used to communicate
 * with the node server as well as begin the timed update events
 */
function setupServerComm() {
	var pushServerCall = setTimeout(pushThisFlyerToServer, 30);
	socket = io.connect('http://localhost:8080');
	
 	socket.on('clientUpdate', function (serverDataRec) {
		updateThisFlyerWithIncomingData(serverDataRec);
 	});

	/* 
	 * A function that updates information from the swarm for this client
	 */
	function updateThisFlyerWithIncomingData(flyer) {

		/* 
		 * A function that updates this client's swarm with information about another
		 * node flyer
		 */
		function updateSwarm(flyer) {
			flyer.lastUpdate = new Date().getTime();
			for(flyerCounter = 0; flyerCounter < swarm.length; flyerCounter++) {
				if(swarm[flyerCounter].key == flyer.key) {
					swarm[flyerCounter] = flyer;
					return;
				}
			};
			swarm.push(flyer);
		};

		/* 
		 * A function that updates this client's target list with information about
		 * a target received from the swarm
		 */
		function updateTargets(target) {
			for(targetCounter = 0; targetCounter < targets.length; targetCounter++) {
				if(targets[targetCounter].key == target.key) {
					targets[targetCounter] = target;
					return;
				}
			};
			targets.push(target);
		};

		if( flyer.rotationAngle ) {
			updateSwarm(flyer);
		} else if( flyer.lives ) {
			updateTargets(flyer);
		}
	};

	//server update function
 	function pushThisFlyerToServer() {
 		socket.emit('clientData', thisFlyer);
 		pushServerCall = setTimeout(pushThisFlyerToServer, 30);
 	};
};

/* 
 * A function used to send target data to the server 
 */
function sendTarget(target) {
	socket.emit('clientData', target);
};
