/**
 * Translation Fields - jQuery Form Widget to translate
 *
 * @author   Ariana Las <ariana.las@gmail.com>
 * @author   Mariusz Maroń <mmaron@nexway.com>
 *
 * version   0.1.4
 *
 */

;(function ( $, window, document, undefined ) {

    /** @constructor */
    var pluginName = "formWidget",
        defaults = {
            inputNamePrefix: "",
            removeText: "Delete this translation?",
            languages: {
                "select": "Select language",
                "PL": "Polish",
                "EN": "English",
                "FR": "French",
                "ES": "Spanish",
                "DE": "German"
            }
        };

    // The actual plugin constructor
    function Plugin( element, options, countWidgetInstances ) {
        this.element = element;
        this.countWidgetInstances = countWidgetInstances;
        $thisElement = $(this.element);

        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {

            this.generalStart();
            this.makeSelectLang();
            this.newClick();
            this.updateClick();
            this.langClick();
            this.removeClick();
            this.updateClick();
            this.optionChanged();
            this.applyClick();

        },

        generalStart: function() {

            var $wrapBox = $('<div />', {
                "class" : "input-prepend form-translation"
            });

            this.setInputName();
            $thisElement.wrap($wrapBox);
            $thisElement.before('<span class="add-on open-translation"><i class="icon-reorder"></i><i class="icon-caret-up"></i></span>');
            $thisElement.after('<div class="translation-options"><div class="translation-content"><div class="current-language"><textarea class="m-wrap new-word" placeholder="Text to translate" rows="1"></textarea><textarea class="m-wrap translated" placeholder="Text to translate" rows="1"></textarea><a href="#" class="btn blue apply">Apply</a><a href="#" class="btn blue update">Update</a></div></div></div>');
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

        /**
         *  Set the unique input name. User can set default prefix name.
         */
        setInputName: function() {
            var labelName = $thisElement.parents(".control-group").children("label").text();
                labelName = labelName.replace(" ","_");

            $thisElement.attr("name",this.options.inputNamePrefix + labelName); 
        },

        langTab: function() {
            var langTab = $("<div />", {
                "class" : "language-tabs"
            });
            return langTab;
        },

        newClick: function() {

            $thisElement.prev().on('click', function () {
                
                $this = $(this);

                var $current_div = $this.parent();
                $current_div.find('.chosen-language').removeClass('open');
                $this.toggleClass('open');
                if ($this.hasClass('open')) {

                    $current_div.find('.update').css('display', 'none');
                    $current_div.find('.apply').css('display', 'inline-block');
                    $current_div.find('.select-language').children('option[selected="selected"]').attr('selected', false);
                    $current_div.find('.select-language').children('option[value="select"]').attr('selected', true);
                    //
                    $current_div.find('.current-language .new-word').val('').attr('placeholder', 'Text to translate').css('display', 'inline-block').focus().blur();

                    $current_div.find('.current-language .translated').css('display', 'none');
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
        },

        updateClick: function() {

            var $self = this;

            $(this.element).parent().find('.update').unbind('click').on('click', function() {

                $current_div = $(this).parent().parent().parent().parent();
                console.log($current_div);
                $selected = $current_div.find('.select-language option[selected="selected"]').attr('value');

                $input = $(this).siblings('.translated').val();

                if (!$input == '') {

                    $object = $($self.element).parent().find('.language-tabs > span[id="' + $selected + '"]');
                    $object.children('input').attr('value', $input);
                    $object.css({backgroundColor: "#ffb848"});
                    $object.animate({backgroundColor: "#eee"}, 700);
                    $current_div.removeClass('show');

                }

                return false; //link deactivated
                
            });
        },

        applyClick: function() {
            //input name!!!

            $self = this;
            var applyBtn = $($self.element).next().find('.apply');

            applyBtn.on('click', function(e) {

                e.preventDefault();

                    //input name!!!
                    $main = $(this).parent().parent().parent().siblings('input');
                    $name = $main.attr('name');
                    $current_div = $main.parent();
                    $selected = $current_div.find('.select-language option:selected').attr('value');
                    $translation = $current_div.find('.new-word').val();
                    if ($selected != "select" && $translation != "") {
                        $str = '<span id="' + $selected + '" class="chosen-language">' + $selected;
                        $str += '<a href="/" class="remove icon-remove"></a>';
                        $str += '<input class="m-wrap" type="hidden" name="' + $name + '[' + $selected + ']" value="' + $translation + '"/>';
                        $str += '</span>';
                        $object = $($str).appendTo($current_div.find('.language-tabs'));
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

        langClick: function() {

            var $self = this;

            var langTabBtn = $($self.element).next().next();

            $(function () {
                langTabBtn.unbind('click').on('click', '.chosen-language', function() {

                    $current_div = $(this).parent().parent();
                    $current_div.children('.open-translation').removeClass('open');
                    $(this).siblings().removeClass('open');
                    $(this).toggleClass('open');
                    if ($(this).hasClass('open')) {
                        $current_div.find('.select-language').children('option[selected="selected"]').attr('selected', false);
                        $current_div.find('.select-language').children('option[value="' + $(this).attr('id') + '"]').attr('selected', true);

                        $current_div.find('.current-language .new-word').css('display', 'none');
                        $input = $(this).children('input');

                        $current_div.find('.current-language .translated').html($input.val()).val($input.val());
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

        },
        removeClick: function() {

            var $self = this;

            $(function () {
               $($self.element).next().next().on('click', '.remove', function(e) {
                    e.preventDefault();
                    if (confirm($self.options.removeText)) {
                        $main = $(this).parent().parent().siblings('input');
                        $current_div = $main.parent();
                        $current_div.removeClass('show');
                        $(this).parent().remove();
                    }

                    return false; //link deactivated
                });
            });
            
        },
        optionChanged: function() {

            $selectForm = $(this.element).next().find('.select-language');

            $selectForm.on('change', function() {

                    $current_div = $(this).parent().parent().parent();
                    $current_div.find('.chosen-language').removeClass('open');
                    $current_div.children('.open-translate').toggleClass('open');
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
                        $current_div.find('.current-language .new-word').css('display', 'none');
                        $input = $current_div.find('.language-tabs span[id=' + $selected + ']').children('input');
                        $current_div.find('.current-language .translated').css('display', 'inline-block').html($input.val()).val($input.val());
                }
            });
            
        }

    };

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