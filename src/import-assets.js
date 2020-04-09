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
                    //"entry points array:",
                    //entryPoints);
            }
        }
    };
}