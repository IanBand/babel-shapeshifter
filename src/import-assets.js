const _path = require('path');
const _fs = require('fs');

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

                /*console.log(
                    "import-assets --\n",
                    "config file path:\n", 
                    state.opts.configFilePath, 
                    "assetEntryPoints:\n",
                    entryPoints);
                */


                // get import object identifier
                // import myAssets from "{assets}" => myAssets
                //console.log(path.node.specifiers[0].local.name);
                let masterIdentifier = path.node.specifiers[0].local.name;

                // create asset object. 'import myAssets from "{assets}";'
                // this creates 'const myAssets = {};'
                let obj = t.variableDeclaration("const", [
                    t.variableDeclarator(
                        t.identifier(masterIdentifier),
                        t.objectExpression([])
                    )
                ]);
                path.insertBefore(obj);

                const filenameRegex = new RegExp('.+');
                // All the extensions that we should look at
                let fileExtensionsToImport = [...state.opts.extensions,
                    "png", "jpg", "gif", "jpeg", "svg", "mp3", "json", ""];
                let sourceFileName = state.file.opts.filename;

                //console.log(`found ${entryPoints.length} possible entrypoints`);

                //for each entry point, import all assets
                for( let entry_idx = 0; entry_idx < entryPoints.length; entry_idx++ ) {

                    //console.log(entryPoints[entry_idx]);

                    //skip blank or invalid entrypoints
                    if(!entryPoints[entry_idx]) continue;

                    // source -> assets -> entryPoint
                    let entryPointDir =_path.join(_path.dirname(sourceFileName), pathToAssetFolder, entryPoints[entry_idx]); // path of the final target dir.
                    //console.log('dir!: ', entryPointDir);

                    let entry = _path.basename(entryPointDir);
                    //console.log("entry: ", entry);

                    // assign entry point object to master object
                    // this creates 'myAssets.entry = {};'

                    let entryAssignment = t.expressionStatement(
                        t.assignmentExpression(
                            "=", 
                            t.memberExpression( //left side of assignment
                                t.identifier(masterIdentifier), //object 
                                t.identifier(entry)  //member of object
                            ),  
                            t.objectExpression([]) //right side of assignment
                    ));
                    path.insertBefore(entryAssignment);


                    // dfs import all assets starting from entrypoint
                    treeCopy(entryPointDir, entry, masterIdentifier, path, filenameRegex, fileExtensionsToImport, t);
                    
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
function treeCopy(curpath, entry, masterIdentifier, babelPath, filenameRegex, fileExtensionsToImport, t){

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
    //console.log("files:", files, isDirs);

    //check for empty folder
    if(files.len <= 0) return;

    for(let i = 0; i < files.length; i++){

        if(!isDirs[i]){ //import files

            makeImportStatement(curpath + _path.sep + files[i], entry, masterIdentifier, babelPath, t);
        }
        else{ //recurse over dirs
            //append dirname to curpath
            treeCopy(curpath + _path.sep + files[i], entry, masterIdentifier, babelPath, filenameRegex, fileExtensionsToImport, t);
        }
    }
}

function makeImportStatement(path, entry, masterIdentifier, babelPath, t){
    //assign import to object assignment
    //console.log('importing ' + fileName +  ' from ' + path + ';');

    // generate unique identifier to hold imported file
    let id = babelPath.scope.generateUidIdentifier("userDefinedImport");

    // Generate the import declaration
    let importDeclaration = t.importDeclaration(
        [t.importDefaultSpecifier(id)],
        t.stringLiteral(path)
    );

    // derive the list of member accessors
    let dirnames = path.split(_path.sep);
    //console.log("dirnames ", dirnames);
    //console.log("entry index: ", dirnames.indexOf(entry));

    //need members/path relative to entry point...
    let members = dirnames.slice(dirnames.indexOf(entry));
    let last = members.length - 1;
    members[last] = members[last].split('.')[0]; //strip file extension

    /* FORMAT MEMBERS HERE (camelCase, remove hyphens, ect)*/

    members.unshift(masterIdentifier)


    //console.log("members: ", members);

    // assign the imported variable to object
    // need a function f: path => {member access tree}
    // use https://astexplorer.net/ to reverse engineer statements to trees

    let assignment = t.expressionStatement(
        t.assignmentExpression(
            "=", 
            memberExpressionChain(members, t), //left side of assignment
            id //right side of assignment
    ));

    babelPath.insertAfter(assignment);
    babelPath.insertAfter(importDeclaration);
}

// chain member accessors together
function memberExpressionChain(members, t){ //array of members

    if(members.length > 1){
        return t.memberExpression(
                memberExpressionChain(members.slice(0, -1), t), //cut off member
                t.identifier(members[members.length - 1]) 
            );
    }
    else{
        return t.identifier(members[0]);
    }
}

