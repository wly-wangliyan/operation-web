import {Component, ElementRef, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-progress-modal',
  templateUrl: './progress-modal.component.html',
  styleUrls: ['./progress-modal.component.css']
})
export class ProgressModalComponent implements OnInit {

  public message = '';
  @ViewChild('progressModal', {static: false}) progressModal: ElementRef;
  @Input()
  public hideCloseButton = false;
  @Output()
  public closeChange = new EventEmitter();
  constructor() {
  }

  ngOnInit() {
  }

  public onClose() {
    this.progressModal.nativeElement.style.display = 'none';
    this.closeChange.emit();
  }

  public openOrClose(flag = true, message?: string) {
    if (flag) {
      this.message = message || '正在导入中...';
      this.progressModal.nativeElement.style.display = 'block';
    } else {
      this.progressModal.nativeElement.style.display = 'none';
    }
  }
}
