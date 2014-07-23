// todo - resize dynamically
// todo - colour selection
// todo - drag n drop
// todo - mark done, delete…

$(function() {
    var marginPct = 5;
    var pageHeight = $(window).height();
    var marginHeight = pageHeight * marginPct / 100;
    var usableHeight = pageHeight - marginHeight * 2;

    // Make sub-blocks half the size of the page
    var subBlockHeight = usableHeight / 2;
    $(".sub-block").css({"height": subBlockHeight});

    // Bootstrap Angular
    var taskMatrixApp = angular.module('taskMatrixApp', ['ngRoute']);

    taskMatrixApp.factory('dataModelService', ['$rootScope', function ($rootScope) {

        var service = {

            model: {
                text: ''
            },

            SaveState: function () {
                //sessionStorage.storageService = angular.toJson(service.model);
                localStorage.storageService = angular.toJson(service.model);
                console.log("saved state: " + service.model.text);
            },

            RestoreState: function () {
                //service.model = angular.fromJson(sessionStorage.storageService);
                service.model = angular.fromJson(localStorage.storageService);
                if (service.model)
                    console.log("restored state: " + service.model.text);
                else
                    service.model = { text: 'all new' };
            }
        }

        $rootScope.$on("savestate", service.SaveState);
        $rootScope.$on("restorestate", service.RestoreState);

        return service;
    }]);

    taskMatrixApp.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('', { controller: 'taskMatrixCtrl'})
            .otherwise({ controller: 'taskMatrixCtrl'});
    }]);

    taskMatrixApp.controller('taskMatrixCtrl',
                             ['$scope', '$rootScope', '$route', 'dataModelService', function($scope, $rootScope, $route, dataModelService) {
                                 //$scope.text = "hi";
                                 $scope.dataModelService = dataModelService;
                                 
                                 $scope.change = function() {
                                     console.log("saving state: " + $scope.dataModelService.model.text);
                                     //service.model.text = $scope.text;
                                     $rootScope.$broadcast('savestate');
                                 };

                                 $scope.$on(
                                     "$routeChangeSuccess",
                                     function( $currentRoute, $previousRoute ){
                                         console.log("restoring state");
                                         $rootScope.$broadcast('restorestate');
                                     }
                                 );
                                 
                             }
                             ]
                            );

    angular.element(document).ready(function() {
        angular.bootstrap(document, ['taskMatrixApp']);
    });

});

