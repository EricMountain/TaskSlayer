define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name taskSlayerApp.controller:AboutCtrl
   * @description
   * # AboutCtrl
   * Controller of the taskSlayerApp
   */
  angular.module('taskSlayerApp.controllers.AboutCtrl', [])
    .controller('AboutCtrl', function ($scope) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
    });
});
