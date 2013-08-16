/**
 * Translation Fields - jQuery Form Widget to translate
 *
 * @author   Ariana Las <ariana.las@gmail.com>
 * @author   Mariusz Maroń <mmaron@nexway.com>
 * @author   Damian Duda <dduda@nexway.com>
 *
 * version   0.1.4
 *
 */

;(function ( $, window, document, undefined ) {

    /** @constructor */
    var pluginName = "translationFields",
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
            },
            addAnimation: "",
            addAnimationSpeed: 500
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
            this.markTranslatedOptions();
            this.toggleTranslationInput();

        },

        /**
         *    Creates HTML structure, bind click event to hide
         */
        generalStart: function() {

            var $wrapBox = $('<div />', {
                "class" : "input-prepend form-translation"
            });

            this.setInputName();
            this.customAddAnimation();
            $thisElement.wrap($wrapBox);
            $thisElement.before('<span class="add-on open-translation"><i class="icon-reorder"></i><i class="icon-caret-up"></i></span>');
            $thisElement.after('<div class="translation-options"><div class="translation-content"><div class="current-language"><textarea class="m-wrap new-word" placeholder="Text to translate" rows="1"></textarea><textarea class="m-wrap translated" placeholder="Text to translate" rows="1"></textarea><a href="#" class="btn blue apply">Apply</a><a href="#" class="btn blue update">Update</a></div></div></div>');
            $thisElement.next().find('.apply').after('<span class="hide-border"></span>');

            var langTabs = this.langTab(),
                $allFormTranslation = $('.form-translation');

            langTabs.insertAfter($thisElement.next()); 

            $('body').click(function() {
                $allFormTranslation.removeClass('show').find('.open-translation, .chosen-language').removeClass('open');

            });
            
            $allFormTranslation.click(function(e){
                e.stopPropagation();
            });
        },

        /**
         *    Set the unique input name. User can set default prefix name.
         */
        setInputName: function() {
            var labelName = $thisElement.parents(".control-group").children("label").text().replace(" ","_");

            $thisElement.attr("name",this.options.inputNamePrefix + labelName); 
        },

        /**
         *    Returns a language tab container element
         *    @returns {jQuery object} langTab
         */
        langTab: function() {
            var langTab = $("<div />", {
                "class" : "language-tabs"
            });
            return langTab;
        },

        /**
         *    Bind click event to "new translation" button. It show/hide elements.
         */
        newClick: function() {

            var self = this;
            $thisElement.prev().on('click', function () {
                
                var $this        = $(this),
                    $current_div = $this.parent();

                $current_div.find('.chosen-language').removeClass('open');
                $this.toggleClass('open');

                if ($this.hasClass('open')) {
                    self.toggleTranslationInput();

                    $current_div.find('.update').css('display', 'none');
                    $current_div.find('.apply').css('display', 'inline-block');
                    $current_div.find('.select-language').children('option[selected="selected"]').attr('selected', false);
                    $current_div.find('.select-language').children('option[value="select"]').attr('selected', true);
                    $current_div.find('.current-language .new-word').val('').attr('placeholder', 'Text to translate').css('display', 'inline-block').focus().blur();
                    $current_div.find('.current-language .translated').css('display', 'none');

                    $('.form-translation').each(function() {
                    if ($(this).hasClass('show')) {
                        $(this).removeClass('show');
                    }
                    });
                        $current_div.addClass('show');
                    } else {
                        $current_div.removeClass('show');
                    }

                    self.toggleTranslationInput();
            });
        },

        /**
         *    Bind click event to "update" button. It show/hide elements and updates the hidden input.
         */
        updateClick: function() {

            var self = this;

            $thisElement.parent().find('.update').unbind('click').on('click', function(e) { 

                e.preventDefault();
                $current_div = $(this).parents(".form-translation");
                $selected = $current_div.find('.select-language option[selected="selected"]').attr('value');

                inputValue = $(this).siblings('.translated').val();

                if (inputValue.length > 0) {
                    $object = $(self.element).parent().find('.language-tabs > span[id="' + $selected + '"]');
                    $object.children('input').attr('value', inputValue);
                    $object.css({backgroundColor: "#ffb848"});
                    $object.animate({backgroundColor: "#eee"}, 700);
                    $current_div.removeClass('show');
                    $current_div.find(".chosen-language").removeClass("open");
                }                
            });
        },

        /**
         *    Bind click event to "apply" button. It creates new "translation badge".
         */
        applyClick: function() {

            var $applyBtn = $(this.element).next().find('.apply'),
                self = this;

            $applyBtn.on('click', function(e) {

                e.preventDefault();

                $main = $(this).parents('.translation-options').siblings('input');
                name = $main.attr('name');
                $current_div = $main.parent();
                $selected = $current_div.find('.select-language option:selected').attr('value');
                translation = $current_div.find('.new-word').val();

                if ($selected != "select" && translation != "") {
                    translationBadgeBody = '<span id="' + $selected + '" class="chosen-language">' + $selected;
                    translationBadgeBody += '<a href="/" class="remove icon-remove"></a>';
                    translationBadgeBody += '<input class="m-wrap" type="hidden" name="' + name + '[' + $selected + ']" value="' + translation + '"/>';
                    translationBadgeBody += '</span>';
                    $object = $(translationBadgeBody).appendTo($current_div.find('.language-tabs'));

                    if($.isFunction($object.customAnimation)){
                        $object.customAnimation();
                    } 
                    else {
                        $object.css({backgroundColor: "#ffb848"});
                        $object.animate({backgroundColor: "#eee"}, 700);
                    }

                    $object
                    .mouseover(function(){
                        $(this).css({backgroundColor: "#e1e1e1"});
                    })
                    .mouseleave(function(){
                        $(this).css({backgroundColor: "#eee"});
                    }); 

                    self.markTranslatedOptions();

                    $current_div.find('.apply').css('display', 'none');
                    $current_div.find('.update').css('display', 'inline-block');
                    $current_div.children('.open-translation').removeClass('open');
                    $object.toggleClass('open');
                }
            });
            
        },
        /**
         *    If custom animation exists then use it.
         */
        customAddAnimation: function() {
            var animName = this.options.addAnimation,
                animSpeed = this.options.addAnimationSpeed,
                animationNames = ["slideToggle","fadeToggle"];

            if($.isFunction(this.options.addAnimation)){
                $.fn["customAnimation"] = this.options.addAnimation;
            } 
            else if($.inArray(this.options.addAnimation , animationNames) != -1){
                $.fn["customAnimation"] = function() { this[animName](0); return this[animName](animSpeed)};
            }
         },

        /**
         *    Shows translation body for existing language badge.
         */
        langClick: function() {

            var $langTabBtn = $(this.element).nextAll(".language-tabs");

            $(function () {
                $langTabBtn.unbind('click').on('click', '.chosen-language', function() {

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
        /**
         *    It creates the select and append it, which contains all avaiable languages.
         */
        makeSelectLang: function() {

            var sTranslate = $('<select />', {
                "class" : "select-language",
                "tabindex" : 1
            });
            var $contentWidget = $('.translation-content');
            var items = [];

            // Simple data for select
            var data = { "select": "Select language" };
                data = $.extend(data, this.options.languages);

            $thisElement.next().children('.translation-content').prepend(sTranslate);

            $.each(data, function(key, value) {
                
                items.push('<option value="' + key + '">' + value + '</option>');
                
            });

            var $selectForm = $thisElement.next().find('.select-language');

            $selectForm.append(items);

        },
        /**
         *    Removes the translation for clicked language.
         */
        removeClick: function() {


            var self = this;

            $(function () {
               $(self.element).next().next().on('click', '.remove', function(e) {
                    e.preventDefault();
                    if (confirm(self.options.removeText)) {
                        $main = $(this).parent().parent().siblings('input');
                        $current_div = $main.parent();
                        $current_div.removeClass('show');
                        $(this).parent().remove();
                        self.markTranslatedOptions();
                    }
                });
            });
            
        },
        /**
         *    It shows the translation for picked language from select.
         */
        optionChanged: function() {

            var self = this;
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
            self.toggleTranslationInput();
            });

            
        },
        /**
         *    It marks (add class translated) option element in select if it's translated.
         */
        markTranslatedOptions: function() {
            var $thisElementParent = $(this.element).parent();
            $thisElementParent.find("select option").removeClass("translated");

            $thisElementParent.find(".language-tabs").children("span").each(function(k,v){
                $thisElementParent.find("select option[value='" + $(v).attr("id") + "']").addClass("translated");
            });
        },
        /**
         *    It hide/show textarea to pass translation.
         *    Depends on select. If a lang is seleted - show it.
         */
        toggleTranslationInput: function() {
            var $thisElementParent = $(this.element).parent();
            
            if($thisElementParent.find(".select-language").val() === "select") {
                $thisElementParent.find(".m-wrap.new-word").addClass("hidden").siblings(".apply").addClass("hidden");
            }
            else {
                $thisElementParent.find(".m-wrap.new-word").removeClass("hidden").siblings(".apply").removeClass("hidden");
            }
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