// https://github.com/estree/estree/blob/master/spec.md#thisexpression

// https://github.com/estree/estree/blob/master/spec.md#assignmentexpression
// https://github.com/estree/estree/blob/master/spec.md#memberexpression

function O() {
    this.a = 1;
}

O.prototype.func = function() {
    this.b = 2;
};

// https://github.com/estree/estree/blob/master/spec.md#newexpression
var o = new O();

// https://github.com/estree/estree/blob/master/spec.md#arrayexpression
var a = [1, 2];

// https://github.com/estree/estree/blob/master/spec.md#conditionalexpression
var c = true? 1 : 2;

// https://github.com/estree/estree/blob/master/spec.md#logicalexpression
var d = a || c;

// https://github.com/estree/estree/blob/master/spec.md#updateexpression
c++;

// https://github.com/estree/estree/blob/master/spec.md#unaryexpression
if (typeof true === 'boolean') {
}

// https://github.com/estree/estree/blob/master/spec.md#sequenceexpression
var x, y, z
x = (y=1, z=4);
x; //4
y; //1
z; //4
