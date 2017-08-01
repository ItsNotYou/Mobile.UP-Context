define(['ADL'], function (xapi) {

    var serviceProviders = {
        "facebook": "http://www.facebook.com/"
    };

    return {
        service: function (provider, identity) {
            if (!serviceProviders[provider]) {
                throw "Unsupported service provider";
            }
            if (!identity) {
                throw "Identity required";
            }

            return {
                "id": serviceProviders[provider],
                "definition": {
                    "name": {
                        "en-US": "service"
                    },
                    "description": {
                        "en-US": "Represents any form of hosted or consumable service that performs some kind of work or benefit for other entities. Examples of such objects include websites, businesses, etc."
                    },
                    "type": "http://activitystrea.ms/schema/1.0/service",
                    "extensions": {
                        "http://id.tincanapi.com/extension/account": identity
                    }
                },
                "objectType": "Activity"
            };
        },
        device: function (deviceUuid, extensions) {
            extensions = extensions || {};

            if (!deviceUuid) {
                throw "Device uuid required";
            }

            var result = {
                "id": "http://xapi.uni-potsdam.de/device/" + deviceUuid,
                "definition": {
                    "name": {
                        "en-US": "device"
                    },
                    "description": {
                        "en-US": "Represents a device of any sort."
                    },
                    "type": "http://activitystrea.ms/schema/1.0/device",
                    "extensions": {}
                },
                "objectType": "Activity"
            };

            if (extensions.languageCode) {
                result.definition.extensions["http://id.tincanapi.com/extension/language"] = extensions.languageCode;
            }

            if (extensions.phoneNumbers) {
                result.definition.extensions["http://id.tincanapi.com/extension/phonenumbers"] = extensions.phoneNumbers;
            }

            return result;
        },
        place: function (location) {
            if (!location || !location.latitude || !location.longitude) {
                throw "Location with latitude and longitude required";
            }

            return {
                "id": "http://xapi.uni-potsdam.de/place/" + xapi.ADL.ruuid(),
                "definition": {
                    "name": {
                        "en-US": "place"
                    },
                    "description": {
                        "en-US": "Represents a physical location. Locations can be represented using geographic coordinates, a physical address, a free-form location name, or any combination of these. Objects of this type MAY contain the additional properties specified in Section 3.5."
                    },
                    "type": "http://activitystrea.ms/schema/1.0/place",
                    "extensions": {
                        "http://id.tincanapi.com/extension/geojson": {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [location.longitude, location.latitude]
                            }
                        }
                    }
                },
                "objectType": "Activity"
            };
        },
        event: function(course) {
            if (!course.semesterSC) {
                debugger;
                throw "Course semester required";
            }
            if (!course.courseId) {
                debugger;
                throw "Course course id required";
            }

            return {
                "id": "http://xapi.uni-potsdam.de/event/" + course.semesterSC + "/" + course.courseId,
                "definition": {
                    "name": {
                        "en-US": course.courseName ? course.courseName : "event"
                    },
                    "description": {
                        "en-US": "Represents an event that occurs at a certain location during a particular period of time. Objects of this type MAY contain the additional properties specified in Section 3.3."
                    },
                    "type": "http://activitystrea.ms/schema/1.0/event"
                },
                "objectType": "Activity"
            }
        },
        /**
         *
         * @param event
         * @param event.semesterSC
         * @param event.courseId
         * @param event.startTime
         * @param event.lecturers
         * @param event.lecturers.lecturer
         * @param [event.courseName=event]
         * @returns xAPI activity
         */
        courseEvent: function (event) {
            if (!event.semesterSC) {
                throw "Event semester required";
            }
            if (!event.courseId) {
                throw "Event header id required";
            }

            return {
                "id": "http://xapi.uni-potsdam.de/event/" + event.semesterSC + "/" + event.courseId,
                "definition": {
                    "name": {
                        "en-US": event.courseName ? event.courseName : "event"
                    },
                    "description": {
                        "en-US": "Represents an event that occurs at a certain location during a particular period of time. Objects of this type MAY contain the additional properties specified in Section 3.3."
                    },
                    "type": "http://activitystrea.ms/schema/1.0/event"
                },
                "objectType": "Activity"
            }
        },
        heartbeat: function() {
            return {
                "id": "http://xapi.uni-potsdam.de/debug/heartbeat/" + xapi.ADL.ruuid(),
                "definition": {
                    "name": {
                        "en-US": "Heartbeat"
                    },
                    "description": {
                        "en-US": "Represents a keepalive message within an application."
                    },
                    "type": "http://activitystrea.ms/schema/1.0/alert"
                },
                "objectType": "Activity"
            }
        }
    }
});
