const settings = {
    views: [
        {
            moduleName: "myModule",
            viewSettings: {}
        },
        {
            moduleName: "aCustomModule",
            viewSettings: {}
        },
        {
            moduleName: "awesomeComponent",
            viewSettings: {}
        },
        {
            moduleName: "thisModuleDoesNotExist",
            viewSettings: {}
        },
    ]
}
module.exports = {
    settings: settings,
    moduleList: settings.views.map(view => view.moduleName)
}