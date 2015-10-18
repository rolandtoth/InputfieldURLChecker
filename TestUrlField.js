$(document).ready(function () {

    var TUF = {
        parent: '.InputfieldURL',
        selector: 'input',
        testLink: '<a href="#" class="tuf-link" target="_blank"><i class="fa fa-arrow-right"></i></a>',
        mode: (config.TUF && config.TUF.mode) ? config.TUF.mode : 'button',
        forceHttp: (config.TUF && config.TUF.forceHttp) ? config.TUF.forceHttp : false,
        enabled_fields: (config.TUF && config.TUF.enabled_fields) ? config.TUF.enabled_fields : false
    };

    TUF.selector = TUF.parent + ' ' + TUF.selector;

    $(document).on('ready wiretabclick', function ($event, $newTab) {
        initTUF();
    });

    function initTUF() {

        if ($(TUF.selector).length) {

            $(TUF.selector).each(function () {

                var currInput = $(this);

                // continue if field is not among enabled fields
                if (TUF.enabled_fields) {
                    TUF.enabled_fields = TUF.enabled_fields.replace(' ', '');
                    TUF.enabled_fields = '.Inputfield_' + TUF.enabled_fields.replace(',', ', .Inputfield_');

                    if (!$(parent).is(TUF.enabled_fields)) {
                        return true;
                    }
                }

                // set link height
                setTimeout(function () {

                    if (TUF.mode === 'button') {
                        var btnHeight = currInput.outerHeight();

                        if ($('body').hasClass('AdminThemeReno')) {
                            btnHeight -= 2;
                        }
                    }

                    if (btnHeight > 0) {
                        currInput.next('.tuf-link').css({
                            'height': btnHeight + 'px',
                            'line-height': btnHeight + 'px'
                        });
                    }
                }, 0);

                // disable adding link and events twice (ajax loaded tabs)
                if (currInput.next().hasClass('tuf-link')) {
                    return true;
                }

                if (TUF.mode === 'button') {

                    currInput.after(TUF.testLink);

                    currInput.on('keyup fieldchange', function () {

                        var url = getUrl(currInput.val(), TUF.forceHttp),
                            link = currInput.next('.tuf-link');

                        if (url) {
                            link.attr('href', url);
                            link.removeClass('tuf-hide');
                        } else {
                            link.addClass('tuf-hide')
                        }
                    });

                    // populate on load
                    currInput.trigger('fieldchange');

                } else if (TUF.mode === 'ctrl-shift-click') {

                    $(TUF.selector).on('click', function (e) {

                        e.preventDefault();

                        if (e.ctrlKey && e.shiftKey) {
                            window.open(getUrl(currInput.val(), TUF.forceHttp));
                        }

                        return false;
                    })

                } else if (TUF.mode === 'ctrl-shift-enter') {

                    $(TUF.selector).on('keydown', function (e) {

                        e.preventDefault();

                        if (e.ctrlKey && e.shiftKey && (e.keyCode == 10 || e.keyCode == 13)) {
                            window.open(getUrl(currInput.val(), TUF.forceHttp));
                        }

                        return false;
                    })
                }
            });
        }
    }
});


function getUrl(url, forcePrefix) {
    var prefix = 'http://';
    return (forcePrefix && url != "" && url.indexOf(prefix) === -1) ? prefix + url : url;
}
