## Import required classes in correct order
#import Plugin
#import EditorWindow
#import LanguageTabs

#______________________________________________________________
#                                             TranslationWidget
#
# Main translationWidget class
#
# @author   Michal Katanski <mkatanski@nexway.com>
# @author   Ariana Las <ariana.las@gmail.com>
# @author   Mariusz Maroń <mmaron@nexway.com>
# @author   Damian Duda <dduda@nexway.com>
# @author   Karol Gorecki <kgorecki@nexway.com>
# @version 1.0.5
class TranslationWidget extends Plugin

  #default options
  defaultOptions =
    dataSource: 'json' # object, function
    useDefaultLanguages: true
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

  # Construct base class.
  #
  # @param [Object] element jQuery plugin object
  # @param [Object] options User options
  # @param [String] instanceName Instance name
  # @param [String] pluginName Plugin name
  # @param [Object] languages Languages list
  #
  constructor: (element, options, instanceName, @pluginName, languages) ->
    options = $.extend({}, defaultOptions, options)
    if options.useDefaultLanguages
      @languages = $.extend(true, {}, defLanguages, languages)
    else
      @languages = languages

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
      @log 'Element should be HTML <input />', 'error'
      return
    else
      @_constructSkeleton()

    return

  # Initialize class instances for plugin controls
  #
  init: ->
    # Set .control-group div as base element
    # <div class="control-group form-translation">...</div>
    @baseElement = @_currentElement.parents('.control-group')

    # get input type
    @_inputType = @_currentElement.attr('type').toLowerCase()
    if @_inputType is 'file'
      @log 'Input type is file'
      @_currentElement.attr('type', 'text').addClass('replacement')

    # Create new toggle button
    @_createToggleBtn()

    # Create editor window
    @edWindow = new EditorWindow(@)

    # Create language tabs
    @languageTabs = new LanguageTabs(@)

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
    $(@baseElement).on 'click.' + @pluginName, (e) ->
      e.stopPropagation()
      return

    # Populate existing translations
    @_fillData()

    return

  # Remove all translation from current instance
  #
  # @param [Bool] showConfirmation Show confirmation box if true
  #
  clearData: (showConfirmation = true)->
    list = @languageTabs.getAllLanguages()
    if showConfirmation
      @showConfirmBox =>
        for langCode in list
          @languageTabs.removeLanguage(langCode)
        return
    else
      for langCode in list
        @languageTabs.removeLanguage(langCode)
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

  # Create and render ToggleButton
  #
  # @private
  _createToggleBtn: ->
    tgHTML = '''
    <span class="add-on open-translation">
      <i class="icon icon-options"></i>
    </span>
    '''
    # insert ToggleBtn HTML before main input element
    $(tgHTML).insertBefore @baseElement.find('.lang-translation')

    # Set _currentElement as ToggleBtn HTML
    @tglBtn = @baseElement.find '.open-translation'

  # Create existing translations
  #
  # @private
  #
  _fillData: ->
    # variable containing exsiting translations
    dataObject = null
    # check whether data source is custom function
    if $.isFunction @options.dataSource
      @log 'dataSource is a function'
      # set dataObject to result of a function
      @_processDataForEach @options.dataSource(@instanceName)
    else if typeof @options.dataSource is 'object'
      @log 'dataSource is an object'
      # set dataObject to dataSource
      @_processDataForEach @options.dataSource
    else
      @log 'No data source', 'warning'

    return

  # Add language translation for each instance
  #
  # @private
  # @param [Object] dataObject List of translations for each instance
  #
  _processDataForEach: (dataObject) ->
    @runForEachInstance 'input.lang-translation', (instance) ->
      #instance.edWindow.show()
      curTransObj = dataObject[instance.instanceName]
      for langCode, translation of curTransObj
        instance.edWindow.addLang langCode, translation
      return

  # Close all opened editor windows in document
  #
  closeAllEditors: ->
      @log 'Closing all editor windows'
      $('body').find('.control-group').removeClass('show')
      # close all editor windows for each active instance
      @runForEachInstance 'input.lang-translation', (instance) ->
        instance.edWindow.hide()
      return

  # Show confirm box
  #
  # @param [Method] callback Code to execute when user accept
  #
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
    instanceCount = @.length
    @each ->
      count = count + 1
      if instanceCount is 1
        # if its only one instance do not generate
        # index number. Try to use elements id instead.
        # This will enable possibility to instantiate
        # plugin by id.
        count = '#' + $(this).attr('id')

      instanceName = pluginName + '_' + count
      newInstance = new TranslationWidget(this, options, instanceName, pluginName, languages)
      unless $.data(this, instanceName)
        $.data this, instanceName, newInstance
        newInstance.init()
    return

  return
) jQuery, window, document
