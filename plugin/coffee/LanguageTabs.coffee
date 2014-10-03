# LanguageTabs class
#
# Manage language tabs (add, edit, remove)
#
# @author   Michal Katanski <mkatanski@nexway.com>
# @author   Ariana Las <ariana.las@gmail.com>
# @author   Mariusz Maroń <mmaron@nexway.com>
# @author   Damian Duda <dduda@nexway.com>
# @version 1.0.4
class LanguageTabs

  HIGHLIGHT_COLOR =   '#ffb848'
  MOUSE_OVER_COLOR =  '#e1e1e1'
  BASE_COLOR =        '#eee'

  # Construct LanguageTabs class
  #
  # @param [class] base TranslationWidget class
  #
  constructor: (@base) ->
    @buttons = []

    @base.log 'Language tabs created'
    @_render()
    @_addCustomAnimation()

    #Get original width of base input
    @baseInputWidth = parseInt @base.baseElement.find('.lang-translation').width()
    # get width of toggle button
    @tglBtnWidth = parseInt @base.baseElement.find('.open-translation').width()
    @tglBtnMarginRight = parseInt @base.baseElement.find('.open-translation').css('marginRight')
    return

  # Render LanguageTabs HTML into DOM
  # @private
  _render: ->
    ltHTML = '''
    <div class="language-tabs"></div>
    '''
    $(ltHTML).insertAfter @base.baseElement.find '.translation-options'
    @_currentElement = @base.baseElement.find '.language-tabs'
    @base.log 'Language tabs rendered'

  # Create new button (tab) and append it to the list
  #
  # @param [String] langCode Code of the language that button refers to
  addButton: (langCode) ->
    if @buttonExists langCode
      @base.log "Cannot add [#{langCode}]! Button exists.", 'error'
      return

    span = $("<span id=\"#{langCode}\" class=\"chosen-language\"/>").text langCode
    removeIcon = $('<a href="#" class="remove icon-remove" />')
    removeIcon.appendTo span

    removeIcon.on 'click.'+@base.pluginName, (e) =>
      e.preventDefault()
      e.stopPropagation()
      @base.showConfirmBox =>
        @removeLanguage langCode
        return

    # Add onClick event for button to show editor window in edit mode
    # or hide it when its already opened
    span.on 'click.'+@base.pluginName, =>
      @base.log "LangBtn [#{langCode}] clicked"
      @base.edWindow.show langCode

    # add mouse events for highlighting item
    span.on 'mouseover.'+@base.pluginName, =>
      span.css {backgroundColor: MOUSE_OVER_COLOR}
    span.on 'mouseleave.'+@base.pluginName, =>
      span.css {backgroundColor: BASE_COLOR}

    span.appendTo @_currentElement

    @base.log "Button added: #{langCode}"
    @_updateInputWidth()
    return

  # Remove button (tab) from the list
  #
  # @deprecated
  # @note To completely remove language translation, use EditorWindow::removeLang instead of using this method.
  #
  # @param [String] langCode Code of the language that button refers to
  removeLanguage: (langCode) ->
    @base.edWindow.removeLang langCode
    @base.edWindow.hide()
    @_currentElement.find('#'+langCode).remove()
    @base.log "Button [#{langCode}] removed"
    @_updateInputWidth()
    return

  # Check whether button refering provided language exists
  #
  # @param [String] langCode Code of the language that button refers to
  # @return [Bool] Return true if button exists
  buttonExists: (langCode) ->
    return if @_currentElement.find('#'+langCode).length is 1 then true else false

  # Get list of all languages that have its own button
  #
  # @return [Array] list of buttons id's
  getAllLanguages: ->
    list = new Array()
    langBtns = @_currentElement.find('.chosen-language')
    langBtns.each ->
      list.push $(@).attr('id')

    return list

  # Highlight selected button. By default method is using standard animation.
  # If custom animation exists, it will use custom animation instead.
  #
  # @param [String] langCode Code of the language that button refers to
  #
  highlight: (langCode) ->
    button = @_currentElement.find('#'+langCode)
    if $.isFunction @.customAnimation
        button.customAnimation()
    else
      button.css {backgroundColor: HIGHLIGHT_COLOR}
      button.animate {"backgroundColor": BASE_COLOR}, @base.options.addAnimationSpeed
    return

  # Updates main input width to fit buttons (tabs) width
  # @private
  _updateInputWidth: ->
    # static margin
    margin = 20
    #Get btns element and count single btn width
    btns = @_currentElement.children('span')
    btnMargins = parseInt(btns.css('marginLeft')) + parseInt(btns.css('marginRight'))
    btnWidth = parseInt(btns.width()) + btnMargins
    # count total length of btns
    btnsTotalWidth = (btnWidth * btns.length) + @tglBtnWidth + @tglBtnMarginRight + margin

    if btnsTotalWidth > @baseInputWidth
      # set new width for main input element
      @base.baseElement.find('.lang-translation').width btnsTotalWidth + margin
    else
      # reset width of main input element to initial
      @base.baseElement.find('.lang-translation').width @baseInputWidth
    return

  # Method checks custom animation option (options.addAnimation).
  # If the option is function, it will bind this function as new animation
  # Otherwise it will assume that option is a name of animation and will set
  # new animation type.
  #
  # @private
  _addCustomAnimation: ->
    animationNames = ["slideToggle", "fadeToggle"]

    # if custom animation is function
    if $.isFunction @base.options.addAnimation
      # set new custom animation function
      $.fn["customAnimation"] = @base.options.addAnimation;
      @base.log 'Added custom animation as new function'
    else
      # else check if name of animation is valid
      if $.inArray(@base.options.addAnimation , animationNames) isnt -1
        # set new animation based on valid animation name
        $.fn["customAnimation"] = ->
          @[@base.options.addAnimation] 0
          return @[@base.options.addAnimation] @base.options.addAnimationSpeed
        @base.log 'Added custom animation based on name'
