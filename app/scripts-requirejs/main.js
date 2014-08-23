// FIXME add map for noconflict - cf requirejs docs

/*jshint unused: vars */
requirejs.config({
    paths: {
        angular: '../../bower_components/angular/angular',
        'angular-animate': '../../bower_components/angular-animate/angular-animate',
        'angular-mocks': '../../bower_components/angular-mocks/angular-mocks',
        'angular-route': '../../bower_components/angular-route/angular-route',
        'angular-scenario': '../../bower_components/angular-scenario/angular-scenario',
        jquery: 'vendor/jquery-1.10.2.min',
        'perfect-scrollbar': 'vendor/perfect-scrollbar.min',
        'angular-perfect-scrollbar': 'vendor/angular-perfect-scrollbar'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        'angular-route': {
            deps: [
                'angular'
            ]
        },
        'angular-animate': {
            deps: [
                'angular'
            ]
        },
        'angular-mocks': {
            deps: [
                'angular'
            ],
            exports: 'angular.mock'
        },
        'perfect-scrollbar': {
            deps: [
                'jquery'
            ]
        },
        'angular-perfect-scrollbar': {
            deps: [
                'perfect-scrollbar',
                'angular'
            ]
        }
    },
    priority: [
        'angular'
    ],
    packages: [

    ]
});

// Load the main app module to start the app
requirejs(['app']);
