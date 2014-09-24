#==========================================================================
#=                                MAIN TESTS                              =
#==========================================================================

#
# * @author: Michal Katanski (mkatanski@nexway.com)
# * @version: 0.0.2
# *
# * Basic tests which check general plugin behaviour and correct
# * initialisation as well as basic translations editing.
#

#==========  HELPER METHODS AND VARIABLES  ==========

# number of plugin instances in testing .html file
instanceNumber = 3

makeUniqueString = ->
  text = ""
  possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  i = 0

  while i < 5
    text += possible.charAt(Math.floor(Math.random() * possible.length))
    i++
  text


#==========  Casper.js Main Tests creation  ==========

###
Create tests for initializing plugin by
element id name.
Additionally, pass different options to
each instance.
###
casper.test.begin "Initialization by ID - passed different options", 0, (test) ->
  initializeMultiple = ->
    isInit = ""
    try
      langs = new Object()
      langs["Translation"] =
        EN: "English translation"
        PL: "Polskie tłumaczenie"

      langs["FakeEditorName"] = RU: "Russian"
      $("#input1").translationWidget
        debug: true
        useDefaultLanguages: true
        dataSource: langs
      ,
        BU: "Bulgarian"

      $("#input2").translationWidget
        debug: true
        useDefaultLanguages: false
        dataSource: langs
      ,
        RU: "Russian"

      $("#input3").translationWidget
        debug: false
        useDefaultLanguages: true

    catch e
      isInit = e.message
    isInit
  casper.start "http://localhost:9001/test.html", ->
    test.assertElementCount "input[type='file']", 1, "'file input' is found 1 times"
    test.assertNot @evaluate(initializeMultiple), "Initialisation"
    commonTests test, this
    return

  casper.run =>
    test.done()
    return
  return

###
Create tests for initializing plugin
by elements class name.

Single initialisation means same
options for each plugin, however languages
passed in an object can be different.
###
casper.test.begin "Initialization by class - same options", 0, (test) ->
  initializeSingle = ->
    langs = new Object()
    langs["Translation"] =
      EN: "English translation"
      PL: "Polskie tłumaczenie"

    langs["FakeEditorName"] = RU: "Russian"
    isInit = ""
    try
      $(".lang-translation").translationWidget
        debug: true
        useDefaultLanguages: true
        dataSource: langs
      ,
        RU: "Russian"

    catch e
      isInit = e.message
    isInit
  casper.start "http://localhost:9001/test.html", ->
    test.assertElementCount "input[type='file']", 1, "'file input' is found 1 times"
    test.assertNot @evaluate(initializeSingle), "Initialisation"
    commonTests test, this

    return

  casper.run =>
    test.done()
    return

  return



#==========  TESTING METHODS  ==========


