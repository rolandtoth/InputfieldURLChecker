/**
 * InputfieldURLChecker module for ProcessWire
 * https://goo.gl/F8CAK8
 */

$(document).ready(function () {

    var IUC = {
        selector: 'a.iuc',
        asmSelectPlaceholder: 'data-asm-placeholder',
        linkHiddenClass: 'iuc-hide',
        lockedClass: 'iuc-locked-link',
        iframeSelector: 'iuc-iframe',
        overlaySelector: 'iuc-overlay',
        dummyFieldSelector: 'IUC-dummy',
        dataMode: 'data-iuc-mode',
        dataTarget: 'data-iuc-target',
        dataForceHttp: 'data-iuc-force-http',
        dataLoaded: 'data-iuc-loaded'
    };

    // get button height with a dummy element
    $('body').append('<input class="' + IUC.dummyFieldSelector + '">');
    IUC.btnHeight = $('.' + IUC.dummyFieldSelector).outerHeight() - 2;
    $('.' + IUC.dummyFieldSelector).remove();

    $(document).on('ready reloaded wiretabclick', initIUC);

    function initIUC() {

        // append empty iframe to the right on start
        if ($('input[' + IUC.dataTarget + '="iframe"]').length && !$('.' + IUC.iframeSelector).length) {
            $('body').append('<iframe class="' + IUC.iframeSelector + '">');
        }

        $(IUC.selector).not('[' + IUC.dataLoaded + '="1"]').each(function () {

            if ($(this).hasClass(IUC.lockedClass)) {
                addLockedFieldMode($(this));
            }

            var currInput = $(this).next('input:not([type="hidden"])');

            // set link height
            setTimeout(function () {
                if (IUC.btnHeight > 0) {
                    currInput.prev(IUC.selector).css({
                        'height': IUC.btnHeight + 'px',
                        //'line-height': IUC.btnHeight - 1 + 'px'
                        'line-height': IUC.btnHeight + 'px'
                    });
                }
            }, 0);

            addButtonMode(currInput);

            $(this).attr(IUC.dataLoaded, 1);
        });


        $('input[' + IUC.dataMode + '!=""][' + IUC.dataMode + ']').not('[' + IUC.dataLoaded + '="1"]').each(function () {

            var mode = $(this).attr(IUC.dataMode);

            if (mode.indexOf('ctrl-shift-click') !== -1) {
                addHotkeyMode($(this), 'click', 'ctrl-shift-click');
            }

            if (mode.indexOf('ctrl-shift-enter') !== -1) {
                addHotkeyMode($(this), 'keydown', 'ctrl-shift-enter');
            }

            $(this).attr(IUC.dataLoaded, 1);
        });
    }


    function addLockedFieldMode(obj) {

        obj.on('click', function (e) {

            var url = $(this).attr('href');

            e.preventDefault();

            return url ? gotoLink(url, obj.attr(IUC.dataTarget)) : false;
        });
    }


    function addButtonMode(obj, side) {

        obj.on('keyup fieldchange', function () {

            var url = getUrl(obj.val(), $(this).attr(IUC.dataForceHttp)),
                link = obj.prev(IUC.selector);

            link.attr('href', url);

            url ? link.removeClass(IUC.linkHiddenClass) : link.addClass(IUC.linkHiddenClass);

        });

        obj.prev(IUC.selector).on('click', function (e) {

            var url = $(this).attr('href'),
                currInput = $(this).next('input:not([type="hidden"])');

            e.preventDefault();

            return url ? gotoLink(url, currInput.attr(IUC.dataTarget)) : false;
        });

        // populate on load
        obj.trigger('fieldchange');

        return false;
    }


    function addHotkeyMode(obj, eventName, mode) {

        obj.on(eventName, function (e) {

            var url = $(this).val(),
                isCtrlShiftPressed = e.ctrlKey && e.shiftKey,
                isEnterPressed = e.keyCode == 10 || e.keyCode == 13;

            if (!url) return true;

            if ((mode === 'ctrl-shift-enter' && isCtrlShiftPressed && isEnterPressed) ||
                (mode === 'ctrl-shift-click' && isCtrlShiftPressed)) {
                gotoLink(getUrl(url, $(this).attr(IUC.dataForceHttp)), $(this).attr(IUC.dataTarget));
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
    function gotoLink(url, target) {

        var iframe = $('.' + IUC.iframeSelector);

        if (target === 'new-window' || document.body.scrollWidth < 640) {
            window.open(url);

        } else {

            $('html').css('overflow-y', 'hidden');
            $('body').append('<div class="' + IUC.overlaySelector + '">');
            iframe.addClass('iuc-iframe-animate').attr('src', url);

            iframe.on('load', function () {
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
        IUCCloseIframe();
    });

    // remove overlay on pressing ESC
    $(document).bind('keyup', '.' + IUC.overlaySelector, function (e) {
        if (e.keyCode === 27) {
            IUCCloseIframe();
        }
    });

    function IUCCloseIframe() {
        $('.' + IUC.iframeSelector).removeClass('iuc-iframe-animate iuc-iframe-loaded').attr('src', '');
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
