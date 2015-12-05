#!/bin/bash

./bin/cfg-js ./tests/samples/0001-choice.js
dot -Tpng ./tests/samples/0001-choice.js.dot > ./tests/samples/0001-choice.png
./bin/cfg-js ./tests/samples/0002-function.js
dot -Tpng ./tests/samples/0002-function.js.dot > ./tests/samples/0002-function.png
./bin/cfg-js ./tests/samples/0003-try-catch-finally.js
dot -Tpng ./tests/samples/0003-try-catch-finally.js.dot > ./tests/samples/0003-try-catch-finally.png
./bin/cfg-js ./tests/samples/0004-loop.js
dot -Tpng ./tests/samples/0004-loop.js.dot > ./tests/samples/0004-loop.png
./bin/cfg-js ./tests/samples/0005-expression.js
dot -Tpng ./tests/samples/0005-expression.js.dot > ./tests/samples/0005-expression.png
./bin/cfg-js ./tests/samples/0006-with.js
dot -Tpng ./tests/samples/0006-with.js.dot > ./tests/samples/0006-with.png
./bin/cfg-js ./tests/samples/0007-label.js
dot -Tpng ./tests/samples/0007-label.js.dot > ./tests/samples/0007-label.png
./bin/cfg-js ./tests/samples/0008-debugger.js
dot -Tpng ./tests/samples/0008-debugger.js.dot > ./tests/samples/0008-debugger.png
