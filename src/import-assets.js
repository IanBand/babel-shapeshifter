const _path = require('path');
const _fs = require('fs');

module.exports = function ImportAssets({types: t}) {
    return {
        visitor: {
            ImportDeclaration(path, state){

                //check for import keyword
                if(path.node.source.value != "{assets}") return;

                // check that configFilePath was specified in settings
                if(!state.opts.configFilePath){
                    console.warn(`"configFilePath" is not specified in options`);
                    return;
                }

                // check that configFile exports "entryPoints" array
               

                //let entryPoints = require(_path.join(process.cwd(), state.opts.configFilePath)).entryPoints;
                let entryPoints = require(_path.join(process.cwd(), state.opts.configFilePath)).assetEntryPoints;

                console.log(
                    "import-assets --\n",
                    "config file path:\n", 
                    state.opts.configFilePath, 
                    "assetEntryPoints:\n",
                    entryPoints);

                let extensions = [...state.opts.extensions,
                                    "png", "jpg", "jpeg", "svg", "", "json", "gif", "mp3"];

                // get import object identifier
                // import myAssets from "{assets}" => myAssets
                console.log(path.node.specifiers[0].local.name);
                let assetsIdentifier = path.node.specifiers[0].local.name;

                // create asset object. 'import myAssets from "{assets}";'
                // this creates 'const myAssets = {};'
                let obj = t.variableDeclaration("const", [
                    t.variableDeclarator(
                        t.identifier(assetsIdentifier),
                        t.objectExpression([])
                    )
                ]);
                path.insertBefore(obj);


                //for each entry point, 

                // Get current filename so we can try to determine the folder
                var name = state.file.opts.filename;

                var files = [];
                var isDirs = [];
                var dir = _path.join(_path.dirname(name), src); // path of the target dir.








                // remove original import statement 
                // import myAssets from "{assets}"
                path.remove();
            }
        }
    };
}