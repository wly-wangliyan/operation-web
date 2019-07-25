import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {GlobalConst} from '../../../global-const';
import {Router} from '@angular/router';

@Component({
  selector: 'app-http500-tip',
  templateUrl: './http500-tip.component.html',
  styleUrls: ['./http500-tip.component.less']
})
export class Http500TipComponent {
  constructor(private renderer2: Renderer2, private router: Router) {
  }

  @ViewChild('pageDiv', {static: false}) public pageDiv: ElementRef;

  private flag = false;

  public get http500Flag(): boolean {
    return this.flag;
  }

  @Input()
  public set http500Flag(flag: boolean) {
    this.renderer2.setStyle(this.pageDiv.nativeElement, 'display', flag ? 'flex' : 'none');
    this.flag = flag;
    this.displayStateChanged.emit({displayState: flag});
  }

  @Output() public displayStateChanged = new EventEmitter();

  public onHomeBtnClick() {
    this.router.navigateByUrl(GlobalConst.HomePath);
  }
}
