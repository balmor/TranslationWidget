# Translation Widget - jQuery Form Widget to translate
#
# @author   Ariana Las <ariana.las@gmail.com>
# @author   Mariusz Maroń <mmaron@nexway.com>
# @author   Damian Duda <dduda@nexway.com>
# @author   Michal Katanski <mkatanski@nexway.com>
#
# version   1.0.0-a

# Reference jQuery
$ = jQuery

pluginName = 'translationWidget'

# Default options
defaults =
  inputNamePrefix: ''
  customSelectLabel: 'Please Select'
  addAnimation: ''
  addAnimationSpeed: 700
  confirmBox:
    yesText: 'Yes, delete'
    noText: 'No, go away you crazy bastard!'
    infoMessage: 'Are you sure?'
    hText: 'Confirm your request'
    outerClick: false
    useKeys: true

# Languages enabled
languages =
  example: ''

# use this array to create default existing data from database, etc.
# format: "EN": "Message"
existingData =
  example: ''

Plugin = (element, options) ->
  this.element = element
  this.options = $.extend defaults, options, existingData, languages
  this._defaults = defaults
  this._name = pluginName

# Initialize plugin instances
Plugin.prototype.init = () ->
  #Place initialisation logic here

# main plugin function
 $.fn[pluginName] = (options) ->
    @each ->
      $.data this, "plugin_" + pluginName, new Plugin(this, options)  unless $.data(this, "plugin_" + pluginName)
      return


