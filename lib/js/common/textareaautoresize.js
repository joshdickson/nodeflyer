/*
 * textareaautoresize.js
 * 
 * A file that provides the bindTextAutoResizeFunctions() function, which binds a listening
 * function to textarea elements on the builder DOM to change their height when their contents
 * become to large or too small.
 * 
 * @version May 12, 2013
 * 		Added the bindTextAreaAutoResizeFunctions() function and all local functions.
 */


/**
 * A function that binds automatic resize listener functions to each textarea in the builder
 * DOM with a class of 'autoresize'. These listeners adjust the sizes of the text areas to 
 * automatically expand and contract to fit their contents.
 */
function bindTextAreaAutoResizeFunctions() {
	
	/**
	 * A helper function that resizes an element if its contents determine that it should be
	 * of greater or lesser height than its current height based upon its contents.
	 * @param element
	 */
	function resizeIfNecessary(element) {
		
		/**
		 * A function that gets the new height of the element depending on its contents
		 * @returns
		 */
		function getNewHeight() {
			
			/**
			 * A function that formats the slave div with the formatting of the given element.
			 * @param slaveID the id of the slave element
			 */
			function formatSlave(slaveID) {
				var formatValuesArray = "width font-size line-height letter-spacing font-weight text-align".split(' ');
				for(var formatValueIndex = 0; formatValueIndex < formatValuesArray.length; formatValueIndex++) {
					$('#' + slaveID).css(formatValuesArray[formatValueIndex], $(element).css(formatValuesArray[formatValueIndex]));	
				}
				$('#' + slaveID).html('<pre>' + $(element).val() + '</pre>');			
				$(element).css('height', $('#' + slaveID).css('height'));
			};
			
			/**
			 * A helper function that returns the number of wrapping new-line characters in the
			 * element's value.
			 * @returns {Number} the number of wrapping new-line characters
			 */
			function getNumberOfWrappingNewLineCharacters() {
				var wrappingEnterValues = 0;
				if(encodeURIComponent($(element).val()).substring(encodeURIComponent($(element).val()).length - 3) == '%0A') {
					wrappingEnterValues++;
				} if(encodeURIComponent($(element).val()).substring(0, 3) == '%0A') {
					wrappingEnterValues++;
				}
				return wrappingEnterValues;
			};
			
			var slave = 'area-slave';
			$('body').append("<div id='" + slave + "'></div>");
			formatSlave(slave);
			var wrappingEnterValues = getNumberOfWrappingNewLineCharacters();
			var newElementHeight = parseFloat($('#' + slave).css('height')) + (wrappingEnterValues * parseFloat($('#' + slave).css('line-height')));
			
			$('#' + slave).remove();
						
			if(newElementHeight > 0) {
				return newElementHeight;
			} else {
				return parseFloat($(element).css('line-height'));
			}
			
		};
		
		$(element).css('height', getNewHeight() + 'px');
		
	};
	
	$('textarea.autoresize').each(function(){
		$(this).bind('input propertychange', function(){
			resizeIfNecessary($(this));
			triggerParentPropertyChange(this);
		});
	});
};

function triggerParentPropertyChange(element) {
	if($(element).prop('tagName') == 'BODY') {
		return;
	} else {
		$(element).parent().trigger('propertychange');
//		var parentElement = $(element).parent();
//		alert(parentElement.prop('tagName'));
		triggerParentPropertyChange($(element).parent());
	}
	
//	alert(parentElement + ' is parent element');
//	
}

/**
 * A function that manually simulates a propertychange event for each textarea with autoresize
 * functionality.
 */
function resizeTextAreasWithAutoResize() {
	$('textarea.autoresize').each(function(){
		$(this).trigger('propertychange');
	});
};

