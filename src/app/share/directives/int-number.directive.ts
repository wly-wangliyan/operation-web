import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appIntNumber]'
})
export class IntNumberDirective {

  @Input('appIntNumber') public isToNumber: boolean; // 是否转化为整数 使用时[appIntNumber]="true"

  private defaultType = false; // 默认不转化为整数

  constructor(private control: NgControl) { }
  // 只能输入数字
  @HostListener('input', ['$event']) onInput(event: any) {
    const target = event.target.value;
    if (target) {
      this.control.control.setValue(target.replace(/[^\d]/g, ''));
    }
  }

  // 转化为整数
  @HostListener('change', ['$event']) onChange(event: any) {
    this.defaultType = this.isToNumber ? this.isToNumber : this.defaultType;
    const target = event.target.value;
    if (target && this.defaultType) {
      const tmpValue = Number(target);
      this.control.control.setValue(tmpValue);
    }
  }
}
