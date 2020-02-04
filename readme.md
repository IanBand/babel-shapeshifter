# Specify Imports

A Babel plugin that allows you to specify your imports based off a "modules" array.

A good use case for this plugin would be a project that will be built many different times, and each build requires a different set of components. Instead of inculding each component for every different build, you can use Specify Imports to import only use the required modules based off of a configuration file.

## Usage


Indicate that you will be using Specify Import by using the '\[list]' identifier and a relative path. Specify Import will not modify any other imports.
```javascript
import myModules from './modules/[list]'; 
```

This will transpile into:
```javascript
import myModules from './modules/[list]'; 
```


## References
- https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
- https://github.com/babel-utils/babel-plugin-tester
- https://github.com/vihanb/babel-plugin-wildcard/blob/master/src/index.js


[//]: # (vscode markdown preview shortcut is command + shift + v)
