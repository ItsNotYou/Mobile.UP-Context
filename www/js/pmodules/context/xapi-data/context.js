define([], function () {

    return {
        attendance: function () {
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
        }
    }
});
