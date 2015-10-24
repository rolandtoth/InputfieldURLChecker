InputfieldURLChecker module for ProcessWire
================

Admin helper to add button or hotkey to URL type fields to check link in [ProcessWire CMS](http://processwire.com/).

## Features

- enhance FieldtypeURL inputs with a button to open typed url in a new window
- button and/or hotkey modes
- linkify locked URL fields
- force "http://" prefix (optional)
- restrict module to selected templates or fields
- compatible with the default and Reno admin themes
- ajax-loaded tabs and fields ready


## Usage

1. Install the module. All URL type fields will automatically get a URL check button.

1. Go to module settings and tweak options.


## Screens

**In action:**

![InputfieldURLChecker](https://github.com/rolandtoth/InputfieldURLChecker/raw/master/InputfieldURLChecker.gif)

**Options:**

![InputfieldURLChecker options](https://github.com/rolandtoth/InputfieldURLChecker/raw/master/InputfieldURLChecker-options.png)

**Linkify locked field:**

![Linkify locked field](https://github.com/rolandtoth/InputfieldURLChecker/raw/master/InputfieldURLChecker-locked-field.png)


## Options

### Mode

You can choose whether to use a dedicated button or a key/click combo to open URL field contents.

The module currently supports three modes:

- Button: adds a URL check button to the left or to the right side of the field
- Ctrl + Shift + Click: check URL by holding down ctrl+shift and clicking on the field
- Ctrl + Shift + Enter: check URL by holding down ctrl+shift+enter while caret is in the field

### Force HTTP prefix

If checked, links will always have "http://" prefix, even if the field itself doesn't contain it.

This ensures opening external links instead of relative ones.

### Restrict module

Here you can set templates and/or fields where the module will be enabled. If none selected, module will be active on all templates and all URL type fields.

Note: if used, module will be disabled on all non-listed fields/templates.


## Troubleshooting and feedback

Forum: [https://processwire.com/talk/topic/11209-modulette-inputfieldurlchecker/](https://processwire.com/talk/topic/11209-modulette-inputfieldurlchecker/)


## License

Licensed under the MIT license.

"InputfieldURLChecker" is provided "as-is" without warranty of any kind, express, implied or otherwise, including without limitation, any warranty of merchantability or fitness for a particular purpose. In no event shall the author of this software be held liable for data loss, damages, loss of profits or any other kind of loss while using or misusing this software.
