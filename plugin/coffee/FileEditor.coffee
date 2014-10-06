# FileEditor class
#
# Creates file input type for translating languages
#
# @author   Michal Katanski <mkatanski@nexway.com>
# @author   Ariana Las <ariana.las@gmail.com>
# @author   Mariusz Maroń <mmaron@nexway.com>
# @author   Damian Duda <dduda@nexway.com>
# @author   Karol Gorecki <kgorecki@nexway.com>
# @version 1.0.1
class FileEditor extends EditorBase

  # Construct FileEditor class, inherits from EditorBase class
  #
  # Creates file input html element as an editor
  #
  # @param [class] base TranslationWidget class
  # @param [class] parent Parent class
  # @param [string] langCode Code of the language to translate
  # @param [string] value Info text string
  #
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
