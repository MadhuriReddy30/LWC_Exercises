import { LightningElement, track } from 'lwc';

export default class TripReports extends LightningElement {
	mode = 'browse';

	get browseMode() {
		return (this.mode === 'browse');
	}
	get addOrEditMode() {
		return (this.mode === 'add' || this.mode === 'edit');
	}

	selectedTripReportId = 0;

	handleTripReportModeChange(event) {
		this.mode = event.detail.mode;
		this.selectedTripReportId = event.detail.Id;
	}

}