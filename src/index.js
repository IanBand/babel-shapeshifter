const modules = require('./modules.js');

module.exports = function specifyImport({types: t}) {
    return {
        visitor: {
            ImportDeclaration(path, state){
                //console.log(path.node);
                
                console.log(path.node.source.value);
                let sourceDir = path.node.source.value;

                // Don't do anything if not a relative path
                // if if not a relative path then a module
                if (sourceDir[0] !== "." && sourceDir[0] !== "/") return;


                


                //create obj with name equal to path.node.specifiers[0].local.name
                //console.log(path.node.specifiers[0].local); //obj name

                //remove import dec

                path.replaceWith(
                    t.expressionStatement(t.stringLiteral("hello world"))
                );

                //loop through specified list
                    //add specific import dec
                    //add import to obj

            }
        }
    };
}