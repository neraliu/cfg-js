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

    describe("Control Flow Graph Test Suite", function() {
        it("AST tests", function() {
            testPatterns.TestASTPatterns.forEach(function(testObj) {
                filePath = testObj.sourcefile;
                console.log("testing.... "+filePath);
                var data = fs.readFileSync(filePath, 'utf-8');

                var config = {};
                config.log = testObj.log;
                var parser = new CFGJS(config);

                var astJson = parser.parse(data);
                parser.traverse(astJson, null);
                parser.output();

                var paths = parser.getAllPaths();
                paths.forEach(function(path, i) {
                    expect(path.join(' -> ')).to.equal(testObj.paths[i]);
                });
            });
        });

        it("CFG tests", function() {
            testPatterns.TestCFGPatterns.forEach(function(testObj) {
                filePath = testObj.sourcefile;
                console.log("testing.... "+filePath);
                var data = fs.readFileSync(filePath, 'utf-8');

                var config = {};
                config.log = testObj.log;
                var parser = new CFGJS(config);

                var astJson = parser.parse(data);
                parser.traverse(astJson, null);
                parser.traverseCFG();
                parser.output();

                var r = parser.getRootCFG();
                testCFG(r, testObj.blocks);

                if (testObj.paths.length != 0) {
                    var paths = parser.getAllCFGPaths();
                    paths.forEach(function(path, i) {
                        path.forEach(function(p, j) {
                            expect(p).to.equal(testObj.paths[i][j]);
                        });
                    });
                }
            });
        });

        var testCFG = function(node, testNode) {
            expect(node._statements).to.deep.equal(testNode.statements);
            for (var i=0;i<node._blocks.length;++i) {
                testCFG(node._blocks[i], testNode.blocks[i]);
            }
        }
    });

}());
