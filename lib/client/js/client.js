$(function()
{
	var delay = 1000;
	var timing = setTimeout(onTick, delay);

	var url = 'http://localhost:8080';

	var socket = io.connect(url);

	socket.on('serverInfo', function (info) 
	{
	    console.log("serverInfo " + info);
 	});


	var cData = "client.js data ";

 	function onTick()
 	{
 		socket.emit('clientData', cData);
 		timing = setTimeout(onTick, delay);
 	}
});