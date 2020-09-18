import { LightningElement,track } from 'lwc';

export default class HelloWorldParent extends LightningElement {

  @track progressValue = 'Madhuri';
  hanldeProgressValueChange(event) {
    this.progressValue = event.detail;
  }
}