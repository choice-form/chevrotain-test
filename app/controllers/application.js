import Controller from '@ember/controller';
import { action } from '@ember/object';
import { toSqlAst, toSumAst, toCalculatorAst, toAnyAst } from '../utils';

export default class ApplicationController extends Controller {
  sqlValue = 'SELECT column1,column2 FROM table2 WHERE a > b';
  sumValue = 'SUM([field_1] + [field_2])';
  calculatorValue = '100 + 2 * 3 * 100';
  anyValue = '100 + 2 * 3 * 100';

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
}
