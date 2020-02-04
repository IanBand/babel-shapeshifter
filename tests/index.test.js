const specifyImport = require('../src/index.js');
const pluginTester = require('babel-plugin-tester');
const path = require('path');

pluginTester({
    plugin: specifyImport,
    pluginName: 'specify import',
    fixtures: path.join(__dirname, 'fixtures'),
})