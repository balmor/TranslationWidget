class LangBtn

  HIGHLIGHT_COLOR =   '#ffb848'
  MOUSE_OVER_COLOR =  '#e1e1e1'
  BASE_COLOR =        '#eee'

  constructor: (@base, @langCode, @translation) ->
    @base.log 'Language Btn created'
    # set initial state of btn
    @_render()

    # Add onClick event listener for remove button
    @removeIcon.on 'click.'+@base.pluginName, (e) =>
      e.preventDefault()
      @base.edWindow.hide()
      # Remove event listeners for current button
      @removeIcon.off 'click.'+@base.pluginName
      @removeIcon.off 'mouseover.'+@base.pluginName
      @removeIcon.off 'mouseleave.'+@base.pluginName
      # finally remove button from document
      # and main translations array
      @base.languageTabs.removeTranslation(@)

    # Add onClick event for button to show editor window in edit mode
    # or hide it when its already opened
    @domElement.on 'click.'+@base.pluginName, =>
      @base.log "LangBtn [#{@langCode}] clicked"
      @base.edWindow.show @langCode

    # add mouse events for highlighting item
    @domElement.on 'mouseover.'+@base.pluginName, =>
      @domElement.css {backgroundColor: MOUSE_OVER_COLOR}
    @domElement.on 'mouseleave.'+@base.pluginName, =>
      @domElement.css {backgroundColor: BASE_COLOR}
    return

  _render: ->
    # Create lang item DOM
    @domElement = $("<span id=\"#{@langCode}\" class=\"chosen-language\"/>").text @langCode
    @removeIcon = $('<a href="#" class="remove icon-remove" />')
    input = $("<input type=\"hidden\" class=\"m-wrap\" name=\"[#{@langCode}]\" value=\"#{@translation}\"/>")

    @removeIcon.appendTo @domElement
    input.appendTo @domElement
    return

  # Get current button
  get: ->
    return @domElement

  update: (translation) ->
    @domElement.find('input.m-wrap').val translation
    @translation = translation
    return

  # highlight item
  highlight: ->
    if $.isFunction @.customAnimation
        @domElement.customAnimation()
    else
      @domElement.css {backgroundColor: HIGHLIGHT_COLOR}
      @domElement.animate {"backgroundColor": BASE_COLOR}, @base.options.addAnimationSpeed
    return
