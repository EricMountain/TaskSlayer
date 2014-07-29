// LocalStorage layer

(function(window, angular, undefined) {

    'use strict';

    angular.module('localstorage', [])

        .factory('localstorage', ['$http', function($http) {

            function save(data) {
                localStorage.storageService = angular.toJson(data);
            }

            function load() {
                return angular.fromJson(localStorage.storageService);
            }

            return {
                save: save,
                load: load
            };
            
        }]);

})(window, window.angular);
