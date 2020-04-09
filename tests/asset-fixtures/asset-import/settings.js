const settings = {
    views: [
        {
            moduleName: "myModule",
            viewSettings: {},
            assetFolderPath: "/path/to/myModuleAssets"
        },
        {
            moduleName: "aCustomModule",
            viewSettings: {}
        },
        {
            moduleName: "awesomeComponent",
            viewSettings: {},
            assetFolderPath: "/path/to/awesomeAssets"
        },
        {
            moduleName: "thisModuleDoesNotExist",
            viewSettings: {}
        },
    ]
}
module.exports = {
    settings: settings,
    testlList: settings.views.map(view => view.moduleName),
    
    assetEntryPoints: settings.views.map(view => view.assetFolderPath)
    //check for undefined, empty string, and string not in array
}