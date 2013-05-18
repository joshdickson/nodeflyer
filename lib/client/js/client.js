$(function()
{
	//update delay
	var delay = 1000;
	//timing var
	var timing = setTimeout(onTick, delay);

	var url = 'http://localhost:8080';

	var socket = io.connect(url);


	// array of all clients to draw
	var flyersList = new Array();

	// //random testing protocol
	// socket.on('serverInfo', function (info) 
	// {
	//     console.log("serverInfo " + info);
 // 	});

	//new client connection protocol
 	socket.on('clientUpdate', function (player) 
	{
		updateFlyers(info)
	    console.log("client update " + player);
 	});

	function updateFlyers(client)
	{
		//handle last updated 
		//draw
	}


	//server update function
 	function onTick()
 	{
 		socket.emit('clientData', thisFlyer);
 		timing = setTimeout(onTick, delay);
 	}
});