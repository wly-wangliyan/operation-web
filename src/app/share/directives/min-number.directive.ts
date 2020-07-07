import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMinNumber]'
})
export class MinNumberDirective {

  @Input('appMinNumber') public digit: number; // 使用时[appMaxNumber]=""

  constructor(private control: NgControl) { }
  // 最少输入多少
  @HostListener('input', ['$event']) onKeyUp(event: any) {
    const target = event.target.value;
    if (target && Number(target) < Number(this.digit)) {
      this.control.control.setValue(this.digit);
    } else {
      this.control.control.setValue(target.replace(/[^\d]/g, ''));
    }
  }
}
