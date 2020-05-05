#Babel Shapeshifter

TODO: minimize dependencies 

# Development:

Install Jest globally with:
```bash
$ yarn global add jest
```
If 'yarn install' is giving you trouble because of something like:
```bash
error fsevents@2.1.2: The platform "win32" is incompatible with this module.
error Found incompatible module.
```

Then do:
```bash
$ yarn install --ignore-platform
```

## Testing
Just run:
```bash
$ jest
```

*note* One of the tests should always fail. This is because the babel script creates absolute include paths. 


# References
- https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
- https://github.com/babel-utils/babel-plugin-tester
- https://github.com/vihanb/babel-plugin-wildcard/
- https://stackoverflow.com/a/36755665


[//]: # (vscode markdown preview shortcut is command + shift + v)
