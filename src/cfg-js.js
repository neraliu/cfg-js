/*
Copyright (c) 2015, All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.

Authors: Nera Liu <neraliu@gmail.com>
*/
/*jshint -W030 */
(function () {
"use strict";

/* import the required package */
var esprima = require('esprima'),
    Block = require('./block.js'),
    log = require('loglevel');

/////////////////////////////////////////////////////
//
// @module CFGJS
//
/////////////////////////////////////////////////////

/**
* @module CFGJS
*/
function CFGJS(config) {
    this._config = config || {};
    this._config.log = config.log? config.log : "info";
    this._config.printPath = config.printPath ? config.printPath : false;

    this._currentASTPath = [];
    this._allASTPaths = [];
    
    this._rootCFG = null;
    this._currentCFGPath = [];
    this._allCFGPaths = [];

    log.setLevel(config.log);
}

/**
* @function CFGJS.output
*
* @description
*/
CFGJS.prototype.output = function() {
    // console.log(this._rootCFG._blocks[1]._blocks);
};

/**
* @function CFGJS.getAllPaths
*
* @description
*/
CFGJS.prototype.getAllPaths = function() {
    return this._allASTPaths;
};

/**
* @function CFGJS.getAllCFGPaths
*
* @description
*/
CFGJS.prototype.getAllCFGPaths = function() {
    return this._allCFGPaths;
};

/**
* @function CFGJS.traverseCFG
*
* @description
* this is the helper function to traverse the CFG.
*/
CFGJS.prototype.traverseCFG = function(block) {
    var currentBlock = block? block : this._rootCFG;
    // log.debug(currentBlock); 

    // if the currentBlock has statement, save it (i.e. content of the node)
    if (currentBlock._statements.length !== 0) {
        this._currentCFGPath.push(currentBlock._statements);
    }

    // traverse all blocks and pop back the block once returns
    if (currentBlock._blocks.length !== 0) {
        for(var i=0;i<currentBlock._blocks.length;++i) {
            this.traverseCFG(currentBlock._blocks[i]);
            this._currentCFGPath.pop();
        }
    } else {
        this._allCFGPaths.push(this._currentCFGPath.slice(0));
    }
};

/**
* @function CFGJS.parse
*
* @description
*/
CFGJS.prototype.parse = function(code) {
    this._allASTPaths = [];
    return esprima.parse(code);
};

/**
* @function CFGJS.traverse
*
* @description
* https://github.com/estree/estree/blob/master/spec.md
*/
CFGJS.prototype.traverse = function(node, block) {
    var n = Array.isArray(node)? node : [node]; // we convert it into Array for iteration

    var currentBlock = block? block : new Block(this._config);
    for(var i=0;i<n.length;++i) {
        var type = n[i].type? n[i].type : '';
        log.debug("type:"+type+",i:"+i);
        log.debug(n[i]);

        this._currentASTPath.push(type);
        switch(type) {

            // those are the left nodes of the AST
            case "BreakStatement":
            case "ContinueStatement":
            case "DebuggerStatement":
            case "EmptyStatement":
            case "Identifier": 							// cfg
            case "Literal":							// cfg
            case "RegExpLiteral":
            case "ThisExpression":
                this._allASTPaths.push(this._currentASTPath.slice(0));
                this._printPaths(); // reaching the left node and print it.
                break;

            // those nodes having object has type property
            case "AssignmentExpression": 					// cfg
                currentBlock.addStatement(type);
                this._traverse(n[i], currentBlock);
                break;
            case "BinaryExpression": 						// cfg
            case "CatchClause":
            case "ConditionalExpression":
            case "DoWhileStatement":
            case "ExpressionStatement":
            case "ForStatement":
            case "ForInStatement":
            case "LabeledStatement":
	    case "LogicalExpression":
            case "MemberExpression":
            case "Property":
            case "ReturnStatement":
            case "ThrowStatement":
            case "TryStatement":
            case "VariableDeclarator":
            case "UnaryExpression":
            case "UpdateExpression":
            case "WhileStatement":
            case "WithStatement":
                this._traverse(n[i], currentBlock);
                break;
            case "IfStatement":  						// cfg
                currentBlock.addStatement(type);
                this.traverse(n[i].test, currentBlock);

                var b1, b2;
                if (n[i].consequent) {
                    b1 = this.traverse(n[i].consequent, null);
                    currentBlock.addBlock(b1);
                }
                if (n[i].alternate) {
                    b2 = this.traverse(n[i].alternate,  null);
                    currentBlock.addBlock(b2);
                }

                var newBlock = new Block(this._config);
                newBlock.addStatement("IfStatementEnd");
                if (b1) {
                    b1.addBlock(newBlock);
                }
                if (b2) {
                    b2.addBlock(newBlock);
                }
      
                log.debug(currentBlock);
                log.debug(b1);
                log.debug(b2);
                log.debug(newBlock);
                currentBlock = newBlock;
                break;

            // those nodes have object array that has type property
            // and the order of call traverse/_traverse are important
            case "ArrayExpression":
                this.traverse(n[i].elements, currentBlock);
                break;

            case "BlockStatement": 						// cfg
                this.traverse(n[i].body, currentBlock);
                break;
            case "Program": 							// cfg
                this._rootCFG = currentBlock;

                this.traverse(n[i].body, currentBlock);
                break;

            case "CallExpression":
            case "NewExpression":
                this._traverse(n[i], currentBlock);
                this.traverse(n[i].arguments, currentBlock);
                break;

            case "FunctionDeclaration":
            case "FunctionExpression":
                this.traverse(n[i].params, currentBlock);
                this._traverse(n[i], currentBlock);
                break;

            case "ObjectExpression":
                this.traverse(n[i].properties, currentBlock);
                break;

            case "SequenceExpression":
                this.traverse(n[i].expressions, currentBlock);
                break;

            case "SwitchCase":
                this._traverse(n[i], currentBlock);
                this.traverse(n[i].consequent, currentBlock);
                break;

            case "SwitchStatement":
                this._traverse(n[i], currentBlock);
                this.traverse(n[i].cases, currentBlock);
                break;

            case "VariableDeclaration":  					// cfg
                currentBlock.addStatement(type);

                this.traverse(n[i].declarations, currentBlock);
                break;

            default:
                break;
        } // end of swtich
        this._currentASTPath.pop();
    }
    
    return currentBlock;
};

/**
* @function CFGJS._traverse
*
* @description
* this is the helper function to traverse the AST.
*/
CFGJS.prototype._traverse = function(node, block) {
    for (var property in node) {
        if (node.hasOwnProperty(property) && node[property]!==null && node[property].hasOwnProperty("type")) {
            this.traverse(node[property], block);
        }
    }
};

/**
* @function CFGJS._printPaths
*
* @description
*/
CFGJS.prototype._printPaths = function(node) {
    if (this._config.printPath) {
        this._currentASTPath.forEach(function(e, i) {
            process.stdout.write(e + " -> ");
        });
        process.stdout.write("\n");
    }
};

/* exposing it */
module.exports = CFGJS;

})();

// reference:
// https://github.com/estree/estree/blob/master/spec.md
