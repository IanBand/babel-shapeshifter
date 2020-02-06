# Specify Imports

A Babel plugin that allows you to specify your imports based off a config file.

A good use case for this plugin would be a project that will be built many different times, and each build requires a different set of components. Instead of inculding each component for every different build, you can use Specify Imports to import only use the required modules based off of a configuration file.

# Installation
```
$ npm install babel-specify-imports
```
# Usage

In your .babelrc, or wherever your plugins are defined, specify the imports by defining moduleListPath. This path is relative to process.cwd().
``` javascript
{
    plugins: [
        ["specify-imports", {"moduleListPath": "path/to/settings.js"}]
    ]
}
```

settings.js should export the list of module names that you want to use
```javascript
module.exports = {
    moduleList: [
        "myModule",
        "aCustomModule",
        "awesomeComponent"
    ]
}
```

However, a more useful way to export the module list would be something like this
```javascript
const settings = {
    views: [
        {
            moduleName: "myModule",
            viewSettings: {}
        },
        {
            moduleName: "aCustomModule",
            viewSettings: {}
        },
        {
            moduleName: "awesomeComponent",
            viewSettings: {}
        }
    ]
}
module.exports = {
    settings: settings, // to be used elsewhere in the project
    moduleList: settings.views.map(view => view.moduleName) // used by specify-import
}
```

In the file that you want to import your modules into, indicate that you will be using Specify Imports by using the "\[list]" identifier and a relative path. Specify Imports will not modify any other import statements.
```javascript
import myModules from './modules/[list]'; 
```

This will cause the above import statement to transpile into:
```javascript
const myModules = {};
import  myThirdModule2 from "./modules/myThirdModule";
myModules["myThirdModule"] =  myThirdModule2;
import  myOtherModule1 from "./modules/myOtherModule";
myModules["myOtherModule"] =  myOtherModule1;
import  myModule0 from "./modules/myModule";
myModules["myModule"] =  myModule0;
```

The modules can be referenced like any object member
```javascript 
myModules.myOtherModule1.doSomething();
```

But its typically most useful to iterate through the parent object with a for...in loop, or another method.
```javascript
for(const myModule in myModules){
    // do something with each imported module
}
```

# Future Features
- Check for the existance of a file before including it
- Allow the specification of file types, not just module names
- Support multiple list identifiers. eg: \[list1], \[list2]


# References
- https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
- https://github.com/babel-utils/babel-plugin-tester
- https://github.com/vihanb/babel-plugin-wildcard/
- https://stackoverflow.com/a/36755665


[//]: # (vscode markdown preview shortcut is command + shift + v)
