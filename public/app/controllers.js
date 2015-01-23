var fleabayControllers = angular.module('fleabayControllers', []);

fleabayControllers.controller('mainController', function($scope){
  $scope.signUp = toggleSignUpPage;
  $scope.logIn = toggleLogInPage;

  $scope.expertList = experts;
  $scope.itemList = items;
});

fleabayControllers.controller('userController', function($scope){
  $scope.expertList = experts;
  $scope.itemList = items;
});

fleabayControllers.controller('expertController', function($scope){
  $scope.expertList = experts;
  $scope.itemList = items;
});