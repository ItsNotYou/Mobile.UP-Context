define([
    'contactJS'
], function (contactJS) {

    var contextDescriptions = {
        CI_ATTENDED_COURSES: {
            name: "CI_ATTENDED_COURSES",
            type: "ARRAY",
            parameterList: [["CP_UNIT", "OBJECT", "COURSE"]]
        },
        CI_CURRENTLY_ATTENDED_COURSES: {
            name: "CI_CURRENTLY_ATTENDED_COURSES",
            type: "ARRAY",
            parameterList: [["CP_UNIT", "OBJECT", "COURSE_EVENT"]]
        },
        CI_CURRENTLY_RUNNING_COURSES: {
            name: "CI_CURRENTLY_RUNNING_COURSES",
            type: "ARRAY",
            parameterList: [["CP_UNIT", "OBJECT", "COURSE_EVENT"], ["CP_UNIT", "TIMESPAN", "EXACT"]]
        },
        CI_CURRENTLY_RUNNING_COURSES_FUZZY: {
            name: "CI_CURRENTLY_RUNNING_COURSES",
            type: "ARRAY",
            parameterList: [["CP_UNIT", "OBJECT", "COURSE_EVENT"], ["CP_UNIT", "TIMESPAN", "FUZZY"]]
        },
        CI_CURRENT_DATETIME: {
            name: "CI_CURRENT_DATETIME",
            type: "DATE",
            parameterList: [["CP_UNIT", "STRING", "ISO-8601"]]
        },
        CI_USER_LOCATION: {
            name: "CI_USER_LOCATION",
            type: "POSITION",
            parameterList: [["CP_UNIT", "OBJECT", "POSITION"]]
        },
        CI_AVAILABLE_BUILDINGS: {
            name: "CI_AVAILABLE_BUILDINGS",
            type: "ARRAY",
            parameterList: [["CP_UNIT", "OBJECT", "BUILDING"]]
        },
        CI_NEAR_BUILDINGS: {
            name: "CI_NEAR_BUILDINGS",
            type: "ARRAY",
            parameterList: [["CP_UNIT", "OBJECT", "BUILDING"]]
        },
        CI_REGISTERED_ACCOUNTS: {
            name: "CI_REGISTERED_ACCOUNTS",
            type: "ARRAY",
            parameterList: [["CP_UNIT", "OBJECT", "ACCOUNT"]]
        },
        CI_SERVICE_PROVIDER: {
            name: "CI_SERVICE_PROVIDER",
            type: "ARRAY",
            parameterList: [["CP_UNIT", "OBJECT", "SERVICE_PROVIDER"]]
        },
        CI_DEVICE_PHONE_NUMBERS: {
            name: "CI_DEVICE_PHONE_NUMBERS",
            type: "ARRAY",
            parameterList: [["CP_UNIT", "OBJECT", "PHONE_NUMBERS"]]
        },
        CI_DEVICE_LANGUAGE: {
            name: "CI_DEVICE_LANGUAGE",
            type: "LANGUAGE",
            parameterList: [["CP_UNIT", "STRING", "BCP-47"]]
        },
        CI_DEVICE_UUID: {
            name: "CI_DEVICE_UUID",
            type: "UUID",
            parameterList: [["CP_UNIT", "STRING", "RFC-4122"], ["CP_UNIT", "VERSION", "v4"]]
        }
    };

    var ContextDescriptions = function () {
        this._discoverer = new contactJS.Discoverer();
    };

    /**
     * Retrieves the raw context information description as used by widgets and interpreters if available. Throws an error if the given name is not found
     * @param {String} contextName Common name of the context information description
     * @returns {Object} context Context information description as a raw object
     * @returns {String} context.name
     * @returns {String} context.type
     * @returns {Array} context.parameterList
     * @throws error if the contextName is not known
     */
    ContextDescriptions.prototype.getRaw = function (contextName) {
        var result = contextDescriptions[contextName];
        if (!result) {
            if (console.error) console.error("The requested contextName '" + contextName + "' is not available");
            throw "The requested contextName '" + contextName + "' is not available";
        } else {
            return result;
        }
    };

    /**
     * Retrieves the context information description as used by rules if available. Throws an error if the given name is not found
     * @param {String} contextName Common name of the context information description
     * @returns {ContextInformation} context Context information description
     * @throws error if the contextName is not known
     */
    ContextDescriptions.prototype.get = function (contextName) {
        var result = this.getRaw(contextName);
        return contactJS.ContextInformation.fromContextInformationDescription(this._discoverer, result);
    };

    return new ContextDescriptions();
});
