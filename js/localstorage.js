/*! Task Slayer | (c) 2014 Eric Mountain | https://github.com/EricMountain/TaskSlayer */

// LocalStorage layer

define(["angular"],
    function() {
        (function(window, angular, undefined) {

            'use strict';

            angular.module('localstorage', [])

                .factory('localstorage', ['$http', function($http) {

                    function save(data) {
                        console.log("Saving to local storage: " + data._rev);

                        localStorage.storageService = angular.toJson(data);
                    }

                    function load() {
                        var json = localStorage.storageService;
                        var data = angular.fromJson(json);

                        console.log("Loaded from local storage: " + data._rev);

                        return data;
                    }

                    return {
                        save: save,
                        load: load
                    };

                }]);

        })(window, window.angular);
    });
