#import EditorBase
#import TextEditor
#import FileEditor

#
# @author   Michal Katanski (mkatanski@nexway.com)
# @author   Ariana Las <ariana.las@gmail.com>
# @author   Mariusz Maroń <mmaron@nexway.com>
# @author   Damian Duda <dduda@nexway.com>
# @version 1.0.1
class EditorWindow

  constructor: (@base) ->
    @_render()
    @base.log 'Editor Window rendered'
    @status = 'closed'

    # Assign onClick event for button
    @_currentElement.find('.apply').on 'click.'+@base.pluginName, (e) =>
      e.preventDefault()
      @currentEditor.save()
      return

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
    $(@base.baseElement).find('.input-prepend').addClass 'show'
    @status = 'open'
    @base.log "Show editor window (translation: #{@translation})"
    return

  _setEditorFor: (lang) ->
    editors = @_currentElement.find('.editors')
    if lang is 'new'
      editors.hide()
    else
      if @base._inputType is 'text'
        @currentEditor = new TextEditor @base, editors, lang
      else
        @currentEditor = new FileEditor @base, editors, lang
      editors.show()
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
        if @base.languageTabs.buttonExists key
          option.addClass 'translated'
        @langList.append option

    # set langList current language as selected
    @langList.find("option[value=\"#{@translation}\"]").attr 'selected', 'selected'

    # create on change event
    @langList.on 'change.'+@base.pluginName, =>
      @translation = @langList.val()
      if @currentEditor?
        @currentEditor.discard()
      @_setEditorFor @langList.val()

    # finally insert lang list into editor window
    @_currentElement.find('.translation-content').prepend @langList
    @base.log 'List of languages created'
    return

  removeLang: (langCode) ->
    # make sure that current editor is set for language
    # which is going to be removed
    @_setEditorFor langCode
    # remove language
    @currentEditor.remove()

  # Hide window command
  hide: ->
    if @status is 'open'
      @base.log 'Hide editor window'
      $(@base.baseElement).find('.input-prepend').removeClass 'show'

      # clear window
      # remove lang list
      @langList.remove()
      # discard changes
      if @currentEditor?
        @currentEditor.discard()
      @status = 'closed'
    return

  _render: ->
    ewHTML = '''
    <div class="translation-options">
      <div class="translation-content">
        <div class="current-language">
          <div class="editors">
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
    return
