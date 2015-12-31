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

    this._currentPath = [];
    this._allPaths = [];
    
    this._rootBlock = null;
    this._currentBlock = null;

    log.setLevel(config.log);
}

/**
* @function CFGJS.output
*
* @description
*/
CFGJS.prototype.output = function() {
    this._rootBlock.printBlock();
};

/**
* @function CFGJS.getAllPaths
*
* @description
*/
CFGJS.prototype.getAllPaths = function() {
    return this._allPaths;
};

/**
* @function CFGJS.parse
*
* @description
*/
CFGJS.prototype.parse = function(code) {
    this._allPaths = [];
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

    // if block is null, we will create it dynamically.
    var currentBlock = block? block : new Block(this._config);

    for(var i=0;i<n.length;++i) {
        var type = n[i].type? n[i].type : '';
        log.debug("type:"+type+",i:"+i);
        log.debug(n[i]);

        this._currentPath.push(type);
        switch(type) {

            // those are the left nodes of the AST
            case "BreakStatement":
            case "ContinueStatement":
            case "DebuggerStatement":
            case "EmptyStatement":
            case "Identifier":
            case "Literal":
            case "RegExpLiteral":
            case "ThisExpression":
                this._allPaths.push(this._currentPath.slice(0));
                this._printPaths();
                break;

            // those nodes having object has type property
            case "AssignmentExpression":
            case "BinaryExpression":
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
            case "IfStatement":
                currentBlock.addStatement(n[i]);
                this.traverse(n[i].test, currentBlock);

                var b1, b2;
                if (n[i].consequent && n[i].alternate) {
                    b1 = this.traverse(n[i].consequent, null);
                    currentBlock.addBlock(b1);
                    b2 = this.traverse(n[i].alternate,  null);
                    currentBlock.addBlock(b2);

                    currentBlock = new Block(this._config);
                    b1.addBlock(currentBlock);
                    b2.addBlock(currentBlock);
                } else if (n[i].consequent) {
                    b1 = this.traverse(n[i].consequent, null);
                    currentBlock.addBlock(b1);

                    currentBlock = new Block(this._config);
                    b1.addBlock(currentBlock);
                }
                break;

            // those nodes have object array that has type property
            // and the order of call traverse/_traverse are important
            case "ArrayExpression":
                this.traverse(n[i].elements, currentBlock);
                break;

            case "BlockStatement":
                this.traverse(n[i].body, currentBlock);
                break;
            case "Program":
                this._rootBlock = currentBlock;

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

            case "VariableDeclaration":
                currentBlock.addStatement(n[i]);

                this.traverse(n[i].declarations, currentBlock);
                break;

            default:
                break;
        } // end of swtich
        this._currentPath.pop();
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
        this._currentPath.forEach(function(e, i) {
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
