'use strict';

yoruApp.controller('MainCtrl', function($scope, yoru) {
  $scope.stream = [];
	$scope.message = '';
	
	$scope.submit = function() {
		yoru.feed($scope.message);
		$scope.message = '';
	};
	
	yoru.listen('yoru:response', function(e, response) {
		$scope.stream.push(response);
	});
	
	yoru.listen('yoru:clear', function(e, response) {
		$scope.stream.length = 0;
	});
});
