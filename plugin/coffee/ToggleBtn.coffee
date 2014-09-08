class ToggleBtn

  constructor: (@base) ->
    @base.log 'Toggle Button created'

    @_render()

    # Create onClick event within plugin namespace
    $(@_currentElement).on 'click.' + @base.pluginName, =>
      @_onClick()

  _onClick: ->
    @base.log 'toggleBtn clicked!'
    @base.edWindow.show()


  _render: ->
    tgHTML = '''
    <span class="add-on open-translation">
      <i class="icon-reorder"></i>
      <i class="icon-caret-up"></i>
    </span>
    '''
    # insert ToggleBtn HTML before main input element
    $(tgHTML).insertBefore @base.baseElement.find('.lang-translation')

    # Set _currentElement as ToggleBtn HTML
    @_currentElement = @base.baseElement.find '.open-translation'
