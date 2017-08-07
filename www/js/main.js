require.config({
    //Standardmäßig alles aus dem lib-Pfad laden
    baseUrl: 'js',
    //waitSeconds: 10,
    paths: {
        // Frameworks
    	'templates': '../templates',
    	'controllers': 'controllers',
    	'jquery': 'vendor/jquery',
        'jquerymobile-config': 'jqm-config',
    	'jquerymobile': 'vendor/jquery.mobile',
        'datebox': 'vendor/jqm-datebox',
    	'underscore': 'vendor/underscore-min',
        'underscore.string': 'vendor/underscore.string.min',
    	'backbone': 'vendor/backbone-min',
		'backboneMVC': 'vendor/backbone-mvc',
        'cache': 'vendor/backbone.fetch-cache',
        'geojson': 'lib/GeoJSON',
        'moment': 'vendor/moment-with-locales',
        'view.utils': 'lib/view.utils',
        'date': 'vendor/date',
        'LocalStore': 'lib/ls-store',
        'fastclick': 'vendor/fastclick.min',
        'hammerjs': 'vendor/hammer',
        'uri': 'vendor/src',
        'AppEvents': 'lib/AppEvents',
        'turf': 'vendor/turf.min',
        // Testing frameworks
        'jasmine': 'https://cdnjs.cloudflare.com/ajax/libs/jasmine/2.7.0/jasmine',
        'jasmine-html': 'https://cdnjs.cloudflare.com/ajax/libs/jasmine/2.7.0/jasmine-html',
        'jasmine-boot': 'https://cdnjs.cloudflare.com/ajax/libs/jasmine/2.7.0/boot',
        // Our own libraries
        'PulsAPI': 'lib/PulsAPI',
        'utils': 'lib/utils',
        'history': 'lib/history',
        'moodle.download': 'lib/moodle.download',
        'login.sso': 'lib/login.sso',
        'stateful.models': 'lib/StatefulModels',
        'headerParser': 'lib/headerParser',
        // RequireJS plugins
        'text': 'vendor/require-extensions/text',
        'async': 'vendor/require-extensions/async',
        'font': 'vendor/require-extensions/font',
        'goog': 'vendor/require-extensions/goog',
        'image': 'vendor/require-extensions/image',
        'json': 'vendor/require-extensions/json',
        'noext': 'vendor/require-extensions/noext',
        'mdown': 'vendor/require-extensions/mdown',
        'propertyParser': 'vendor/require-extensions/propertyParser',
        'markdownConverter': 'vendor/require-extensions/Markdown.Converter'
    },
    shim: {
        'jasmine-html': { deps : ['jasmine'] },
        'jasmine-boot': { deps : ['jasmine', 'jasmine-html'] }
    },
    // "Paths configurations should only be used for folders, not modules themselves.
    // Map configurations apply to individual modules." See
    //
    // http://stackoverflow.com/questions/12271152/relative-path-doesnt-work-with-paths
    //
    // for details
    map: {
        '*': {
            // opening_hours has to be defined in map configuration, otherwise relative
            // dependencies won't be resolved correctly
            'opening_hours': 'vendor/opening_hours',
            'i18next': 'vendor/i18next',
            'i18next-xhr-backend': 'vendor/i18nextXHRBackend.min',
            'suncalc': 'vendor/suncalc',
            'i18next-client': 'vendor/i18next.amd',
            // Context implementation
            'ContextDetector': 'pmodules/context/ContextDetector',
            'ContextDescriptions': 'pmodules/context/ContextDescriptions',
            'StatementSender': 'pmodules/context/statement-sender/StatementSender',
            'AdaptationEngine': 'vendor/contactJS/AdaptationEngine',
            'contactJS': 'vendor/contactJS/contactJS',
            'MathUuid': 'vendor/contactJS/MathUuid',
            'widgets': 'pmodules/context/widgets/widgets',
            'interpreters': 'pmodules/context/interpreters/interpreters',
            // xAPI
            'ADL': 'vendor/xapiwrapper.min'
        }
    }
});

requirejs.onError = function(error){
	var failedId = error.requireModules && error.requireModules[0];

	if(error.requireType === 'timeout'){
		console.log('Timeout of RequireJS-Module:'+error.requireModules);
	}else{
		throw error;
	}
};

// Run app or run tests?
if (typeof test_runner === "undefined") {

    // Unfortunately, requirejs cannot force jquerymobile to load after jqm-config. Therefore, we have to force this dependency by modifying the jQuery Mobile code base. See
    //
    // https://github.com/jrburke/requirejs/issues/358
    //
    // for details
    require(['jquery', 'jquerymobile-config', 'jquerymobile', 'app'], function () {
        app.initialize();
    });

} else {

    test_runner();

}