##
#
# Perform commont test for both initialisation modes.
#
# @param casper.js test object
# @param current scope
#
commonTests = (test, _this) ->

  cg2BtnClick = (test, _this, newENTrans) ->
    _this.click "#cg2 .add-on"
    _this.echo "#cg2 .add-on clicked", "COMMENT"

    # check #cg1 for skipped translation
    existingLanguages =
      EN: newENTrans
      PL: "Polskie tłumaczenie"

    fakeLanguages = ["FR"]
    _checkTranslationsExistence test, existingLanguages, fakeLanguages, "#cg1"

    # wait 500ms for close and open editor windows
    _this.wait 500, ->
      test.assertNotVisible "#cg1 .translation-options", "'#cg1.translation-options' not visible after #cg2 click"
      test.assertVisible "#cg2 .translation-options", "'#cg2.translation-options' visible after #cg2 click"
      test.assertNotVisible "#cg3 .translation-options", "'#cg3.translation-options' not visible after #cg2 click"
      _langEditingTests "#cg2", test, _this, false
      bodyClick test, _this, newENTrans, "Polskie tłumaczenie"

  bodyClick = (test, _this, ENTrans, PLTrans) ->
    _this.click "body"
    _this.echo "#body clicked", "COMMENT"

    # wait 500ms for close all opened editor windows.
    _this.wait 500, ->
      _checkDefaultState test, _this
      test.assertElementCount ".control-group .input-prepend .translation-options select", 0, "'select' is found 0 times"
      _testTabs test, _this, ENTrans, PLTrans

  _checkDefaultState test, _this
  _this.echo "Checking default data loaded during initialisation...", "COMMENT"
  existingLanguages =
    EN: "English translation"
    PL: "Polskie tłumaczenie"

  fakeLanguages = ["RU"]
  _checkTranslationsExistence test, existingLanguages, fakeLanguages, "#cg1"
  existingLanguages = null
  fakeLanguages = [
    "PL"
    "EN"
  ]
  _checkTranslationsExistence test, existingLanguages, fakeLanguages, "#cg2"
  _checkTranslationsExistence test, existingLanguages, fakeLanguages, "#cg3"
  _this.echo "#cg1 .add-on clicked", "COMMENT"
  _this.click "#cg1 .add-on"
  casper.waitFor(->
    _this.wait 200, ->
      test.assertVisible "#cg1 .translation-options", "'#cg1.translation-options' visible after #cg1 click"
      test.assertNotVisible "#cg2 .translation-options", "'#cg2.translation-options' not visible after #cg1 click"
      test.assertNotVisible "#cg3 .translation-options", "'#cg3.translation-options' not visible after #cg1 click"
      newENTrans = _langEditingTests("#cg1", test, _this, true, "English translation", "Polskie tłumaczenie")
      _langCreationTests "#cg1", test, _this, newENTrans, "Polskie tłumaczenie"
      cg2BtnClick test, _this, newENTrans

  )
  return

##
#
# Check opening existing languages by click on its tab
# and switching between existing languages
#
_testTabs = (test, _this, ENTrans, PLTrans) ->

  # open existing translation (PL)
  #_this.click('#cg1 #PL.chosen-language');
  clickSecondTab = ->
    casper.evaluate ->
      $("#cg1 #EN.chosen-language").click()
      return

    _this.wait 400, ->
      existingLanguages =
        EN: ENTrans
        PL: PLTrans

      _checkEditorWindow "#cg1", test, _this, existingLanguages, "update", "EN"
      clickSecondTabAgain()

  clickSecondTabAgain = ->
    casper.evaluate ->
      $("#cg1 #EN.chosen-language").click()
      return

    _this.wait 400, ->
      _checkDefaultState test, _this

      # Try to delete lang without accepting
      casper.evaluate ->
        $("#cg1 #EN.chosen-language .remove").click()
        return
      _checkConfirmWindow(test, _this, 'NO')
      # Language should be still available
      existingLanguages =
        EN: ENTrans
        PL: PLTrans
      fakeLanguages = null
      _checkTranslationsExistence test, existingLanguages, fakeLanguages, "#cg1"

      # Now try to accept deleting language
      casper.evaluate ->
        $("#cg1 #EN.chosen-language .remove").click()
        return
      _checkConfirmWindow(test, _this, 'OK')
      # Language should be still available
      existingLanguages =
        PL: PLTrans
      fakeLanguages = ["EN"]
      _checkTranslationsExistence test, existingLanguages, fakeLanguages, "#cg1"

      true

  _this.echo "Checking tabs behaviour...", "COMMENT"
  casper.evaluate ->
    $("#cg1 #PL.chosen-language").click()
    return

  _this.wait(500, ->
    existingLanguages =
      EN: ENTrans
      PL: PLTrans
    _checkEditorWindow "#cg1", test, _this, existingLanguages, "update", "PL"
    clickSecondTab()
  )
  return


##
#
# Test adding new translations
#
_langCreationTests = (instanceID, test, _this, ENTrans, PLTrans) ->
  _this.echo "Select non existing language ES by #{instanceID} dropdown list", "COMMENT"
  newES_value = makeUniqueString()
  casper.evaluate ((instanceID) ->
    $("#{instanceID} select").val("ES").change()
    return
  ), instanceID
  existingLanguages =
    EN: ENTrans
    PL: PLTrans
    ES: ""

  _checkEditorWindow instanceID, test, _this, existingLanguages, "create", "ES"
  casper.evaluate ((instanceID, newES_value) ->
    $("#{instanceID} .translation-options .editors #ES.editor textarea[name='Translation[ES]']").val newES_value
    $("#{instanceID} .translation-options .editors .apply").click()
    return
  ), instanceID, newES_value
  _this.click "#{instanceID} .translation-options .editors .apply"
  casper.evaluate ((instanceID) ->
    $("#{instanceID} select").val("FR").change()
    return
  ), instanceID
  existingLanguages =
    EN: ENTrans
    PL: PLTrans
    ES: newES_value
    FR: ""

  _checkEditorWindow instanceID, test, _this, existingLanguages, "create", "FR"
  return

