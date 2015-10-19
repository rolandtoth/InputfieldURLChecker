Test URL Field module for ProcessWire
================

Add button to URL fields to test link validity in [ProcessWire CMS](http://processwire.com/).

## Features

- adds button to URL fields to test link validity (opens in a new window)
- linkify locked URL fields
- link visible only if field is not empty
- compatible with the Default & Reno admin themes
- button and key/click combo modes
- force "http://" prefix (optional)
- limit module to enabled fields only
- ajax-loaded tabs & fields ready


## Usage

1. Install the module. All URL type fields will automatically have a test link button.

1. Go to module settings and tweak options.


## Options

### Mode

You can choose whether to use a dedicated button or a key/click combo to open URL field contents.

The module currently supports three modes:

- Button (default)
- Ctrl + Shift + Click
- Ctrl + Shift + Enter

### Force http

If checked, links will always have "http://" prefix, even if the field itself doesn't have it. Default is checked.

### Enabled fields/templates

Comma-separated list of field/template names where module should be enabled. Leave empty to enable all.

Note: if used, module will be disabled on all non-listed fields/templates.


## Troubleshooting and feedback

Forum: [https://processwire.com/talk/topic/11209-modulette-test-url-field/](https://processwire.com/talk/topic/11209-modulette-test-url-field/)


## License

Licensed under the MIT license.

"Test URL Field" is provided "as-is" without warranty of any kind, express, implied or otherwise, including without limitation, any warranty of merchantability or fitness for a particular purpose. In no event shall the author of this software be held liable for data loss, damages, loss of profits or any other kind of loss while using or misusing this software.
