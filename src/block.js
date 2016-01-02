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
// @module Block
//
/////////////////////////////////////////////////////

/**
* @module Block
*/
function Block(config) {
    this._config = config || {};
    this._config.log = config.log? config.log : "info";
    log.setLevel(config.log);

    this._id = config.id? config.id : -1;
    this._statements = [];
    this._blocks = [];
}

/**
* @function Block.addStatement
*
* @description
*/
Block.prototype.addStatement = function(stmt) {
    this._statements.push(stmt);
};

/**
* @function Block.addBlock
*
* @description
*/
Block.prototype.addBlock = function(block) {
    this._blocks.push(block);
};

/**
* @function Block.printBlock
*
* @description
*/
Block.prototype.printBlock = function() {
    console.log(this._statements);
    for(var i=0;i<this._blocks.length;++i) {
        this._printBlock(this._blocks[i]);
    }
};

/**
* @function Block._printBlock
*
* @description
*/
Block.prototype._printBlock = function(block) {
    console.log(block._statements);
    for(var i=0;i<block._blocks.length;++i) {
        this._printBlock(block._blocks[i]);
    }
};

/* exposing it */
module.exports = Block;

})();
