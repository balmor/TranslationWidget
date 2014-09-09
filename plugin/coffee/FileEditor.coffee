#
# @author   Michal Katanski (mkatanski@nexway.com)
# @author   Ariana Las <ariana.las@gmail.com>
# @author   Mariusz Maroń <mmaron@nexway.com>
# @author   Damian Duda <dduda@nexway.com>
# @version 1.0.1
class FileEditor extends EditorBase

  constructor: (base, parent, langCode, value = '') ->
    @Type = 'FileEditor'
    name = base.instanceName + "[#{langCode}]"
    @editorHtml = """
    <div id="#{langCode}" class="editor toRemove" >
      <input name="#{name}" type="file" />
      <div class="infoText">#{value}</div>
    </div>
    """
    super(base, parent, langCode)
    @parent.find('.apply').text 'Save'
    if @mode is 'edit'
      @parent.find('.apply').hide()
      @_currentElement.css 'height', '50px'
    else
      @parent.find('.apply').show()
      @_currentElement.css 'height', 'auto'

    @_currentElement.find('input[type=file]').on 'change.'+@base.pluginName, (e) =>
      @base.languageTabs.highlight @langCode

    return
