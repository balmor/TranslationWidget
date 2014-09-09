#
# @author   Michal Katanski (mkatanski@nexway.com)
# @author   Ariana Las <ariana.las@gmail.com>
# @author   Mariusz Maroń <mmaron@nexway.com>
# @author   Damian Duda <dduda@nexway.com>
# @version 1.0.1
class TextEditor extends EditorBase

  constructor: (base, parent, langCode) ->
    @Type = 'TextEditor'
    name = base.instanceName + "[#{langCode}]"
    @editorHtml = """
    <div id="#{langCode}" class="editor toRemove" >
      <textarea name="#{name}" class="m-wrap new-word" placeholder="Text to translate" rows="1"></textarea>
    </div>
    """
    super(base, parent, langCode)

    if @mode is 'edit'
      @_currentElement.data 'current', @_currentElement.find('.new-word').val()
      @parent.find('.apply').text 'Update'
    else
      @parent.find('.apply').text 'Apply'
    return

  save: ->
    @_currentElement.removeData 'current'
    super()
    return

  discard: ->
    super()
    unless @_currentElement.hasClass('toRemove')
      if @_currentElement.data('current')
        @_currentElement.find('.new-word').val @_currentElement.data 'current'
        @base.log "Changes in TextEditor [#{@langCode}] discarded"
    return
