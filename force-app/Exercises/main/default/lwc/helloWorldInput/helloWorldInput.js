import { LightningElement,api,wire,track } from 'lwc';

export default class HelloWorldInput extends LightningElement {
  @api progressValue;
  handleChnage(event) {
    this.progressValue = event.target.value;
    const selectedEvent = new CustomEvent("progressvaluechange", {
      detail: this.progressValue
    });
 

    this.dispatchEvent(selectedEvent);
  }

  changeHandler(event) {
    this.greeting = event.target.value;
  }

}