import { LightningElement, track, wire } from 'lwc';
import getStudents from '@salesforce/apex/StudentBrowser.getStudents';
import { publish, MessageContext } from 'lightning/messageService';
import SELECTED_STUDENT_CHANNEL from '@salesforce/messageChannel/SelectedStudentChannel__c';
import { NavigationMixin } from 'lightning/navigation';
export default class StudentBrowser extends NavigationMixin(LightningElement) {



  @wire(getStudents, {
    instructorId: '$selectedInstructorId',
    courseDeliveryId: '$selectedDeliveryId'
  })
  students;

  cols = [
    {
      fieldName: "Name",
      label: "Name"
    },
    {
      fieldName: "Title",
      label: "Title",
      hiddenOnMobile: true
    },
    {
      fieldName: "Phone",
      label: "Phone",
      type: "phone"
    },
    {
      fieldName: "Email",
      label: "E-Mail",
      type: "email"
    }
  ];

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

  handleRowDblClick(event) {
    const studentId = event.detail.pk;
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: studentId,
        objectApiName: 'Contact',
        actionName: 'edit'
      }
    });
  }
}