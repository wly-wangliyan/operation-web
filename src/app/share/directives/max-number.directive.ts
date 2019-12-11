import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMaxNumber]'
})
export class MaxNumberDirective {

  @Input('appMaxNumber') public digit: string; // 使用时[appMaxNumber]=""

  constructor(private control: NgControl) { }
  // 最多输入几位数
  @HostListener('input', ['$event']) onKeyUp(event: any) {
    const target = event.target.value;
    if (Number(target) > Number(this.digit)) {
      this.control.control.setValue(this.digit);
    } else {
      this.control.control.setValue(target);
    }
  }
}
