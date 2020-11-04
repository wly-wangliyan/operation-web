import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-date-clock',
    templateUrl: './date-clock.component.html',
    styleUrls: ['./date-clock.component.css']
})
export class DateClockComponent {

    private hourValue: string = null;

    private minuteValue: string = null;

    /* 约定写法 构建双向绑定 */
    @Output() hourChange = new EventEmitter();

    @Output() minuteChange = new EventEmitter();

    /* 是否包含24时 */
    @Input() has24 = false;

    /* 是否禁止点击 */
    @Input() readonly = false;

    @Input()
    get hour() {
        return this.hourValue;
    }

    /* 绑定输入 */
    set hour(val) {
        const intValue = parseInt(val, 10);
        const maxValue = this.has24 ? 24 : 23;
        if (intValue >= 0 && intValue <= maxValue) {
            this.hourValue = this.formatDate(val);
        } else {
            // flux.promptWindow.open("小时超出范围！");
        }
    }

    /* 绑定输出 */
    setHour(event: any) {
        const intValue = event.target.value ? parseInt(event.target.value, 10) : '';
        const maxValue = this.has24 ? 24 : 23;
        if (intValue === '') {
            event.target.value = this.hourValue = null;
            this.hourChange.emit(this.hourValue);
        } else if (this.minuteValue !== '00' && Number(event.target.value) >= 24) {
            this.hourValue = this.formatDate('23');
            event.target.value = this.hourValue;
            this.hourChange.emit(this.hourValue);
        } else if (intValue >= 0 && intValue <= maxValue) {
            this.hourValue = this.formatDate(event.target.value);
            event.target.value = this.formatDate(event.target.value);
            this.hourChange.emit(this.hourValue);
        } else {
            event.target.value = this.hourValue;
        }
    }

    @Input()
    get minute() {
        return this.minuteValue;
    }

    set minute(val) {
        const intValue = parseInt(val, 10);
        if (intValue >= 0 && intValue < 60) {
            this.minuteValue = this.formatDate(val);
        } else {
        }
    }

    setMinute(event: any) {
        if (this.hourValue === '24') {
            event.target.value = '00';
        }
        const intValue = event.target.value ? parseInt(event.target.value, 10) : '';
        if (intValue === '') {
            event.target.value = this.minuteValue = null;
            this.minuteChange.emit(this.minuteValue);
        } else if (intValue >= 0 && intValue < 60) {
            this.minuteValue = this.formatDate(event.target.value);
            this.minuteChange.emit(this.minuteValue);
            event.target.value = this.formatDate(event.target.value);
        } else {
            event.target.value = this.minuteValue;
        }
    }

    constructor() {
    }

    private formatDate(value: string): string {
        if (value.length === 1) {
            return '0' + value;
        } else if (value.length > 2) {
            return value.substr(value.length - 2, 2);
        } else {
            return value;
        }
    }
}
