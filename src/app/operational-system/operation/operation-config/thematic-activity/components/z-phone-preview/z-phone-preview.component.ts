import { Component, Input } from '@angular/core';
import { ContentEntity } from '../../thematic-activity.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-z-phone-preview',
  templateUrl: './z-phone-preview.component.html',
  styleUrls: ['./z-phone-preview.component.css', '../../../../../../../assets/less/preview.less']
})
export class ZPhonePreviewComponent {

  @Input() public preview_title = ''; // 标题

  @Input() public previewList: Array<ContentEntity> = []; // 预览内容数组

  constructor() { }

  public open(): void {
    timer(0).subscribe(() => {
      $('#previewModal').modal('show');
    });
  }

  public onClosePreview(): void {
    // 重置滚动条位置
    $('.pru-con').scrollTop(0);
    $('#previewModal').modal('hide');
  }
}
