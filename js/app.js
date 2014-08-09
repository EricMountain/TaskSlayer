// FIXME add map for noconflict - cf requirejs docs

requirejs.config({
    "baseUrl": "js/vendor",
    "paths": {
		"app": "..",
		"jquery": "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min",
		"angular": "//ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.16/angular",
		"angular-route": "//ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.16/angular-route",
		"angular-animate": "//ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.16/angular-animate",
		"perfect-scrollbar": "perfect-scrollbar.min",
		"angular-perfect-scrollbar": "angular-perfect-scrollbar"
    },
	"shim": {
		'angular-route': {
			deps: ['angular']
		},
		'angular-animate': {
			deps: ['angular']
		},
		'perfect-scrollbar': {
			deps: ['jquery']
		},
		"angular-perfect-scrollbar": {
			deps: ['perfect-scrollbar', 'angular']
		}
	}
});

// Load the main app module to start the app
requirejs(["app/main"]);
