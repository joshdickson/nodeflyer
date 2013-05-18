/*
 * input.js
 * @author Arsani gaied
 * this file will conatain all the event listeners for user input
 */


function setupEventListeners()
{

	canvas.on('mousedown',function(e)
	{
	        e.preventDefault();

	        var x = e.pageX - canvas.offset().left;
	        var y = e.pageY - canvas.offset().top;

	        newTarget (x,canvas.height()-y);

	        console.log ('new target x= '+x);
	        console.log ('new target y= '+y+'\n');

	        // Hide the instructions
	        //instructions.fadeOut();
    });
}