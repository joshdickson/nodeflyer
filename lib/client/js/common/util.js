/**
 * Set elements of the page layout and variables pertaining to the size of the page to be
 * displayed in the user's browser
 */
function setPageLayout() {
	var pageWidth = parseInt($(window).width());
	pageWidth = checkValueAgainstMaxAndMin(pageWidth, MAXIMUMPAGEWIDTH, MINIMUMPAGEWIDTH);
	setCSSLayoutVariables(pageWidth);
	appendStyleSheet("./css/typography/" + cssLayoutString + ".css");
	setCSSAttribute('#page-wrapper', 'width', pageWidth + 'px');	
};


/**
 * Set a variable compared to its minimum and maximum and return the result. If the variable 
 * is greater than its maximum, it is set to its maximum value. Similarly, if the variable is 
 * less than its mimimum, it is set to its minimum.
 * @param value the variable to compare
 * @param maximum the variable's maximum value
 * @param minimum the variable's minimum value
 * @returns the variable with its value changed, if a change has been made
 */
function checkValueAgainstMaxAndMin(value, maximum, minimum) {
	switch (true) {
		case (value > maximum):
			value = maximum;
			break;
		case (value < minimum):
			value = minimum;
			break;
	}
	return value;
};

/**
 * A function that resizes an element with a class of 'max-width' to the same width as
 * this element's parent.
 */
function resizeMax() {
	$('.max-width').each(function(){
		$(this).css('width', $(this).parent().width() + 'px');
	});
};


/**
 * Return an array of elements that contain a givenClassName somewhere in their full class name
 * @param partialClassName the name to check for in the full class name
 * @returns an array of elements
 */
function getElementsWithPartialClassName(partialClassName) {
	return $("*[class*='" + partialClassName + "']");
};


/**
 * Set the CSSLayout variables from the given pageWidth
 * @param pageWidth a value representing the current width of the page
 */
function setCSSLayoutVariables(pageWidth) {
	switch (true) {
	case(pageWidth < MOBILEWIDTHMAXIMUM):
		cssLayoutString = 'mobile';
		cssLayoutIndex = 3;
		break;
	case(pageWidth < TABLETSMALLWIDTHMAXIMUM):
		cssLayoutString = 'tablet-small';
		cssLayoutIndex = 2;
		break;
	case(pageWidth < TABLETLARGEWIDTHMAXIMUM):
		cssLayoutString = 'tablet-large';
		cssLayoutIndex = 1;
		break;
	default:
		cssLayoutString = 'desktop';
		cssLayoutIndex = 0;
		break;
	}
};


/**
 * Append a stylesheet with the given href string to the head of the DOM
 * @param href the href path of the stylesheet to append to the DOM, including extension 
 * 		(*.css, etc)
 */
function appendStyleSheet(href) {
	$('head').append('<link rel="stylesheet" type="text/css" href="' + href + '">');
};


/** 
 * Set a CSS attribute with a given value on an element 
 * @param element
 * @param attribute
 * @param value
 */
function setCSSAttribute(element, attribute, value) {
	$(element).css(attribute, value);
};


/**
 * Resize an image from the image's true size (as opposed to seting it based upon a container size!)
 */
function resizeImages() {	
	
	var images = getElementsWithPartialClassName('imagepercentflag');
			
	for(var imageIndex = 0; imageIndex < images.length; imageIndex++) {
		var classNames = images[imageIndex].className.split(' ');
		
		for(var classNameIndex = 0; classNameIndex < classNames.length; classNameIndex++) {
			if(classNames[classNameIndex].startsWith('imagepercentflag')) {
				
				var tokens = classNames[classNameIndex].split('-');					
				
				$(images[imageIndex]).css('height', 'auto');
				$(images[imageIndex]).css('width', 'auto');
													
				$(images[imageIndex]).css(tokens[1], (images[imageIndex].offsetWidth * 
						tokens[(cssLayoutIndex + 2)] / 100));
				
			}
		}
	};
};


/**
 * Search for elements in the DOM that are fixed and with a given unit, and set them
 * @param unit the unit to use to search for and assign values (px, percent, em, etc)
 */
function setFixed(unit) {
	var elements = getElementsWithPartialClassName('fixed' + unit);
	
	for(var elementIndex = 0; elementIndex < elements.length; elementIndex++) {
		var classNames = elements[elementIndex].className.split(' ');
		
		for(var classNameIndex = 0; classNameIndex < classNames.length; classNameIndex++) {
			if(classNames[classNameIndex].startsWith('fixed' + unit)) {
				
				var tokens = classNames[classNameIndex].split('-');	
				
				if(tokens.length == 7) {
					tokens[1] = tokens[1] + '-' + tokens[2];
					tokens.splice(2, 1);
				}
				
				if(unit == 'percent') {
					$(elements[elementIndex]).css(tokens[1], (tokens[(cssLayoutIndex + 2)] + '%'));
				} else {														
					$(elements[elementIndex]).css(tokens[1], (tokens[(cssLayoutIndex + 2)] + unit));
				}
			}
		}
	}
};

/**
 * Perform a mock float right on the second inline-block element in a parent
 * May have bug in the call to get the parents width and factor in just 'padding'
 */
