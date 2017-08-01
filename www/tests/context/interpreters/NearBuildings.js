define([
    'underscore',
    'contactJS',
    'ContextDescriptions',
    'pmodules/context/interpreters/NearBuildingsInterpreter'
], function(_, contactJS, ci, NearBuildingsInterpreter) {

    var prepareInterpreterTest = function(setup, context) {
        context.sut = new setup.sut(new contactJS.Discoverer());

        var createContextInformation = function(info) {
            var key = _.keys(info)[0];
            context[key] = ci.get(info[key]);
            return context[key];
        };

        context.inList = new contactJS.ContextInformationList();
        context.inList.putAll(_.map(setup.inList, createContextInformation));

        context.outList = new contactJS.ContextInformationList();
        context.outList.putAll(_.map(setup.outList, createContextInformation));
    };

    describe("NearBuildingsInterpreter", function() {

        beforeEach(function() {
            prepareInterpreterTest({
                sut: NearBuildingsInterpreter,
                inList: [
                    {location: "CI_USER_LOCATION"},
                    {availableBuildings: "CI_AVAILABLE_BUILDINGS"}
                ],
                outList: [
                    {nearBuildings: "CI_NEAR_BUILDINGS"}
                ]
            }, this);
        });

        it("should give unknown value if location is unknown", function(done) {
            this.location.setValueUnknown();
            this.availableBuildings.setValue([]);

            this.sut._interpretData(this.inList, this.outList, _.bind(function() {
                expect(this.nearBuildings.isKnown()).toBe(false);
                done();
            }, this));
        });

        it("should give unknown value if buildings is unknown", function(done) {
            this.location.setValue({
                coords: {
                    latitude: 52.3936253,
                    longitude: 13.1295858,
                    altitude: null,
                    accuracy: 35.9,
                    altitudeAccuracy: null,
                    heading: null,
                    speed: null
                },
                timestamp: 123456789
            });
            this.availableBuildings.setValueUnknown();

            this.sut._interpretData(this.inList, this.outList, _.bind(function() {
                expect(this.nearBuildings.isKnown()).toBe(false);
                done();
            }, this));
        });

        it("should give IFI as near building when at Griebnitzsee", function(done) {
            var ifi = {
                name: "Haus 04 - Institut für Informatik",
                centroid: {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [13.1299177, 52.3933018]
                    }
                },
                campus: "3",
                building: "4"
            };

            this.location.setValue({
                coords: {
                    latitude: 52.3936253,
                    longitude: 13.1295858,
                    altitude: null,
                    accuracy: 35.9,
                    altitudeAccuracy: null,
                    heading: null,
                    speed: null
                },
                timestamp: 123456789
            });
            this.availableBuildings.setValue([ifi]);

            this.sut._interpretData(this.inList, this.outList, _.bind(function() {
                expect(JSON.stringify(this.nearBuildings.getValue())).toBe(JSON.stringify([ifi]));
                done();
            }, this));
        });

        it("shouldn't give IFI as near building when at Golm", function(done) {
            var ifi = {
                name: "Haus 04 - Institut für Informatik",
                centroid: {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [13.1299177, 52.3933018]
                    }
                },
                campus: "3",
                building: "4"
            };

            this.location.setValue({
                coords: {
                    latitude: 52.408504,
                    longitude: 12.9712723,
                    altitude: null,
                    accuracy: 35.9,
                    altitudeAccuracy: null,
                    heading: null,
                    speed: null
                },
                timestamp: 123456789
            });
            this.availableBuildings.setValue([ifi]);

            this.sut._interpretData(this.inList, this.outList, _.bind(function() {
                expect(JSON.stringify(this.nearBuildings.getValue())).toBe("[]");
                done();
            }, this));
        });
    });

});
