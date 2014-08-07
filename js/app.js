// FIXME add map for noconflict - cf requirejs docs

requirejs.config({
    "baseUrl": "js/vendor",
    "paths": {
		"app": "..",
		"jquery": "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min",
		"angular": "//ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.16/angular",
		"angular-route": "//ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.16/angular-route",
		"angular-animate": "//ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.16/angular-animate"
    }
});

// Load the main app module to start the app
requirejs(["app/main"]);
