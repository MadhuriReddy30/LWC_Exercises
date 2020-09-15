import { LightningElement, track, wire } from 'lwc';
import getStudents from '@salesforce/apex/StudentBrowser.getStudents';
import { publish, MessageContext } from 'lightning/messageService';
import SELECTED_STUDENT_CHANNEL from '@salesforce/messageChannel/SelectedStudentChannel__c';
export default class StudentBrowser extends LightningElement {



  @wire(getStudents, {
    instructorId: '$selectedInstructorId',
    courseDeliveryId: '$selectedDeliveryId'
  })
  students;

  selectedDeliveryId = '';
  selectedInstructorId = '';

  handleFilterChange(event) {
    this.selectedDeliveryId = event.detail.deliveryId;
    this.selectedInstructorId = event.detail.instructorId;
  }

  @wire(MessageContext) messageContext;

  handleStudentSelected(event) {
    const studentId = event.detail.studentId;
    this.updateSelectedStudent(studentId);
  }

  updateSelectedStudent(studentId) {
    const message = {
      studentId: studentId
    }
    publish(this.messageContext, SELECTED_STUDENT_CHANNEL,
      message);
  }
}