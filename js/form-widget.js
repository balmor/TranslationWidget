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
            propertyName: "value"
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

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

            
            // numeric names input
            var $inputNamed = $('.translation-options').prev();
            $inputNamed.each(function(index, element)
                {$(element).attr("name", "iTranslate"+(index+1));
            });
            this.initMethods();
        },

        initMethods: function() {

            this.newClick();
            this.addTranslate();
            this.updateTranslate();
            this.removeTranslate();

            $(this.element).before('<span class="add-on open-translation"><i class="icon-reorder"></i><i class="icon-caret-up"></i></span>');
        },

        // Show new, blank form for translate

        createBlankTemplate: function(translatedTxt) {

            this.checkEmptyFields();

            if (translatedTxt == 'undefined') {
                $('textarea').val('');
            } else {
                $('textarea').val(translatedTxt);
            }

            var $wrapBox = $('<div />', {
                "class" : "input-prepend form-translation"
            });

            $(this.element).wrap($wrapBox);
            $(this.element).after('<div class="translation-options"><div class="translation-content"><div class="current-language"><textarea class="m-wrap new-word" placeholder="Text to translate" rows="1"></textarea><a href="#" class="btn blue apply">Apply</a></div></div></div>');
            $(this.element).next().find('.apply').after('<span class="hide-border"></span>');

        },

        newClick: function() {

            $self = this;
            var $openBtn = $('.open-translation');
            
                $self.createBlankTemplate();
                $self.makeSelectLang();

            $openBtn.unbind('click').click(function(e) {
                e.preventDefault();
                

                var $applyBtn = $(".translation-content .apply");
                var translateBox = $('.m-wrap.new-word');

                $applyBtn.text('Apply');
                translateBox.val('');
                $('option:selected').removeAttr('selected');
                $(this).parent().toggleClass('show');

            }); 
        },
        

        // Create select with simple data
        makeSelectLang: function(selectedOpt) {

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

                $(this.element).next().children('.translation-content').prepend(sTranslate);

                $.each(data, function(key, value) {
                    
                    items.push('<option value="' + key + '">' + value + '</option>');
                    
                });

                if (selectedOpt) {

                    $('option[value=' + selectedOpt + ']').attr('selected', true);
                }

                var $selectForm = $(this.element).next().find('.select-language');

                $selectForm.append(items);

                $selectForm.on('change', function () {
                    $("option:selected", this).attr("selected", true).siblings().attr("selected", false);
                });
        },

        // Create content for labels
        createContentLabel: function() {
            var $contentLabel = $("<div />", {

                "class": "language-tabs"

            });
            $contentLabel.insertAfter('.translation-options');
        },

        // Remove translation 
        removeTranslate: function() {
            $(function(){

                var $deleteBtn = $('.language-tabs');

                $(".language-tabs").on('click', '.remove' , function(e) {

                    if (confirm("Delete?")) {
                
                        e.preventDefault();
                        $(this).parent().remove();

                    }

                });
            });
        },
        
        // Check avaliable languages
        checkEmptyFields: function() {

        },

        // Add new translate
        addTranslate: function() {

            var self = this;

            $(function(){

                var $applyBtn = $(".translation-content .apply");

                self.createContentLabel();
                $applyBtn.unbind('click').click(function(e) {

                    // dsad
                    e.preventDefault();
                    var translateBox = $(this).prev(),
                        translatedText = translateBox.val(),
                        tTag = $(this).parent().prev().find('option:selected').val(),
                        $appendBoxLabel = $(this).closest('.translation-options').next(),
                        $appendBoxInput = $appendBoxLabel.children('.chosen-language');

                    var iHidden = self.createInputHidden(tTag, translatedText),
                        nLabel = self.newLabel(tTag);

                    // app
                    nLabel.appendTo($appendBoxLabel).append(iHidden);

                    // console.log(nLabel);
                    

                    // clear datra from inputs
                    translateBox.val('');
                    $(this).parent().prev().find('option:selected').removeAttr('selected');



                });
            });
        },

        newLabel: function(labelText) {
            
            var nLabel = $("<span />", {

                "class": "chosen-language"

            }).text(labelText).append('<a href="#" class="remove icon-remove">');

            return nLabel;

        },

        // Create input hidden
        createInputHidden: function(tValue, tName) {

            var iHidden = $('<input/>', {

                'value':    tValue,
                'name':     tName,
                'type':     "hidden"

              });

              return iHidden;
        },

        // Updating translate
        updateTranslate: function() {

            $self = this;
            $element = this.element;

            $(function(){
                $($element).next().next('.language-tabs').on('click', '.chosen-language', function() {
                    $(this).closest('.form-translation').eq(0).addClass('show');
                    var $this = $(this),
                        $currentTargetTag = $this.find('input').attr('value');
                        $currentTargetText = $this.find('input').attr('name');

                        $('.apply').text("Update");

                        $self.createBlankTemplate($currentTargetText);
                        $self.makeSelectLang($currentTargetTag);
                });
            });
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );



