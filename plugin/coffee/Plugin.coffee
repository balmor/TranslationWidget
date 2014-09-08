#______________________________________________________________
#                                                        Plugin
# Generic class for plugins. Extend this class to
# create own functionality
#
# @author Michal Katanski (mkatanski@nexway.com)
# @version 0.0.1
class Plugin
    #default settings
    defaultOptions =
      debug:    false

    constructor: (element, options, instanceName) ->
      # initial plugin element
      @element = element
      @options = $.extend({}, defaultOptions, options)
      @instanceName = instanceName
      @defaults = defaultOptions

    # simple logger
    log: (msg) ->
      if @options.debug is on
        console.log @instanceName + ': ' + msg
      return
