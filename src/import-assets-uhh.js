const _path = require('path');
const _fs = require('fs');

module.exports = function (babel) {
    const { types: t } = babel;

    return {
        visitor: {
            ImportDeclaration(path, state) {
                let node = path.node, dec;
                var src = path.node.source.value;

                // Don't do anything if not a relative path
                // if if not a relative path then a module
                if (src[0] !== "." && src[0] !== "/") return;

                let addWildcard = false, // True if should perform transform
                    wildcardName;        // Name of the variable the wilcard will go in
                // not set if you have a filter { A, B, C }

                let filterNames = []; // e.g. A, B, C

                /*
                ListName is the list of entry points, relative to src
                */
                
                const regex = /.*\/\{[a-zA-Z0-9]+\}$/; //should match "/{listName}" at end of string
                let isExplicitWildcard = regex.test(src);
                


                const lastSlash = path.node.source.value.lastIndexOf('/');
                src = path.node.source.value.substring(0, lastSlash);

                let entryPointListName = path.node.source.value.substring(lastSlash + 2).slice(0,-1);

                // check that configFilePath was specified in settings
                if(!state.opts.configFilePath){
                    console.error(`"configFilePath" is not specified in options`);
                    return;
                }

                let entryPoints = require(_path.join(process.cwd(), state.opts.configFilePath)).assetEntryPoints;

                console.log('entryPoints:', entryPoints);
                console.log('src: ', src);
                

                // Get current filename so we can try to determine the folder
                var name = state.file.opts.filename;

                var files = [];
                var isDirs = [];
                var dir = _path.join(_path.dirname(name), src); // path of the target dir.

                console.log(dir);

                // All the extensions that we should look at
                let exts = state.opts.exts || ["js", "es6", "es", "jsx"];
                let filenameRegex = new RegExp('.+');

                if (addWildcard) {
                    // Add the original object. `import * as A from 'foo';`
                    //  this creates `const A = {};`
                    // For filters this will be empty anyway
                    if (filterNames.length === 0 && wildcardName !== null) {
                        var obj = t.variableDeclaration("const", [
                            t.variableDeclarator(
                                t.identifier(wildcardName),
                                t.objectExpression([])
                            )
                        ]);
                        path.insertBefore(obj);
                    }

                    // Will throw if the path does not point to a dir
                    try {
                        let r = _fs.readdirSync(dir);
                        for (var i = 0; i < r.length; i++) {
                            // Check extension is of one of the aboves
                            const {name, ext} = _path.parse(r[i]);
                            
                            if(name == '.DS_Store') continue;

                            if (exts.indexOf(ext.substring(1)) > -1 && filenameRegex.test(name)) {
                                files.push(r[i]);
                                isDirs.push(!ext);
                            }
                        }
                    } catch(e) {
                        console.warn(`Wildcard for ${name} points at ${src} which is not a directory.`);
                        return;
                    }

                    // This is quite a mess but it essentially formats the file
                    // extension, and adds it to the object
                    for (var i = 0; i < files.length; i++) {
                        // name of temp. variable to store import before moved
                        // to object
                        let id = path.scope.generateUidIdentifier("wcImport");

                        var file = files[i];
                        const isDir = isDirs[i];

                        // Strip extension
                        var fancyName = file.replace(/(?!^)\.[^.\s]+$/, "");

                        // Handle dotfiles, remove prefix `.` in that case
                        if (fancyName[0] === ".") {
                            fancyName = fancyName.substring(1);
                        }

                        // If we're allowed to camel case, which is default, we run it
                        // through this regex which converts it to a PascalCase variable.
                        if (state.opts.noModifyCase !== true) {
                            let parts = fancyName.match(/[A-Z][a-z]+(?![a-z])|[A-Z]+(?![a-z])|([a-zA-Z\d]+(?=-))|[a-zA-Z\d]+(?=_)|[a-z]+(?=[A-Z])|[A-Za-z0-9]+/g);
                            if (state.opts.useCamelCase) {
                                fancyName = parts[0].toLowerCase() + parts.slice(1).map(s => s[0].toUpperCase() + s.substring(1)).join("")
                            } else {
                                fancyName = parts.map(s => s[0].toUpperCase() + s.substring(1)).join("");
                            }
                        }

                        // Now we're 100% settled on the fancyName, if the user
                        // has provided a filer, we will check it:
                        if (filterNames.length > 0) {
                            // Find a filter name
                            let res = null;
                            for (let j = 0; j < filterNames.length; j++) {
                                if (filterNames[j].original === fancyName) {
                                    res = filterNames[j];
                                    break;
                                }
                            }
                            if (res === null) continue;
                            fancyName = res.local;
                        }

                        // This will remove file extensions from the generated `import`.
                        // This is useful if your src/ files are for example .jsx or
                        // .es6 but your generated files are of a different extension.
                        // For situations like webpack you may want to disable this
                        var name;
                        if (state.opts.nostrip !== true) {
                            name = "./" + _path.join(src, _path.basename(file));
                        } else {
                            name = "./" + _path.join(src, file);
                        }

                        // Special behavior if 'filterNames'
                        if (filterNames.length > 0) {
                            let importDeclaration = t.importDeclaration(
                                [t.importDefaultSpecifier(
                                    t.identifier(fancyName)
                                )],
                                t.stringLiteral(name)
                            );
                            path.insertAfter(importDeclaration);
                            continue;
                        }

                        // Generate temp. import declaration
                        let importDeclaration = t.importDeclaration(
                            [
                                isDir
                                    ? t.importNamespaceSpecifier(id)
                                    : t.importDefaultSpecifier(id)
                            ],
                            t.stringLiteral(name)
                        );

                        // Assign it
                        if (wildcardName !== null) {
                            let thing = t.expressionStatement(
                                t.assignmentExpression("=", t.memberExpression(
                                    t.identifier(wildcardName),
                                    t.stringLiteral(fancyName),
                                    true
                                ), id
                            ));

                            path.insertAfter(thing);
                        }

                        path.insertAfter(importDeclaration);
                    }

                    if (path.node.specifiers.length === 0) {
                        path.remove();
                    }
                }
            }
        }
    };
}