import { Component, Input, OnInit } from '@angular/core';
import { TimeSlotItem } from '../rescue-fees-edit/rescue-fees-edit.component';

@Component({
    selector: 'app-time-slot',
    templateUrl: './time-slot.component.html',
    styleUrls: ['./time-slot.component.css']
})
export class TimeSlotComponent implements OnInit {
    @Input() public timeSlots = new TimeSlotItem();

    @Input() public startReadonly = false;

    @Input() public endReadonly = false;

    ngOnInit() {
    }

}
