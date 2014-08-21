/*! Task Slayer | (c) 2014 Eric Mountain | https://github.com/EricMountain/TaskSlayer */

// CouchDB layer

/*jshint unused: vars */
define(['angular'],
    function() {
        'use strict';

        (function(window, angular, undefined) {

            angular.module('couchstorage', [])

                .factory('couchstorage', ['$http', function($http) {

                    var defaultUrl = 'http://127.0.0.1:5984';
                    var tasksDb = 'tasks';

                    var pendingData;
                    var pendingRev;
                    var isLastSaveOrLoadFailed = false;

                    function deepCopy(object) {
                        if (typeof object === 'undefined')
                            return undefined;

                        if (object === null || typeof object !== 'object')
                            return object;

                        var deepCopyObject = object.constructor();
                        for (var key in object)
                            if (object.hasOwnProperty(key))
                                deepCopyObject[key] = deepCopy(object[key]);

                        return deepCopyObject;
                    }

                    function save(data, postSaveCallback, conflictResolution) {
                        processPendingSave(data, undefined, postSaveCallback, conflictResolution);
                    }

                    function processPendingSave(data, newRev, postSaveCallback, conflictResolution) {
                        if (typeof data !== 'undefined') {
                            pendingData = deepCopy(data);
                        }

                        if (typeof newRev !== 'undefined') {
                            pendingRev = newRev;
                        }

                        if (typeof pendingData !== 'undefined' &&
                            (typeof pendingRev !== 'undefined' || isLastSaveOrLoadFailed)) {
                            var saveData = pendingData;
                            pendingData = undefined;

                            if (typeof pendingRev !== 'undefined') {
                                saveData._rev = pendingRev;
                                pendingRev = undefined;
                            }

                            saveToCouchDB(data, saveData, postSaveCallback, conflictResolution);
                        }
                    }

                    function saveToCouchDB(dataModel, dataCopy, postSaveCallback, conflictResolution) {
                        var json = angular.toJson(dataCopy);

                        console.log('Asynch save to CouchDB: ' + dataCopy._rev);

                        $http.put(defaultUrl + '/' + tasksDb + '/' + dataCopy._id, json)
                            .success(function(responseDataJson, status, headers, config) {
                                var responseData = angular.fromJson(responseDataJson);

                                dataCopy._rev = responseData.rev;
                                if (typeof dataModel !== 'undefined')
                                    dataModel._rev = responseData.rev;

                                console.log('Saved to CouchDB, new rev: ' + responseData.rev);

                                isLastSaveOrLoadFailed = false;

                                // NB - _rev updated with new CouchDB value
                                postSaveCallback(dataCopy);

                                processPendingSave(undefined, responseData.rev, postSaveCallback, conflictResolution);
                            })
                            .error(function(responseData, status, headers, config) {
                                console.log('Error saving to CouchDB');
                                console.log(status);
                                console.log(headers);

                                if (status === 409) { // Conflict
                                    // Reload data and drop the change
                                    if (typeof conflictResolution !== 'undefined')
                                        conflictResolution(undefined,
                                                           {message: 'Conflict detected on save.  Data reloaded and change discarded'});
                                } else {
                                    isLastSaveOrLoadFailed = true;

                                    // Best effort anyway
                                    // NB - _rev unchanged
                                    postSaveCallback(dataCopy);
                                }
                            });
                    }

                    function load(id, callback) {
                        $http.get(defaultUrl + '/' + tasksDb + '/' + id)
                            .success(function(json, status, headers, config) {
                                console.log('Data loaded from CouchDB');

                                isLastSaveOrLoadFailed = false;

                                var data = angular.fromJson(json);
                                callback(data);

                                processPendingSave(undefined, data._rev);
                            })
                            .error(function(data, status, headers, config) {
                                console.log('Error loading from CouchDB');
                                console.log(status);
                                console.log(headers);

                                // Ensure saves to CouchDB will be attempted despite the load failing
                                isLastSaveOrLoadFailed = true;

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

