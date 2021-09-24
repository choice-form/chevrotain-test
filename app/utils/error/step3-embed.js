'use strict';
// Written Docs for this tutorial step can be found here:
// https://chevrotain.io/docs/tutorial/step3b_adding_actions_embedded.html

// Tutorial Step 3:

// Adding a actions(semantics) embedded in the grammar.
// This is the highest performance approach, but its also verbose and none modular
// Therefore using the CST Visitor is the recommended approach:
// https://chevrotain.io/docs/tutorial/step3a_adding_actions_visitor.html
import sumLexer from './step1';
import chevrotain from 'chevrotain';
const tokenVocabulary = sumLexer.tokenVocabulary;

// individual imports, prefer ES6 imports if supported in your runtime/transpiler...
const { Sum, Identifier, LeftParenthesis, RightParenthesis, PlusSign } =
  tokenVocabulary;

// ----------------- parser -----------------
class SumParserEmbedded extends chevrotain.EmbeddedActionsParser {
  constructor() {
    super(tokenVocabulary);
    const $ = this;

    this.sumStatement = $.RULE('sumStatement', () => {
      let sum;

      sum = $.SUBRULE($.sumClause);

      // Each Grammar rule can return a value, these values can be combined to create a new data structure
      // in our case an AST.
      return {
        type: 'Sum_STMT',
        sumClause: sum,
      };
    });

    this.sumClause = $.RULE('sumClause', () => {
      const columns = [];

      $.CONSUME(Sum);
      $.CONSUME(LeftParenthesis);
      $.AT_LEAST_ONE_SEP({
        SEP: PlusSign,
        DEF: () => {
          columns.push($.CONSUME(Identifier).image);
        },
      });
      $.CONSUME(RightParenthesis);

      return {
        type: 'Sum_CLAUSE',
        columns: columns,
      };
    });

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis();
  }
}

// We only ever need one as the parser internal state is reset for each new input.
const parserInstance = new SumParserEmbedded();

export default {
  toAst: function (inputText) {
    const lexResult = sumLexer.lex(inputText);

    // ".input" is a setter which will reset the parser's internal's state.
    parserInstance.input = lexResult.tokens;

    // No semantic actions so this won't return anything yet.
    const ast = parserInstance.sumStatement();

    if (parserInstance.errors.length > 0) {
      throw Error(
        'Sad sad panda, parsing errors detected!\n' +
          parserInstance.errors[0].message
      );
    }

    return ast;
  },
};
