class LangFileBtn extends LangBtn

  constructor: (base, langCode, input) ->
    super(base, langCode, input.val())
    # copy file input to domElement
    finput = input.clone()
    finput.hide().appendTo @domElement
    input.val('')
    @base.log 'Language File Btn created'
    return

  update: (input) ->
    super(input.val())
    # Replace file input
    @domElement.find('input[type=file]').remove()
    input.clone().appendTo @domElement
    input.val('')
    return
