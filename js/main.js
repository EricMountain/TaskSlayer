/*! Task Slayer | (c) 2014 Eric Mountain | http://github.com/... */

define(["jquery", "perfect-scrollbar", "angular", "angular-route", "angular-animate", "app/schema", "app/couchstorage", "app/localstorage", "app/datastorage"], function($) {

	// FIXME wrap in $(function() { ? c.f. https://github.com/requirejs/example-jquery-cdn/blob/master/www/js/app/main.js (doesn't seem necessary)

//	$(function() {
		// Handle resizing
		function resizeSubBlocks() {
			var marginPct = 0;
			var pageHeight = $(window).height();
			var marginHeight = pageHeight * marginPct / 100;
			var usableHeight = pageHeight - marginHeight * 2;

			// Make sub-blocks half the size of the page
			var subBlockHeight = usableHeight / 2;
			$(".sub-block").css({"height": subBlockHeight});

			$('#task-list-Now').perfectScrollbar('update');
		}

		$(window).resize(function() {
			resizeSubBlocks();
		});

	    $('#task-list-Now').perfectScrollbar();
		resizeSubBlocks();

		// Bootstrap Angular
		var taskSlayerApp = angular.module('taskSlayerApp', ['ngRoute', 'ngAnimate', 'localstorage', 'couchstorage', 'datastorage', 'schema']);

		taskSlayerApp.factory('dataModelService', ['$rootScope', 'datastorage', function ($rootScope, datastorage) {

			var service = {

				keyBase: undefined,

				model: {},

				SaveState: function () {
					datastorage.save(service.model, service.RestoreState);
				},

				RestoreState: function (event, args) {
					if (typeof keyBase === 'undefined')
						keyBase = "TaskSlayer-" + args.location;

					datastorage.load(keyBase, function(data) {
						service.model = data;

						$rootScope.$broadcast("staterestored", args);
					});
				}
			}

			$rootScope.$on("savestate", service.SaveState);
			$rootScope.$on("restorestate", service.RestoreState);

			return service;
		}]);

		taskSlayerApp.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('', { controller: 'taskSlayerCtrl'})
				.otherwise({ controller: 'taskSlayerCtrl'});
		}]);

		taskSlayerApp.controller('taskSlayerCtrl', ['$scope', '$rootScope', '$route', '$timeout', '$location', 'dataModelService', function($scope, $rootScope, $route, $timeout, $location, dataModelService) {

			$scope.message = "";
			$scope.showMessage = false;

			$scope.dataModelService = dataModelService;
			$scope.categories = dataModelService.model.taskCategories;

			$scope.change = function() {
				$rootScope.$broadcast('savestate');
			};

			$scope.$on("$routeChangeSuccess", function( $currentRoute, $previousRoute ) {
				var loc = $location.absUrl().replace(/[/:]/g, "-");
				$rootScope.$broadcast('restorestate', {location: loc});
			});

			$scope.$on("staterestored", function(event, args) {
				args = (typeof args === "undefined") ? {} : args;

				// Update shortcut after state has been restored asynchronously
				$scope.categories = dataModelService.model.taskCategories;

				console.log("State restored event");
				console.log(args);
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
				var delay = 0;

				if (index == category.tasks.list.length && index > 0) {
					target = index - 1;
				} else {
					target = index;
					// There is a .5" fade-out. If we focus immediately,
					// it will be on the item being deleted, so we'll just
					// lose focus.
					delay = 550;
				}

				$scope.focusTask(category, target, delay);

				if (persist)
					$rootScope.$broadcast('savestate');

				return task;
			};

			$scope.focusTask = function(category, index, delay) {
				delay = (typeof delay === "undefined") ? 0 : delay;

				if (category.tasks.list.length > index && index >= 0) {
					setTimeout(function() {
						$("#" + category.description + "-" + index).focus();
					}, delay);
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
				} else if (!$event.ctrlKey && !$event.altKey) {
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

		taskSlayerApp.directive('taskCategory', function() {
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

		taskSlayerApp.directive('initialFocus', function() {
			var timer;

			return function(scope, element, attr) {
				if (timer) clearTimeout(timer);

				timer = setTimeout(function() {
					element[0].focus();
				}, 0);
			}
		});

		angular.bootstrap(document, ['taskSlayerApp']);

		// Hide the loading pane...
		$("#wait-pane-master").css({visibility: "hidden"});

//	});

});

