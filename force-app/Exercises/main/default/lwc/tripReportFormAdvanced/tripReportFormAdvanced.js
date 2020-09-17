import { LightningElement, api, track, wire } from 'lwc';

import Utils from 'c/utils';
import getInstructors from '@salesforce/apex/StudentBrowserForm.getInstructors';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';

import { createRecord, getFieldValue, getRecord, updateRecord } from 'lightning/uiRecordApi';	//fill in the contents of this line


import OBJECT_TRIP_REPORT from '@salesforce/schema/TripReport__c';
import FIELD_ID from '@salesforce/schema/TripReport__c.Id';
import FIELD_DATE from '@salesforce/schema/TripReport__c.Date__c';
import FIELD_INSTRUCTOR from
  '@salesforce/schema/TripReport__c.Instructor__c';
import FIELD_NAME from '@salesforce/schema/TripReport__c.Name';
import FIELD_RATING from
  '@salesforce/schema/TripReport__c.Rating__c';
import FIELD_REVIEWTYPE from
  '@salesforce/schema/TripReport__c.ReviewType__c';
import FIELD_REVIEW from
  '@salesforce/schema/TripReport__c.Review__c';

const fieldsToLoad = [FIELD_DATE, FIELD_INSTRUCTOR, FIELD_NAME, FIELD_RATING, FIELD_REVIEWTYPE, FIELD_REVIEW];

export default class TripReportFormAdvanced extends LightningElement {

  error;
  _editorInitialized;

  @api recordId;

  //arrays to populate form options
  @track instructors;
  @track reviewTypes;

  //properties to store form values
  instructorId;
  locationName;
  dateVisited;
  reviewType;
  rating = 3;
  review;

  //TODO #3: following the examples of and dateVisited and instructorId, store the value of the name, rating, review type, and review fields in JavaScript properties 
  @wire(getRecord, { recordId: '$recordId', fields: fieldsToLoad })
  wiredTripReport({ error, data }) {
    if (data) {
      this.dateVisited = getFieldValue(data, FIELD_DATE);
      this.instructorId = getFieldValue(data, FIELD_INSTRUCTOR);
      this.locationName = getFieldValue(data, FIELD_NAME);
      this.rating = getFieldValue(data, FIELD_RATING);
      this.reviewType = getFieldValue(data, FIELD_REVIEWTYPE);
      this.review = getFieldValue(data, FIELD_REVIEW);

      this.error = undefined;
    } else if (error) {
      this.error = error;

    }
  }

  @wire(getInstructors)
  wired_getInstructors({ error, data }) {
    this.instructors = [];
    if (data) {
      data.forEach(instructor => {
        this.instructors.push({
          value: instructor.Id,
          label: instructor.Name
        });
      });
    } else if (error) {
      this.error = error;
    }
  }

  //Get Object Info
  @wire(getObjectInfo, { objectApiName: OBJECT_TRIP_REPORT })
  objectInfo;

  //Get ReviewType picklist values
  @wire(getPicklistValues, {
    recordTypeId: '$objectInfo.data.defaultRecordTypeId',
    fieldApiName: FIELD_REVIEWTYPE
  })
  wired_getPicklistValues({ error, data }) {
    this.reviewTypes = [];
    if (data) {
      data.values.forEach(reviewType => {
        this.reviewTypes.push({
          value: reviewType.value,
          label: reviewType.label
        });
      });
    }
  }

  get formTitle() {
    return (typeof this.recordId === 'undefined' || this.recordId === 0) ? 'Add Trip Report' : 'Edit Trip Report';
  }

  renderedCallback() {
    //without the following, the rich text area doesn't show text until first click
    if (!this._editorInitialized) {
      this._editorInitialized = true;
      this.template.querySelector('lightning-input-rich-text').focus();
    }
  }

  //TODO #4: set the value of the private tracked properties when they're changed in the form
  onInstructorChange(event) {
    this.instructorId = event.target.value;
  }
  onLocationNameChange(event) {
    this.locationName = event.target.value;
  }
  onDateVisitedChange(event) {
    this.dateVisited = event.target.value;
  }
  onReviewTypeChange(event) {
    this.reviewType = event.target.value;
  }
  onRatingChange(event) {
    this.rating = event.target.value;
  }
  onReviewChange(event) {
    this.review = event.target.value;
  }

  onSave() {
    this.saveTripReport();
  }
  saveTripReport() {
    const fieldsToSave = {}
    fieldsToSave[FIELD_DATE.fieldApiName] = this.dateVisited;
    fieldsToSave[FIELD_INSTRUCTOR.fieldApiName] = this.instructorId;
    fieldsToSave[FIELD_RATING.fieldApiName] = this.rating;
    fieldsToSave[FIELD_REVIEWTYPE.fieldApiName] = this.reviewType;
    fieldsToSave[FIELD_REVIEW.fieldApiName] = this.review;
    fieldsToSave[FIELD_NAME.fieldApiName] = this.locationName;

    if (!this.recordId) {

      const recordInput = { fields:fieldsToSave, apiName:
        OBJECT_TRIP_REPORT.objectApiName};

      createRecord(recordInput)
        .then(tripReport => {
          this.recordId = tripReport.id;

          Utils.showToast(this, 'Success', 'Trip Report Created', 'success');
        })
        .catch(error => {
          Utils.showToast(this, 'Error creating record', error.body.message, 'error');
        });
    } else {

      fieldsToSave[FIELD_ID.fieldApiName] = this.recordId;
      
      const recordInput = { fields: fieldsToSave }
      updateRecord(recordInput)
        .then(() => {
          Utils.showToast(this, 'Success', 'Trip report updated', 'success');
        })
        .catch(error => {
          Utils.showToast(this, 'Error updating record', error.body.message, 'error');
        });
    }

  }

}