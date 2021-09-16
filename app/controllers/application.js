import Controller from '@ember/controller';
import { action } from '@ember/object';
import embedParse from '../utils/step3-1';
//import embedParse from '../utils/step3-2';

export default class ApplicationController extends Controller {
  // value = 'SELECT column1,column2 FROM table2 WHERE a > b';
  value = 'SUM([field_1] + [field_2])';

  @action
  transformAst() {
    console.log(embedParse.toAst(this.value));
  }
}
