'use strict';
// Written Docs for this tutorial step can be found here:
// https://chevrotain.io/docs/tutorial/step1_lexing.html

// Tutorial Step 1:
// Implementation of A lexer for a simple SELECT statement grammar
import chevrotain from 'chevrotain';
const Lexer = chevrotain.Lexer;
const createToken = chevrotain.createToken;

// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary = {};

// ----------------- lexer -----------------
// using the NA pattern marks this Token class as 'irrelevant' for the Lexer.
// AdditionOperator defines a Tokens hierarchy but only the leafs in this hierarchy define
// actual Tokens that can appear in the text
const AdditionOperator = createToken({
  name: 'AdditionOperator',
  pattern: Lexer.NA,
});
export const Plus = createToken({
  name: 'Plus',
  pattern: /\+/,
  categories: AdditionOperator,
});
const Minus = createToken({
  name: 'Minus',
  pattern: /-/,
  categories: AdditionOperator,
});

const MultiplicationOperator = createToken({
  name: 'MultiplicationOperator',
  pattern: Lexer.NA,
});
export const Multi = createToken({
  name: 'Multi',
  pattern: /\*/,
  categories: MultiplicationOperator,
});
const Div = createToken({
  name: 'Div',
  pattern: /\//,
  categories: MultiplicationOperator,
});

const LParen = createToken({ name: 'LParen', pattern: /\(/ });
const RParen = createToken({ name: 'RParen', pattern: /\)/ });
const NumberLiteral = createToken({
  name: 'NumberLiteral',
  pattern: /[1-9]\d*/,
});

const PowerFunc = createToken({ name: 'PowerFunc', pattern: /power/ });
const Comma = createToken({ name: 'Comma', pattern: /,/ });

// marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

// The order of tokens is important
const allTokens = [
  WhiteSpace, // whitespace is normally very common so it should be placed first to speed up the lexer's performance
  Plus,
  Minus,
  Multi,
  Div,
  LParen,
  RParen,
  NumberLiteral,
  AdditionOperator,
  MultiplicationOperator,
  PowerFunc,
  Comma,
];

const CalculatorLexer = new Lexer(allTokens);

allTokens.forEach((tokenType) => {
  tokenVocabulary[tokenType.name] = tokenType;
});

export default {
  tokenVocabulary: tokenVocabulary,

  lex: function (inputText) {
    const lexingResult = CalculatorLexer.tokenize(inputText);

    if (lexingResult.errors.length > 0) {
      throw Error('Sad Sad Panda, lexing errors detected');
    }

    return lexingResult;
  },
};
