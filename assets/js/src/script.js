window.Project = (function (window, document, $, undefined) {
    'use strict';

    var app = {

        initialize: function () {
            console.log('working');

        },

    };

    $(document).ready(app.initialize);

    return app;

})(window, document, jQuery);
