/**
 * Test URL Field module for ProcessWire
 * https://goo.gl/GRM0jp
 */

$(document).ready(function () {

    var TUF = {
        parent: '.InputfieldURL',
        selector: 'input:not([type="hidden"])',
        lockedFields: '.collapsed7, .collapsed8',
        TUFlink: '<a href="#" class="tuf-link" target="_blank"><i class="fa fa-arrow-right"></i></a>',
        dummyFieldSelector: 'TUF-dummy',
        mode: (config.TUF && config.TUF.mode) ? config.TUF.mode : 'button-left',
        forceHttp: (config.TUF && config.TUF.forceHttp) ? config.TUF.forceHttp : true,
        enabled_fields: (config.TUF && config.TUF.enabled_fields) ? config.TUF.enabled_fields : false,
        enabled_templates: (config.TUF && config.TUF.enabled_templates) ? config.TUF.enabled_templates : false,
        template: (config.TUF && config.TUF.template) ? config.TUF.template : false
    };

    // get button height with a dummy element
    $('body').append('<input class="' + TUF.dummyFieldSelector + '">');
    TUF.btnHeight = $('.' + TUF.dummyFieldSelector).outerHeight() - 2;
    $('.' + TUF.dummyFieldSelector).remove();

    TUF.selector = TUF.parent + ' ' + TUF.selector;

    // continue if template is not among enabled templates
    if (TUF.enabled_templates && TUF.template) {
        if (TUF.enabled_templates.indexOf(TUF.template) === -1) {
            return true;
        }
    }

    $(document).on('ready reloaded wiretabclick', initTUF);

    function initTUF() {

        // linkify fields with locked status
        if ($(TUF.parent).is(TUF.lockedFields)) {

            $(TUF.parent).filter(TUF.lockedFields).find('.InputfieldContent').each(function () {

                var content = $(this).html().trim();

                if (content && content !== "" && content !== "&nbsp;" && !$(this).find('a').length) {
                    $(this).wrapInner(function () {
                        return '<a href="' + content + '" target="_blank"></a>';
                    });
                }
            });

            return true;
        }

        else if ($(TUF.selector).length) {

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

                    if (TUF.btnHeight > 0) {
                        currInput.next('.tuf-link').css({
                            'height': TUF.btnHeight + 'px',
                            'line-height': TUF.btnHeight - 1 + 'px'
                        });
                    }
                }, 0);

                // disable adding link and events twice (ajax loaded tabs and fields)
                if (currInput.next('.tuf-link').length) {
                    return true;
                }

                if (TUF.mode === 'button-right' || TUF.mode === 'button-left') {

                    currInput.after(TUF.TUFlink);

                    if (TUF.mode === 'button-left') {
                        $('body').addClass('tuf-left');
                    } else {
                        $('body').addClass('tuf-right');
                    }

                    currInput.on('keyup fieldchange', function () {

                        var url = getUrl(currInput.val(), TUF.forceHttp),
                            link = currInput.next('.tuf-link');

                        if (url) {
                            link.attr('href', url).removeClass('tuf-hide');
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
