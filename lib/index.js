const _path=require("path");const _fs=require("fs");module.exports=function specifyImport({types:t}){return{visitor:{ImportDeclaration(path,state){let sourceDir=path.node.source.value;// if not a relative path, ignore
if(sourceDir[0]!=="."&&sourceDir[0]!=="/")return;// if regex does not match, dont do anything
const si_regex=/.*\/\[list\]$/;//should match "/[list]" at end of string
if(!si_regex.test(sourceDir))return;// check that module list file was specified in settings
if(!state.opts.moduleListPath){console.warn("No modules specified in options");return}// get list of modules from file
if(!state.moduleList){// look for file in cwd
state.moduleList=require(_path.join(process.cwd(),state.opts.moduleListPath)).moduleList}// extract pathname
let pathName=sourceDir.slice(0,sourceDir.indexOf("[list]"));// save obj name
let listobj=path.node.specifiers[0].local.name;// replace import with list object
path.replaceWith(t.variableDeclaration("const",[t.variableDeclarator(t.identifier(listobj),t.objectExpression([]))]));//loop through specified list
let modules=state.moduleList;for(let i=0;i<modules.length;++i){let file_extension=state.opts.extensions?"."+state.opts.extensions:"";let fullPath=pathName+modules[i]+file_extension;let internalModName=`selectedModule${i}`;// check if file exists, if not, try next module
if(!_fs.existsSync(_path.join(_path.dirname(state.file.opts.filename),fullPath.substring(1))))continue;// add import to obj
path.insertAfter(t.expressionStatement(t.assignmentExpression("=",t.memberExpression(t.identifier(listobj),t.stringLiteral(modules[i]),true),t.identifier(internalModName))));//add specific import dec
path.insertAfter(t.importDeclaration([t.importDefaultSpecifier(t.identifier(internalModName))],t.stringLiteral(fullPath)))}}}}};