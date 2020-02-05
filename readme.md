# Specify Imports

A Babel plugin that allows you to specify your imports based off a "modules" array.

A good use case for this plugin would be a project that will be built many different times, and each build requires a different set of components. Instead of inculding each component for every different build, you can use Specify Imports to import only use the required modules based off of a configuration file.

## Usage

In your .babelrc, specify the imports by defining the 'modules' array. Module names should be the same as the filename where the module is exported from.
``` javascript
{
    plugins: [
        ['specify-import', {
            'modules': [
                "myModule",
                "myOtherModule",
                "myThirdModule"
            ]
        }]
    ]
}
```

In the file that you want to import your modules into, indicate that you will be using Specify Import by using the '\[list]' identifier and a relative path. Specify Import will not modify any other imports.
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
myModules.myOtherModule1
```
But its typically most useful to iterate through the parent object with a for...in loop, or another method.
```javascript
for(const module in myModules){
    //do something with each imported module
}
```


## References
- https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
- https://github.com/babel-utils/babel-plugin-tester
- https://github.com/vihanb/babel-plugin-wildcard/


[//]: # (vscode markdown preview shortcut is command + shift + v)
