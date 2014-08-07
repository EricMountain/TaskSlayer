/*! Task Slayer | (c) 2014 Eric Mountain | http://github.com/... */

// Handle schema upgrades

define(["angular"],
	function() {
		(function(window, angular, undefined) {

			'use strict';

			angular.module('schema', [])

				.factory('schema', ['$http', function($http) {

					function latestVersion() {
						return 8;
					}

					function upgrade(baseKey, data) {
						if (typeof data === 'undefined') {
							return initModel(baseKey);
						} else {
							if (!data.taskCategories) {
								return initModel(baseKey);
							}

							switch(data.version) {
							case 1:
							case 2:
							case 3:
							case 4:
							case 5:
							case 6:
							case 7:
								data._id = baseKey;
							default:
								data.version = latestVersion();
							}

							return data;
						}
					}

					function initModel(baseKey) {
						return {
							_id: baseKey,

							version: latestVersion(),

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

					return {
						upgrade: upgrade
					};

				}]);

		})(window, window.angular);
	});