###
Perform languages editing test for single plugin instance.
Only for text inputs
###
_langEditingTests = (instanceID, test, _this, existingData, ENTrans, PLTrans) ->
  if existingData is true
    newPL_value = makeUniqueString()
    newEN_value = makeUniqueString()

    # select existing language PL
    _this.echo "Select existing language PL by #{instanceID} dropdown list", "COMMENT"
    casper.evaluate ((instanceID, newPL_value) ->
      $("#{instanceID} select").val("PL").change()
      $("#{instanceID} .translation-options .editors #PL.editor textarea[name='Translation[PL]']").val newPL_value
      return
    ), instanceID, newPL_value
    existingLanguages =
      EN: ENTrans
      PL: newPL_value

    _checkEditorWindow instanceID, test, _this, existingLanguages, "update", "PL"

    # select existing language EN
    _this.echo "Select existing language EN by #{instanceID} dropdown list", "COMMENT"
    casper.evaluate ((instanceID, newEN_value) ->
      $("#{instanceID} select").val("EN").change()
      $("#{instanceID} .translation-options .editors #EN.editor textarea[name='Translation[EN]']").val newEN_value
      return
    ), instanceID, newEN_value
    existingLanguages =
      EN: newEN_value
      PL: PLTrans

    _checkEditorWindow instanceID, test, _this, existingLanguages, "update", "EN"

    # apply EN changes and switch to PL language
    casper.evaluate ((instanceID, newPL_value) ->
      $("#{instanceID} .translation-options .editors .apply").click()
      $("#{instanceID} select").val("PL").change()
      $("#{instanceID} .translation-options .editors #PL.editor textarea[name='Translation[PL]']").val newPL_value
      return
    ), instanceID, newPL_value
    existingLanguages =
      EN: newEN_value
      PL: newPL_value

    _checkEditorWindow instanceID, test, _this, existingLanguages, "update", "PL"
    return newEN_value
  else

    # Check number of highlighted select options
    test.assertElementCount "#{instanceID} select option.translated", 0, "'#{instanceID} select' contains 0 highlighted options as expected"
    fakeLanguages = [
      "PL"
      "EN"
    ]
    _checkTranslationsExistence test, null, fakeLanguages, instanceID
  null


#==========  TESTING HELPERS  ==========

##
#
# Check if editor windows is working correctly
#
_checkEditorWindow = (instanceID, test, _this, languages, mode, visibleLang) ->
  _this.echo "Checking editor window for #{instanceID} and mode is: " + mode, "COMMENT"
  omitTabs = false
  if mode is "new"
    test.assertElementCount ".control-group .input-prepend .translation-options select", 0, "'select' is found 0 times as expected"
    test.assertNotExists "#{instanceID} select", "'select' is not found"
    test.assertNotVisible "#{instanceID}.translation-options .editors", "'.editors' is not visible"
  else if mode is "update"
    test.assertElementCount ".control-group .input-prepend .translation-options select", 1, "'select' is found 1 times as expected"
    test.assertExists "#{instanceID} select", "'select' is found in correct instance"
    test.assertSelectorHasText "#{instanceID} .translation-options .editors .apply", "Update", "'#{instanceID} save btn' has correct text when updating translation"
  else if mode is "create"
    omitTabs = true
    test.assertElementCount ".control-group .input-prepend .translation-options select", 1, "'select' is found 1 times as expected"
    test.assertExists "#{instanceID} select", "'select' is found in correct instance"
    test.assertSelectorHasText "#{instanceID} .translation-options .editors .apply", "Apply", "'#{instanceID} save btn' has correct text when creating translation"
  _checkTranslationsExistence test, languages, null, instanceID, omitTabs
  for l,t of languages
    if l is visibleLang
      test.assertVisible "#{instanceID} .translation-options .editors ##{l}.editor textarea[name='Translation[#{l}]']", "'#{instanceID} #{l}  Translation textarea' is visible as expected"
    else
      test.assertNotVisible "#{instanceID} .translation-options .editors ##{l}.editor textarea[name='Translation[#{l}]']", "'#{instanceID} #{l}  Translation textarea' is not visible as expected"
    test.assertElementCount "#{instanceID} select option[value='#{l}'].translated", 1, "'#{instanceID} select' has highlighted #{l} language"  if mode is "update"
  return

