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

    this._path = [];
    this._paths = [];
    log.setLevel(config.log);
}

/**
* @function CFGJS.output
*
* @description
*/
CFGJS.prototype.output = function() {
    console.log(this._path);
};

/**
* @function CFGJS.getAllPaths
*
* @description
*/
CFGJS.prototype.getAllPaths = function() {
    return this._paths;
};

/**
* @function CFGJS.parse
*
* @description
*/
CFGJS.prototype.parse = function(code) {
    this._paths = [];
    return esprima.parse(code);
};

/**
* @function CFGJS.traverse
*
* @description
* https://github.com/estree/estree/blob/master/spec.md
*/
CFGJS.prototype.traverse = function(node) {
    var n = Array.isArray(node)? node : [node]; // we convert it into Array for iteration

    for(var i=0,j=0,k=0,l=0;i<n.length;++i,j=0,k=0,l=0) {
        var type = n[i].type? n[i].type : '';
        log.debug("type:"+type);
	log.debug(n[i]);
	this._path.push(type);
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
                this._paths.push(this._path.slice(0));
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
            case "IfStatement":
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
                this._traverse(n[i]);
                break;

            // those nodes have object array that has type property
            // and the order of call traverse/_traverse are important
            case "ArrayExpression":
                this.traverse(n[i].elements);
                break;

            case "BlockStatement":
            case "Program":
                this.traverse(n[i].body);
                break;

            case "CallExpression":
            case "NewExpression":
                this._traverse(n[i]);
                this.traverse(n[i].arguments);
                break;

            case "FunctionDeclaration":
            case "FunctionExpression":
                this.traverse(n[i].params);
                this._traverse(n[i]);
                break;

            case "ObjectExpression":
                this.traverse(n[i].properties);
                break;

            case "SequenceExpression":
                this.traverse(n[i].expressions);
                break;

            case "SwitchCase":
                this._traverse(n[i]);
                this.traverse(n[i].consequent);
                break;

            case "SwitchStatement":
                this._traverse(n[i]);
                this.traverse(n[i].cases);
                break;

            case "VariableDeclaration":
                this.traverse(n[i].declarations);
                break;

            default:
                break;
        } // end of swtich
	this._path.pop();
    }
};

/**
* @function CFGJS._traverse
*
* @description
* this is the helper function to traverse the AST.
*/
CFGJS.prototype._traverse = function(node) {
    for (var property in node) {
        if (node.hasOwnProperty(property) && node[property]!==null && node[property].hasOwnProperty("type")) {
            this.traverse(node[property]);
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
        this._path.forEach(function(e, i) {
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
