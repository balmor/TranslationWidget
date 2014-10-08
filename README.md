Translation Widget
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

It should be noted that the id attribute is optional and depends on how you want to initialize the plug-ins. There are two methods of doing this: by class or by id. The main difference between these two methods is that when plug-ins are initiated by the class name, all the options are the same for each instance on the page. Initialization by id gives each instance more independent behaviour.

*Tip: You can create different classes for different groups of inputs. This way you can have two independent groups of widgets on your page with different settings and translations.*

Label content is also instance name. However, if the label contains spaces, they will be removed from the instance name. For example:<br>
**Label content = Translation Widget**<br>
**Instance name = TranslationWidget**


Below are some simple examples of initialization only needed to run plugins. For both methods of initialization by the class and id. Place it somewhere in your document (for example at the bottom, just before ```</body>``` tag).
```html

<script>

// WIDGET INITIALIZATION BY CLASS
$('.lang-translation').translationWidget();

// WIDGET INITIALIZATION BY ID
$('#input1').translationWidget();

</script>

```

Note that if you want to intialize widget by input ID, you have to do it separately for each input.

------------

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

By default Translation Widget has list of 5 available languages: Polish, English, French, Spanish, German. You can append new language to the list or override with your own custom list.

To include new languages simply pass them during initialization as a JavaScript object just after the list of options:
```html
<script>
// WIDGET INITIALIZATION BY CLASS
$('.lang-translation').translationWidget({
 // list of options
}, {
 // list of additional languages
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

### Existing translations

There are at least two ways to load existing translations. The simplest one is to create object which stores translations for each plugin on page. You then assign this object to the parameter **dataSource**.

The object has its own schema which looks like this:

```JS
{
  'instanceName': {
    langCode: 'Translation',
  },
}
```

where *instanceName* is the name of widget instance on page, *langCode* is the code name of language. This standard allows us to pass the translations for all widgets independently even if widgets are initialized only once by the class name.

Example:
```JS
var translationsObject = new Object();

// Translations for first instance
translationsObject["Instance1"] = {
   EN: 'English translation',
   PL: 'Polskie tłumaczenie',
};

// Translations for second instance
translationsObject["Instance2"] = {
   EN: 'Another translation',
   PL: 'Inne tłumaczenie',
};

// Initialize all widgets by class reference
$('.lang-translation').translationWidget({
 dataSource: translationsObject, // pass translationObject to load translations
});

```



### Other options

1. **inputNamePrefix** - string that will be added to every input name at the beginning.

2. **customSelectLabel** - default text for language drop-down menu. You can change it if you want to translate plugin for your own language.

3. **confirmBox** - list of texts and options for confirm box.
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
