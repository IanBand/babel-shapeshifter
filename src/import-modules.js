//https://github.com/IanBand/babel-specify-Imports
const _path = require('path');
const _fs = require('fs');

module.exports = function ImportModules({types: t}) {
    return {
        visitor: {
            ImportDeclaration(path, state){

                let sourceDir = path.node.source.value;

                // if not a relative path, ignore
                if (sourceDir[0] !== "." && sourceDir[0] !== "/") return;
                
                // if regex does not match, dont do anything
                const regex = /.*\/\[[a-zA-Z0-9]+\]$/; //should match "/[listName]" at end of string
                if(!regex.test(sourceDir)) return;

                // check that configFilePath was specified in settings
                if(!state.opts.configFilePath){
                    console.warn(`"configFilePath" is not specified in options`);
                    return;
                }

                // extract list from path identifier: ./my/path/to/[myListName] => myListName
                let listName = sourceDir.slice(sourceDir.indexOf('[') + 1, sourceDir.indexOf(']'));

                // check if list is defined in config file
                if(!state[listName]){
                    state[listName] = require(_path.join(process.cwd(), state.opts.configFilePath))[listName];

                    if(!state[listName]){
                        console.error(`"${listName}" is not defined as an export of "${state.opts.configFilePath}"`);
                        return;
                    }
                }

                // extract pathname
                let pathName = sourceDir.slice(0, sourceDir.indexOf(`[${listName}]`));

                // save obj name
                let listobj = path.node.specifiers[0].local.name;

                // replace import with list object
                path.replaceWith(
                    t.variableDeclaration("const", [
                        t.variableDeclarator(
                            t.identifier(listobj),
                            t.objectExpression([]),
                        )
                    ])
                );

                //loop through specified list
                let modules = state[listName];
                for(let i = 0; i < modules.length; ++i){

                    let file_extension = state.opts.extensions ? '.' + state.opts.extensions : '';
                    let fullPath = pathName + modules[i] + file_extension;
                    let internalModName = `CONFIG_IMPORTED_MODULE_${i}`;

                    // check if file exists, if not, try next module
                    if(!_fs.existsSync(_path.join(_path.dirname(state.file.opts.filename), fullPath))) continue;

                    // add import to obj
                    path.insertAfter(
                        t.expressionStatement(
                            t.assignmentExpression("=", 
                                t.memberExpression(
                                    t.identifier(listobj),
                                    t.stringLiteral(modules[i]),
                                    true
                                ),
                                t.identifier(internalModName)
                            )
                        )
                    );
                    
                    //add specific import dec
                    path.insertAfter(
                        t.importDeclaration(
                            [t.importDefaultSpecifier(
                                t.identifier(internalModName)
                            )],
                            t.stringLiteral(fullPath)
                        )
                    );
                }
            }
        }
    };
}