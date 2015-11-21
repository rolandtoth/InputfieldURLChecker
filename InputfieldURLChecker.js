/**
 * InputfieldURLChecker module for ProcessWire
 * https://github.com/rolandtoth/InputfieldURLChecker
 */

$(document).ready(function () {

    var IUC = {
        parent: '.InputfieldURL',
        selector: 'input:not([type="hidden"])',
        asmSelectPlaceholder: 'data-asm-placeholder',
        linkClass: 'iuc-button',
        linkHiddenClass: 'iuc-hide',
        lockedFields: '.collapsed7, .collapsed8',
        button: '<a class="iuc-button" target="_blank"><i class="fa fa-arrow-right"></i></a>',
        iframeSelector: 'iuc-iframe',
        overlaySelector: 'iuc-overlay',
        dummyFieldSelector: 'IUC-dummy',
        mode: (config.IUC && config.IUC.mode) ? config.IUC.mode.toString().split(',') : 'button-left',
        target: (config.IUC && config.IUC.target) ? config.IUC.target : 'new-window',
        buttonPosition: (config.IUC && config.IUC.buttonPosition) ? config.IUC.buttonPosition : 'button-left',
        forceHttp: (config.IUC && config.IUC.forceHttp !== 'undefined') ? config.IUC.forceHttp : true,
        enabled_fields: (config.IUC && config.IUC.enabled_fields) ? config.IUC.enabled_fields : false,
        enabled_templates: (config.IUC && config.IUC.enabled_templates) ? config.IUC.enabled_templates : false,
        template: (config.IUC && config.IUC.template) ? config.IUC.template : false
    };


    // stop if template is not among enabled templates
    // but skip if on own module edit page
    if ($('form#ModuleEditForm').attr('action') !== 'edit?name=InputfieldURLChecker') {
        if (IUC.enabled_templates && IUC.template) {
            if (IUC.enabled_templates.indexOf(IUC.template) === -1) {
                return true;
            }
        }
    }

    // get button height with a dummy element
    $('body').append('<input class="' + IUC.dummyFieldSelector + '">');
    IUC.btnHeight = $('.' + IUC.dummyFieldSelector).outerHeight() - 2;
    $('.' + IUC.dummyFieldSelector).remove();

    IUC.selector = IUC.parent + ' ' + IUC.selector;

    $(document).on('ready reloaded wiretabclick', initIUC);

    function initIUC() {

        // append empty iframe to the right on start
        if (IUC.target === 'iframe' && !$('.' + IUC.iframeSelector).length) {
            $('body').append('<iframe class="' + IUC.iframeSelector + '">');
        }

        // linkify fields with locked status
        if ($(IUC.parent).is(IUC.lockedFields)) {

            $(IUC.parent).filter(IUC.lockedFields).find('.InputfieldContent').each(function () {

                var content = $(this).html().trim();

                if (content && content !== "" && content !== "&nbsp;" && !$(this).find('a').length) {
                    $(this).wrapInner(function () {
                        return '<a href="' + content + '" target="_blank"></a>';
                    });
                }
            });

            return true;
        }

        else if ($(IUC.selector).length) {

            $(IUC.selector).each(function () {

                var currInput = $(this),
                    fieldList;

                // continue if field is not among enabled fields
                if (IUC.enabled_fields) {
                    fieldList = IUC.enabled_fields.replace(' ', '');
                    fieldList = '#Inputfield_' + fieldList.replace(',', ', #Inputfield_');

                    if (!currInput.is(fieldList)) {
                        return true;
                    }
                }

                // add class to set padding only on enabled inputs
                currInput.addClass('iuc-input');

                // set link height
                setTimeout(function () {
                    if (IUC.btnHeight > 0) {
                        currInput.next('.' + IUC.linkClass).css({
                            'height': IUC.btnHeight + 'px',
                            'line-height': IUC.btnHeight - 1 + 'px'
                        });
                    }
                }, 0);

                // disable adding link and events twice (ajax loaded tabs and fields)
                if (currInput.next('.' + IUC.linkClass).length) {
                    return true;
                }

                if (config.IUC.mode.indexOf('button') !== -1) {
                    addButtonMode(currInput, IUC.buttonPosition);
                }

                if (config.IUC.mode.indexOf('ctrl-shift-click') !== -1) {
                    addHotkeyMode('click', 'ctrl-shift-click');
                }

                if (config.IUC.mode.indexOf('ctrl-shift-enter') !== -1) {
                    addHotkeyMode('keydown', 'ctrl-shift-enter');
                }
            });
        }
    }


    function addButtonMode(obj, side) {

        obj.after(IUC.button);

        $('body').addClass('iuc-' + side);

        obj.on('keyup fieldchange', function () {

            var url = getUrl(obj.val(), IUC.forceHttp),
                link = obj.next('.' + IUC.linkClass);

            link.attr('href', url);

            url ? link.removeClass(IUC.linkHiddenClass) : link.addClass(IUC.linkHiddenClass);

        });

        obj.next('.' + IUC.linkClass).on('click', function (e) {

            var url = $(this).attr('href');

            e.preventDefault();

            return url ? gotoLink(url) : false;
        });

        // populate on load
        obj.trigger('fieldchange');

        return false;
    }


    function addHotkeyMode(eventName, mode) {

        $(IUC.selector).on(eventName, function (e) {

            var url = $(this).val(),
                isCtrlShiftPressed = e.ctrlKey && e.shiftKey,
                isEnterPressed = e.keyCode == 10 || e.keyCode == 13;

            if (!url) {
                return true;
            }

            if ((mode === 'ctrl-shift-enter' && isCtrlShiftPressed && isEnterPressed) ||
                (mode === 'ctrl-shift-click' && isCtrlShiftPressed)) {
                gotoLink(getUrl(url, IUC.forceHttp));
                return false;
            }
        });
    }


    /**
     * Open link in a new window/tab or slide in iframe
     * Force new window/tab if document width is below 640px
     *
     * @param url
     * @returns {boolean}
     */
    function gotoLink(url) {

        var iframe = $('.' + IUC.iframeSelector);

        if (IUC.target === 'new-window' || document.body.scrollWidth < 640) {
            window.open(url);

        } else {

            $('html').css('overflow-y', 'hidden');
            $('body').append('<div class="' + IUC.overlaySelector + '">');
            iframe.addClass('iuc-iframe-animate').attr('src', url);

            iframe.on('load', function() {
                $(this).addClass('iuc-iframe-loaded');
            })
        }

        return false;
    }


    /**
     * Add placeholder to asmSelect
     * Selector: http://stackoverflow.com/questions/10641258/jquery-select-data-attributes-that-arent-empty#answer-23944081
     */
    $(function () {
        $('select[' + IUC.asmSelectPlaceholder + '!=""][' + IUC.asmSelectPlaceholder + ']').each(function () {

            var placeholder = $(this).data('asmPlaceholder');

            if (placeholder) {
                $(this).parent().find('.asmSelect option:first').attr({
                    'selected': true,
                    'disabled': true
                }).text(placeholder);
            }
        });
    });

    // remove overlay on click
    $(document).on('click', '.' + IUC.overlaySelector, function () {
        IUCRemoveOverlay();
    });

    // remove overlay on pressing ESC
    $(document).bind('keyup', '.' + IUC.overlaySelector, function (e) {
        if (e.keyCode === 27) {
            IUCRemoveOverlay();
        }
    });

    function IUCRemoveOverlay() {
        $('.' + IUC.iframeSelector).attr('src', '').removeClass('iuc-iframe-animate');
        $('html').css('overflow-y', '');
        $('.' + IUC.overlaySelector).remove();
    }

});


/**
 * Get url with or without "http://"
 *
 * @param url
 * @param forcePrefix
 * @returns {*}
 */
function getUrl(url, forcePrefix) {
    var prefix = 'http';
    return (forcePrefix && url != "" && url.indexOf(prefix) === -1) ? prefix + '://' + url : url;
}
