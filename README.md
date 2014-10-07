TranslationWidget
=================

Translation Widget is a jQuery widget which you can use to enable sending text strings and/or files in different languages.

Requirements
-------------

Translation Widget requires [jquery](http://jquery.com/) library to work.

Installation
-------------

To enable this widget on your website you have to include javascript documents in your document head section:
 ```html
 <!-- jQuery  -->
 <script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>
 <!-- Widget core scripts  -->
 <script src="scripts/jq.translationWidget.min.js"></script>
 ```

Also there is need to include css styles sheets:
```html
<link rel="stylesheet" href="styles/translationWidget.css">
```

*jq.translationWidget.min.js* and *translationWidget.css* files you can find in **/dist/scripts** and **/dist/styles** folders.

--------------

Initialization
-----------

First you have to create basic html skeleton for each instance like this:
```html
<div class="control-group">
 <label class="control-label">Translation</label>
   <div class="controls">
     <input id="input1" type="text" class="m-wrap large lang-translation" readonly />
   </div>
</div>
```

Note that input id attribute is optional and it depends on how you want to initialize plugin. There are two methods of doing this: by class or by id. The second method will be discussed later in this document. The main difference betweent those two methods is when plugins are intialized by class name, all options are equal for each instance on page. Initialization by id gives each instance more independent behaviour.

Below is simple initialization by class reference just to make the plugin work. Place it somewhere in your document (for example at the bottom, just before ```</body>``` tag).
```html

<script>

// WIDGET INITIALIZATION BY CLASS
$('.lang-translation').translationWidget();

</script>

```


Options
------------

You can change widget settings by passing them as an JavaScript Object during initialization.
```html
<script>
// WIDGET INITIALIZATION BY CLASS
$('.lang-translation').translationWidget({
 // options list
}, {
 // custom languages list
});
</script>

```

###Available languages

By default Translation Widget has list of 5 available languages: Polish, English, French, Spanish, German. You can append new language to the list or override with your own cutom list.

To append new languages simply pass it during initialization as an JavaScript object just after options list like this:
```html
<script>
// WIDGET INITIALIZATION BY CLASS
$('.lang-translation').translationWidget({
 // options list
}, {
 'RU': 'Russian'
});
</script>
```

The code above will add new russian language to the list. If you want to use only your list, set 'useDefaultLanguages' option to **false**:
```html
<script>
// WIDGET INITIALIZATION BY CLASS
$('.lang-translation').translationWidget({
 useDefaultLanguages: false,
}, {
 'RU': 'Russian'
});
</script>
```

### Other options

1. **inputNamePrefix** - it will be added to every input name at the beginning.

2. **customSelectLabel** - default text for language drop-down menu. You can change it if you want to translate plugin for your own language.

3. **confirmBox** - list of texts and options for confirm box. You can change it if you want to translate plugin for your own language.
 + **confirmBox: yesText** - Accept button label
 + **confirmBox: noText** - Cancel button label
 + **confirmBox: infoMessage** - Confirm box message
 + **confirmBox: hText** - Confirm box title
 + **confirmBox: outerClick** - Set to *true* if you want to close confirm box on outer click
 + **confirmBox: useKeys** - Set to *true* if you want to use Escape key to close confirm box

List of all options with their default values:

```JS
defaultOptions = {
    dataSource: '',
    useDefaultLanguages: true,
    inputNamePrefix: '',
    customSelectLabel: 'Please Select',
    confirmBox: {
      yesText: 'Yes, delete',
      noText: 'No, go away!',
      infoMessage: 'Are you sure ?',
      hText: 'Confirm your request',
      outerClick: false,
      useKeys: true
    }
  };
```


License
--------------

<a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-sa/3.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Translation Widget</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-ShareAlike 3.0 Unported License</a> and also available under [the MIT License](LICENSE.txt).

Contact/Help
-------------

+ <mkatanski@nexway.com>
+ <dduda@nexway.com>
+ <mmaron@nexway.com>
+ <ariana.las@gmail.com>
+ <kgorecki@nexway.com>
