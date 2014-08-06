/*! Task Slayer | (c) 2014 Eric Mountain | http://github.com/... */

// CouchDB layer

(function(window, angular, undefined) {

    'use strict';

    angular.module('couchstorage', [])

        .factory('couchstorage', ['$http', function($http) {

            var defaultUrl = "http://127.0.0.1:5984";
            var tasksDb = "tasks";
            var url;

            function checkAvailable() {
            }

            function checkDatabaseExists() {
            }

            function isAvailable() {
            }

            function save(data, callback, conflictResolution) {
                $http.put(defaultUrl + '/' + tasksDb + '/' + data._id, angular.toJson(data))
                    .success(function(responseData, status, headers, config) {
                        console.log("Saved to CB");
                        data._rev = angular.fromJson(responseData).rev;
                        callback(data);
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

            function load(id, callback) {
                $http.get(defaultUrl + '/' + tasksDb + '/' + id)
                    .success(function(data, status, headers, config) {
                        console.log("Data loaded from CB");
                        callback(angular.fromJson(data));
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

