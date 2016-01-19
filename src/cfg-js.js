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
    this._config.id = 0;

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
    // console.log(JSON.stringify(this._rootCFG));
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
* @function CFGJS.getRootCFG
*
* @description
*/
CFGJS.prototype.getRootCFG = function() {
    return this._rootCFG;
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

    // if the currentBlock has statement, save it (i.e. content of the node)
    var stmt = currentBlock._id + ":" + currentBlock._statements.join(',');
    this._currentCFGPath.push(stmt);

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
* this function traverses the same level in the AST through iterating the array of nodes.
* by depth-first-search (DFS)
*/
CFGJS.prototype.traverse = function(node, block) {
    var n = Array.isArray(node)? node : [node]; // we convert it into Array for iteration

    var currentBlock, startBlock;
    if (block) {
        currentBlock = block;
    } else {
        this._config.id++;
        currentBlock = new Block(this._config);
    }
    startBlock = currentBlock;

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
            case "ExpressionStatement":
            case "ForStatement":						// cfg?
            case "ForInStatement":						// cfg?
            case "LabeledStatement":						// cfg?
	    case "LogicalExpression":
            case "MemberExpression":
            case "Property":
            case "ReturnStatement":
            case "ThrowStatement":
            case "TryStatement":
            case "VariableDeclarator":						// cfg
            case "UnaryExpression":
            case "UpdateExpression":
            case "WithStatement":
                this._traverse(n[i], currentBlock);
                break;

            case "DoWhileStatement":						// cfg
            case "WhileStatement":						// cfg
                var whileBlock, whileEndBlock, b1;
                currentBlock.addStatement(type);
                this.traverse(n[i].test, currentBlock);

                whileBlock = this.traverse(n[i].body, null);			// n[i].body is a block statement
                currentBlock.addBlock(whileBlock); 				// link the currentBlock to the whileBlock

                this._config.id++;
                whileEndBlock = new Block(this._config);
                if (whileBlock) {
                    b1 = this._getLastBlock(whileBlock);			// get the last block from the whileBlock and link the whileEndBlock
                    b1.addBlock(whileEndBlock); 				// link the last block to the whileEndBlock
                }
                currentBlock.addBlock(whileEndBlock);				// link the currentBlock to the whileEndBlock

                currentBlock = whileEndBlock;					// update the currentBlock to whileEndBlock
                break;

            case "IfStatement":  						// cfg
                var leftBlock, rightBlock, ifEndBlock, b2;
                currentBlock.addStatement(type);
                this.traverse(n[i].test, currentBlock);

                if (n[i].consequent) {
                    leftBlock = this.traverse(n[i].consequent, null);		// n[i].consequent is a block statement
                    currentBlock.addBlock(leftBlock);				// link the leftBlock to currentBlock
                }
                if (n[i].alternate) {
                    rightBlock = this.traverse(n[i].alternate, null);		// n[i].alternate is a block statement
                    currentBlock.addBlock(rightBlock);				// link the rightBlock to currentBlock
                }

                this._config.id++;
                ifEndBlock = new Block(this._config);
                if (leftBlock) {
                    b2 = this._getLastBlock(leftBlock);				// get the last block from the leftBlock and link the ifEndBlock
                    b2.addBlock(ifEndBlock);					// link the last block to the ifEndBlock
                }
                if (rightBlock) {
                    b2 = this._getLastBlock(rightBlock);			// get the last block from the rightBlock and link the ifEndBlock
                    b2.addBlock(ifEndBlock);					// link the last block to the ifEndBlock
                } else {
                    currentBlock.addBlock(ifEndBlock);
                }
      
                currentBlock = ifEndBlock;					// update the currentBlock to ifEndBlock
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

            case "SwitchCase":							// cfg?
                this._traverse(n[i], currentBlock);
                this.traverse(n[i].consequent, currentBlock);
                break;

            case "SwitchStatement":						// cfg?
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
    
    return startBlock;
};

/**
* @function CFGJS._getLastBlock
*
* @description
* traverse the block chain and return the end block.
*/
CFGJS.prototype._getLastBlock = function(block) {
    if (block._blocks.length !== 0) {
        return this._getLastBlock(block._blocks[0]); // assuming that all end at the same block, so travering index 0 is ok!
    } else {
        return block;
    }
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