##
#
# Test if plugin contains languages from availableLangs array and optionally
# test if plugin DOES NOT contain languages from fakeLangs array.
#
#
_checkTranslationsExistence = (test, availableLangs, fakeLangs, instanceID, omitTabs) ->
  id = instanceID
  if availableLangs?
    for l,t of availableLangs
      test.assertExists "#{id} .translation-options .editors ##{l}.editor", "#{id} #{l} editor exists as expected"
      test.assertExists "#{id} .translation-options .editors ##{l}.editor textarea[name='Translation[#{l}]']", "'#{id} #{l} Translation textarea' exists as expected"
      test.assertExists "#{id} .language-tabs ##{l}.chosen-language", "'#{id} #{l}' tab exists as expected"  unless omitTabs
      text = casper.evaluate((id, l) ->
        $("#{id} .translation-options .editors ##{l}.editor textarea[name='Translation[#{l}]']").val()
      , id, l)
      test.assertEquals text, t, "'#{l} Translation textarea' contains correct string"

  if fakeLangs?
    i = fakeLangs.length - 1

    while i >= 0
      fl = fakeLangs[i]
      test.assertNotExists "#{id} .translation-options .editors ##{fl}.editor", "'#{id} #{fl}' editor not exists as expected"
      test.assertNotExists "#{id} .translation-options .editors ##{fl}.editor textarea[name='Translation[#{fl}]']", "'#{id} #{fl} Translation textarea' not exists as expected"
      test.assertNotExists "#{id} .language-tabs ##{fl}.chosen-language", "'#{id} #{fl}' tab not exists as expected"  unless omitTabs
      i--
  return


##
#
# Check plugin DOM while its in default state
#
_checkDefaultState = (test, _this) ->
  _this.echo "Checking default state of plugin instances...", "COMMENT"
  test.assertElementCount "input[type='file']", 0, "'file input' is found 0 times"
  test.assertElementCount ".control-group .input-prepend", instanceNumber, "'.input-prepend' is found #{instanceNumber} times"
  test.assertElementCount ".control-group .add-on", instanceNumber, "'.add-on' is found #{instanceNumber} times"
  test.assertElementCount ".control-group .language-tabs", instanceNumber, "'.language-tabs' is found #{instanceNumber} times"
  test.assertElementCount ".control-group .translation-options", instanceNumber, "'.translation-options' is found #{instanceNumber} times"
  test.assertElementCount ".control-group .translation-options select", 0, "'select' is found 0 times"
  test.assertElementCount ".control-group .translation-options .editors", instanceNumber, "'.editors' is found #{instanceNumber} times"
  test.assertNotVisible "#cg1 .translation-options", "'#cg2.translation-options' not visible"
  test.assertNotVisible "#cg2 .translation-options", "'#cg2.translation-options' not visible"
  test.assertNotVisible "#cg3 .translation-options", "'#cg2.translation-options' not visible"
  return


_checkConfirmWindow = (test, _this, click='OK') ->
  test.assertElementCount "body #confirmOverlay", 1, "Confirm window is found 1 time as expected"
  if click is 'OK'
    _this.click "body #confirmOverlay .yes"
    _this.echo "Confirm window click OK", "COMMENT"
  if click is 'NO'
    _this.click "body #confirmOverlay .no"
    _this.echo "Confirm window click NO", "COMMENT"
  test.assertElementCount "body #confirmOverlay", 0, "Confirm window is not found as expected"
