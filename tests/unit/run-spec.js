/*
Copyright (c) 2015, All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.

Authors: Nera Liu <neraliu@gmail.com>
*/
(function () {

    mocha = require("mocha");
    var expect = require('chai').expect,
        Promise = require('bluebird'),
        fs = Promise.promisifyAll(require("fs")),
        testPatterns = require('../test-patterns.js'),
        CFGJS = require('../../src/cfg-js.js');

    describe("Test Suite", function() {
        it("basic test", function() {
            testPatterns.TestPatterns.forEach(function(testObj) {
                filePath = testObj.sourcefile;
                console.log("testing.... "+filePath);
                var data = fs.readFileSync(filePath, 'utf-8');

                var config = {};
                config.log = testObj.log;
                var parser = new CFGJS(config);

                var astJson = parser.parse(data);
                parser.traverse(astJson, null);

                var paths = parser.getAllPaths();
                paths.forEach(function(path, i) {
                    expect(path.join(' -> ')).to.equal(testObj.paths[i]);
                });

                parser.output();
            });
        });
    });

}());
