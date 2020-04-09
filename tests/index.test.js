const importModules = require('../src/import-modules.js');
const importAssets = require('../src/import-assets.js');

const pluginTester = require('babel-plugin-tester');
const path = require('path');

pluginTester({
    plugin: importModules,
    pluginName: 'config-import-modules',
    fixtures: path.join(__dirname, 'module-fixtures'),
})


pluginTester({
    plugin: importAssets,
    pluginName: 'config-import-assets',
    fixtures: path.join(__dirname, 'asset-fixtures'),
})