'use strict';
// Written Docs for this tutorial step can be found here:
// https://chevrotain.io/docs/tutorial/step2_parsing.html

// Tutorial Step 2:

// Adding a Parser (grammar only, only reads the input without any actions).
// Using the Token Vocabulary defined in the previous step.

import sumLexer from './step1';
import chevrotain from 'chevrotain';
const tokenVocabulary = sumLexer.tokenVocabulary;

// individual imports, prefer ES6 imports if supported in your runtime/transpiler...
const { Sum, Identifier, LeftParenthesis, RightParenthesis, PlusSign } =
  tokenVocabulary;

// ----------------- parser -----------------
class SumParser extends chevrotain.CstParser {
  constructor() {
    super(tokenVocabulary);

    // for conciseness
    const $ = this;

    $.RULE('sumStatement', () => {
      $.SUBRULE($.sumClause);
    });

    $.RULE('sumClause', () => {
      $.CONSUME(Sum);
      $.CONSUME(LeftParenthesis);
      $.AT_LEAST_ONE_SEP({
        SEP: PlusSign,
        DEF: () => {
          $.CONSUME(Identifier);
        },
      });
      $.CONSUME(RightParenthesis);
    });

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis();
  }
}

// We only ever need one as the parser internal state is reset for each new input.
const parserInstance = new SumParser();

export default {
  parserInstance: parserInstance,

  SumParser: SumParser,

  parse: function (inputText) {
    const lexResult = sumLexer.lex(inputText);

    // ".input" is a setter which will reset the parser's internal's state.
    parserInstance.input = lexResult.tokens;

    // No semantic actions so this won't return anything yet.
    // parserInstance.sumStatement();

    if (parserInstance.errors.length > 0) {
      throw Error(
        'Sad sad panda, parsing errors detected!\n' +
          parserInstance.errors[0].message
      );
    }
  },
};
