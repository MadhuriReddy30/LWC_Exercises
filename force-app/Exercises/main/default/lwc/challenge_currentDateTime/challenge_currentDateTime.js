import { LightningElement, track } from 'lwc';

export default class Challenge_currentDateTime extends LightningElement {

  currentDate = new Date();
	updateDate() {
    this.currentDate = new Date();
  }
}