// lang_click = function() {
//  $current_div = $(this).parent().parent();
//  $current_div.find('.select-language').children('option[value="select"]').attr('selected', false);
//  $current_div.find('.select-language').children('option[value="' + $(this).attr('id') + '"]').attr('selected', true);
//  $current_div.find('.current-language .new-word').css('display', 'none');
//  $current_div.find('.current-language .translated').remove();
//  $input = $(this).children('input');
//  $str = '<textarea name="' + $input.attr('name') + '" class="m-wrap translated" rows="1"></textarea>';
//  $current_div.find('.current-language').prepend($str);
//  $current_div.find('.current-language .translated').append($input.val());
//  $current_div.addClass('show');

// }

// new_click = function() {
//  $current_div = $(this).parent();

//  $current_div.find('.select-language').children('option[selected="selected"]').attr('selected', false);
//  $current_div.find('.select-language').children('option[value="select"]').attr('selected', true);
//  $current_div.find('.current-language .translated').remove();
//  $current_div.find('.current-language .new-word').attr('value', '').attr('placeholder', 'Text to translate').css('display', 'inline-block');
//  $current_div.addClass('show');
// }

// apply_click = function() {
//  //input name!!!
//  $main = $(this).parent().parent().parent().siblings('input');
//  $name = $main.attr('name');
//  $current_div = $main.parent();
//  $selected = $current_div.find('.select-language option:selected').attr('value');
//  $translation = $current_div.find('.new-word').val();
//  if ($selected != "select" && $translation != "") {
//      $str = '<span id="' + $selected  + '" class="chosen-language">' + $selected;
//      $str += '<a href="#" class="remove icon-remove"></a>';
//      $str += '<input class="m-wrap" type="hidden" name="' + $name + '[' + $selected + ']" value="' + $translation + '"/>';
//      $str += '</span>';
//      $object = $($str).appendTo($current_div.find('.language-tabs'));
//      $object.css({backgroundColor: "#ffb848", color: "#fff"});
//      $object.animate({backgroundColor: "#eee", color: "#555"}, 700);
//      $object.click(lang_click);
//      $object.children(".remove").click(remove_click);

//      $(".chosen-language").mouseover(function(){
//          $(this).css({backgroundColor: "#e1e1e1"});
//      });

//      $(".chosen-language").mouseleave(function(){
//          $(this).css({backgroundColor: "#eee"});
//      }); 
//  }
//  return false; //link deactivated

// }

// remove_click = function() {
//  //input name!!!
//  if (confirm("Delete this tranlation?")) {
//      $main = $(this).parent().parent().siblings('input');
//      $current_div = $main.parent();
//      $current_div.removeClass('show');
//      $(this).parent().remove();
//  }

//  return false; //link deactivated
// }

// jQuery(function() {
//  $('.lang-translation').wrap('<div class="input-prepend form-translation" />')
//  $('.form-translation').each(function() {
//      $(this).prepend('<span class="add-on open-translation"><i class="icon-reorder"></i><i class="icon-caret-up"></i></span>');
//      $str = '<div class="translation-options">\n';
//      $str += '<div class="translation-content"\n>';
//      $str += '<select class="select-language select2" tabindex="1">\n';
//      $str += '<option value="select" selected="selected">Select language</option>';
//      $str += '<option value="EN">English</option>';
//      $str += '<option value="DE">German</option>';
//      $str += '<option value="FR">French</option>';
//      $str += '<option value="ES">Spanish</option>';
//      $str += '<option value="PT">Portuguese</option>';
//      $str += '<option value="PL">Polish</option>';
//      $str += '<option value="JP">Japanese</option>';
//      $str += '</select>';
//      $str += '<div class="current-language">';
//      $str += '<textarea class="m-wrap new-word" placeholder="Text to translate" rows="1"></textarea>';
//      $str += '<a href="/" class="btn blue apply">Apply</a>';
//      $str += '</div>';
//      $str += '<span class="hide-border"></span>';
//      $str += '</div></div>';
//      $($str).appendTo($(this));
//      $str = '<div class="language-tabs">';
//      /* SOME EXAMPLES OF TRANSLATIONS
//      $str += '<span id="FR" class="chosen-language">FR';
//      $str += '<a href="/" class="remove icon-remove"></a>';
//      $str += '<input class="m-wrap" type="hidden" name="translation1[FR]" value="po-francusku"/>';
//      $str += '</span>';
//      $str += '<span id="EN" class="chosen-language">EN';
//      $str += '<a href="/" class="remove icon-remove"></a>';
//      $str += '<input class="m-wrap" type="hidden" name="translation1[EN]" value="po-angielsku"/>';
//      $str += '</span>';
//      */
//      $str += '</div>';
//      $($str).insertAfter($(this).children('.translation-options'));
//  });



//  $('body').click(function() {
//      $('.form-translation').removeClass('show');
//  });
    
//  $('.form-translation').click(function(e){
//      e.stopPropagation();
//  });

//  $('.open-translation').click(new_click);
//  $('.chosen-language').click(lang_click);
//  $('.apply').click(apply_click);
//  $('.remove').click(remove_click);

  
// });