/*!
 * Version: 1.0
 * Started: 11-06-2013
 * Updated: 11-04-2015
 * Author : paramana (hello AT paramana DOT com)
 *
 */

define([
    'jquery'
], function($) {
    // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
    "use strict";

    // Create the defaults once
    var pluginName = "dropdown",
        defaults   = {
            activeClass: "active",
            activeSelect: "active-select",
            errorClass: "error",
            selectedClass:  "selected",
            rel: this,
            onchange: function(){}
        };

    // The actual plugin constructordropdown-element
    function Dropdown(element, options) {
        this.element = element;
        this.$element = $(element);
        this.$select = this.$element.find('select');
        this.$text = this.$element.find('span:eq(0)')
        this.enabled = true;
        
        // jQuery has an extend method that merges the 
        // contents of two or more objects, storing the 
        // result in the first object. The first object 
        // is generally empty because we don't want to alter 
        // the default options for future instances of the plugin
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Dropdown.prototype.init = function() {
        this.$element.addClass('dropdown-element');
        this.events();

        var $selected;
        if (this.options.value)
            $selected = this.$select.find('option[value="' + this.options.value + '"]').attr('selected', 'selected');
        else
            $selected = this.$select.find('option[selected="selected"]');

        if ($selected.length)
            this.$select.val($selected.prop('value')).trigger('change');
    };
    
    Dropdown.prototype.setValue = function(value) {
        if (!this.enabled)
            return false;
            
        var _value  = value || this.$select.prop('value'),
            $option = this.$select.find('option[value="' + _value + '"]');
        
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
            click: function(e) {
                if (!_self.enabled)
                    return false;
                
                e.stopPropagation()
            },
            keyup: function() {
                if (!_self.enabled)
                    return false;
                
                _self.setValue();
            },
            focus: function(event) {
                if (!_self.enabled)
                    return false;
                
                _self.$element.addClass(_self.options.activeClass);
            },
            blur: function(event) {
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
    

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                        new Dropdown(this, options));
            }
        });
    }
});