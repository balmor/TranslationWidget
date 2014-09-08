class EditorWindow

  constructor: (@base) ->
    @_render()
    @base.log 'Editor Window rendered'
    @status = 'closed'

    # add button onClick event
    @_currentElement.find('.apply').on 'click.'+@base.pluginName, (e) =>
      e.preventDefault()

      # get current translation
      tr = null
      if @base._inputType is 'text'
        tr = @_currentElement.find('.new-word').val()
      else
        tr =  @_currentElement.find('input[type=file]')

      # check if translation exists
      if @base.languageTabs.translationExists @translation
        #update existing translation
        @base.languageTabs.updateTranslation @translation, tr
      else
        #add new translation
        @base.languageTabs.addTranslation @translation, tr
      @hide()
    return

  # Show window command
  show: (translation = 'new') ->

    # if editor window is open and new translation
    # is the same translation - hide editor window
    # and quit. Otherwise open new translation
    if @status is 'open'
      if translation is @translation
        @hide()
        return

    # set new translation
    @translation = translation

    # close other windows if opened
    @base.closeAllEditors()

    # create lang list
    @_createLangList()

    # Setup editor
    @_setEditorFor @translation

    # open editor window
    $(@base.baseElement).addClass 'show'
    @status = 'open'
    @base.log "Show editor window (translation: #{@translation})"
    return

  _setEditorFor: (lang) ->
    if lang is 'new'
      @_currentElement.find('.editors').hide()
    else
      @_currentElement.find('.editors').show()
      # If lang is existing translation
      if @base.languageTabs.translationExists lang
        # get existing translation and display it in
        # editor input element
        @_currentElement.find('.new-word').val @base.languageTabs.getTranslation lang
        # update button text
        @_currentElement.find('.apply').text 'Update'
      else
        # reset input element
        @_currentElement.find('.new-word').val ''
        @_currentElement.find('.apply').text 'Apply'
    return


  _createLangList: ->
    @langList = $('<select />', {
        "class" : "select-language",
        "tabindex" : 1
    })

    # append default option to @langList
    label = @base.options.customSelectLabel
    @langList.append "<option value=\"new\">#{label}</option>"

    # append list of languages
    $.each @base.languages, (key, value) =>
        option = $("<option value=\"#{key}\">#{value}</option>")
        if @base.languageTabs.translationExists key
          option.addClass 'translated'
        @langList.append option

    # set langList current language as selected
    @langList.find("option[value=\"#{@translation}\"]").attr 'selected', 'selected'

    # create on change event
    @langList.on 'change.'+@base.pluginName, =>
      @translation = @langList.val()
      @_setEditorFor @langList.val()

    # finally insert lang list into editor window
    @_currentElement.find('.translation-content').prepend @langList
    @base.log 'List of languages created'
    return


  # Hide window command
  hide: ->
    if @status is 'open'
      @base.log 'Hide editor window'
      $(@base.baseElement).removeClass 'show'

      # clear window
      # remove lang list
      @langList.remove()
      @status = 'closed'
    return

  _render: ->
    ewHTML = '''
    <div class="translation-options">
      <div class="translation-content">
        <div class="current-language">
          <div class="editors">
            <textarea class="m-wrap new-word" placeholder="Text to translate" rows="1"></textarea>
            <a href="#" class="btn blue apply">Apply</a>
          </div>
          <span class="hide-border"></span>
        </div>
      </div>
    </div>
    '''
    # insert ToggleBtn HTML before main input element
    $(ewHTML).insertAfter @base.baseElement.find '.lang-translation'

    # Set _currentElement as ToggleBtn HTML
    @_currentElement = @base.baseElement.find '.translation-options'

    # set content to file if base input type is file
    if @base._inputType is 'file'
      @base.log 'Replace editor to file input'
      @_currentElement.find('.new-word').hide()
      editors = @_currentElement.find '.editors'
      $('<input type="file" style="display: block" />').appendTo editors
      $('<div class="infoText" />').appendTo editors
    return
