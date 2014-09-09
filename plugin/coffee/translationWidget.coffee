## Import required classes in correct order
#import Plugin
#import EditorWindow
#import LanguageTabs

#______________________________________________________________
#                                             TranslationWidget
#
# Main translationWidget class
#
# @author   Michal Katanski (mkatanski@nexway.com)
# @author   Ariana Las <ariana.las@gmail.com>
# @author   Mariusz Maroń <mmaron@nexway.com>
# @author   Damian Duda <dduda@nexway.com>
# @version 1.0.1
class TranslationWidget extends Plugin

  #default options
  defaultOptions =
    inputNamePrefix:    ''
    customSelectLabel:  'Please Select'
    addAnimation:       ''
    addAnimationSpeed:  700
    confirmBox:
      yesText:          'Yes, delete'
      noText:           'No, go away!'
      infoMessage:      'Are you sure ?'
      hText:            'Confirm your request'
      outerClick:       false
      useKeys:          true

  defLanguages =
    "PL": "Polish"
    "EN": "English"
    "FR": "French"
    "ES": "Spanish"
    "DE": "German"

  existingData = {}

  # Construct base class.
  #
  # @param [Object] jQuery plugin object
  #
  constructor: (element, options, instanceName, @pluginName, languages) ->
    @languages = $.extend(true, {}, defLanguages, languages)
    options = $.extend({}, defaultOptions, options)

    # set custom instance name
    instanceName = $(element).parents(".control-group").find("label").text().replace " " , "_"
    instanceName = options.inputNamePrefix + instanceName

    super(element, options, instanceName, languages)

    # set initial input element as @_currentElement
    # <input class="m-wrap lang-translation large"/>
    @_currentElement = $(element)

    # Check if initial input is input
    elementName = @_currentElement.prop("tagName").toLowerCase()
    unless elementName is 'input'
      @log 'Element should be HTML <input />'
      return
    else
      @_constructSkeleton()
      # Initialize classes and create DOM elements
      @_init()

    return

  # Initialize class instances for plugin controls
  #
  # @private
  #
  _init: ->
    # Set .control-group div as base element
    # <div class="control-group form-translation">...</div>
    @baseElement = @_currentElement.parents('.control-group')

    # get input type
    @_inputType = @_currentElement.attr('type').toLowerCase()
    if @_inputType is 'file'
      @log 'Input type is file'
      @_currentElement.attr('type', 'text').addClass('replacement')

    # Create editor window
    @edWindow = new EditorWindow(@)

    # Create language tabs
    @languageTabs = new LanguageTabs(@)

    # Create new toggle button
    @_createToggleBtn()
    @tglBtn.on 'click.' + @pluginName, =>
      @log 'toggleBtn clicked!'
      @edWindow.show()

    # Disable previus onClick events for body
    # so it will be executed only once by last
    # instance of the plugin
    $('body').off 'click.' + @pluginName

    # add onClick event for document which will
    # close all editor windows if opened
    $('body').on 'click.' + @pluginName, =>
      @closeAllEditors()

    # disable event propagation for plugin context
    # so closing all windows will not affect
    # plugin onClick events
    $(@baseElement).click (e) ->
      e.stopPropagation()
      return

    return


  # Create required HTML for widget
  #
  # @private
  #
  _constructSkeleton: ->
    wrapBox = $('<div />', {
        'class' : 'input-prepend form-translation'
    })
    @_currentElement.wrap(wrapBox)
    return

  _createToggleBtn: ->
    tgHTML = '''
    <span class="add-on open-translation">
      <i class="icon-reorder"></i>
      <i class="icon-caret-up"></i>
    </span>
    '''
    # insert ToggleBtn HTML before main input element
    $(tgHTML).insertBefore @baseElement.find('.lang-translation')

    # Set _currentElement as ToggleBtn HTML
    @tglBtn = @baseElement.find '.open-translation'

  closeAllEditors: ->
    @log 'Closing all editor windows'
    $('body').find('.control-group').removeClass('show')

    i = 0
    # Set generic plugin name to temporary variable
    # so it will be visible within 'each' scope
    iName = @pluginName
    # iterate through every instance of translation widget
    $('input.lang-translation').each ->
      i = i + 1
      # get translationWidget instance and
      # close editor window if is open
      $.data(@, iName + '_' + i).edWindow.hide()
    return

  showConfirmBox: (callback) ->
    containerHTML = """
    <div id="confirmOverlay">
      <div id="confirmBox">
        <h1>#{@options.confirmBox.hText}</h1>
        <p>#{@options.confirmBox.infoMessage}</p>
        <div id="confirmButtons" style="color: black">
          <a class="button yes" id="removeYes" href="#">
            #{@options.confirmBox.yesText}
          </a>
          <a class="button no" id="removeNo" href="#">
            #{@options.confirmBox.noText}
          </a>
        </div>
      </div>
    </div>
    """
    msgBox = $(containerHTML)

    msgBox.find('#removeYes').on 'click.'+@pluginName, (e) =>
      e.preventDefault()
      callback()
      msgBox.remove()
      return

    msgBox.find('#removeNo').on 'click.'+@pluginName, (e) =>
      e.preventDefault()
      msgBox.remove()
      return

    msgBox.hide().appendTo('body').fadeIn();

    return



#______________________________________________________________
#                                         JQuery Initialisation

(($, window, document, undefined_) ->

  pluginName = "translationWidget"
  $.fn[pluginName] = (options, languages) ->
    count = 0
    @each ->
      count = count + 1
      instanceName = pluginName + '_' + count
      newInstance = new TranslationWidget(this, options, instanceName, pluginName, languages)
      $.data this, instanceName, newInstance unless $.data(this, instanceName)

  return
) jQuery, window, document
