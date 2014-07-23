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
                    if (service.model.text) {
                        // delete it
                        delete service.model.text;
                    }
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
                                 
                                 $scope.addTask = function() {
                                     $scope.dataModelService.model.taskCategories.urgentImportant.tasks.list.push({description: "new task", done: false});
                                 };
                                 
                                 $scope.deleteTask = function(index) {
                                     $scope.dataModelService.model.taskCategories.urgentImportant.tasks.list.splice(index, 1);
                                 };

                             }
                             ]
                            );

    angular.element(document).ready(function() {
        angular.bootstrap(document, ['taskMatrixApp']);
    });

});

