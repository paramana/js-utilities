/*!
 * Version: 1.2
 * Started: 11-06-2013
 * Updated: 11-11-2020
 * Author : paramana (hello AT paramana DOT com)
 *
 */
define(['jquery'], function($) {
    'use strict';

    var pluginName = 'dropdown',
        defaults   = {
            activeClass: 'active',
            activeSelect: 'active-select',
            errorClass: 'error',
            selectedClass:  'selected',
            rel: this,
            onchange: function(){}
        };

    function Dropdown(element, options) {
        this.element = element;
        this.$element = $(element);
        this.$select = this.$element.find('select');
        this.$text = this.$element.find('span:eq(0)')
        this.enabled = true;
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Dropdown.prototype.init = function() {
        var $selected;

        if (this.$element.hasClass('dropdown-element'))
            return;

        this.$element.addClass('dropdown-element');
        this.events();

        if (this.options.value !== false && this.options.value !== '')
            $selected = this.$select.find('option[value="' + this.options.value + '"]').attr('selected', 'selected');
        else
            $selected = this.$select.find('option[selected="selected"]');

        if ($selected.length)
            this.$select.val($selected.prop('value')).trigger('change');
    };

    Dropdown.prototype.setValue = function(value) {
        if (!this.enabled)
            return false;

        var _value  = value || this.$select.prop('value') || this.$select.data('value'),
            $option = this.$select.find('option[value="' + _value + '"]:eq(0)');

        if (!this.$select.prop('value'))
            this.$select.val(_value);

        if (!$option.length) {
            _value  = '';
            $option = this.$select.find('option:eq(0)');
        }

        this.$element
            .removeClass(this.activeSelect + ' ' + this.error)
            .data('value', _value);

        this.$text.text($option.text());

        if (_value)
            this.$select.data('text', $option.text());
        else
            this.$select.data('text', "");

        if (value == null) {
            this.options.onchange.call(this.options.rel, _value);
        }
        else {
            this.$element.addClass(this.options.selectedClass);
            $option.attr('selected', 'selected');
        }
    };

    Dropdown.prototype.events = function() {
        var _self = this;

        this.$select.on({
            change: function(){
                _self.setValue();
            },
            click: function(event) {
                if (!_self.enabled)
                    return false;

                event.stopPropagation()
            },
            keyup: function() {
                if (!_self.enabled)
                    return false;

                _self.setValue();
            },
            focus: function() {
                if (!_self.enabled)
                    return false;

                _self.$element.addClass(_self.options.activeClass);
            },
            blur: function() {
                if (!_self.enabled)
                    return false;

                _self.$element.removeClass(_self.options.activeClass);
            }
        });
    };

    Dropdown.prototype.enable = function() {
        this.$element.removeClass('disabled');
        this.$select.removeAttr('disabled');
        this.enabled = true;
    }

    Dropdown.prototype.disable = function() {
        this.$element.addClass('disabled');
        this.$select.attr('disabled', 'disabled');
        this.enabled = false;
    }

    Dropdown.prototype.destroy = function() {
        this.$select.off();
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName))
                $.data(this, 'plugin_' + pluginName, new Dropdown(this, options));
        });
    }
});
