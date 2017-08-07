define([
    'underscore',
    'backbone'
], function(_, Backbone) {

    /*
     Known events:
     - app_started
     - logged_in
     - logged_out
     - context_started
     - context_stopped
     */
    return _.clone(Backbone.Events);
});
