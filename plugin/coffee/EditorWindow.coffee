#import EditorBase
#import TextEditor
#import FileEditor

# EditorWindow class
#
# Language editing functionality. Language translation management.
#
# @author   Michal Katanski <mkatanski@nexway.com>
# @author   Ariana Las <ariana.las@gmail.com>
# @author   Mariusz Maroń <mmaron@nexway.com>
# @author   Damian Duda <dduda@nexway.com>
# @author   Karol Gorecki <kgorecki@nexway.com>
# @version 1.0.1
class EditorWindow

  # Construct EditorWindow class
  #
  # @param [class] base TranslationWidget class
  #
  constructor: (@base) ->
    @_render()
    @base.log 'Editor Window rendered'
    @status = 'closed'

    # Assign onClick event for button
    @_currentElement.find('.apply').on 'click.'+@base.pluginName, (e) =>
      e.preventDefault()
      @currentEditor.save()
      @setOptionAsTranslated @translation
      @_currentElement.find('.apply').text 'Update'
      return

    return

  # Show editor window. If language cod is set to 'new' (default)
  # Editor will be in 'new language' mode. Otherwise, editor will open
  # language to translate by its code.
  #
  # @param [String] translation language code of translation to edit. Default is 'new'.
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

  # Set appropriate editor to display and edit translation
  #
  # @private
  # @param [String] lang Language code
  # @param [String] initialValue initial value to show in editor
  #
  _setEditorFor: (lang, initialValue='') ->
    editors = @_currentElement.find('.editors')
    if lang is 'new'
      editors.hide()
    else
      if @base._inputType is 'text'
        @currentEditor = new TextEditor @base, editors, lang, initialValue
      else
        @currentEditor = new FileEditor @base, editors, lang
      editors.show()
    return


  # Create drop-down box with list of all available languages
  #
  # @note List of all available languages is set by initialization method
  #
  # @private
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

  # Set options as translated in select languages list.
  #
  # @param [String] langCode Language code to set as translated
  #
  setOptionAsTranslated: (langCode) ->
    @langlist = @_currentElement.find('select')
    @langlist.find("option[value=\"#{langCode}\"]").addClass 'translated'
    return

  # Completely removes language translation. Language is still avaiable
  # for further translate.
  #
  # @param [String] langCode Code of language to remove from list of translated languages
  #
  removeLang: (langCode) ->
    # make sure that current editor is set for language
    # which is going to be removed
    @_setEditorFor langCode
    # remove language
    @currentEditor.remove()

  # Programatically add translation for existing langCode
  #
  # @note Usefull for editing translations using external extensions
  #
  # @param [String] langCode Language code in ISO format
  # @param [String] translation Translated string
  #
  addLang: (langCode, translation) ->
    if @base.languages[langCode]?
      @_setEditorFor langCode, translation
      @currentEditor.save()
    else
      @base.log "There is no #{langCode} language", 'warning'

  # Hide editor window
  #
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

  # Create HTML of editor window and render it into DOM
  #
  # @private
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
