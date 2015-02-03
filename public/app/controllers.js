var fleabayControllers = angular.module('fleabayControllers', []);
var currentUser = {};

fleabayControllers.controller('mainController', function($scope, $location, $http){
  $scope.signUp = toggleSignUpPage;
  $scope.logIn = toggleLogInPage;
  $scope.goToHomePage = function(){
    $location.path("/")
  }; 

  $scope.directToSignUpPage = function(){
    $location.path("/signup")
  };

  //get some items to show on front page
  $http.get('http://karmatest1.azurewebsites.net/api/item').
    success(function(data, status, headers, config){
      $scope.itemList = data.slice(0, 5);
      console.log('itemList', itemList);
    }).
    error(function(data, status, headers, config){
      console.log('could not pull data down');
    });
    $scope.expertList = [];
    //get some experts to show on front page
    $http.get('http://karmatest1.azurewebsites.net/api/user').
      success(function(data, status, headers, config){
        for(var i = 0; i < data.length; i++){
          if(data[i].IsExpert === true) $scope.expertList.push(data[i]);
        }
      }).
      error(function(data, status, headers, config){
        console.log('could not pull data down');
      });



  $scope.realLogIn = function(){
    var userCellNumber = $scope.userCellNumber;
    var userPassword = $scope.userPassword;

    $http.get('http://karmatest1.azurewebsites.net/api/user?CellNumber=' + userCellNumber).
      success(function(data, status, headers, config){
        $scope.user = data;
        if (data[0].Password == userPassword){
          currentUser = data;
          sessionStorage.user = JSON.stringify(data);
          if(data[0].IsExpert){
            $location.path("/expert");
          } else {
            $location.path("/user");
          }
        }
      }).
      error(function(data, status, headers, config){
        console.log('there is an error')
      });
  }

});

fleabayControllers.controller('userController', function($scope, $http, $location){
  $scope.user = currentUser[0];
  var userCellNumber = currentUser[0].CellNumber;
  $scope.imageUrl = 'http://karmatest1.azurewebsites.net/images/' + currentUser[0].Image;
  // $scope.itemList = items;
  // $scope.postItem = userPostItem;
  currentUser = JSON.parse(sessionStorage.user);
  // console.log(currentUser)
  // console.log(sessionStorage)
  $scope.user = currentUser[0];
  var userCellNumber = currentUser[0].CellNumber;

  $http.get('http://karmatest1.azurewebsites.net/api/item/byuser?CellNumber=' + userCellNumber).
      success(function(data, status, headers, config){
        $scope.itemList = data;
      }).
      error(function(data, status, headers, config){
        console.log('there is an error');
      });

  $scope.postItem = function(){
    var title = $scope.itemTitle;
    var description = $scope.itemDescription;
    var price = $scope.itemPrice;
    $http.post('http://karmatest1.azurewebsites.net/api/item',{

      Owner: currentUser[0]._id,
      Title: title,
      Description: description,
      ListPrice: price,

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
    delete sessionStorage.user
    $location.path('/')
  }
});

fleabayControllers.controller('expertController', function($scope, $http, $location){
  currentUser = JSON.parse(sessionStorage.user);
  $scope.user = currentUser[0];
  $scope.imageUrl = 'http://karmatest1.azurewebsites.net/images/' + currentUser[0].Image;
  $scope.expertItems = [];
  $http.get('http://karmatest1.azurewebsites.net/api/item/unsold')
    .success(function(data, status, headers, config){
      $scope.items = data;
    })
    .error(function(data, status, headers, config){
      console.log('error getting data');
    })
    $http.get('http://karmatest1.azurewebsites.net/api/item?Expert=' + currentUser[0]._id)
      .success(function(data, status, headers, config){
        $scope.expertItems = data;
      })
      .error(function(data, status, headers, config){
        console.log('error getting data');
      })
  $scope.acceptRequest = function(item){
    $http.post('http://karmatest1.azurewebsites.net/api/item', {
      _id: item,
      Expert: currentUser[0]._id
    })
  };

  $scope.logOut = function(){
    currentUser = {};
    delete sessionStorage.user
    $location.path('/')
  };
});

fleabayControllers.controller('signUpController', function($scope, $http){
  $scope.realSignUp = function(){
    var signUpCellNumber = $scope.signUpCellNumber;
    var signUpPassword = $scope.signUpPassword;
    
    var expert = $scope.value1;
    if(expert){
      $http.post('http://karmatest1.azurewebsites.net/api/user', {
        CellNumber: signUpCellNumber,
        Password: signUpPassword,
        IsExpert: true
      }).
        success(function(data, status, headers, config){
          currentUser = data;
          $location.path('/expert')
        }).
        error(function(data, status, headers, config){
          console.log('an error in signUp');
        });
    } 
    else { 
      $http.post('http://karmatest1.azurewebsites.net/api/user', {
        CellNumber: signUpCellNumber,
        Password: signUpPassword,
      }).
        success(function(data, status, headers, config){
          currentUser = data;
          $location.path('/user')
        }).
        error(function(data, status, headers, config){
          console.log('an error in signUp');
        });
    }
  }
});
