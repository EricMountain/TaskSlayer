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

    taskMatrixApp.controller('taskMatrixCtrl', ['$scope', '$rootScope', '$route', 'dataModelService', function($scope, $rootScope, $route, dataModelService) {
        $scope.dataModelService = dataModelService;
        $scope.categories = dataModelService.model.taskCategories;

        $scope.change = function() {
            $rootScope.$broadcast('savestate');
        };

        $scope.$on("$routeChangeSuccess", function( $currentRoute, $previousRoute ) {
            $rootScope.$broadcast('restorestate');

            // Update shortcuts
            $scope.categories = dataModelService.model.taskCategories;
        });

        $scope.addTask = function(destinationCategory) {
            destinationCategory.tasks.list.push({description: "", done: false});
            $rootScope.$broadcast('savestate');
        };

        $scope.addTaskAfterIndex = function(destinationCategory, index) {
            destinationCategory.tasks.list.splice(index + 1, 0, {description: "", done: false});
            $rootScope.$broadcast('savestate');
        };

        $scope.deleteTask = function(destinationCategory, index) {
            destinationCategory.tasks.list.splice(index, 1);

            var target;

            if (index == destinationCategory.tasks.list.length && index > 0) {
                target = index - 1;
            } else {
                target = index;
            }

            $scope.focusTask(destinationCategory, target);

            $rootScope.$broadcast('savestate');
        };

        $scope.focusTask = function(category, index) {
            if (category.tasks.list.length > index && index >= 0) {
                setTimeout(function() {
                    $("#" + category.description + "-" + index).focus();
                }, 0);
            }
        };

        $scope.focusCategory = function(category) {
            if (category.tasks.list.length == 0)
                $scope.addTask(category);
            else
                $scope.focusTask(category, 0);
        }

        $scope.keypress = function($event) {
            var isHandledHere = true;

            if ($event.altKey) {
                switch($event.keyCode) {
                case 78: // N
                    $scope.focusCategory($scope.categories.urgentImportant);
                    break;
                case 83: // S
                    $scope.focusCategory($scope.categories.important);
                    break;
                case 68: // D
                    $scope.focusCategory($scope.categories.urgent);
                    break;
                case 87: // W
                    $scope.focusCategory($scope.categories.waste);
                    break;
                default:
                    isHandledHere = false;
                }
            } else
                isHandledHere = false;

            if (isHandledHere)
                $event.preventDefault();
        };

        $scope.taskKeypress = function($event, category, index) {
            var isHandledHere = true;
            console.log("keycode: " + $event.keyCode);
            if ($event.ctrlKey) {
                switch($event.keyCode) {
                case 45: // Insert
                    $scope.addTask(category);
                    break;
                case 8: // Backspace
                case 46: // Delete
                case 13: // Enter/Return
                    $scope.deleteTask(category, index);
                    break;
                default:
                    isHandledHere = false;
                }
            } else {
                switch($event.keyCode) {
                case 13: // Enter/Return
                    $scope.addTaskAfterIndex(category, index);
                    break;
                case 38: // Up
                    $scope.focusTask(category, index - 1);
                    break;
                case 40: // Down
                    $scope.focusTask(category, index + 1);
                    break;
                default:
                    isHandledHere = false;
                }
            }

            if (isHandledHere)
                $event.preventDefault();
        };
    }]);

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
            }, 0);
        }
    });

    angular.element(document).ready(function() {
        angular.bootstrap(document, ['taskMatrixApp']);
    });

});

