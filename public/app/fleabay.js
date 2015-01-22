var fleabay = angular.module('fleabay', []);

fleabay.controller('bannerController', function($scope){
	$scope.showSellerSignUp = showSellerSignUp;
	$scope.showExpertSignUp = showExpertSignUp;
	};
})