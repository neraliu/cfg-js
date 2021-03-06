/*
Copyright (c) 2015, All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/
(function() {

var TestASTPatterns = [
    { sourcefile: './tests/samples/0001-choice.js',                   log: 'info' ,
      paths: [
        'Program -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> IfStatement -> BinaryExpression -> Identifier',
        'Program -> IfStatement -> BinaryExpression -> Identifier',
        'Program -> IfStatement -> BlockStatement -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> IfStatement -> BlockStatement -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> IfStatement -> BlockStatement -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> IfStatement -> BlockStatement -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> IfStatement -> BinaryExpression -> Identifier',
        'Program -> IfStatement -> BinaryExpression -> Identifier',
        'Program -> SwitchStatement -> Identifier',
        'Program -> SwitchStatement -> SwitchCase -> Literal',
        'Program -> SwitchStatement -> SwitchCase -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> SwitchStatement -> SwitchCase -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> SwitchStatement -> SwitchCase -> BreakStatement',
        'Program -> SwitchStatement -> SwitchCase -> Literal',
        'Program -> SwitchStatement -> SwitchCase -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> SwitchStatement -> SwitchCase -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> SwitchStatement -> SwitchCase -> BreakStatement',
        'Program -> SwitchStatement -> SwitchCase -> BreakStatement',
      ] 
    },
    { sourcefile: './tests/samples/0002-function.js',                 log: 'info',
      paths: [
        'Program -> FunctionDeclaration -> Identifier',
        'Program -> FunctionDeclaration -> Identifier',
        'Program -> FunctionDeclaration -> Identifier',
        'Program -> FunctionDeclaration -> BlockStatement -> ReturnStatement -> Literal',
        'Program -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> VariableDeclaration -> VariableDeclarator -> FunctionExpression -> Identifier',
        'Program -> VariableDeclaration -> VariableDeclarator -> FunctionExpression -> Identifier',
        'Program -> VariableDeclaration -> VariableDeclarator -> FunctionExpression -> BlockStatement -> ReturnStatement -> Identifier',
      ]
    },
    { sourcefile: './tests/samples/0003-try-catch-finally.js',        log: 'info',
      paths: [
        'Program -> TryStatement -> BlockStatement -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> TryStatement -> BlockStatement -> VariableDeclaration -> VariableDeclarator -> Literal',
        'Program -> TryStatement -> BlockStatement -> ThrowStatement -> Literal',
        'Program -> TryStatement -> CatchClause -> Identifier',
        'Program -> TryStatement -> CatchClause -> BlockStatement -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> TryStatement -> CatchClause -> BlockStatement -> VariableDeclaration -> VariableDeclarator -> Literal',
        'Program -> TryStatement -> BlockStatement -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> TryStatement -> BlockStatement -> VariableDeclaration -> VariableDeclarator -> Literal',
      ]
    },
    { sourcefile: './tests/samples/0004-loop.js',                     log: 'info',
      paths: [
        'Program -> WhileStatement -> Literal',
        'Program -> WhileStatement -> BlockStatement -> IfStatement -> Literal',
        'Program -> WhileStatement -> BlockStatement -> IfStatement -> BlockStatement -> BreakStatement',
        'Program -> ForStatement -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> ForStatement -> VariableDeclaration -> VariableDeclarator -> Literal',
        'Program -> ForStatement -> BinaryExpression -> Identifier',
        'Program -> ForStatement -> BinaryExpression -> Literal',
        'Program -> ForStatement -> UpdateExpression -> Identifier',
        'Program -> ForStatement -> BlockStatement -> IfStatement -> Literal',
        'Program -> ForStatement -> BlockStatement -> IfStatement -> BlockStatement -> ContinueStatement',
        'Program -> DoWhileStatement -> BlockStatement -> IfStatement -> Literal',
        'Program -> DoWhileStatement -> Literal',
        'Program -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> VariableDeclaration -> VariableDeclarator -> ObjectExpression -> Property -> Identifier',
        'Program -> VariableDeclaration -> VariableDeclarator -> ObjectExpression -> Property -> Literal',
        'Program -> VariableDeclaration -> VariableDeclarator -> ObjectExpression -> Property -> Identifier',
        'Program -> VariableDeclaration -> VariableDeclarator -> ObjectExpression -> Property -> Literal',
        'Program -> VariableDeclaration -> VariableDeclarator -> ObjectExpression -> Property -> Identifier',
        'Program -> VariableDeclaration -> VariableDeclarator -> ObjectExpression -> Property -> Literal',
        'Program -> ForInStatement -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> ForInStatement -> Identifier',
        'Program -> ForInStatement -> BlockStatement -> IfStatement -> Literal',
      ]
    },
    { sourcefile: './tests/samples/0005-expression.js',               log: 'info',
      paths: [
        'Program -> FunctionDeclaration -> Identifier',
        'Program -> FunctionDeclaration -> BlockStatement -> ExpressionStatement -> AssignmentExpression -> MemberExpression -> ThisExpression',
        'Program -> FunctionDeclaration -> BlockStatement -> ExpressionStatement -> AssignmentExpression -> MemberExpression -> Identifier',
        'Program -> FunctionDeclaration -> BlockStatement -> ExpressionStatement -> AssignmentExpression -> Literal',
        'Program -> ExpressionStatement -> AssignmentExpression -> MemberExpression -> MemberExpression -> Identifier',
        'Program -> ExpressionStatement -> AssignmentExpression -> MemberExpression -> MemberExpression -> Identifier',
        'Program -> ExpressionStatement -> AssignmentExpression -> MemberExpression -> Identifier',
        'Program -> ExpressionStatement -> AssignmentExpression -> FunctionExpression -> BlockStatement -> ExpressionStatement -> AssignmentExpression -> MemberExpression -> ThisExpression',
        'Program -> ExpressionStatement -> AssignmentExpression -> FunctionExpression -> BlockStatement -> ExpressionStatement -> AssignmentExpression -> MemberExpression -> Identifier',
        'Program -> ExpressionStatement -> AssignmentExpression -> FunctionExpression -> BlockStatement -> ExpressionStatement -> AssignmentExpression -> Literal',
        'Program -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> VariableDeclaration -> VariableDeclarator -> NewExpression -> Identifier',
        'Program -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> VariableDeclaration -> VariableDeclarator -> ArrayExpression -> Literal',
        'Program -> VariableDeclaration -> VariableDeclarator -> ArrayExpression -> Literal',
        'Program -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> VariableDeclaration -> VariableDeclarator -> ConditionalExpression -> Literal',
        'Program -> VariableDeclaration -> VariableDeclarator -> ConditionalExpression -> Literal',
        'Program -> VariableDeclaration -> VariableDeclarator -> ConditionalExpression -> Literal',
        'Program -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> VariableDeclaration -> VariableDeclarator -> LogicalExpression -> Identifier',
        'Program -> VariableDeclaration -> VariableDeclarator -> LogicalExpression -> Identifier',
        'Program -> ExpressionStatement -> UpdateExpression -> Identifier',
        'Program -> IfStatement -> BinaryExpression -> UnaryExpression -> Literal',
        'Program -> IfStatement -> BinaryExpression -> Literal',
        'Program -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> ExpressionStatement -> AssignmentExpression -> Identifier',
        'Program -> ExpressionStatement -> AssignmentExpression -> SequenceExpression -> AssignmentExpression -> Identifier',
        'Program -> ExpressionStatement -> AssignmentExpression -> SequenceExpression -> AssignmentExpression -> Literal',
        'Program -> ExpressionStatement -> AssignmentExpression -> SequenceExpression -> AssignmentExpression -> Identifier',
        'Program -> ExpressionStatement -> AssignmentExpression -> SequenceExpression -> AssignmentExpression -> Literal',
        'Program -> ExpressionStatement -> Identifier',
        'Program -> ExpressionStatement -> Identifier',
        'Program -> ExpressionStatement -> Identifier',
      ]
    },
    { sourcefile: './tests/samples/0006-with.js',                     log: 'info',
      paths: [
        'Program -> WithStatement -> Identifier',
        'Program -> WithStatement -> BlockStatement -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> WithStatement -> BlockStatement -> VariableDeclaration -> VariableDeclarator -> Literal',
      ]
    },
    { sourcefile: './tests/samples/0007-label.js',                    log: 'info',
      paths: [
        'Program -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> VariableDeclaration -> VariableDeclarator -> Identifier',
        'Program -> LabeledStatement -> Identifier',
        'Program -> LabeledStatement -> ForStatement -> AssignmentExpression -> Identifier',
        'Program -> LabeledStatement -> ForStatement -> AssignmentExpression -> Literal',
        'Program -> LabeledStatement -> ForStatement -> BinaryExpression -> Identifier',
        'Program -> LabeledStatement -> ForStatement -> BinaryExpression -> Literal',
        'Program -> LabeledStatement -> ForStatement -> UpdateExpression -> Identifier',
        'Program -> LabeledStatement -> ForStatement -> BlockStatement -> LabeledStatement -> Identifier',
        'Program -> LabeledStatement -> ForStatement -> BlockStatement -> LabeledStatement -> ForStatement -> AssignmentExpression -> Identifier',
        'Program -> LabeledStatement -> ForStatement -> BlockStatement -> LabeledStatement -> ForStatement -> AssignmentExpression -> Literal',
        'Program -> LabeledStatement -> ForStatement -> BlockStatement -> LabeledStatement -> ForStatement -> BinaryExpression -> Identifier',
        'Program -> LabeledStatement -> ForStatement -> BlockStatement -> LabeledStatement -> ForStatement -> BinaryExpression -> Literal',
        'Program -> LabeledStatement -> ForStatement -> BlockStatement -> LabeledStatement -> ForStatement -> UpdateExpression -> Identifier',
        'Program -> LabeledStatement -> ForStatement -> BlockStatement -> LabeledStatement -> ForStatement -> BlockStatement -> IfStatement -> LogicalExpression -> BinaryExpression -> Identifier',
        'Program -> LabeledStatement -> ForStatement -> BlockStatement -> LabeledStatement -> ForStatement -> BlockStatement -> IfStatement -> LogicalExpression -> BinaryExpression -> Literal',
        'Program -> LabeledStatement -> ForStatement -> BlockStatement -> LabeledStatement -> ForStatement -> BlockStatement -> IfStatement -> LogicalExpression -> BinaryExpression -> Identifier',
        'Program -> LabeledStatement -> ForStatement -> BlockStatement -> LabeledStatement -> ForStatement -> BlockStatement -> IfStatement -> LogicalExpression -> BinaryExpression -> Literal',
        'Program -> LabeledStatement -> ForStatement -> BlockStatement -> LabeledStatement -> ForStatement -> BlockStatement -> IfStatement -> BlockStatement -> ContinueStatement',
        'Program -> LabeledStatement -> ForStatement -> BlockStatement -> LabeledStatement -> ForStatement -> BlockStatement -> ExpressionStatement -> CallExpression -> MemberExpression -> Identifier',
        'Program -> LabeledStatement -> ForStatement -> BlockStatement -> LabeledStatement -> ForStatement -> BlockStatement -> ExpressionStatement -> CallExpression -> MemberExpression -> Identifier',
        'Program -> LabeledStatement -> ForStatement -> BlockStatement -> LabeledStatement -> ForStatement -> BlockStatement -> ExpressionStatement -> CallExpression -> BinaryExpression -> BinaryExpression -> BinaryExpression -> Literal',
        'Program -> LabeledStatement -> ForStatement -> BlockStatement -> LabeledStatement -> ForStatement -> BlockStatement -> ExpressionStatement -> CallExpression -> BinaryExpression -> BinaryExpression -> BinaryExpression -> Identifier',
        'Program -> LabeledStatement -> ForStatement -> BlockStatement -> LabeledStatement -> ForStatement -> BlockStatement -> ExpressionStatement -> CallExpression -> BinaryExpression -> BinaryExpression -> Literal',
        'Program -> LabeledStatement -> ForStatement -> BlockStatement -> LabeledStatement -> ForStatement -> BlockStatement -> ExpressionStatement -> CallExpression -> BinaryExpression -> Identifier',
        'Program -> EmptyStatement',
      ]
    },
    { sourcefile: './tests/samples/0008-debugger.js',                 log: 'info',
      paths: [
        'Program -> FunctionDeclaration -> Identifier',
        'Program -> FunctionDeclaration -> BlockStatement -> DebuggerStatement',
        'Program -> DebuggerStatement',
      ]
    },
];
exports.TestASTPatterns = TestASTPatterns;

var TestCFGPatterns = [
    { sourcefile: './tests/samples/0000-block-if-then-else.js',       log: 'info' ,
      paths: [
        [ '1:VariableDeclaration,VariableDeclaration,IfStatement',
          '2:VariableDeclaration',
          '3:AssignmentExpression' ],
        [ '1:VariableDeclaration,VariableDeclaration,IfStatement',
          '3:AssignmentExpression' ], 
      ],
      blocks: { statements: ["VariableDeclaration","VariableDeclaration","IfStatement"],
                blocks: [ { statements: ["VariableDeclaration"],
                            blocks: [ { statements: ["AssignmentExpression"],
                                       blocks: [] } ]
                          },
                          { statements: ["AssignmentExpression"],
                            blocks: []
                          } ]
              },
    },
    { sourcefile: './tests/samples/0001-block-if-then-else.js',       log: 'info' ,
      paths: [
        [ '1:VariableDeclaration,VariableDeclaration,IfStatement',
          '2:VariableDeclaration',
          '4:AssignmentExpression' ],
        [ '1:VariableDeclaration,VariableDeclaration,IfStatement',
          '3:VariableDeclaration,AssignmentExpression',
          '4:AssignmentExpression' ],
      ],
      blocks: { statements: ["VariableDeclaration","VariableDeclaration","IfStatement"],
                blocks: [ { statements: ["VariableDeclaration"],
                            blocks: [ { statements: ["AssignmentExpression"],
                                        blocks: [] } ]
                          },
                          { statements: ["VariableDeclaration","AssignmentExpression"],
                            blocks: [ { statements: ["AssignmentExpression"],
                                        blocks: [] } ]
                          } ]
              },
    },
    { sourcefile: './tests/samples/0002-block-if-then-else.js',       log: 'info' ,
      paths: [
        [ '1:VariableDeclaration,VariableDeclaration,IfStatement',
          '2:VariableDeclaration,IfStatement',
          '3:AssignmentExpression',
          '4:VariableDeclaration',
          '6:AssignmentExpression' ],
        [ '1:VariableDeclaration,VariableDeclaration,IfStatement',
          '2:VariableDeclaration,IfStatement',
          '4:VariableDeclaration',
          '6:AssignmentExpression' ],
        [ '1:VariableDeclaration,VariableDeclaration,IfStatement',
          '5:VariableDeclaration,AssignmentExpression',
          '6:AssignmentExpression' ],
      ],
      blocks: { statements: ["VariableDeclaration","VariableDeclaration","IfStatement"],
                blocks: [ { statements: ["VariableDeclaration","IfStatement"],
                            blocks: [ { statements: ["AssignmentExpression"],
                                        blocks: [ { statements: ["VariableDeclaration"],
                                                    blocks: [ { statements: ["AssignmentExpression"],
                                                                blocks: [] } ]
                                                  } ]
                                      },
                                      { statements: ["VariableDeclaration"],
                                        blocks: [ { statements: ["AssignmentExpression"],
                                                    blocks: [] } ]
                                      } ]
                          },
                          { statements: ["VariableDeclaration","AssignmentExpression"],
                            blocks: [ { statements: ["AssignmentExpression"],
                                        blocks: [] } ]
                          } ] 
              },
    },
    { sourcefile: './tests/samples/0003-block-if-then-else.js',       log: 'info' ,
      paths: [
        [ '1:VariableDeclaration,VariableDeclaration,IfStatement',
          '2:VariableDeclaration,IfStatement',
          '3:AssignmentExpression,IfStatement',
          '4:AssignmentExpression',
          '6:',
          '7:VariableDeclaration',
          '9:AssignmentExpression' ],
        [ '1:VariableDeclaration,VariableDeclaration,IfStatement',
          '2:VariableDeclaration,IfStatement',
          '3:AssignmentExpression,IfStatement',
          '5:AssignmentExpression',
          '6:',
          '7:VariableDeclaration',
          '9:AssignmentExpression' ],
        [ '1:VariableDeclaration,VariableDeclaration,IfStatement',
          '2:VariableDeclaration,IfStatement',
          '7:VariableDeclaration',
          '9:AssignmentExpression' ],
        [ '1:VariableDeclaration,VariableDeclaration,IfStatement',
          '8:VariableDeclaration,AssignmentExpression',
          '9:AssignmentExpression' ]
      ],
      blocks: { statements: ["VariableDeclaration","VariableDeclaration","IfStatement"],
                blocks: [ { statements: ["VariableDeclaration","IfStatement"],
                            blocks: [ { statements: ["AssignmentExpression","IfStatement"],
                                        blocks: [ { statements: ["AssignmentExpression"],
                                                    blocks: [ { statements: [],
                                                                blocks: [ { statements: ["VariableDeclaration"],
                                                                            blocks: [ { statements: ["AssignmentExpression"],
                                                                                        blocks: [] } ]
                                                                          } ]
                                                              } ]
                                                  },
                                                  { statements: ["AssignmentExpression"],
                                                    blocks: [ { statements: [],
                                                                blocks: [ { statements: ["VariableDeclaration"],
                                                                            blocks: [ { statements: ["AssignmentExpression"],
                                                                                        blocks: [] } ]
                                                                          } ]
                                                              } ]
                                                  } ]
                                      },
                                      { statements: ["VariableDeclaration"],
                                        blocks: [ { statements: ["AssignmentExpression"],
                                                    blocks: [] } ]
                                      } ]
                          },
                          { statements: ["VariableDeclaration","AssignmentExpression"],
                            blocks: [ { statements: ["AssignmentExpression"],
                                        blocks: [] } ]
                          } ]
              },
    }
];
exports.TestCFGPatterns = TestCFGPatterns;

})();
