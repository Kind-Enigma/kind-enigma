var fleabayControllers = angular.module('fleabayControllers', []);
var currentUser = {};

fleabayControllers.controller('mainController', function($scope, $location, $http){
  $scope.signUp = toggleSignUpPage;
  $scope.logIn = toggleLogInPage;
  $scope.goToHomePage = function(){
    console.log("function called!!!!")
    $location.path("/")
  };

  $scope.realLogIn = function(){
    var userCellNumber = $scope.userCellNumber;
    var userPassword = $scope.userPassword;

    $http.get('http://localhost:8080/api/user?CellNumber=' + userCellNumber).
      success(function(data, status, headers, config){
        $scope.user = data[0];
        if (data[0].Password == userPassword){
          if(data[0].isExpert){
            console.log('isanExpert');
          }else{
            currentUser = data;
            $location.path("/user")
          }
        }
      }).
      error(function(data, status, headers, config){
        console.log('there is an error')
      });
  }

  $scope.realSignUp = function(){
    var signUpCellNumber = $scope.signUpCellNumber;
    var signUpPassword = $scope.signUpPassword;
    $http.post('http://localhost:8080/api/user', {
      CellNumber: signUpCellNumber,
      Password: signUpPassword
    }).
      success(function(data, status, headers, config){
        console.log(data);
        currentUser = data  ;
        $location.path('/user')
      }).
      error(function(data, status, headers, config){
        console.log('an error in signUp');
      });
  }

  $scope.expertList = experts;
  $scope.itemList = items;
});

fleabayControllers.controller('userController', function($scope, $http, $location){
  $scope.user = currentUser;
  var userCellNumber = currentUser[0].CellNumber;
  // $scope.itemList = items;
  // $scope.postItem = userPostItem;
  $http.get('http://localhost:8080/api/item/byuser?CellNumber=' + userCellNumber).
      success(function(data, status, headers, config){

        $scope.itemList = data;
      }).
      error(function(data, status, headers, config){
        console.log('there is an error')
      });

  $scope.postItem = function(){
    var title = $scope.itemTitle;
    var description = $scope.itemDescription;
    var price = $scope.itemPrice;
    $http.post('http://localhost:8080/api/item',{
      // Owner: currentUser[0].CellNumber,
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
      console.log('succesfully posted an item');
    }).
    error(function(data, status, headers, config){
      console.log('did not succesfully post an item');
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