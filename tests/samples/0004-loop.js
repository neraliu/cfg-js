// https://github.com/estree/estree/blob/master/spec.md#loops

// https://github.com/estree/estree/blob/master/spec.md#forinstatement
// https://github.com/estree/estree/blob/master/spec.md#forstatement
// https://github.com/estree/estree/blob/master/spec.md#dowhilestatement
// https://github.com/estree/estree/blob/master/spec.md#whilestatement

// https://github.com/estree/estree/blob/master/spec.md#continuestatement

// https://github.com/estree/estree/blob/master/spec.md#updateexpression

// https://github.com/estree/estree/blob/master/spec.md#objectexpression
// https://github.com/estree/estree/blob/master/spec.md#property

while(true) {
  if (1) {
    break;
  }
}

for(var i=0;i<100;++i) {
  if (1) {
    continue;
  }
}

do {
  if (1) {
  }
} while(true);

var obj = {a:1, b:2, c:3};
for (var prop in obj) {
  if (1) {
  }
}
