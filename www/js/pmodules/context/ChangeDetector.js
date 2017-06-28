define([], function() {

    var localStorageKey = "context-change";
    var values = {};

    // Taken from backbone.fetch-cache
    var supportLocalStorage = (function() {
        var supported = typeof window.localStorage !== 'undefined';
        if (supported) {
            try {
                // impossible to write on some platforms when private browsing is on and
                // throws an exception = local storage not supported.
                localStorage.setItem('test_support', 'test_support');
                localStorage.removeItem('test_support');
            } catch (e) {
                supported = false;
            }
        }
        return supported;
    })();

    var getLocalValue = function(key) {
        if (supportLocalStorage) {
            values = JSON.parse(localStorage.getItem(localStorageKey) || '{}');
        }
        return values[key];
    };

    var setLocalValue = function(key, value) {
        values[key] = value;
        if (supportLocalStorage) {
            try {
                localStorage.setItem(localStorageKey, JSON.stringify(values));
            } catch(err) {
                var code = err.code || err.number || err.message;
                if (code === 22) {
                    localStorage.removeItem(localStorageKey);
                } else {
                    throw(err);
                }
            }
        }
    };

    var ChangeDetector = function() {};

    ChangeDetector.prototype.isDifferentFromLastValue = function(key, value) {
        var expected = JSON.stringify(getLocalValue(key));
        var actual = JSON.stringify(value);
        return expected !== actual;
    };

    ChangeDetector.prototype.updateLastValue = function(key, value) {
        var former = getLocalValue(key);
        setLocalValue(key, value);
        return former;
    };

    return ChangeDetector;
});
