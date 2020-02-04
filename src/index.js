module.exports = function specifyImport({types: t}) {
    return {
        visitor: {
            ImportDeclaration(path, state){

                let sourceDir = path.node.source.value;

                // if not a relative path, ignore
                if (sourceDir[0] !== "." && sourceDir[0] !== "/") return;
                
                // if regex does not match, dont do anything
                const si_regex = /.*\/\[list\]$/; //should match "/[list]" at end of string
                if(!si_regex.test(sourceDir)) return;

                // check that modules exist 
                if(!state.opts.modules){
                    console.warn("No modules specified in options");
                    return;
                }

                // extract pathname
                let pathName = sourceDir.slice(0, sourceDir.indexOf('[list]'));

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
                let modules = state.opts.modules;
                for(let i = 0; i < modules.length; ++i){

                    let internalModName = `selectedModule${i}`;

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
                            t.stringLiteral(pathName + modules[i])
                        )
                    );
                }
            }
        }
    };
}