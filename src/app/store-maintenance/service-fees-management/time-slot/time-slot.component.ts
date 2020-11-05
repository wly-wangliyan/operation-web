import { Component, Input, OnInit } from '@angular/core';
import { TimeItem } from '../../../../utils/date-format-helper';

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

class TimeSlotItem {
    public startTime: TimeItem = new TimeItem();
    public endTime: TimeItem = new TimeItem('24');
}
