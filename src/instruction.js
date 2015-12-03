/* 
Copyright (c) 2015, All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.

Authors: Nera Liu <neraliu@gmail.com>
*/
/*jshint -W030 */
(function () {
"use strict";

/////////////////////////////////////////////////////
//
// @module Instruction
// 
/////////////////////////////////////////////////////

/** 
* @module Instruction
*/
function Instruction(instr, arg) {
    this._arg = arg;
    this._instr = instr;
}

/**
* @function Instruction.toString
*
* @description
*/
Instruction.prototype.toString = function() {
    return "INSTRUCTION:"+this._instr+",ARGUMENTS:"+this._arg;
};

/* exposing it */
module.exports = Instruction;

})();
