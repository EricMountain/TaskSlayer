define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name taskSlayerApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the taskSlayerApp
   */
  angular.module('taskSlayerApp.controllers.MainCtrl', [])
    .controller('MainCtrl', function ($scope) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
    });
});
