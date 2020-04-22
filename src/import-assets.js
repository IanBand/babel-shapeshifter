const _path = require('path');
const _fs = require('fs');

let importNumber = 0;

module.exports = function ImportAssets({types: t}) {
    return {
        visitor: {
            ImportDeclaration(path, state){

                // check for import keyword
                const regex = /.*\/\{[a-zA-Z0-9]+\}$/; // should match ../some/path/{ListOfEntryPoints}

                if(!regex.test(path.node.source.value)) return;

                // check that configFilePath was specified in settings
                if(!state.opts.configFilePath){
                    console.warn(`"configFilePath" is not specified in options`);
                    return;
                }

                // check that configFile exports "entryPoints" array
               

                //let entryPoints = require(_path.join(process.cwd(), state.opts.configFilePath)).entryPoints;
                let entryPoints = require(_path.join(process.cwd(), state.opts.configFilePath)).assetEntryPoints;

                // extract relative path to assets folder
                const lastSlash = path.node.source.value.lastIndexOf('/');
                const pathToAssetFolder = path.node.source.value.substring(0, lastSlash);

                console.log(
                    "import-assets --\n",
                    "config file path:\n", 
                    state.opts.configFilePath, 
                    "assetEntryPoints:\n",
                    entryPoints);



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


                const filenameRegex = new RegExp('.+');
                // All the extensions that we should look at
                let fileExtensionsToImport = [...state.opts.extensions,
                    "png", "jpg", "gif", "jpeg", "svg", "mp3", "json", ""];
                let sourceFileName = state.file.opts.filename;

                console.log(`found ${entryPoints.length} possible entrypoints`);

                //for each entry point, import all assets
                for( let entry_idx = 0; entry_idx < entryPoints.length; entry_idx++ ) {

                    console.log(entryPoints[entry_idx]);

                    //skip blank or invalid entrypoints
                    if(!entryPoints[entry_idx]) continue;

                    // source -> assets -> entryPoint
                    let entryPointDir =_path.join(_path.dirname(sourceFileName), pathToAssetFolder, entryPoints[entry_idx]); // path of the final target dir.
                    console.log('dir!: ', entryPointDir);

                    // dfs import all assets starting from entrypoint
                    treeCopy(entryPointDir, entryPointDir, path, filenameRegex, fileExtensionsToImport);
                    
                }
                // remove original import statement 
                // import myAssets from "../../masterAssets/{entryPoints}"
                path.remove();
            }
        }
    };
}
/**
 * dfs tree copy, starting at entryPoint
 * 
 * 
 * current node
 * explored nodes hash table
 * only make import statements on leafs that arent 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
function treeCopy(curpath, rootPath, babelPath, filenameRegex, fileExtensionsToImport){

    // check if explored... dont need?
    //if(explored[curpath]) return;
    //explored[curpath] = true;

    //create object assignment
    // (curpath, root) => (root.path.to.curpath.[node at curpath]) => assign to empty obj

    //get contents at path
    let files = [];
    let isDirs = [];

    let r = _fs.readdirSync(curpath);
    for (let i = 0; i < r.length; i++) {
        // Check extension is of one of the aboves
        let {name, ext} = _path.parse(r[i]);
        
        if(name == '.DS_Store') continue; //ignore these files ... could make this into a list of files to ignore

        if (fileExtensionsToImport.indexOf(ext.substring(1)) > -1 && filenameRegex.test(name)) {
            files.push(r[i]);
            isDirs.push(!ext);
        }
    }
    console.log("files:", files, isDirs);

    //check for empty folder
    if(files.len <= 0) return;

    for(let i = 0; i < files.length; i++){

        if(!isDirs[i]){ //import files

            makeImportStatement(curpath + '/' + files[i], files[i], babelPath);
        }
        else{ //recurse over dirs
            //append dirname to curpath
            treeCopy(curpath + '/' + files[i], rootPath, babelPath, filenameRegex, fileExtensionsToImport);
        }
    }
}
/**
 * 
 * @param {string} identifier 
 * @param {string} accessorPath 
 * @param {Object} babelPath 
 */
function makeImportStatement(path, fileName, babelPath){
    //assign import to object assignment
    console.log('importing ' + fileName +  ' from' + path + '; , import number: ' + importNumber);

    importNumber++;

}


const resolvePath = (path) => {

    if(_.isEmpty(data)){
      //window.alert('Data folder is empty!');
      console.error('*** ERROR: Data folder is empty ***');
    }
    let keys = path.split('/');

    if (keys[0] === '') keys.shift();

    // remove file extension from file (file is last key in keys)
    keys[keys.length - 1] = keys[keys.length - 1].split('.')[0];

    //remove periods from path
    keys = keys.filter(curr => curr != '.');

    //replace spaces with dashes
    for (let i = 0; i < keys.length; i++) {
      keys[i] = keys[i].replace(' ', '-');
    }

    // traverse through data object
    let node = data;

    for(let key in keys) {
      try {
            node = node[keys[key]];
      }
      catch{
            console.warn('Warning: invalid data path: ' + path);
        return null;
      }
      }

    return node;
  }