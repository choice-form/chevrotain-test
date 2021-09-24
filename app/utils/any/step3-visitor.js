'use strict';
// Written Docs for this tutorial step can be found here:
// https://chevrotain.io/docs/tutorial/step3a_adding_actions_visitor.html

// Tutorial Step 3a:

// Adding Actions(semantics) to our grammar using a CST Visitor.

import calculatorLexer, { Plus, Multi } from './step1';
// re-using the parser implemented in step two.
import parser from './step2';
import { tokenMatcher } from 'chevrotain';
const CalculatorParser = parser.CalculatorParser;

// A new parser instance with CST output (enabled by default).
const parserInstance = new CalculatorParser();
// The base visitor class can be accessed via the a parser instance.
const BaseSQLVisitor = parserInstance.getBaseCstVisitorConstructor();

class CALCULATORToAstVisitor extends BaseSQLVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  expression(ctx) {
    // visiting an array is equivalent to visiting its first element.
    return this.visit(ctx.additionExpression);
  }

  // Note the usage if the "rhs" and "lhs" labels to increase the readability.
  additionExpression(ctx) {
    const lhs = this.visit(ctx.lhs);

    // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
    let rhs = [];
    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand, idx) => {
        // there will be one operator for each rhs operand
        let rhsValue = this.visit(rhsOperand);
        let operator = ctx.AdditionOperator[idx];
        if (tokenMatcher(operator, Plus)) {
          rhs.push({ type: 'Plus', value: rhsValue });
        } else {
          // Minus
          rhs.push({ type: 'Minus', value: rhsValue });
        }
      });
    }
    return {
      type: 'additionExpression',
      lhs,
      rhs: rhs.length > 0 ? rhs : null,
    };
  }

  multiplicationExpression(ctx) {
    const lhs = this.visit(ctx.lhs);

    // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
    let rhs = [];
    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand, idx) => {
        // there will be one operator for each rhs operand
        let rhsValue = this.visit(rhsOperand);
        let operator = ctx.MultiplicationOperator[idx];

        if (tokenMatcher(operator, Multi)) {
          rhs.push({ type: 'Multi', value: rhsValue });
        } else {
          // Division
          rhs.push({ type: 'Div', value: rhsValue });
        }
      });
    }

    return {
      type: 'multiplicationExpression',
      lhs,
      rhs: rhs.length > 0 ? rhs : null,
    };
  }

  atomicExpression(ctx) {
    if (ctx.parenthesisExpression) {
      return this.visit(ctx.parenthesisExpression);
    } else if (ctx.NumberLiteral) {
      return parseInt(ctx.NumberLiteral[0].image, 10);
    } else if (ctx.powerFunction) {
      return this.visit(ctx.powerFunction);
    } else if (ctx.Identifier) {
      return ctx.Identifier[0].image;
    } else if (ctx.sumClause) {
      return this.visit(ctx.sumClause);
    }
  }

  parenthesisExpression(ctx) {
    // The ctx will also contain the parenthesis tokens, but we don't care about those
    // in the context of calculating the result.

    return {
      type: 'parenthesisExpression',
      expression: this.visit(ctx.expression),
    };
  }

  powerFunction(ctx) {
    const base = this.visit(ctx.base);
    const exponent = this.visit(ctx.exponent);
    return {
      type: 'powerFunction',
      base,
      exponent,
    };
  }

  sumClause(ctx) {
    return {
      type: 'sumClause',
      value: this.visit(ctx.expression),
    };
  }
}

// Our visitor has no state, so a single instance is sufficient.
const toAstVisitorInstance = new CALCULATORToAstVisitor();

const toAst = function (inputText) {
  const lexResult = calculatorLexer.lex(inputText);

  // ".input" is a setter which will reset the parser's internal's state.
  parserInstance.input = lexResult.tokens;

  // Automatic CST created when parsing
  const cst = parserInstance.expression();

  if (parserInstance.errors.length > 0) {
    throw Error(
      'Sad sad panda, parsing errors detected!\n' +
        parserInstance.errors[0].message
    );
  }

  const ast = toAstVisitorInstance.visit(cst);

  return ast;
};
export { toAst };
