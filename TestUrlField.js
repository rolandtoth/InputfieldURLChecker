/**
 * Test URL Field module for ProcessWire
 * https://goo.gl/GRM0jp
 */

$(document).ready(function () {

    var TUF = {
        parent: '.InputfieldURL',
        selector: 'input:not([type="hidden"])',
        asmSelectPlaceholder: 'data-asm-placeholder',
        lockedFields: '.collapsed7, .collapsed8',
        TUFlink: '<a href="#" class="tuf-link" target="_blank"><i class="fa fa-arrow-right"></i></a>',
        dummyFieldSelector: 'TUF-dummy',
        mode: (config.TUF && config.TUF.mode) ? config.TUF.mode : 'button-left',
        forceHttp: (config.TUF && config.TUF.forceHttp) ? config.TUF.forceHttp : true,
        enabled_fields: (config.TUF && config.TUF.enabled_fields) ? config.TUF.enabled_fields : false,
        enabled_templates: (config.TUF && config.TUF.enabled_templates) ? config.TUF.enabled_templates : false,
        template: (config.TUF && config.TUF.template) ? config.TUF.template : false
    };


    // stop if template is not among enabled templates
    // but skip if on own module edit page
    if ($('form#ModuleEditForm').attr('action') !== 'edit?name=TestUrlField') {
        if (TUF.enabled_templates && TUF.template) {
            if (TUF.enabled_templates.indexOf(TUF.template) === -1) {
                return true;
            }
        }
    }

    // get button height with a dummy element
    $('body').append('<input class="' + TUF.dummyFieldSelector + '">');
    TUF.btnHeight = $('.' + TUF.dummyFieldSelector).outerHeight() - 2;
    $('.' + TUF.dummyFieldSelector).remove();

    TUF.selector = TUF.parent + ' ' + TUF.selector;

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

                        link.attr('href', url);

                        if (url) {
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


    /**
     * Add placeholder to asmSelect
     * Selector: http://stackoverflow.com/questions/10641258/jquery-select-data-attributes-that-arent-empty#answer-23944081
     */
    $(function () {
        $('select[' + TUF.asmSelectPlaceholder + '!=""][' + TUF.asmSelectPlaceholder + ']').each(function () {

            var placeholder = $(this).data('asmPlaceholder');

            if (placeholder) {
                $(this).parent().find('.asmSelect option:first').attr({
                    'selected': true,
                    'disabled': true
                }).text(placeholder);
            }
        });
    });

});


/**
 * Get url with or without "http://"
 *
 * @param url
 * @param forcePrefix
 * @returns {*}
 */
function getUrl(url, forcePrefix) {
    var prefix = 'http://';
    return (forcePrefix && url != "" && url.indexOf(prefix) === -1) ? prefix + url : url;
}
