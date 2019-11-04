import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appIgnoreSpace]'
})
export class IgnoreSpaceDirective {
  constructor(private control: NgControl) {
  }
  @HostListener('keydown', ['$event']) onKeyDown(event: any) {
    const keyCode = event.which;
    if (keyCode === 32) {
      // 32为空格键,当按下空格键是跳过
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event']) onKeyUp(event: any) {
    const target = event.target.value;
    if (target) {
      this.control.control.setValue(target.replace(/\s+/g, ''));
    }
  }
}
