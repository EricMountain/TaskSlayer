
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

    // Bootstrap Angular
    var taskMatrixApp = angular.module('taskMatrixApp', ['ngRoute', 'ngAnimate', 'localstorage', 'couchstorage', 'datastorage']);

    taskMatrixApp.factory('dataModelService', ['$rootScope', 'datastorage', function ($rootScope, datastorage) {

        var service = {

            model: {},

            InitModel: function () {
                service.model = {
                    _id: "TaskMatrixData",
                    version: 1,
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
                datastorage.save(service.model, service.RestoreState);
                console.log("saved state");
            },

            RestoreState: function () {
                datastorage.load("TaskMatrixData", function(data) {
                    service.model = angular.fromJson(data);
                    console.log("callback invoked");
                    if (service.model) {
                        console.log("restored state");
                        if (!service.model.taskCategories) {
                            service.InitModel();
                        }
                        if (!service.model._id) {
                            service.model._id = "TaskMatrixData";
                        }
                        if (!service.model.version) {
                            service.model.version = 1;
                        }
                    } else {
                        service.InitModel();
                    }

                    $rootScope.$broadcast("staterestored");
                });
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
        });

        $scope.$on("staterestored", function() {
            // Update shortcut after state has been restored asynchronously
            $scope.categories = dataModelService.model.taskCategories;
        });

        $scope.addTask = function(category, task, persist) {
            task = (typeof task === "undefined") ? {description: "", done: false} : task;
            persist = (typeof persist === "undefined") ? true : persist;

            category.tasks.list.push(task);

            if (persist)
                $rootScope.$broadcast('savestate');
        };

        $scope.addTaskAfterIndex = function(category, index) {
            category.tasks.list.splice(index + 1, 0, {description: "", done: false});
            $rootScope.$broadcast('savestate');
        };

        $scope.deleteTask = function(category, index, persist) {
            persist = (typeof persist === "undefined") ? true : persist;

            task = category.tasks.list.splice(index, 1)[0];

            var target;

            if (index == category.tasks.list.length && index > 0) {
                target = index - 1;
            } else {
                target = index;
            }

            $scope.focusTask(category, target);

            if (persist)
                $rootScope.$broadcast('savestate');

            return task;
        };

        $scope.focusTask = function(category, index) {
            if (category.tasks.list.length > index && index >= 0) {
                setTimeout(function() {
                    $("#" + category.description + "-" + index).focus();
                }, 0);
            }
        };

        $scope.moveTask = function(category, index, direction) {
            var target = index + direction;

            if (target < 0 || target >= category.tasks.list.length) {
                return;
            }

            var tmp = category.tasks.list[index];
            category.tasks.list[index] = category.tasks.list[target];
            category.tasks.list[target] = tmp;

            $rootScope.$broadcast('savestate');

            $scope.focusTask(category, target);
        };

        $scope.moveTaskToCategory = function(destination, source, index) {
            if (destination === source)
                return;

            task = $scope.deleteTask(source, index, false);

            $scope.addTask(destination, task);
        };

        $scope.focusCategory = function(category) {
            if (category.tasks.list.length == 0)
                $scope.addTask(category);
            else
                $scope.focusTask(category, 0);
        }

        $scope.keypress = function($event) {
            var isHandledHere = true;

            if ($event.altKey && !$event.shiftKey) {
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

            if ($event.altKey && $event.shiftKey) {
                switch($event.keyCode) {
                case 78: // N
                    $scope.moveTaskToCategory($scope.categories.urgentImportant, category, index);
                    break;
                case 83: // S
                    $scope.moveTaskToCategory($scope.categories.important, category, index);
                    break;
                case 68: // D
                    $scope.moveTaskToCategory($scope.categories.urgent, category, index);
                    break;
                case 87: // W
                    $scope.moveTaskToCategory($scope.categories.waste, category, index);
                    break;
                default:
                    isHandledHere = false;
                }
            } else if ($event.ctrlKey) {
                switch($event.keyCode) {
                case 45: // Insert
                    $scope.addTask(category);
                    break;
                case 8: // Backspace
                case 46: // Delete
                case 13: // Enter/Return
                    $scope.deleteTask(category, index);
                    break;
                case 38: // Up
                    $scope.moveTask(category, index, -1);
                    break;
                case 40: // Down
                    $scope.moveTask(category, index, 1);
                    break;
                default:
                    isHandledHere = false;
                }
            } else if (!$event.ctrlKey && !$event.altKey && !$event.shiftKey) {
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

