import {
  ComponentFactoryResolver, ComponentRef, Directive, ElementRef, HostListener, Input, Renderer2, ViewChild,
  ViewContainerRef
} from '@angular/core';
import {TxtCopyComponent} from './txt-copy.component';

/**
 * 目前暂时不能在表格中直接使用，需要加一层标签包裹目标
 */

@Directive({
  selector: '[appTxtCopy]',
})
export class TxtCopyDirective {

  public componentRef: ComponentRef<TxtCopyComponent>;

  @Input() appTxtCopy: string; // 此处是为了对应管道改变需要复制的值的问题

  constructor(private el: ElementRef, private renderer2: Renderer2, public viewContainerRef
    : ViewContainerRef, private componentFactoryResolver: ComponentFactoryResolver) {
  }

  @HostListener('mouseover') onmouseover() {
    this.renderer2.setStyle(this.el.nativeElement, 'cursor', 'pointer');
    this.createComponent();
  }

  @HostListener('mouseleave') onmouseleave() {
    this.componentRef.destroy();
  }

  @HostListener('click') onclick() {
    // 复制
    const aux = document.createElement('input');
    // 需要复制的值
    const content = this.appTxtCopy ? this.appTxtCopy : this.el.nativeElement.innerText;
    aux.setAttribute('value', content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
    this.componentRef.instance.copyComplete = true;
  }

  public createComponent() {
    this.viewContainerRef.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TxtCopyComponent);
    this.componentRef = this.viewContainerRef.createComponent(componentFactory);
    this.componentRef.instance.copyComplete = false;
  }
}

