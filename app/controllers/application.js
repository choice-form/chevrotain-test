import Controller from '@ember/controller';
import { action } from '@ember/object';
import embedParse from '../utils/step3-1';
// import embedParse from '../utils/step3-2';

export default class ApplicationController extends Controller {
  value = 'SELECT column1,column2 FROM table2 WHERE a > b';

  @action
  transformAst() {
    console.log(embedParse.toAst(this.value));
  }
}
