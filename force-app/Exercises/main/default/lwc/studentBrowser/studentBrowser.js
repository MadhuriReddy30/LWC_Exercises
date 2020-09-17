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
    let grid =
      this.template.querySelector('c-responsive-datatable');
    let gallery = this.template.querySelector('c-student-tiles');
    if (gallery) {
      gallery.setSelectedStudent(studentId);
    }
    if (grid) {
      grid.setSelectedRecord(studentId);
    }
    publish(this.messageContext, SELECTED_STUDENT_CHANNEL,
      message);

    //fireEvent(this.pageRef, 'studentChange', { studentId });
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

  handleRowClick(event) {
    let studentId = event.detail.pk;
    this.updateSelectedStudent(studentId);
  }
}