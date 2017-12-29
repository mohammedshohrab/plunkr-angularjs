(function() {

  var app = angular.module("gitHubViewer", []);
  var MainController = function($scope, github, $interval, $log,$location,$anchorScroll) {


    $scope.message = "GitHub Service";
    $scope.sort = "stargazers_count";
    $scope.countdown = 5;
    $scope.username = "angular";
    
    var countDownInterval = null;

    var decrementCountDown = function() {
      $scope.countdown -= 1;
      if ($scope.countdown === 0) {
        $scope.search($scope.username);
      }
    };

    var startCountDown = function() {
      countDownInterval = $interval(decrementCountDown, 1000, 5);
    };

    $scope.search = function(username) {
      $log.info("Searching :" + username);
      github.getUser(username)
        .then(onComplete, onError);
        if(countDownInterval){
          $interval.cancel(countDownInterval);
          $scope.countdown = null;
        }

    };
    var onComplete = function(data) {
      $scope.person = data;
      github.getRepos($scope.person)
        .then(onRepos, onError);
    };
    var onRepos = function(data) {
      $scope.repos = data;
      $location.hash("tableData");
      $anchorScroll();
    };
    var onError = function(error) {
      $scope.error = error.data.message;
    };
    startCountDown();
  }
  app.controller("MainController",MainController);
}());