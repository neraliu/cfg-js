// https://github.com/estree/estree/blob/master/spec.md#labeledstatement
var i, j;

loop1:
for (i = 0; i < 3; i++) {
   loop2:
   for (j = 0; j < 3; j++) {
      if (i === 1 && j === 1) {
         continue loop1;
      }
      // https://github.com/estree/estree/blob/master/spec.md#callexpression
      console.log("i = " + i + ", j = " + j);
   }
}

// https://github.com/estree/estree/blob/master/spec.md#emptystatement
;
