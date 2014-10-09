# TextEditor class
#
# Creates text editor type for translating languages
#
# @author   Michal Katanski <mkatanski@nexway.com>
# @author   Ariana Las <ariana.las@gmail.com>
# @author   Mariusz Maroń <mmaron@nexway.com>
# @author   Damian Duda <dduda@nexway.com>
# @author   Karol Gorecki <kgorecki@nexway.com>
# @version 1.0.1
class TextEditor extends EditorBase

  # Construct TextEditor class, inherits from EditorBase class
  #
  # Creates textarea html element as an editor
  #
  # @param [class] base TranslationWidget class
  # @param [class] parent Parent class
  # @param [string] langCode Code of the language to translate
  # @param [string] initialValue Initial editor value
  #
  constructor: (base, parent, langCode, initialValue='') ->
    @Type = 'TextEditor'
    name = base.options.inputNamePrefix + base.instanceName + "[#{langCode}]"
    @editorHtml = """
    <div id="#{langCode}" class="editor toRemove" >
      <textarea name="#{name}" class="m-wrap new-word" placeholder="Text to translate" rows="1"></textarea>
    </div>
    """
    super(base, parent, langCode)

    if initialValue isnt ''
      @_currentElement.find('.new-word').val(initialValue)

    if @mode is 'edit'
      @_currentElement.data 'current', @_currentElement.find('.new-word').val()
      @parent.find('.apply').text 'Update'
    else
      @parent.find('.apply').text 'Apply'
    return

  # Save translation
  #
  # @note Overrides EditorBase::save method
  #
  save: ->
    @_currentElement.removeData 'current'
    super()
    return

  # Cancel changes in editor
  #
  # @note Overrides EditorBase::discard method
  #
  discard: ->
    super()
    unless @_currentElement.hasClass('toRemove')
      if @_currentElement.data('current')
        @_currentElement.find('.new-word').val @_currentElement.data 'current'
        @base.log "Changes in TextEditor [#{@langCode}] discarded"
    return
