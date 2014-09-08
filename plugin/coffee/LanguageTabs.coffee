#import LangBtn
#import LangFileBtn

class LanguageTabs

  constructor: (@base) ->
    @translations = []

    @base.log 'Language tabs created'
    @_render()
    @_addCustomAnimation()

  _render: ->
    ltHTML = '''
    <div class="language-tabs"></div>
    '''
    $(ltHTML).insertAfter @base.baseElement.find '.translation-options'
    @_currentElement = @base.baseElement.find '.language-tabs'
    @base.log 'Language tabs rendered'


  addTranslation: (langCode, translation) ->
    if @translationExists langCode
      @base.log "Cannot add [#{langCode}]! Translation exists. Please use updateTranslation method."
      return

    # Create new translation button and append it to translation list list
    button = null
    if @base._inputType is 'file'
      button = new LangFileBtn(@base, langCode, translation)
    else
      button = new LangBtn(@base, langCode, translation)

    @translations.push button

    # Render translation button
    button.get().appendTo @_currentElement
    button.highlight()

    @base.log "Translation added: #{langCode}=#{translation}"
    return

  updateTranslation: (langCode, translation) ->
    tr = @findTranslation(langCode)
    if tr isnt null
      tr.update(translation)
      tr.highlight()
      @base.log "Translation updated: #{langCode}=#{translation}"
    return

  removeTranslation: (trBtn) ->
    index = -1
    i = -1
    for btn in @translations
      i = i + 1
      if btn is trBtn
        index = i

    if index > -1
      @translations.splice(index, 1)
      trBtn.domElement.remove()
      @base.log 'Translation removed.'
    return


  findTranslation: (langCode) ->
    for button in @translations
      if button.langCode is langCode
        return button
    return null

  translationExists: (langCode) ->
    found = false
    if @findTranslation(langCode) isnt null
      found = true
    return found

  # return translation
  getTranslation: (langCode) ->
    return @findTranslation(langCode).translation

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
