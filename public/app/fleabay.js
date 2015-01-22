var fleabay = angular.module('fleabay', []);

fleabay.controller('mainController', function($scope){
	$scope.signUp = toggleSignUpPage;
	$scope.logIn = toggleLogInPage;
})