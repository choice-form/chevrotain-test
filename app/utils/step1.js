'use strict';
// Written Docs for this tutorial step can be found here:
// https://chevrotain.io/docs/tutorial/step1_lexing.html

// Tutorial Step 1:
// Implementation of A lexer for a simple SUM statement grammar
import chevrotain from 'chevrotain';
const Lexer = chevrotain.Lexer;
const createToken = chevrotain.createToken;

// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary = {};

// createToken is used to create a TokenType
// The Lexer's output will contain an array of token Objects created by metadata
const Identifier = createToken({
  name: 'Identifier',
  pattern: /\[[a-zA-Z]\w*\]/,
});

// We specify the "longer_alt" property to resolve keywords vs identifiers ambiguity.
// See: https://github.com/chevrotain/chevrotain/blob/master/examples/lexer/keywords_vs_identifiers/keywords_vs_identifiers.js
const Sum = createToken({
  name: 'Sum',
  pattern: /SUM/,
  longer_alt: Identifier,
});

const LeftParenthesis = createToken({ name: 'LeftParenthesis', pattern: /\(/ });
const RightParenthesis = createToken({
  name: 'RightParenthesis',
  pattern: /\)/,
});
const PlusSign = createToken({
  name: 'PlusSign',
  pattern: /\+/,
});

const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

// The order of tokens is important
const allTokens = [
  WhiteSpace,
  // "keywords" appear before the Identifier
  Sum,
  LeftParenthesis,
  RightParenthesis,
  PlusSign,
  // The Identifier must appear after the keywords because all keywords are valid identifiers.
  Identifier,
];

const SumLexer = new Lexer(allTokens);

allTokens.forEach((tokenType) => {
  tokenVocabulary[tokenType.name] = tokenType;
});

export default {
  tokenVocabulary: tokenVocabulary,

  lex: function (inputText) {
    const lexingResult = SumLexer.tokenize(inputText);

    if (lexingResult.errors.length > 0) {
      throw Error('Sad Sad Panda, lexing errors detected');
    }

    return lexingResult;
  },
};
