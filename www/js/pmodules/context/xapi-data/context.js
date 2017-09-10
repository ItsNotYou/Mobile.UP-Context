define([
    './activities'
], function (activities) {

    return {
        attendance_simple: function () {
            return {
                "contextActivities": {
                    "category": [
                        {
                            "id": "http://xapi.trainingevidencesystems.com/recipes/attendance/0_0_1#simple",
                            "definition": {
                                "type": "http://id.tincanapi.com/activitytype/recipe"
                            },
                            "objectType": "Activity"
                        }
                    ]
                }
            };
        },
        attendance_detailed: function () {
            return {
                "contextActivities": {
                    "category": [
                        {
                            "id": "http://xapi.trainingevidencesystems.com/recipes/attendance/0_0_1#detailed",
                            "definition": {
                                "type": "http://id.tincanapi.com/activitytype/recipe"
                            },
                            "objectType": "Activity"
                        }
                    ]
                }
            };
        },
        statement_source: function() {
            return {
                "contextActivities": {
                    "category": [
                        {
                            "id": "http://mobileup.uni-potsdam.de/",
                            "definition": {
                                "type": "http://id.tincanapi.com/activitytype/source"
                            }
                        }
                    ]
                }
            }
        },
        semester_activity: function(semesterSC) {
            return {
                "contextActivities": {
                    "other": [
                        activities.semester(semesterSC)
                    ]
                }
            }
        }
    }
});
