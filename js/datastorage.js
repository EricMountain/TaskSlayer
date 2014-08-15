/*! Task Slayer | (c) 2014 Eric Mountain | https://github.com/EricMountain/TaskSlayer */

// Data storage layer

define(["angular", "./localstorage", "./couchstorage", "./schema"],
    function() {
        (function(window, angular, undefined) {

            'use strict';

            angular.module('datastorage', [])

                .factory('datastorage', ['localstorage', 'couchstorage', 'schema', function(localstorage, couchstorage, schema) {

                    function save(data, conflictResolution) {
                        couchstorage.save(data, conflictResolution);
                        localstorage.save(data);
                    }

                    //function savePartial(key, datum) {
                    //    couchstorage.savePartial(key, datum, function(datum) { localstorage.savePartial(key, datum) });
                    //}

                    function load(keyBase, callback) {
                        couchstorage.load(keyBase, function(data) {

                            if (data === undefined) {
                                console.log("No data from CouchDB, relying on local storage");
                                data = localstorage.load();
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
