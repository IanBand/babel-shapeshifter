const myPlugin = require('../src/index.js');
const pluginTester = require('babel-plugin-tester');

// https://github.com/babel-utils/babel-plugin-tester/blob/master/README.md#examples
pluginTester({
    plugin: myPlugin,
    pluginName: 'my-first-plugin',
    tests: [
        {
            title: 'simple case',
            code: 'foo === bar;',
            output: 'left === right;'
        }
    ]
})