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
                text: '',
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
            },

            SaveState: function () {
                //sessionStorage.storageService = angular.toJson(service.model);
                localStorage.storageService = angular.toJson(service.model);
                console.log("saved state: " + service.model.text);
            },

            RestoreState: function () {
                //service.model = angular.fromJson(sessionStorage.storageService);
                service.model = angular.fromJson(localStorage.storageService);
                if (service.model) {
                    console.log("restored state");
                    if (service.model.text) {
                        // delete it
                    }
                    if (!service.model.taskCategories) {
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
                    }
                } else {
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
                                 
                                 $scope.addTask = function() {
                                     $scope.dataModelService.model.taskCategories.urgentImportant.tasks.list.push({description: "new task", done: false});
                                 };
                             }
                             ]
                            );

    angular.element(document).ready(function() {
        angular.bootstrap(document, ['taskMatrixApp']);
    });

});

