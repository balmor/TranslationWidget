/**
 * Translation Fields - jQuery Form Widget to translate
 *
 * @author   Ariana Las <ariana.las@gmail.com>
 * @author   Mariusz Maroń <mmaron@nexway.com>
 * @author   Damian Duda <dduda@nexway.com>
 *
 * version   0.2.1
 *
 */

;(function ( $, window, document, undefined ) {

    /** @constructor */
    var pluginName = "translationFields",
        defaults = {
            inputNamePrefix: "",
            customSelectLabel: "Please Select",
            confirmBox: {
                yesText: "Yes, delete",
                noText: "No, go away!",
                infoMessage: 'Are you sure ?',
                hText: 'Confirm your request',
                outerClick: false,
                useKeys: true,
            },
            addAnimation: "",
            addAnimationSpeed: 700
        },
        languages = {
            "PL": "Polish",
            "EN": "English",
            "FR": "French",
            "ES": "Spanish",
            "DE": "German"
        },
        existingData = {
            // "EN": "Message" - use this data to create default existing data for example from database etc.
        }

    // The actual plugin constructor
    function Plugin( element, options, countWidgetInstances ) {
        this.element = element;
        this.countWidgetInstances = countWidgetInstances;
        $thisElement = $(this.element);

        this._defaults = defaults;
        this._languages = languages;
        this._exData = existingData;
        this._name = pluginName;

        this.options = $.extend( true, {}, existingData, languages, defaults, options );

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
            this.optionChanged();
            this.applyClick();
            this.markTranslatedOptions();
            this.toggleTranslationInput();
            this.checkIfDataExist();
            this.checkValidInput();
            this.fileInputChanged();

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
            this.escKey();
            this.checkValidInput();

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

            if ($thisElement.attr('type') == 'file') {

                var $replacementInput = $('<input />', {
                    'type': "text",
                    'class': $thisElement.attr('class'),
                    'readonly': "readonly"
                }).addClass('replacement');

                $('<input type="file" />').appendTo($thisElement.next().find('.current-language')).hide();
                
                $thisElement.css({
                    "z-index": "-1",
                });

                $('<div />', {
                    class: 'infoText'
                }).appendTo($thisElement.next().find('.current-language'));
                $replacementInput.appendTo($thisElement.parent());

                $thisElement.next().find('textarea').remove();
                $thisElement.parent().children(':last').css({
                    'left': $thisElement.prev().outerWidth()
                });
                $thisElement.css({
                    'width': $thisElement.parent().children(':last').outerWidth(),
                    'height':  $thisElement.parent().children(':last').height(),
                    'margin-left': "-1px"
                });

            };

            this.checkValidInput();
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
        *     Get file name
         */

        getFileName: function() {
            if ($thisElement.attr('type') == 'file') {
                fileInputValue = $thisElement.next().find(':file').val();
                return fileInputValue;
            };
        },

        fileInputChanged: function() {
            if ($thisElement.attr('type') == 'file') {
                $thisElement.next().find(':file').on('change', function() {
                    value = $(this).val();
                    $(this).siblings('.infoText').text(value);
                });     
            }
        },

        /**
         *    Bind click event to "new translation" button. It show/hide elements.
         */
        newClick: function() {

            var self = this;
            $thisElement.prev().on('click', function () {
                
                var $this        = $(this),
                    $current_div = $this.parent();

                $thisElement.next().find('.infoText').text('')

                $current_div.find('.chosen-language').removeClass('open');
                $this.toggleClass('open');

                if ($this.hasClass('open')) {
                    self.toggleTranslationInput();

                    $current_div.find('.update').css('display', 'none');
                    $current_div.find('.apply').css('display', 'inline-block');
                    if ($thisElement.attr('type') == 'file') {
                        $thisElement.next().find('.current-language').children(':file').hide();

                    };
                    $current_div.find('.select-language').children('option[selected="selected"]').attr('selected', false);
                    $current_div.find('.select-language').children('option[value="select"]').attr('selected', true);
                    $current_div.find('.current-language .new-word').val('').attr('placeholder', 'Text to translate').css('display', 'inline-block').focus().blur();
                    $current_div.find('.current-language .translated').css('display', 'none');

                    $('.form-translation').each(function() {
                    if ($(this).hasClass('show') ){
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
                $object = $(self.element).parent().find('.language-tabs > span[id="' + $selected + '"]');
                           
                if ($(this).closest('.form-translation').children('input').attr('type') == 'file') {
                    inputFile = $(this).siblings(':file').parent();
                    if ($thisElement.next().find('.current-language').children(':file').attr('name') == $selected) {
                        var spanId = $thisElement.next().next().children('span').attr('id');
                        var selectedLang = $thisElement.next().find('select').children(':selected').val();

                            $thisElement.next().next().find('#'+selectedLang).find(':file').remove();
                            $thisElement.next().next().find('#'+selectedLang).append($thisElement
                                .next()
                                .find('.current-language')
                                .children(':file')
                                .clone().hide()
                            );
                            $thisElement.parent().removeClass('show');
                            $thisElement.next().find('.current-language').children(':file').val('');

                            $object.css({backgroundColor: "#ffb848"});
                            $object.animate({backgroundColor: "#eee"}, 700);
                       
                    };
                } 
                if ($(this).closest('.form-translation').children('input').attr('type') == 'text') {
                    inputVal = $(this).siblings('.translated').val();
                    if (inputVal.length > 0 ) {
                        $object.children('input').attr('value', inputVal);
                        $object.css({backgroundColor: "#ffb848"});
                        $object.animate({backgroundColor: "#eee"}, 700);
                        $current_div.removeClass('show');
                        $current_div.find(".chosen-language").removeClass("open");
                    }    
                }   
                
            });
        },


        /**
         *    Bind click event to "apply" button. It creates new "translation badge".
         */
        applyClick: function() {

            var $applyBtn = $(this.element).next().find('.apply'),
                self = this;

            if (!$.isEmptyObject(this.options.customSelectLabel)) {
                var customSelectLabel = this.options.customSelectLabel;
            } else {
                var customSelectLabel = this._defaults.customSelectLabel;
            }

            $applyBtn.on('click', function(e) {

                e.preventDefault();

                $main = $(this).parents('.translation-options').siblings('input');
                name = $main.attr('id');
                $current_div = $main.parent();
                $selected = $current_div.find('.select-language option:selected').attr('value');
                translation = $current_div.find('.new-word').val();
                fileValue = $thisElement.next().find(":file").val();

                if ($selected != customSelectLabel && translation != "") {
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
                        $object.animate({backgroundColor: "#eee"}, self.options.addAnimationSpeed);
                    }

                    $object
                    .mouseover(function(){
                        $(this).css({backgroundColor: "#e1e1e1"});
                    })
                    .mouseleave(function(){
                        $(this).css({backgroundColor: "#eee"});
                    }); 

                    self.markTranslatedOptions();

                    $current_div.find('.current-language .new-word').css('display', 'none');
                    $current_div.find('.current-language .translated').css('display', 'inline-block');
                    
                    $current_div.find('.current-language .translated').html(translation).val(translation);
                    $current_div.find('.apply').css('display', 'none');
                    $current_div.find('.update').css('display', 'inline-block');
                    $current_div.children('.open-translation').removeClass('open');
                    $object.toggleClass('open');

                    if ($thisElement.attr('type') == 'file') {
                        if ($thisElement.next().find('.current-language').children(':file').attr('name') == $selected) {
                            $thisElement.next().find('.current-language')
                                .children(':file')
                                .clone()
                                .appendTo($thisElement.next().next().find('span[id="'+$selected+'"]'))
                                .hide();

                            // $thisElement.next().find('.current-language').children(':file').val('');
                            $thisElement.next().find('.fileInfo').text('');
                        };
                    };
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
        checkValidInput: function() {

            var langTabs = $thisElement.next().next();

            langTabs.on('DOMNodeInserted', function(event) {
                if (event.target.nodeName == 'SPAN' && event.target.className == 'chosen-language') {
                    event.currentTarget.parentNode.getElementsByTagName('input')[0].setAttribute('value', 'ok');
                };
            });
            langTabs.on('DOMNodeRemoved', function(event) {
                if (event.currentTarget.childNodes.length == 1) { // set 1 because event returns number of childNodes 
                    event.currentTarget.parentNode.getElementsByTagName('input')[0].setAttribute('value', '');
                };
            });
        },
        langClick: function() {

            var $langTabBtn = $(this.element).nextAll(".language-tabs");

            var self = this;

            $(function () {
                $langTabBtn.unbind('click').on('click', '.chosen-language', function() {
                    $this = $(this);
                    if($this.hasClass("removed")) return;

                    $current_div = $this.parent().parent();
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
                        if ($(this).closest('.form-translation').children(':file').attr('type') == 'file') {

                            $thisElement.next().find('.current-language').children(':file').remove();
                            $thisElement.next().find('.current-language').append($(this).children('input:file').clone().show());

                            self.getFileName();

                            $thisElement.next().find('.infoText').text(fileInputValue).attr('title', fileInputValue);

                            $thisElement.next().find('.infoText').insertAfter(
                                $thisElement.next().find(':file')
                            );
                        };
                        self.fileInputChanged();
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

            $thisElement.next().children('.translation-content').prepend(sTranslate);

            var $selectForm = $thisElement.next().find('.select-language');

            if ($.isEmptyObject(this.options.languages)) {
                var lang = this._languages,
                    label = this._defaults.customSelectLabel;
            } else {
                var lang = this.options.languages,
                    label = this.options.customSelectLabel;
            }

            $selectForm.append('<option value="'+label+'">'+label+'</option>');

            $.each(lang, function(key, value) {
                
                $selectForm.append('<option value="' + key + '">' + value + '</option>');
                
            });

        }, 

        /**
         *    Check if data from database exist
         */

        checkIfDataExist: function() {
            if (!$.isEmptyObject(this.options.existingData)) {
                var data = this.options.existingData;
            } else {
                var data = this._exData;
            }
            self = this;
            $.each(data, function(index, val) {
                self.addExistingData(index, val);
            });
        },

        /**
         *    Add existing Data to content
         */

        addExistingData: function(label, message) {

            var langTabContainer = $(this.element).next().next(),
                inputName = $(this.element).attr('name');

            $('<span id="'+ label +'" class="chosen-language"/>').text(label).appendTo(langTabContainer);
            $('<a href="/" class="remove icon-remove" />').appendTo(langTabContainer.children('span#'+label));
            $('<input type="hidden" class="m-wrap" name="'+$thisElement.attr('id')+'['+label+']" value="'+message+'"/>').appendTo(langTabContainer.children('span#'+label));

            if($.isFunction(langTabContainer.customAnimation)){
                langTabContainer.find('span').customAnimation();
            } 
            else {
                langTabContainer.find('span').css({backgroundColor: "#ffb848"});
                langTabContainer.find('span').animate({backgroundColor: "#eee"}, this.options.addAnimationSpeed);
            }

            this.markTranslatedOptions();

        },

        createConfirmButtons: function() {

            buttonYes = $('<a />', {
                "class" : "button yes",
                "id" : "removeYes",
                "href" : "#"
            }).text(this.options.confirmBox.yesText);

            buttonNo = $('<a />', {
                "class" : "button no",
                "id" : "removeNo",
                "href" : "#"
            }).text(this.options.confirmBox.noText);

            return buttonYes;
            return buttonNo;
        },

        /**
         *    Create content HTML for confirm box
         */

        createConfirmBoxContent: function() {
            
            containerConfirmOverlay = $('<div id="confirmOverlay"><div id="confirmBox"><h1>'+ this.options.confirmBox.hText +'</h1><p>'+ this.options.confirmBox.infoMessage +'</p><div id="confirmButtons"></div></div></div>');

        },

        /**
         *    Replace content when button was clicked
         */

        replaceButtonWithSpan: function() {

            $('a#removeYes').replaceWith('<span class="button yes">' + this.options.confirmBox.yesText + '</span>');
            $('a#removeNo').replaceWith('<span class="button no">' + this.options.confirmBox.noText + '</span>');
        },

         /**
         *    Removes the translation for clicked language.
         */
        removeClick: function() {

            var self = this;

            $(function () {

               $removeIcon = $(self.element);
               $removeIcon.next().next().on('click', '.remove', function(e) {

                    e.preventDefault();
                    this.blur();
                    itemToDelete = $(this).parent();

                    if(itemToDelete.hasClass("removed")) return;
                    
                    self.createConfirmBoxContent();
                    self.createConfirmButtons();

                    $(containerConfirmOverlay).hide().appendTo('body').fadeIn();

                    buttonYes.appendTo('#confirmButtons');
                    buttonNo.appendTo('#confirmButtons');


                    $main = $(this).parent().parent().siblings('input');
                    $current_div = $main.parent();

                    $('#confirmButtons').one('click', '#removeYes', function(e) {
                        if(itemToDelete.hasClass("removed")) return;
                        e.preventDefault();

                        itemToDelete.addClass("removed").fadeOut(400, function() {
                            itemToDelete.remove();
                        });
                        self.markTranslatedOptions();
                        $current_div.removeClass('show');
                        self.replaceButtonWithSpan();
                        $('#confirmOverlay').fadeOut(function() {
                            $(this).remove();
                        });
                        self.markTranslatedOptions();
                    });
                    $('#confirmButtons').one('click', '#removeNo', function(e) {
                        e.preventDefault();

                        self.replaceButtonWithSpan();
                        $('#confirmOverlay').fadeOut(function() {
                            $(this).remove();
                        });

                    });
                    
                    if(self.options.confirmBox.outerClick == true) {
                        $('#confirmBox').on('click', function(e) {
                            e.stopPropagation();
                            return false;
                        });

                        $('body').on('click', function(e) {
                            $('#confirmOverlay').fadeOut(function() {
                                $(this).remove();
                            });
                        });
                    }

                });
            });
            
        },
        escKey: function() {
            if(this.options.confirmBox.useKeys) {
                $(document).on('keypress', function(e) {
                    if (e.keyCode == 27) {
                        var $overlay = $("#confirmOverlay");
                        if($overlay.length) {
                            $overlay.remove();
                        }
                        
                    }
                });
            }
        },

        /**
         *    It shows the translation for picked language from select.
         */
        optionChanged: function() {

            var self = this;
            $selectForm = $(this.element).next().find('.select-language');

            $selectForm.on('change', function() {

                    $(this).children('option').on('click', function() {
                        $(this).siblings().attr('selected', false);
                    });
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
                    // console.log($(this));


                    if ($the_same == false) {
                        if ($(this).closest('.translation-options').prev().attr('type') == 'text') {
                            $current_div.find('.current-language .translated').css('display', 'none');
                            $current_div.find('.current-language .new-word').attr('value', '').attr('placeholder', 'Text to translate').css('display', 'inline-block');
                            $current_div.find('.current-language .new-word').focus();
                        }
                        if ($(this).closest('.translation-options').prev().attr('type') == 'file') {
                            $thisElement.next().find('.current-language').children(':file').show().attr('name', $selected).val('');
                            $thisElement.next().find('.infoText').text('');
                        };
                    } else {
                        if ($(this).closest('.translation-options').prev().attr('type') == 'text') {
                            $current_div.find('.current-language .new-word').css('display', 'none');
                            $input = $current_div.find('.language-tabs span[id=' + $selected + ']').children('input');
                            $current_div.find('.current-language .translated').css('display', 'inline-block').html($input.val()).val($input.val());
                        }
                        if ($(this).closest('.translation-options').prev().attr('type') == 'file') {
                            $thisElement.next().find('.current-language').children(':file').remove();
                            $thisElement.next().find('.current-language').append($thisElement.next().next().find('#'+$selected).children(':file').clone().show());

                            self.getFileName();

                            $thisElement.next().find('.infoText').text(fileInputValue).attr('title', fileInputValue);

                            $thisElement.next().find('.infoText').insertAfter(
                                $thisElement.next().find(':file')
                            );

                            self.fileInputChanged();
                        };
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

            $thisElementParent.find(".language-tabs").children("span").not(".removed").each(function(k,v){
                $thisElementParent.find("select option[value='" + $(v).attr("id") + "']").addClass("translated");
            });

        },
        /**
         *    It hide/show textarea to pass translation.
         *    Depends on select. If a lang is seleted - show it.
         */
        toggleTranslationInput: function() {
            var $thisElementParent = $(this.element).parent();
            $selectedLabel = $thisElement.next().find('option:selected').val();
            $currentLang = $thisElement.next().find('.current-language');

            if (!$.isEmptyObject(this.options.customSelectLabel)) {
                var customSelectLabel = this.options.customSelectLabel;
            } else {
                var customSelectLabel = this._defaults.customSelectLabel;
            }

            if($thisElementParent.find(".select-language").val() === customSelectLabel) {
                $thisElementParent.find(".m-wrap.new-word").addClass("hidden");
                $thisElementParent.find(".hide-border").siblings(".apply").addClass("hidden");
                if ($thisElement.attr('type') == 'file') {
                    $thisElement.next().find('.current-language').children(':file').hide().attr('name', '');
                };
            }
            else {
                $thisElementParent.find(".m-wrap.new-word").removeClass("hidden");
                $thisElementParent.find('.hide-border').siblings(".apply").removeClass("hidden");
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