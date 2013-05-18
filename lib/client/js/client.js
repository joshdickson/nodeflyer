var socket;

function setupServerComm() {
	var timing = setTimeout(onTick, 30);
	socket = io.connect('http://localhost:8080');
	

 	socket.on('clientUpdate', function (flyer) 
	{
		updateSwarmFlyer(flyer);
	    // console.log("Heard from flyer " + flyer.key + 
	    // 	" at position: " + flyer.xCoord + ',' + flyer.yCoord);
 	});

	function updateSwarmFlyer(flyer) {

		// Update the received flyer in this client's list of other flyers
		function updateSwarm(flyer) {
			// console.log('Got a flyer log...');
			flyer.lastUpdate = new Date().getTime();
			for(flyerCounter = 0; flyerCounter < swarm.length; flyerCounter++) {
				if(swarm[flyerCounter].key == flyer.key) {
					swarm[flyerCounter] = flyer;
					return;
				}
			};
			swarm.push(flyer);
			return;
		};

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
 	function onTick() {
 		socket.emit('clientData', thisFlyer);
 		timing = setTimeout(onTick, 30);
 	};
};

function sendTarget(target) {
	socket.emit('clientData', target);
};
