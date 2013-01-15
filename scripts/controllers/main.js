'use strict';

yoruApp.controller('MainCtrl', function($scope, yoru) {
	$scope.stream = [];
	$scope.message = '';
	
	$scope.submit = function() {
		yoru.feed($scope.message);
		$scope.message = '';
	};
	
	yoru.listen(function(e, response) {
		$scope.stream.push(response);
	});
});
