'use strict';

yoruApp.directive('onEnter', function() {
	return function(scope, element, attrs) {
		element.bind('keydown', function(event) {
			if (event.keyCode === 13) {
				event.preventDefault();
				event.stopPropagation();
				scope.$apply(attrs.onEnter);
			}
		});
	};
});
