var fleabayControllers = angular.module('fleabayControllers', []);
var currentUser = {};

fleabayControllers.controller('mainController', function($scope, $location, $http){
  $scope.signUp = toggleSignUpPage;
  $scope.logIn = toggleLogInPage;

  $scope.realLogIn = function(){
    var userCellNumber = $scope.userCellNumber;
    var userPassword = $scope.userPassword;

    $http.get('http://localhost:8080/api/user?CellNumber=' + userCellNumber).
      success(function(data, status, headers, config){
        $scope.user = data[0];
        console.log(data[0]);
        console.log(userPassword);
        if (data[0].Password == userPassword){
          if(data[0].is)
          console.log('Password is correct')
          currentUser = data;
          $location.path("/user")
        }
      }).
      error(function(data, status, headers, config){
        console.log('there is an error')
      });
  }

  $scope.realSignUp = function(){
    var signUpCellNumber = $scope.signUpCellNumber;
    var signUpPassword = $scope.signUpPassword;
    var expert = $scope.value1;
    console.log(expert);
    if(expert){
      $http.post('http://localhost:8080/api/user', {
        CellNumber: signUpCellNumber,
        Password: signUpPassword,
        isExpert: true
      }).
        success(function(data, status, headers, config){
          console.log(data);
          currentUser = data;
          $location.path('/expert')
        }).
        error(function(data, status, headers, config){
          console.log('an error in signUp');
        });
    }
    else{
      $http.post('http://localhost:8080/api/user', {
        CellNumber: signUpCellNumber,
        Password: signUpPassword,
      }).
        success(function(data, status, headers, config){
          console.log(data);
          currentUser = data;
          $location.path('/user')
        }).
        error(function(data, status, headers, config){
          console.log('an error in signUp');
        });
    }
  }

  $scope.expertList = experts;
  $scope.itemList = items;
});

fleabayControllers.controller('userController', function($scope, $http, $location){
  $scope.user = currentUser;
  // $scope.itemList = items;
  // $scope.postItem = userPostItem;
  $scope.postItem = function(){
    var title = $('#postItemTitle').val()
    var description = $('#postItemDescription').val()
    var price = $('#postItemPrice').val()
    $http.post('http://localhost:8080/api/items',{
      Owner: $scope.user.CellNumber,
      Title: title,
      Description: description,
      // Address: $scope.user.Address,
      // City: $scope.user.City,
      // State: $scope.user.State,
      // ZipCode: $scope.user.ZipCode,
      // Images: [],
      ListPrice: price,
      // ListPercentage: 10,
      // Expert: 'expert',
      // ListDate: Date,
      // AcceptedDate: Date

    }). // database not uploaded yet
    success(function(data, status, headers, config){

    }).
    error(function(data, status, headers, config){

    });
  };
  $scope.logOut = function(){
    currentUser = {};
    $location.path('/')
  }

  // $scope.logOut = userLogOut;
});

fleabayControllers.controller('expertController', function($scope){
  $scope.user = wayne;
  $scope.itemList = items;
  $scope.logOut = expertLogOut;
  $scope.acceptRequest = expertAcceptRequest;
});