/*
 * mockfloat.js
 * 
 * A file that provides utility binding functionality for performing mock floats on elements
 * with javascript that may change properties while on the page.
 */
/**
 * Perform mock float: bottom and float: middle for elements in their parent
 */
function doVerticalPaddingManipulations() {
	floatMiddle();
	floatBottom();
};

function floatMiddle() {
	function doFloatMiddle(element) {
		var parentChildVerticalDelta = parseInt(element.parent().height()) - parseInt(element.height());
		element.css('padding-top', ((parentChildVerticalDelta / 2) + 'px'));
	}
	$('.display-vertically-centered').each(function(){
		$(this).on('propertychange', function() {
			doFloatMiddle($(this));
		});
		$(this).trigger('propertychange');
	});
}


function floatBottom() {
	
	function doFloatBottom(element) {
		var parentChildVerticalDelta = parseInt(element.parent().height()) - parseInt(element.height());
		element.css('padding-top', ((parentChildVerticalDelta) + 'px'));
	};
	
	$('.display-vertically-at-bottom').each(function(){
		$(this).on('propertychange', function() {
			doFloatBottom($(this));
		});
		$(this).trigger('propertychange');
	});
};

