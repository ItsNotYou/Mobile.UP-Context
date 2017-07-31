define([
    'underscore',
    'contactJS',
    'ContextDescriptions',
    'turf',
    'pmodules/sitemap/sitemap.models'
], function(_, contactJS, ci, turf, sitemap) {

    var AvailableBuildingsWidget = function(discoverer) {
        contactJS.Widget.call(this, discoverer);
        this.name = "AvailableBuildingsWidget";
        return this;
    };

    AvailableBuildingsWidget.prototype = Object.create(contactJS.Widget.prototype);
    AvailableBuildingsWidget.prototype.constructor = AvailableBuildingsWidget;

    AvailableBuildingsWidget.prototype._initCallbacks = function() {
        this._addCallback(new contactJS.Callback()
            .withName('UPDATE')
            .withContextInformation(this.getOutputContextInformation()));
    };

    AvailableBuildingsWidget.description = {
        out: [ci.getRaw("CI_AVAILABLE_BUILDINGS")],
        const: [{ name: "", type: "" }],
        updateInterval: 1000 * 60 * 24 // once per day
    };

    AvailableBuildingsWidget.prototype.queryGenerator = function(callback) {
        var finish = _.bind(function(result) {
            var response = new contactJS.ContextInformationList();
            response.put(this.getOutputContextInformation().getItems()[0].setValue(result));
            this._sendResponse(response, callback);
        }, this);

        // Load sitemap buildings
        var buildings = new sitemap.GeoCollection();
        buildings.fetch().done(function() {
            // Extract the available info as far as possible
            var result = buildings.chain()
                .map(function(model) {
                    // Take name
                    var name = model.get("name");

                    // Calculate building centroid
                    var centroid = turf.centroid(model.get("geo"));

                    // Try to extract the house number
                    var building = undefined;
                    var prefix = "Haus ";
                    if (name && name.startsWith(prefix)) {
                        // The house name could be "Haus 26" or "Haus 10a"
                        building = name.substr(prefix.length);
                        // Remove leading zeros
                        while (building.length > 0 && building[0] === '0') {
                            building = building.substr(1);
                        }
                    }

                    // Try to translate campus
                    var campusMap = {
                        "neuespalais": "1",
                        "golm": "2",
                        "griebnitzsee": "3"
                    };
                    var campus = campusMap[model.get("campus")];

                    return {
                        name: name,
                        centroid: centroid,
                        campus: campus,
                        building: building
                    };
                })
                .filter(function(geo) {
                    // Remove incomplete elements
                    return geo.name && geo.centroid && geo.campus && geo.building;
                })
                .value();

            finish(result);
        }).fail(function() {
            // Something went wrong while loading the buildings
            finish(contactJS.ContextInformation.VALUE_UNKNOWN);
        });
    };

    return AvailableBuildingsWidget;
});
