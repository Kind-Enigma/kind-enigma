var fleabay = angular.module('fleabay', [
    'ngRoute',
    'fleabayControllers'
  ]);


fleabay.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/user', {
        templateUrl: 'partials/user.html',
        controller: 'userController'
      }).
      when('/expert', {
        templateUrl: 'partials/expert.html',
        controller: 'expertController'
      }).
      when('/', {
       templateUrl: 'partials/homepage.html',
       controller: 'mainController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);