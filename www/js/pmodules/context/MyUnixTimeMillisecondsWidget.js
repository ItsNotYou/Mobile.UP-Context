define(['contactJS'], function(contactJS) {

    MyUnixTimeWidget.description = {
        out: [
            {
                name: 'CI_CURRENT_UNIX_TIME',
                type: 'INTEGER',
                parameterList: [["CP_UNIT", "STRING", "MILLISECONDS"]]
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

    function MyUnixTimeWidget(discoverer) {
        contactJS.Widget.call(this, discoverer);
        this.name = 'MyUnixTimeWidget';
        return this;
    }

    MyUnixTimeWidget.prototype = Object.create(contactJS.Widget.prototype);
    MyUnixTimeWidget.prototype.constructor = MyUnixTimeWidget;

    MyUnixTimeWidget.prototype._initCallbacks = function() {
        this._addCallback(new contactJS.Callback()
            .withName('UPDATE')
            .withContextInformation(this.getOutputContextInformation()));
    };

    MyUnixTimeWidget.prototype.queryGenerator = function(callback) {
        if (!Date.now) {
            Date.now = function () {
                return new Date().getTime();
            }
        }

        var response = new contactJS.ContextInformationList();
        response.put(this.getOutputContextInformation().getItems()[0].setValue(Date.now()));
        this._sendResponse(response, callback);
    };

    return MyUnixTimeWidget;
});
