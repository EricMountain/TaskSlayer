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

            function save(data, callback) {
                $http.put(defaultUrl + '/' + tasksDb + '/' + data._id, angular.toJson(data))
                    .success(function(responseData, status, headers, config) {
                        console.log("saved to CB");
                        data._rev = angular.fromJson(responseData).rev;
                        callback(data);
                    })
                    .error(function(data, status, headers, config) {
                        console.log("error saving to CB");
                        console.log(status);
                        console.log(headers);
                    });
            }

            function load(id, callback) {
                $http.get(defaultUrl + '/' + tasksDb + '/' + id)
                    .success(function(data, status, headers, config) {
                        console.log("loaded from CB");
                        callback(angular.fromJson(data));
                    })
                    .error(function(data, status, headers, config) {
                        console.log("error saving to CB");
                        console.log(status);
                        console.log(headers);
                    });
            }

            return {
                save: save,
                load: load
            };
            
        }]);

})(window, window.angular);

$(function() {


});
