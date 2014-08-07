/*! Task Slayer | (c) 2014 Eric Mountain | http://github.com/... */

// Data storage layer

define(["angular", "./localstorage", "./couchstorage", "./schema"],
	function() {
		(function(window, angular, undefined) {

			'use strict';

			angular.module('datastorage', [])

				.factory('datastorage', ['localstorage', 'couchstorage', 'schema', function(localstorage, couchstorage, schema) {

					function save(data, conflictResolution) {
						couchstorage.save(data, function(data) { localstorage.save(data) }, conflictResolution);
					}

					function load(keyBase, callback) {
						couchstorage.load(keyBase, function(data) {
							var lsData = localstorage.load();

							if (data === undefined) {
								console.log("No data from CouchDB, relying on localStorage");
								data = lsData;
							}

							data = schema.upgrade(keyBase, data);

							callback(data);
						});
					}

					return {
						save: save,
						load: load
					};
					
				}]);

		})(window, window.angular);
	});
