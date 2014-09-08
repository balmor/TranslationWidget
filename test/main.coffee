# Write test here or create new files

casper.test.begin 'Plugin initialisation', 1, (test) ->
  casper.start 'http://localhost:9001/', ->
    init = this.evaluate ->
      isInit = ''
      try $('.text-muted').translationWidget()
      catch e
        isInit = e.message
      return isInit
    test.assertNot init, 'Plugin initialisation'
    console.log init



casper.run()
