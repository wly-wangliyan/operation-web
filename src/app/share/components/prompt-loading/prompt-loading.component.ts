import { Component, OnInit, Input } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-prompt-loading',
  templateUrl: './prompt-loading.component.html',
  styleUrls: ['./prompt-loading.component.less']
})
export class PromptLoadingComponent implements OnInit {

  public opaque = false; // fasle:不透明 true 透明

  public loading = false; // true 显示  false 不显示

  @Input() public msg = '';

  constructor() { }

  ngOnInit() {
  }

  /**
   * 弹出loading
   */
  public open(msg?: string, opaque: boolean = false) {
    timer(0).subscribe(() => {
      this.initData();
      this.msg = msg ? msg : '';
      this.opaque = opaque;
      this.loading = true;
    });
  }

  public close() {
    timer(500).subscribe(() => {
      this.loading = false;
    });
  }

  private initData() {
    this.opaque = false;
    this.msg = '';
  }
}
