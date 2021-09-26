import { toAst as toSqlAst } from './sql/step3-visitor';
import { toAst as toSumAst } from './sum/step3-visitor';
import { toAst as toCalculatorAst } from './calculator/step3-visitor';
import { toAst as toAnyAst } from './any/step3-visitor';
import faultTolerant from './faultTolerant/step4';
// import parse_error_tip from './error/step4';
// parse_error_tip();
export { toSqlAst, toSumAst, toCalculatorAst, toAnyAst, faultTolerant };
