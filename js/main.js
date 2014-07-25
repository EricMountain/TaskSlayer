// todo - resize dynamically
// todo - colour selection
// todo - drag n drop
// todo - mark done, delete…

$(function() {

    // Handle resizing
    function resizeSubBlocks() {
        var marginPct = 0;
        var pageHeight = $(window).height();
        var marginHeight = pageHeight * marginPct / 100;
        var usableHeight = pageHeight - marginHeight * 2;

        // Make sub-blocks half the size of the page
        var subBlockHeight = usableHeight / 2;
        $(".sub-block").css({"height": subBlockHeight});
    }


    $(window).resize(function() {
        resizeSubBlocks();
    });

    resizeSubBlocks();

    // Handle keystroke shortcuts
    //$("body").keypress(function (event) {
    //    
    //});
    


    // Bootstrap Angular
    var taskMatrixApp = angular.module('taskMatrixApp', ['ngRoute', 'ui.utils']);

    taskMatrixApp.factory('dataModelService', ['$rootScope', function ($rootScope) {

        var service = {

            model: {},

            InitModel: function () {
                service.model = {
                    taskCategories: {
                        urgentImportant: {
                            description: "Now",
                            tasks: {
                                list: []
                            }
                        },
                        urgent: {
                            description: "Delegate",
                            tasks: {
                                list: []
                            }
                        },
                        important: {
                            description: "Schedule",
                            tasks: {
                                list: []
                            }
                        },
                        waste: {
                            description: "Waste",
                            tasks: {
                                list: []
                            }
                        }
                    }
                };
            },

            SaveState: function () {
                localStorage.storageService = angular.toJson(service.model);
                console.log("saved state");
            },

            RestoreState: function () {
                service.model = angular.fromJson(localStorage.storageService);
                if (service.model) {
                    console.log("restored state");
                    if (!service.model.taskCategories) {
                        service.InitModel();
                    }
                } else {
                    service.InitModel();
                }
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
                                 $scope.dataModelService = dataModelService;
                                 
                                 $scope.change = function() {
                                     console.log("saving state: ");
                                     $rootScope.$broadcast('savestate');
                                 };

                                 $scope.$on(
                                     "$routeChangeSuccess",
                                     function( $currentRoute, $previousRoute ){
                                         console.log("restoring state");
                                         $rootScope.$broadcast('restorestate');
                                     }
                                 );
                                 
                                 $scope.addTask = function(destinationCategory) {
                                     destinationCategory.tasks.list.push({description: "", done: false});
                                     $rootScope.$broadcast('savestate');
                                 };
                                 
                                 $scope.deleteTask = function(destinationCategory, index) {
                                     console.log("delete called");
                                     destinationCategory.tasks.list.splice(index, 1);
                                     $rootScope.$broadcast('savestate');
                                 };

                                 $scope.keypress = function($event) {
                                     // console.log('key: ' + $event);
                                     // $event.preventDefault();
                                     return false;
                                 };

                                 $scope.taskKeypress = function($event) {
                                     console.log('key-task: ' + $event);
                                     $event.preventDefault();
                                     return false;
                                 };

                                 // $scope.keypressCallback = function($event) {
                                 //     alert('top');
                                 //     $event.preventDefault();
                                 // };

                                 // $scope.keypressCallback2 = function($event) {
                                 //     alert('task');
                                 //     $event.preventDefault();
                                 // };
                             }
                             ]
                            );

    taskMatrixApp.directive('taskCategory', function() {
        return {
            restrict: 'E',
            scope: {
                category: '=',
                deleteTask: '&',
                addTask: '&',
                change: '&',
                taskKeypress: '&',
                title: '@'
                   },
            templateUrl: 'angular-templates/task-category.html'
        };
    });

    taskMatrixApp.directive('initialFocus', function() {
        var timer;

        return function(scope, element, attr) {
            if (timer) clearTimeout(timer);

            timer = setTimeout(function() {
                element[0].focus();
                element[0].select();
            }, 0);
        }
    });

    angular.element(document).ready(function() {
        angular.bootstrap(document, ['taskMatrixApp']);
    });

});

