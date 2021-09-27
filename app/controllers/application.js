import Controller from '@ember/controller';
import { action } from '@ember/object';
import {
  toSqlAst,
  toSumAst,
  toCalculatorAst,
  toAnyAst,
  faultTolerant,
  tokenize,
} from '../utils';
export default class ApplicationController extends Controller {
  sqlValue = 'SELECT column1,column2 FROM table2 WHERE a > b';
  sumValue = 'SUM([field_1] + [field_2])';
  calculatorValue = '100 + 2 * 3 * 100';
  anyValue = '100 + 2 * 3 * 100';
  faultTolerantValue = '{ "key"   666}';
  customLexerErrorValue = 'A B C D';
  @action
  transformSQLAst() {
    console.log(toSqlAst(this.sqlValue));
  }

  @action
  transformSUMAst() {
    console.log(toSumAst(this.sumValue));
  }

  @action
  transformCalculatorAst() {
    console.log(toCalculatorAst(this.calculatorValue));
  }

  @action
  transformAnyAst() {
    console.log(toAnyAst(this.anyValue));
  }
  @action
  faultTolerantFun() {
    let parsingResult = faultTolerant.parse(this.faultTolerantValue);

    // Even though we had a syntax error (missing comma) the whole input was parsed
    // inspect the parsing result to see both the syntax error and that the output Parse Tree (CST)
    // Which even includes the '666' and '}'
    console.log(JSON.stringify(parsingResult, null, '\t'));
  }

  @action
  customLexerErrorFun() {
    console.log(tokenize(this.customLexerErrorValue));
  }
}
