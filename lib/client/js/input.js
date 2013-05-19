/*
 * input.js
 *
 * @author Arsani Gaied
 *
 * This file contains functionality for setting up the target set up functions bound
 * to user input.
 */

/* 
 * A function to set up event listeners to place targets onto the canvas
 */
function setupEventListeners() {

	/* 
	 * Bind a mouse click event on the canvas to set up a new target at the location of the 
	 * mouse click
	 */
	canvas.on('mousedown',function(e) {
	        e.preventDefault();
	        newTarget(e.pageX - canvas.offset().left,canvas.height()-(e.pageY - canvas.offset().top));
    });
};