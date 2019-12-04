import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appFloatNumber]'
})
export class FloatNumberDirective {

  @Input('appFloatNumber') public place: number; // 使用时[appFloatNumber]="3"

  private defaultPlace = 2; // 默认两位小数

  constructor(private control: NgControl) { }
  // 只能输入数字和小数点
  @HostListener('input', ['$event']) onKeyUp(event: any) {
    const target = event.target.value;
    if (target) {
      this.control.control.setValue(target.replace(/[^\d.]/g, ''));
    }
  }

  // 精确小数点 默认两位小数
  @HostListener('change', ['$event']) onChange(event: any) {
    this.defaultPlace = this.place ? this.place : this.defaultPlace;
    let target = event.target.value;
    if (target) {

      if (isNaN(parseFloat(String(target)))) {
        target = null;
      } else {
        const tmpValue = parseFloat(String(target)).toFixed(this.defaultPlace);
        target = parseFloat(tmpValue);
      }
      this.control.control.setValue(target);
    }
  }
}
