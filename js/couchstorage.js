/*! Task Slayer | (c) 2014 Eric Mountain | http://github.com/... */

// CouchDB layer

define(["angular"],
	function() {
		(function(window, angular, undefined) {

			'use strict';

			angular.module('couchstorage', [])

				.factory('couchstorage', ['$http', function($http) {

					var defaultUrl = "http://127.0.0.1:5984";
					var tasksDb = "tasks";
					var url;

					var pendingData = undefined;
					var pendingRev = undefined;

					function deepCopy(object) {
						if (typeof object === 'undefined')
							return undefined;

						if (object == null || typeof object != 'object')
							return object;

						var deepCopyObject = object.constructor();
						for (var key in object)
							if (object.hasOwnProperty(key))
								deepCopyObject[key] = deepCopy(object[key]);

						return deepCopyObject;
					}


					function checkAvailable() {
					}

					function checkDatabaseExists() {
					}

					function isAvailable() {
					}

					function internalSave(data, newRev, callback, conflictResolution) {
						if (!(typeof data === 'undefined')) {
							pendingData = deepCopy(data);
						}

						if (!(typeof newRev === 'undefined')) {
							pendingRev = newRev;
						}

						if (!(typeof pendingData === 'undefined') && !(typeof pendingRev === 'undefined')) {
							var saveData = pendingData;
							pendingData = undefined;

							saveData._rev = pendingRev;
							pendingRev = undefined;

							saveToCouchDB(saveData, callback, conflictResolution);
						}
					}

					function saveToCouchDB(data, callback, conflictResolution) {
						$http.put(defaultUrl + '/' + tasksDb + '/' + data._id, angular.toJson(data))
							.success(function(responseDataJson, status, headers, config) {
								console.log("Saved to CB");
								// FIXME - need to check callback and conflictResolution are defined

								var responseData = angular.fromJson(responseDataJson)
								data._rev = responseData.rev;

								callback(data);

								internalSave(undefined, responseData.rev, callback, conflictResolution);
							})
							.error(function(responseData, status, headers, config) {
								console.log("Error saving to CB");
								console.log(status);
								console.log(headers);

								if (status == 409) { // Conflict
									// Reload data and drop the change
									conflictResolution(undefined,
													   {message: "Conflict detected on save.  Data reloaded and change discarded"});
								} else {
									// Best effort anyway
									callback(data);
								}
							});
					}

					function save(data, callback, conflictResolution) {
						internalSave(data, undefined, callback, conflictResolution);
					}

					function load(id, callback) {
						$http.get(defaultUrl + '/' + tasksDb + '/' + id)
							.success(function(json, status, headers, config) {
								console.log("Data loaded from CB");
								var data = angular.fromJson(json)
								callback(data);
								internalSave(undefined, data._rev);
							})
							.error(function(data, status, headers, config) {
								console.log("Error loading from CB");
								console.log(status);
								console.log(headers);
								callback(/* No data */);
							});
					}

					return {
						save: save,
						load: load
					};
					
				}]);

		})(window, window.angular);
	});

