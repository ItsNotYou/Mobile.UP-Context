define([
    'underscore',
    'contactJS',
    'ContextDescriptions',
    'turf'
], function (_, contactJS, ci, turf) {

    var NearBuildingsInterpreter = function (discoverer) {
        contactJS.Interpreter.call(this, discoverer);
        this.name = "NearBuildingsInterpreter";
        return this;
    };

    NearBuildingsInterpreter.description = {
        in: [ci.getRaw("CI_USER_LOCATION"), ci.getRaw("CI_AVAILABLE_BUILDINGS")],
        out: [ci.getRaw("CI_NEAR_BUILDINGS")]
    };

    NearBuildingsInterpreter.prototype = Object.create(contactJS.Interpreter.prototype);
    NearBuildingsInterpreter.prototype.constructor = NearBuildingsInterpreter;

    NearBuildingsInterpreter.prototype._interpretData = function (inContextInformation, outContextInformation, callback) {
        var userLocation = inContextInformation.getValueForContextInformationOfKind(this.getInputContextInformation().getItems()[0]);
        var availableBuildings = inContextInformation.getValueForContextInformationOfKind(this.getInputContextInformation().getItems()[1]);

        var result = [];
        if (userLocation === contactJS.ContextInformation.VALUE_UNKNOWN || availableBuildings === contactJS.ContextInformation.VALUE_UNKNOWN) {
            result = contactJS.ContextInformation.VALUE_UNKNOWN;
        } else {
            // Maximum building sizes are about 250 meter
            var allowedError = 200;
            var user = turf.point([userLocation.coords.longitude, userLocation.coords.latitude]);
            var allowedDistance = (allowedError + userLocation.coords.accuracy) / 1000;

            // Check distance between user location and building center
            result = _.filter(availableBuildings, function(building) {
                return allowedDistance > turf.distance(user, building.centroid, "kilometers");
            });
        }

        var response = outContextInformation.getItems()[0];
        response.setValue(result);
        callback([response]);
    };

    return NearBuildingsInterpreter;
});
