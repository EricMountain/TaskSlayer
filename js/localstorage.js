/*! Task Slayer | (c) 2014 Eric Mountain | https://github.com/EricMountain/TaskSlayer */

// LocalStorage layer

define(["angular"],
    function() {
        (function(window, angular, undefined) {

            'use strict';

            angular.module('localstorage', [])

                .factory('localstorage', ['$http', function($http) {

                    function save(data) {
                        console.log("Saving to local storage");
                        console.log(angular.toJson(data));
                        localStorage.storageService = angular.toJson(data);
                    }

                    function load() {
                        var json = localStorage.storageService;

                        console.log("Loaded from local storage:");
                        console.log(json);

                        return angular.fromJson(json);
                    }

                    return {
                        save: save,
                        load: load
                    };

                }]);

        })(window, window.angular);
    });
