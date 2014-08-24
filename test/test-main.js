var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    // Removed "Spec" naming from files
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/app/scripts-requirejs',

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

/*    shim: {
        'angular' : {'exports' : 'angular'},
        'angular-route': ['angular'],
        'angular-animate': ['angular'],
        'angular-mocks': {
          deps:['angular'],
          'exports':'angular.mock'
        }
    },
*/
    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
