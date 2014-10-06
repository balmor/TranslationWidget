# Base class for editors
#
# @author   Michal Katanski <mkatanski@nexway.com>
# @author   Ariana Las <ariana.las@gmail.com>
# @author   Mariusz Maroń <mmaron@nexway.com>
# @author   Damian Duda <dduda@nexway.com>
# @author   Karol Gorecki <kgorecki@nexway.com>
# @version 1.0.1
class EditorBase
  @Type = 'editor'
  @mode = 'new'
  @editorHtml = """
  <div id="#{@langCode}" class="editor toRemove" >
    <textarea class="m-wrap new-word" placeholder="Text to translate" rows="1"></textarea>
  </div>
  """

  # Base editor class constructor
  #
  #
  # @param [class] base TranslationWidget class
  # @param [class] parent Parent class
  # @param [string] langCode Code of the language to translate
  #
  constructor: (@base, @parent, @langCode) ->
    @parent.find('.editor').hide()
    if @parent.find('#'+@langCode).length is 1
      # lang exists - edit mode
      @mode = 'edit'
      @_currentElement = @parent.find('#'+@langCode)
      @_currentElement.show()
      @base.log "[#{@langCode}] #{@Type} ready for edit"
    else
      #create new one
      @_currentElement = $(@editorHtml)
      @_currentElement.appendTo @parent
      @base.log "New #{@Type} [#{@langCode}] created"
    return

  # Basic save language functionality
  #
  save: ->
    @_currentElement.removeClass 'toRemove'
    unless @base.languageTabs.buttonExists @langCode
      @base.languageTabs.addButton @langCode

    @base.log "#{@Type} [#{@langCode}] saved"
    @base.languageTabs.highlight @langCode
    return

  # Basic cancelling changes that was made while editing
  #
  discard: ->
    if @_currentElement.hasClass('toRemove')
      @_currentElement.remove()
      @base.log "#{@Type} [#{@langCode}] removed"
    return

  # Manually remove translation
  #
  remove: ->
    @_currentElement.remove()
    @base.log "#{@Type} [#{@langCode}] removed manually"
    return

  # Get @_currentElement
  #
  # @return [jQuery] Return editor element
  getElement: ->
    return @_currentElement
