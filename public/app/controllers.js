var fleabayControllers = angular.module('fleabayControllers', []);

fleabayControllers.controller('mainController', function($scope){
  $scope.signUp = toggleSignUpPage;
  $scope.logIn = toggleLogInPage;

  $scope.expertList = experts;
  $scope.itemList = items;
});

fleabayControllers.controller('userController', function($scope){
  $scope.user = testUser;
  $scope.itemList = items;
  $scope.postItem = userPostItem;
  $scope.logOut = userLogOut;
});

fleabayControllers.controller('expertController', function($scope){
  $scope.user = wayne;
  $scope.itemList = items;
  $scope.logOut = expertLogOut;
  $scope.acceptRequest = expertAcceptRequest;
});