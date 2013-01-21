'use strict';

yoruApp.controller('MainCtrl', ['$scope', '$routeParams', 'yoru', function($scope, $routeParams, yoru) {
	$scope.stream = [];
	$scope.message = '';
	
	$scope.submit = function() {
		yoru.feed($scope.message);
		$scope.message = '';
	};
	
	yoru.listen('yoru:response', function(e, response) {
		$scope.stream.push(response);
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	});
	
	yoru.listen('yoru:clear', function(e, response) {
		$scope.stream.length = 0;
	});

	if ($routeParams.roomId) {
		yoru.feed('yoru join world ' + $routeParams.roomId);
	}
}]);
