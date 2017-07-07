define([
    'jquery',
    'contactJS',
    './MyUnixTimeMillisecondsWidget',
    './DummyValueWidget',
    './DummyValue2Widget'
], function($, contactJS, unixWidget, dummyWidget, dummy2Widget) {

    var _discoverer = new contactJS.Discoverer([
        unixWidget,
        dummyWidget,
        dummy2Widget
    ], []);

    var _aggregators = [];
    /*_aggregators.push(new contactJS.Aggregator(
        _discoverer,
        contactJS.ContextInformationList.fromContextInformationDescriptions(_discoverer, [
            {
                name: 'CI_DUMMY_VALUE',
                type: 'INTEGER',
                parameterList: []
            }
        ])
    ));*/

    var execStart = new Date().getTime();
    var send = function(data) {
        $.ajax({
            url: "http://141.89.174.173:9000/heartbeat",
            type: "post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            success: function() {},
            error: function() {}
        });
    };

    var onHeartbeat = function() {
        send({
            start: execStart,
            now: new Date().getTime(),
            value: 1,
            message: "onHeartbeat"
        });
    };
    var onLocation = function() {
        send({
            start: execStart,
            now: new Date().getTime(),
            value: 1,
            message: "onLocation"
        });
    };
    var onLocationFailure = function() {
        send({
            start: execStart,
            now: new Date().getTime(),
            value: 1,
            message: "onLocationFailure"
        });
    };

    document.addEventListener("deviceready", function() {
        var bgGeo = window.BackgroundGeolocation;
        bgGeo.on('location', onLocation, onLocationFailure);
        bgGeo.on('heartbeat', onHeartbeat);

        bgGeo.configure({
            // Geolocation config
            desiredAccuracy: 1000,
            distanceFilter: 10,
            stationaryRadius: 25,
            // Activity Recognition config
            activityRecognitionInterval: 10000,
            stopTimeout: 1,
            // Application config
            debug: true,  // <-- Debug sounds & notifications.
            stopOnTerminate: true,
            startOnBoot: false,
            heartbeatInterval: 5,
            preventSuspend: true
        }, function(state) {
            // This callback is executed when the plugin is ready to use.
            console.log("BackgroundGeolocation ready: " + state);
            if (!state.enabled) {
                bgGeo.start();
            }
        });

    }, false);

    /*setInterval(function() {
        var start = new Date().getTime();

        var contextInformation = new contactJS.ContextInformationList();
        _aggregators.forEach(function(aggregator) {
            contextInformation.putAll(aggregator.getOutputContextInformation());
        });

        var _d = new contactJS.Discoverer();
        var ci = contactJS.ContextInformation.fromContextInformationDescription(_d, {
            name: "CI_DUMMY_VALUE",
            type: "INTEGER",
            parameterList: []
        });

        if (contextInformation.fulfils(ci, "==", 1)) {
            // send "we have a value"
            console.log("we have a value");
            send({
                start: execStart,
                now: new Date().getTime(),
                value: 1
            });
        }

        var end = new Date().getTime();
        console.log("search took " + (end - start) + " ms");
    }, 5000);*/

    /**
     * Keeps the app awake and provides continuous geo location
     * @constructor
     */
    function BackgroundLocator() {
    }

    BackgroundLocator.prototype.keepAwake = function() {
    };

    BackgroundLocator.prototype.watchPosition = function(geolocationSuccess, geolocationError) {
    };

    return {
        _discoverer: _discoverer,
        _aggregators: _aggregators
    };

});
