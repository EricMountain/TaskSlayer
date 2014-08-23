/*! Task Slayer | (c) 2014 Eric Mountain | https://github.com/EricMountain/TaskSlayer */

// Handle schema upgrades

define(['angular'],
    function() {
        'use strict';

        (function(window, angular, undefined) {

            angular.module('schema', [])

                .factory('schema', function() {

                    function latestVersion() {
                        return 8;
                    }

                    function upgrade(baseKey, data) {
                        if (typeof data === 'undefined') {
                            return initModel(baseKey);
                        } else {
                            if (!data.taskCategories) {
                                return initModel(baseKey);
                            }

                            switch(data.version) {
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                                data._id = baseKey;
                                /* falls through */
                            default:
                                data.version = latestVersion();
                            }

                            return data;
                        }
                    }

                    function initModel(baseKey) {
                        return {
                            _id: baseKey,

                            version: latestVersion(),

                            taskCategories: {
                                urgentImportant: {
                                    description: 'Now',
                                    tasks: {
                                        list: []
                                    }
                                },
                                urgent: {
                                    description: 'Delegate',
                                    tasks: {
                                        list: []
                                    }
                                },
                                important: {
                                    description: 'Schedule',
                                    tasks: {
                                        list: []
                                    }
                                },
                                waste: {
                                    description: 'Waste',
                                    tasks: {
                                        list: []
                                    }
                                }
                            }
                        };
                    }

                    return {
                        upgrade: upgrade
                    };

                });

        })(window, window.angular);
    });
