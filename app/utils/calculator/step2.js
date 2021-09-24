'use strict';
// Written Docs for this tutorial step can be found here:
// https://chevrotain.io/docs/tutorial/step2_parsing.html

// Tutorial Step 2:

// Adding a Parser (grammar only, only reads the input without any actions).
// Using the Token Vocabulary defined in the previous step.

import calculatorLexer from './step1';
import chevrotain from 'chevrotain';
const tokenVocabulary = calculatorLexer.tokenVocabulary;

const LParen = tokenVocabulary.LParen;
const RParen = tokenVocabulary.RParen;
const NumberLiteral = tokenVocabulary.NumberLiteral;
const AdditionOperator = tokenVocabulary.AdditionOperator;
const MultiplicationOperator = tokenVocabulary.MultiplicationOperator;
const PowerFunc = tokenVocabulary.PowerFunc;
const Comma = tokenVocabulary.Comma;

// ----------------- parser -----------------
class CalculatorParser extends chevrotain.CstParser {
  constructor() {
    super(tokenVocabulary);

    // for conciseness
    const $ = this;

    $.RULE('expression', () => {
      $.SUBRULE($.additionExpression);
    });

    // Lowest precedence thus it is first in the rule chain
    // The precedence of binary expressions is determined by how far down the Parse Tree
    // The binary expression appears.
    $.RULE('additionExpression', () => {
      // using labels can make the CST processing easier
      $.SUBRULE($.multiplicationExpression, { LABEL: 'lhs' });
      $.MANY(() => {
        // consuming 'AdditionOperator' will consume either Plus or Minus as they are subclasses of AdditionOperator
        $.CONSUME(AdditionOperator);
        //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
        $.SUBRULE2($.multiplicationExpression, { LABEL: 'rhs' });
      });
    });

    $.RULE('multiplicationExpression', () => {
      $.SUBRULE($.atomicExpression, { LABEL: 'lhs' });
      $.MANY(() => {
        $.CONSUME(MultiplicationOperator);
        //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
        $.SUBRULE2($.atomicExpression, { LABEL: 'rhs' });
      });
    });

    $.RULE('atomicExpression', () => {
      $.OR([
        // parenthesisExpression has the highest precedence and thus it appears
        // in the "lowest" leaf in the expression ParseTree.
        { ALT: () => $.SUBRULE($.parenthesisExpression) },
        { ALT: () => $.CONSUME(NumberLiteral) },
        { ALT: () => $.SUBRULE($.powerFunction) },
      ]);
    });

    $.RULE('parenthesisExpression', () => {
      $.CONSUME(LParen);
      $.SUBRULE($.expression);
      $.CONSUME(RParen);
    });

    $.RULE('powerFunction', () => {
      $.CONSUME(PowerFunc);
      $.CONSUME(LParen);
      $.SUBRULE($.expression, { LABEL: 'base' });
      $.CONSUME(Comma);
      $.SUBRULE2($.expression, { LABEL: 'exponent' });
      $.CONSUME(RParen);
    });

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis();
  }
}

// We only ever need one as the parser internal state is reset for each new input.
const parserInstance = new CalculatorParser();

export default {
  parserInstance: parserInstance,

  CalculatorParser: CalculatorParser,

  parse: function (inputText) {
    const lexResult = calculatorLexer.lex(inputText);

    // ".input" is a setter which will reset the parser's internal's state.
    parserInstance.input = lexResult.tokens;

    // No semantic actions so this won't return anything yet.
    // parserInstance.calculatorStatement();

    if (parserInstance.errors.length > 0) {
      throw Error(
        'Sad sad panda, parsing errors detected!\n' +
          parserInstance.errors[0].message
      );
    }
  },
};
