const importModules = require('../src/import-modules.js');
const importAssets = require('../src/import-assets.js');

const pluginTester = require('babel-plugin-tester');
const path = require('path');

pluginTester({
    plugin: importModules,
    pluginName: 'specify import',
    fixtures: path.join(__dirname, 'fixtures'),
})