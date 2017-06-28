define([
    'contactJS',
    './ChangeDetector'
], function(contactJS, ChangeDetector) {

    var change = new ChangeDetector();

    var getContextValue = function(contextDescription, self) {
        var values = self.find(contextDescription);
        return values[0];
    };

    contactJS.ContextInformation.prototype.isDifferentFromLastValue = function(key, availableContext) {
        var value = getContextValue(this, availableContext);
        return change.isDifferentFromLastValue(key, value.getValue()) && value.isKnown();
    };

    contactJS.ContextInformation.prototype.updateLastValue = function(key, availableContext) {
        var value = getContextValue(this, availableContext).getValue();
        var former = change.updateLastValue(key, value);
        return {
            current: value,
            former: former
        };
    };
    
    return contactJS;
});
