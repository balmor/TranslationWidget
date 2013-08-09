/*
* jQuery Form Widget to translate
*
* @author Ariana Las <ariana.las@gmail.com>
*
*/


// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "formWidget",
        defaults = {
            inputNamePrefix: "translateWidget-"
        };

    // The actual plugin constructor
    function Plugin( element, options, countWidgetInstances ) {
        this.element = element;
        this.countWidgetInstances = countWidgetInstances;
        $thisElement = $(this.element);

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {

            this.generalStart();
            this.new_click();
            this.apply_click();
            this.makeSelectLang();
            this.update_click();
            this.lang_click();
            this.remove_click();
            this.update_click();
            this.option_changed();

        },

        generalStart: function() {

            var $wrapBox = $('<div />', {
                "class" : "input-prepend form-translation"
            });

            this.setInputName();
            $thisElement.wrap($wrapBox);
            $thisElement.before('<span class="add-on open-translation"><i class="icon-reorder"></i><i class="icon-caret-up"></i></span>');
            $thisElement.after('<div class="translation-options"><div class="translation-content"><div class="current-language"><textarea class="m-wrap new-word" placeholder="Text to translate" rows="1"></textarea><a href="#" class="btn blue apply">Apply</a><a href="#" class="btn blue update">Update</a></div></div></div>');
            $thisElement.next().find('.apply').after('<span class="hide-border"></span>');

            var langTabs = this.langTab();

            langTabs.insertAfter($thisElement.next()); // podobno undefined!!


            // $(this.element)$('').insertAfter($(this.element).next());

            $('body').click(function() {
                $('.form-translation .open-translation').removeClass('open');
                $('.form-translation .chosen-language').removeClass('open');
                $('.form-translation').removeClass('show');
            });
            
            $('.form-translation').click(function(e){
                e.stopPropagation();
            });
        },

        setInputName: function() {
            $thisElement.attr("name",this.options.inputNamePrefix + this.countWidgetInstances); 
        },

        langTab: function() {
            var langTab = $("<div />", {
                "class" : "language-tabs"
            });
            return langTab;
        },

        new_click: function() {

            $thisElement.prev().on('click', function () {
                var $current_div = $(this).parent();
                $this = $(this);

                $current_div.find('.chosen-language').removeClass('open');
                $this.toggleClass('open');
                if ($this.hasClass('open')) {

                    $current_div.find('.update').css('display', 'none');
                    $current_div.find('.apply').css('display', 'inline-block');

                    $current_div.find('.select-language').children('option[selected="selected"]').attr('selected', false);
                    $current_div.find('.select-language').children('option[value="select"]').attr('selected', true);

                    $current_div.find('.current-language .new-word').attr('placeholder', 'Text to translate').attr('value', '').val('').css('display', 'inline-block');
                    
                    $current_div.addClass('show');
                } else {
                    $current_div.removeClass('show');
                }
 
            });
        },

        update_click: function() {

            $thisElement.parent().find('.update').on('click', function() {
                $current_div = $(this).parent().parent().parent().parent();
                $input = $(this).siblings('textarea').val();
                $selected = $current_div.find('.select-language option[selected="selected"]').attr('value');
                $object = $current_div.find('.language-tabs span[id="' + $selected + '"]');
                $object.children('input').attr('value', $input);
                $object.css({backgroundColor: "#ffb848"});
                $object.animate({backgroundColor: "#eee"}, 700);
                $current_div.removeClass('show');
                return false; //link deactivated
                
            });
        },

        apply_click: function() {
            //input name!!!

            $self = this;
            var applyBtn = $($self.element).next().find('.apply');

            applyBtn.click(function() {

                $main = $(this).parent().parent().parent().siblings('input');
                $name = $main.attr('name');
                $current_div = $main.parent();
                $selected = $current_div.find('.select-language option:selected').attr('value');
                $translation = $current_div.find('.new-word').val();

                if ($selected != "select" && $translation != "") {
                    $str = '<span id="' + $selected  + '" class="chosen-language">' + $selected;
                    $str += '<a href="#" class="remove icon-remove"></a>';
                    $str += '<input class="m-wrap" type="hidden" name="' + $name + '[' + $selected + ']" value="' + $translation + '"/>';
                    $str += '</span>';
                    var $object = $($str).appendTo($current_div.find('.language-tabs'));
                    $object.css({backgroundColor: "#ffb848"});
                    $object.animate({backgroundColor: "#eee"}, 700);

                    $object.mouseover(function(){
                        $(this).css({backgroundColor: "#e1e1e1"});
                    });

                    $object.mouseleave(function(){
                        $(this).css({backgroundColor: "#eee"});
                    }); 
                    $current_div.find('.apply').css('display', 'none');
                    $current_div.find('.update').css('display', 'inline-block');
                }
                $current_div.children('.open-translation').removeClass('open');
                $object.toggleClass('open');
                return false; //link deactivated
            });
            
        },

        lang_click: function() {

            var $self = this;

            var langTabBtn = $($self.element).next().next();


            $(function () {
                langTabBtn.unbind('click').on('click', '.chosen-language', function() {

                    $current_div = $(this).parent().parent();
                    $current_div.children('.open-translation').removeClass('open');
                    $(this).toggleClass('open');
                    $(this).siblings().removeClass('open');
                    if ($(this).hasClass('open')) {

                        $current_div.find('.select-language').children('option[selected="selected"]').attr('selected', false);
                        $current_div.find('.select-language').children('option[value="' + $(this).attr('id') + '"]').attr('selected', true);

                        $input = $(this).children('input').val();
                        $current_div.find('textarea').val($input);
                        $current_div.find('.current-language .translated').css('display', 'inline-block');

                        $current_div.find('.apply').css('display', 'none');
                        $current_div.find('.update').css('display', 'inline-block');
                        $('.form-translation').each(function() {
                            if ($(this).hasClass('show')) {
                                $(this).removeClass('show');
                                return;
                            }
                        });
                        $current_div.addClass('show');
                    } else {
                        $current_div.removeClass('show');
                    }
                });
            });
            
        },

        makeSelectLang: function() {

            var sTranslate = $('<select />', {
                "class" : "select-language",
                "tabindex" : 1
            });
            var $contentWidget = $('.translation-content');
            var items = [];

            // Simple data for select
            var data = {
                "select": "Select language",
                "PL": "Polish",
                "EN": "English",
                "FR": "French",
                "ES": "Spanish",
                "DE": "German"
            }

            $thisElement.next().children('.translation-content').prepend(sTranslate);

            $.each(data, function(key, value) {
                
                items.push('<option value="' + key + '">' + value + '</option>');
                
            });

            var $selectForm = $thisElement.next().find('.select-language');

            $selectForm.append(items);

            $selectForm.on('change', function () {
                $("option:selected", this).attr("selected", true).siblings().attr("selected", false);
            });

        },
        remove_click: function() {

            var $self = this;

            $(function () {
               $($self.element).next().next().on('click', '.remove', function(e) {
                    e.preventDefault();
                    if (confirm("Delete?")) {
                        $main = $(this).parent().parent().siblings('input');
                        $current_div = $main.parent();
                        $current_div.removeClass('show');
                        $(this).parent().remove();
                    }

                    return false; //link deactivated
                });
            });
            
        },
        option_changed: function() {

            $('.select-language').change(function() {

                $current_div = $(this).parent().parent().parent();
                $selected = $(this).children('option:selected').attr('value');

                $current_div.find('.select-language').children('option[selected="selected"]').attr('selected', false);
                $current_div.find('.select-language').children('option[value="' + $selected + '"]').attr('selected', true);

                $current_div.find('.update').css('display', 'none');
                $current_div.find('.apply').css('display', 'inline-block');
                $the_same = false;

                $current_div.find('.language-tabs').children('span').each(function() {

                    if ($selected == $(this).attr('id')) {
                        $current_div.find('.apply').css('display', 'none');
                        $current_div.find('.update').css('display', 'inline-block');
                        $the_same = true;
                        return;
                    }
                });

                if ($the_same == false) {
                    $current_div.find('.current-language .translated').css('display', 'none');
                    $current_div.find('.current-language .new-word').attr('value', '').attr('placeholder', 'Text to translate').css('display', 'inline-block');
                    $current_div.find('.current-language .new-word').focus();
                } else {
                    $input = $current_div.find('.language-tabs span[id=' + $selected + ']').children('input').val();
                    $current_div.find('textarea').css('display', 'inline-block').val($input);
                }
            });
            
        }

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        var countWidgetInstances = 0;

        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                countWidgetInstances++;
                $.data(this, "plugin_" + pluginName, new Plugin( this, options, countWidgetInstances ));
            }
        });
    };

})( jQuery, window, document );

