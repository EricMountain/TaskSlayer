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

                        var dataInfo = "no data";
                        if (!(typeof data === 'undefined'))
                            dataInfo = data._rev;

                        console.log("Loaded from local storage: " + dataInfo);

                        return data;
                    }

                    return {
                        save: save,
                        load: load
                    };

                }]);

        })(window, window.angular);
    });
