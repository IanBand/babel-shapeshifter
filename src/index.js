const modules = require('./modules.js');

module.exports = function specifyImport({types: t}) {
    return {
        visitor: {
            ImportDeclaration(path, state){
                //console.log(path.node);
                //console.log(path.node.specifiers[0].local);


                //remove import dec
                //create obj with name equal to path.node.specifiers[0].local.name
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