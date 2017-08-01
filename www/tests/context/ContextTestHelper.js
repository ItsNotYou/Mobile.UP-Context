define([
    'underscore',
    'contactJS',
    'ContextDescriptions'
], function(_, contactJS, ci) {

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

    return {
        prepareInterpreterTest: prepareInterpreterTest
    };
});
