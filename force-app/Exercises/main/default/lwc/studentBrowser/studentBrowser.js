import { LightningElement, track, wire } from 'lwc';
import getStudents from '@salesforce/apex/StudentBrowser.getStudents';
export default class StudentBrowser extends LightningElement {



  @wire(getStudents, {
    instructorId: '$selectedInstructorId',
    courseDeliveryId: '$selectedDeliveryId'
  })
  students;

  selectedDeliveryId = '';
  selectedInstructorId = '';

  handleFilterChange(event){
    this.selectedDeliveryId = event.detail.deliveryId;
    this.selectedInstructorId = event.detail.instructorId;
    }
}