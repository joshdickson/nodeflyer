/**
 * rendering-engine.js
 * Joshua Dickson
 */

$(document).ready(function() {
	setLayouts();
	
	$(window).load(function() {
		doResize();
		doMockFloats();
		implementMobileChanges();
		doFinalMarginAdjustments();	
		resizeTextAreasWithAutoResize();
				
	});	
});


/**
 * A function that sets all of the layout and fixed element information on the page
 */
function setLayouts() {
	setPageLayout();
	doContainerManipulations();
	setFixed('percent');
	setFixed('px');
	
};

/**
 * A function that resizes elements that are layout-dependent in their rendering
 */
function doResize() {
	resizeImages();
	resizeSlaves();
	resizeMax();
};

/**
 * A function that performs mock floats, including floating to the right and to the bottom of
 * a container element
 */
function doMockFloats() {
	doInlineBlockMockFloats();
	doVerticalPaddingManipulations();
};

/**
 * A function that performs any final, layout-dependent margin changes after all other page elements
 * have been rendered
 */
function doFinalMarginAdjustments() {
	alignVerticalMiddleWithMargin();
	alignAbsoluteInsideRelativeTest();
};

