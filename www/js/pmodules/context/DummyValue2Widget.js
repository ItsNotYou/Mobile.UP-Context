define(['contactJS'], function(contactJS) {

    DummyValue2Widget.description = {
        out: [
            {
                name: 'CI_DUMMY_VALUE',
                type: 'INTEGER',
                parameterList: []
            }
        ],
        const: [
            {
                name: '',
                type: ''
            }
        ],
        updateInterval: 5000
    };

    function DummyValue2Widget(discoverer) {
        contactJS.Widget.call(this, discoverer);
        this.name = 'DummyValue2Widget';
        return this;
    }

    DummyValue2Widget.prototype = Object.create(contactJS.Widget.prototype);
    DummyValue2Widget.prototype.constructor = DummyValue2Widget;

    DummyValue2Widget.prototype._initCallbacks = function() {
        this._addCallback(new contactJS.Callback()
            .withName('UPDATE')
            .withContextInformation(this.getOutputContextInformation()));
    };

    DummyValue2Widget.prototype.queryGenerator = function(callback) {
        console.log("Value requested, DummyValue2Widget answering now");
        var result = 2;

        var response = new contactJS.ContextInformationList();
        response.put(this.getOutputContextInformation().getItems()[0].setValue(result));
        this._sendResponse(response, callback);
    };

    return DummyValue2Widget;
});
