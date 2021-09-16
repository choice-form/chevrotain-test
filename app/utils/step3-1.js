'use strict';
// Written Docs for this tutorial step can be found here:
// https://chevrotain.io/docs/tutorial/step3a_adding_actions_visitor.html

// Tutorial Step 3a:

// Adding Actions(semantics) to our grammar using a CST Visitor.

import sumLexer from './step1';
// re-using the parser implemented in step two.
import parser from './step2';
const SumParser = parser.SumParser;

// A new parser instance with CST output (enabled by default).
const parserInstance = new SumParser();
// The base visitor class can be accessed via the a parser instance.
const BaseSQLVisitor = parserInstance.getBaseCstVisitorConstructor();

class SQLToAstVisitor extends BaseSQLVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  sumStatement(ctx) {
    // "this.visit" can be used to visit none-terminals and will invoke the correct visit method for the CstNode passed.
    const sum = this.visit(ctx.sumClause);

    return {
      type: 'SUM_STMT',
      sumClause: sum,
    };
  }

  sumClause(ctx) {
    // Each Terminal or Non-Terminal in a grammar rule are collected into
    // an array with the same name(key) in the ctx object.
    const columns = ctx.Identifier.map((identToken) => identToken.image);

    return {
      type: 'SUM_CLAUSE',
      columns: columns,
    };
  }
}

// Our visitor has no state, so a single instance is sufficient.
const toAstVisitorInstance = new SQLToAstVisitor();

export default {
  toAst: function (inputText) {
    const lexResult = sumLexer.lex(inputText);

    // ".input" is a setter which will reset the parser's internal's state.
    parserInstance.input = lexResult.tokens;

    // Automatic CST created when parsing
    const cst = parserInstance.sumStatement();

    if (parserInstance.errors.length > 0) {
      throw Error(
        'Sad sad panda, parsing errors detected!\n' +
          parserInstance.errors[0].message
      );
    }

    const ast = toAstVisitorInstance.visit(cst);

    return ast;
  },
};