function doInlineBlockMockFloats() {	
	
	var elements = getElementsWithPartialClassName('second-element-force-right');
	
	for(var elementIndex = 0; elementIndex < elements.length; elementIndex++) {
		var children = $(elements[elementIndex]).children();
		
		if(children.length == 2) {
			var elementOneWidth = $(children[0]).outerWidth(true);
			var elementTwoWidth = $(children[1]).outerWidth(true);
			var parentWidth = $(elements[elementIndex]).outerWidth() - (2 * parseFloat($(elements[elementIndex]).css('padding')));			

			if((parentWidth - elementOneWidth - elementTwoWidth) > 0) {
				$(children[1]).css('margin-left', ((parentWidth - elementOneWidth - elementTwoWidth - 1) + 'px'));
			}	
		}
	}
};


/**
 * Resize the last element inside a parent div to the maximum space remaining, if the last
 * element's natural size would otherwise be too large to fit in the remaining space
 */
function resizeSlaves() {
	var elements = $("*[class*='last-element-size-slave']");
	
	for(var elementIndex = 0; elementIndex < elements.length; elementIndex++) {
		
		var children = $(elements[elementIndex]).children();
		var nonSlaveWidthSum = 0;
				
		for(var childId = 0; childId < (children.length - 1); childId++) {
			nonSlaveWidthSum += $(children[childId]).outerWidth(true);
		}
		
		var parentWidth = $(elements[elementIndex]).parent().width();
		var maxWidth = parentWidth - nonSlaveWidthSum;
		
		if($(children[children.length - 1]).outerWidth(true) > maxWidth) {
			$(children[children.length - 1]).css('width', (maxWidth - 0));
		}
	}
};

/**
 * TODO - mobile refactoring here
 * Set page layout changes for elements that are adjusted when viewed on small screens
 * (any devices with a width that would place it in the tablet-small or mobile categories)
 */
function implementMobileChanges() {
		
		var elements = $("*[class*='mobile-block']");
		
		for(var elementIndex = 0; elementIndex < elements.length; elementIndex++) {
			if(cssLayoutIndex > 1) {
				parentWidth = $(elements[elementIndex]).parent().width();

				thisWidth = $(elements[elementIndex]).outerWidth(true);

				$(elements[elementIndex]).css('display', 'block');
				$(elements[elementIndex]).css('width', parentWidth + 'px');
				$(elements[elementIndex]).css('padding-left', '0px');
				$(elements[elementIndex]).css('padding-right', '0px');
				
				$(elements[elementIndex]).css('margin', 'auto');
				
			} else {
				$(elements[elementIndex]).css('display', 'inline-block');
			}

		}
		
		var elements = $("*[class*='mobile-no-vertical-padding']");
		
		for(var elementIndex = 0; elementIndex < elements.length; elementIndex++) {
			if(cssLayoutIndex > 1) {
				$(elements[elementIndex]).css('padding-top', '0');
				$(elements[elementIndex]).css('padding-bottom', '0');
				
			} 

		}
	
};


/**
 * Perform container size manipulations (limited to the trial movie-boxed layout, will be
 * added to and refactored later)
 */
function doContainerManipulations() {
	$('.movie-boxed').each(function(){		
		switch (true) {
			case($(this).width() > TABLETSMALLWIDTHMAXIMUM):
				$(this).css('height', ($(this).width() / 2.45));
				break;
			default:
				$(this).css('height', ($(this).width() / 1.78));
				break;
		}
	});
}



function alignVerticalMiddleWithMargin() {
	var elements = $("*[class*='align-children-middle']");
		
	for(var elementIndex = 0; elementIndex < elements.length; elementIndex++) {
		var maxHeight = 0;
		var elementChildren = $(elements[elementIndex]).children();
		
		for(var childIndex = 0; childIndex < elementChildren.length; childIndex++) {
			if($(elementChildren[childIndex]).outerHeight() > maxHeight) {
				maxHeight = $(elementChildren[childIndex]).outerHeight();
			}
		}
		
		for(var childIndex = 0; childIndex < elementChildren.length; childIndex++) {
			if($(elementChildren[childIndex]).outerHeight() < maxHeight) {
				setCSSAttribute(elementChildren[childIndex], 'margin-top', ((maxHeight - $(elementChildren[childIndex]).outerHeight()) / 2));
			}
		}	
	}
};

function alignAbsoluteInsideRelativeTest() {
	var elements = $("*[class*='align-absolute-inside-relative']");
	
	for(var elementIndex = 0; elementIndex < elements.length; elementIndex++) {
		
		var elementChildren = $(elements[elementIndex]).children();
		var absoluteElement = '';
		var relativeElement = '';
		
		for(var childIndex = 0; childIndex < elementChildren.length; childIndex++) {
			if($(elementChildren[childIndex]).css('position') == 'relative') {
				relativeElement = elementChildren[childIndex];
			} else {
				absoluteElement = elementChildren[childIndex];
			}			
		}
		
		setCSSAttribute(absoluteElement, 'margin-right', ($(absoluteElement).css('margin-top')));
		$(absoluteElement).css('margin-left', ('-' + ($(absoluteElement).outerWidth(true) - parseFloat($(absoluteElement).css('margin-left'))) + 'px'));
		
		var fixedWidth = $(absoluteElement).outerWidth() + (2 * parseFloat($(absoluteElement).css('margin')));
		
		setCSSAttribute(relativeElement, 'padding-right', (fixedWidth + 'px'));
		
	}
};
