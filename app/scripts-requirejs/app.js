/*! Task Slayer | (c) 2014-2015 Eric Mountain | https://github.com/EricMountain/TaskSlayer */

/*jshint unused: vars */
define(['jquery', 'perfect-scrollbar', 'angular', 'angular-perfect-scrollbar', 'angular-route', 'angular-animate', 'schema', 'couchstorage', 'localstorage', 'datastorage'], function($) {
    'use strict';

    // Handle resizing
    function resizeSubBlocks() {
        var marginPct = 0;
        var pageHeight = $(window).height();
        var marginHeight = pageHeight * marginPct / 100;
        var usableHeight = pageHeight - marginHeight * 2;

        // Make sub-blocks half the size of the page
        var subBlockHeight = usableHeight / 2;
        $('.sub-block').css({'height': subBlockHeight});

        // Make the scrolled areas take up what's left of the sub-blocks
        var scrollNoneHeight = $('.scroll-none').outerHeight(true);
        var scrollerHeight = subBlockHeight - scrollNoneHeight;
        $('.scroller').css({'height': scrollerHeight});
    }

    $(window).resize(function() {
        resizeSubBlocks();
    });

    // Bootstrap Angular
    var taskSlayerApp = angular.module('taskSlayerApp', ['ngRoute', 'ngAnimate', 'localstorage', 'couchstorage', 'datastorage', 'schema', 'perfect_scrollbar']);

    taskSlayerApp.factory('dataModelService', ['$rootScope', 'datastorage', function ($rootScope, datastorage) {

        var service = {

            keyBase: undefined,

            model: {},

            SaveState: function () {
                datastorage.save(service.model, function(event, args) { console.log('Conflict resolution invoked'); service.RestoreState(event, args);});
            },

            RestoreState: function (event, args) {
                if (typeof service.keyBase === 'undefined')
                    service.keyBase = 'TaskSlayer-' + args.location;

                datastorage.load(service.keyBase, function(data) {
                    service.model = data;

                    $rootScope.$broadcast('staterestored', args);
                });
            }
        };

        $rootScope.$on('savestate', service.SaveState);
        $rootScope.$on('restorestate', service.RestoreState);

        return service;
    }]);

    taskSlayerApp.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('', { controller: 'taskSlayerCtrl'})
            .otherwise({ controller: 'taskSlayerCtrl'});
    }]);

    taskSlayerApp.controller('taskSlayerCtrl', ['$scope', '$rootScope', '$route', '$timeout', '$location', '$interval', 'dataModelService', function($scope, $rootScope, $route, $timeout, $location, $interval, dataModelService) {

        $scope.message = '';
        $scope.showMessage = false;

        $scope.dataModelService = dataModelService;
        $scope.categories = dataModelService.model.taskCategories;

        var stopInterval;

        $scope.change = function() {
            $rootScope.$broadcast('savestate');
        };

        $scope.$on('$routeChangeSuccess', function( $currentRoute, $previousRoute ) {
            var loc = $location.absUrl().replace(/[/:]/g, '-');
            $rootScope.$broadcast('restorestate', {location: loc});
        });

        $scope.$on('staterestored', function(event, args) {
            args = (typeof args === 'undefined') ? {} : args;

            // Update shortcut after state has been restored asynchronously
            $scope.categories = dataModelService.model.taskCategories;

            if (args.message) {
                // Let the display stabilise before displaying the message
                $timeout(function() {
                    $scope.message = args.message;
                    $scope.showMessage = true;

                    $timeout(function() {
                        $scope.showMessage = false;
                    }, 2500);
                }, 1000);
            }

            // Focus on the 1st task in category Now
            $timeout(function() {
                $scope.focusCategory($scope.categories.urgentImportant);
            }, 0);
        });

        // Force a refresh at least once an hour.  This causes all task ng-style callbacks to be invoked,
        // hence updating task colours if necessary.
        stopInterval = $interval(function() {}, 1000 * 3600, 0, true);

        $scope.$on('$destroy', function() { $interval.cancel(stopInterval); });

        $scope.setTaskStyle = function(category, index) {
            var task = category.tasks.list[index];
            var style = {};

            var slashSlash = task.description.indexOf('//');
            if (slashSlash > -1) {
                var rest = task.description.substring(slashSlash + 2, slashSlash + 12);

                var targetDate = Date.parse(rest);
                var days = Math.floor((targetDate - Date.now()) / (1000*60*60*24));

                console.log(rest, targetDate, Date.now(), days);

                if (days > 14) {
                    style.color = 'blue';
                } else if (days > 7) {
                    style.color = 'orange';
                } else if (days > 0) {
                    style.color = 'red';
                } else {
                    style.color = 'purple';
                }
            }
            
            return style;
        };

        $scope.addTask = function(category, task, persist) {
            task = (typeof task === 'undefined') ? {description: '', done: false} : task;
            persist = (typeof persist === 'undefined') ? true : persist;

            category.tasks.list.push(task);

            if (persist)
                $rootScope.$broadcast('savestate');
        };

        $scope.addTaskAtIndex = function(category, index) {
            category.tasks.list.splice(index, 0, {description: '', done: false});
            $rootScope.$broadcast('savestate');
        };

        $scope.addTaskAfterIndex = function(category, index) {
            $scope.addTaskAtIndex(category, index + 1);
        };

        $scope.deleteTask = function(category, index, persist) {
            persist = (typeof persist === 'undefined') ? true : persist;

            var task = category.tasks.list.splice(index, 1)[0];

            var target;
            var delay = 0;

            if (index === category.tasks.list.length && index > 0) {
                target = index - 1;
            } else {
                target = index;
                // There is a .5" fade-out. If we focus immediately,
                // it will be on the item being deleted, so we'll just
                // lose focus.
                delay = 350;
            }

            if (persist) {
                $rootScope.$broadcast('savestate');
                $scope.focusTask(category, target, delay);
            }

            return task;
        };

        $scope.focusTask = function(category, index, delay) {
            delay = (typeof delay === 'undefined') ? 0 : delay;

            if (category.tasks.list.length > index && index >= 0) {
                $timeout(function() {
                    $('#' + category.description + '-' + index).focus();
                }, delay);
            }
        };

        $scope.moveTaskToOffset = function(category, index, target) {
            if (target < 0 || target >= category.tasks.list.length)
                return;

            if (target === index)
                return;

            category.tasks.list.splice(target, 0, category.tasks.list.splice(index, 1)[0]);

            $rootScope.$broadcast('savestate');

            $scope.focusTask(category, target);
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

            var task = $scope.deleteTask(source, index, false);

            $scope.addTask(destination, task);
        };

        $scope.focusCategory = function(category) {
            if (category.tasks.list.length === 0)
                $scope.addTask(category);
            else
                $scope.focusTask(category, 0);
        };

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
            } else if ($event.ctrlKey && $event.shiftKey) {
                switch($event.keyCode) {
                case 45: // Insert - Add task before current position
                    $scope.addTaskAtIndex(category, index);
                    break;
                case 8: // Backspace
                case 46: // Delete
                case 13: // Enter/Return - Mark done
                    $scope.deleteTask(category, index);
                    break;
                case 38: // Up - Move task up
                    $scope.moveTask(category, index, -1);
                    break;
                case 40: // Down - Move task down
                    $scope.moveTask(category, index, 1);
                    break;
                case 36: // Home - Move task to top
                    $scope.moveTaskToOffset(category, index, 0);
                    break;
                case 35: // End - Move task to bottom
                    $scope.moveTaskToOffset(category, index, category.tasks.list.length - 1);
                    $scope.focusTask(category, 0);
                    $scope.focusTask(category, category.tasks.list.length - 1);
                    break;
                default:
                    isHandledHere = false;
                }
            } else if ($event.ctrlKey && !$event.shiftKey) {
                switch($event.keyCode) {
                case 36: // Home - Go to 1st task
                    $scope.focusTask(category, 0);
                    break;
                case 35: // End - Go to last task
                    $scope.focusTask(category, category.tasks.list.length - 1);
                    break;
                default:
                    isHandledHere = false;
                }
            } else if (!$event.ctrlKey && !$event.altKey) {
                switch($event.keyCode) {
                case 13: // Enter/Return - Insert task after current position
                    $scope.addTaskAfterIndex(category, index);
                    break;
                case 38: // Up - Go up
                    $scope.focusTask(category, index - 1);
                    break;
                case 40: // Down - Go down
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

    taskSlayerApp.directive('taskCategory', function() {
        return {
            restrict: 'E',
            scope: {
                category: '=',
                deleteTask: '&',
                addTask: '&',
                change: '&',
                taskKeypress: '&',
                setTaskStyle: '&',
                title: '@'
            },
            templateUrl: 'angular-templates/task-category.html'
        };
    });

    taskSlayerApp.directive('initialFocus', function() {
        var timer;

        return function(scope, element, attr) {
            if (timer) clearTimeout(timer);

            timer = setTimeout(function() {
                element[0].focus();
            }, 0);
        };
    });

    angular.bootstrap(document, ['taskSlayerApp']);

    resizeSubBlocks();

    // Hide the loading pane...
    $('#wait-pane-master').css({visibility: 'hidden'});

    // Ugly, but can't seem to get the scrollable blocks sized correctly until
    // after the initial load
    setTimeout(function() {
        resizeSubBlocks();
    }, 10);

});
