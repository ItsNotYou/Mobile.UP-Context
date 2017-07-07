define(['contactJS'], function(contactJS) {

    DummyValueWidget.description = {
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

    function DummyValueWidget(discoverer) {
        contactJS.Widget.call(this, discoverer);
        this.name = 'DummyValueWidget';
        return this;
    }

    DummyValueWidget.prototype = Object.create(contactJS.Widget.prototype);
    DummyValueWidget.prototype.constructor = DummyValueWidget;

    DummyValueWidget.prototype._initCallbacks = function() {
        this._addCallback(new contactJS.Callback()
            .withName('UPDATE')
            .withContextInformation(this.getOutputContextInformation()));
    };

    DummyValueWidget.prototype.queryGenerator = function(callback) {
        console.log("Value requested, DummyValueWidget answering now");
        var result = 1;

        var response = new contactJS.ContextInformationList();
        response.put(this.getOutputContextInformation().getItems()[0].setValue(result));
        this._sendResponse(response, callback);
    };

    return DummyValueWidget;
});
