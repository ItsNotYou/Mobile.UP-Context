define([
    'contactJS',
    './ChangeDetector'
], function(contactJS, ChangeDetector) {

    var change = new ChangeDetector();

    var getContextValue = function(contextDescription, self) {
        var values = self.find(contextDescription);
        return values[0];
    };

    if (contactJS.ContextInformation.prototype.isOlderThan) throw "Extension failed";
    contactJS.ContextInformation.prototype.isOlderThan = function(key, age, availableContext) {
        var value = getContextValue(this, availableContext);
        return change.isOlderThan(key, age) && value.isKnown();
    };

    if (contactJS.ContextInformation.prototype.isDifferentFromLastValue) throw "Extension failed";
    contactJS.ContextInformation.prototype.isDifferentFromLastValue = function(key, availableContext) {
        var value = getContextValue(this, availableContext);
        return change.isDifferentFromLastValue(key, value.getValue()) && value.isKnown();
    };

    if (contactJS.ContextInformation.prototype.updateLastValue) throw "Extension failed";
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
