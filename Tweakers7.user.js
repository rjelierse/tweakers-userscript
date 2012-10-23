// ==UserScript==
// @name         Tweakers 7
// @namespace    http://tweakers.net
// @description  Navigation bar fixed to top of screen, when outside visible area.
// @author       Raymond Jelierse
// @copyright    AS-IS
// @include      *tweakers.net*
// @match        http://tweakers.net/*
// @match        http://gathering.tweakers.net/*
// @version      1.0
// ==/UserScript==

var initialize = function (callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//code.jquery.com/jquery-latest.min.js");
    script.addEventListener('load', function () {
        var script = document.createElement("script");
        script.textContent = "(" + callback.toString() + ")(window.jQuery);";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);

    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = '#top.affix #menubar {position: fixed; top: 0; width:100%; z-index: 100; box-shadow: 0 0 10px #333;}\n.popup {position: fixed;}';
    document.body.appendChild(style);
};

var main = function ($) {
    var Affix = function (element, options) {
        this.options = $.extend({}, $.fn.affix.defaults, options);
        this.$window = $(window).on('scroll.affix.data-api', $.proxy(this.checkPosition, this));
        this.$element = $(element);
        this.checkPosition();
    };

    Affix.prototype.checkPosition = function () {
        if (!this.$element.is(':visible')) return;

        var scrollHeight = $(document).height()
            , scrollTop = this.$window.scrollTop()
            , position = this.$element.offset()
            , offset = this.options.offset
            , offsetBottom = offset.bottom
            , offsetTop = offset.top
            , reset = 'affix affix-top affix-bottom'
            , affix;

        if (typeof offset != 'object') offsetBottom = offsetTop = offset;
        if (typeof offsetTop == 'function') offsetTop = offset.top();
        if (typeof offsetBottom == 'function') offsetBottom = offset.bottom();

        affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
            false : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
            'bottom' : offsetTop != null && scrollTop <= offsetTop ?
            'top' : false;

        if (this.affixed === affix) return;

        this.affixed = affix;
        this.unpin = affix == 'bottom' ? position.top - scrollTop : null;

        this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
    };

    $.fn.affix = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('affix')
                , options = typeof option == 'object' && option;
            if (!data) $this.data('affix', (data = new Affix(this, options)));
            if (typeof option == 'string') data[option]();
        })
    };

    $.fn.affix.Constructor = Affix;

    $.fn.affix.defaults = {
        offset:0
    };

    $('#top').affix({offset: {top: 51, bottom: 0}});
};

initialize(main);