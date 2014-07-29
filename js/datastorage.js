// Data storage layer

(function(window, angular, undefined) {

    'use strict';

    angular.module('datastorage', [])

        .factory('datastorage', ['localstorage', 'couchstorage', function(localstorage, couchstorage) {

            function save(data, callback) {
                //var json = angular.toJson(data);
                //localstorage.save(json);
                couchstorage.save(data, function(data) { localstorage.save(data) });
            }

            function load(id, callback) {                
                couchstorage.load(id, function(data) {
                    var lsData = localstorage.load();

                    // check rev and CdB avail here
                    if (!data) {
                        data = lsData;
                    }
                    
                    callback(data);
                });
            }

            return {
                save: save,
                load: load
            };
            
        }]);

})(window, window.angular);
