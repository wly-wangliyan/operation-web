import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { timer } from 'rxjs';
import { EntityBase } from 'src/utils/z-entity';
import { ErrMessageGroup, ErrMessageBase } from '../../../../../../../utils/error-message-helper';
export class LinkParams extends EntityBase {
  public link_name: string = undefined; // 链接名
  public link_url: string = undefined; // 小程序路径
}

@Component({
  selector: 'app-insert-link',
  templateUrl: './insert-link.component.html',
  styleUrls: ['./insert-link.component.css']
})
export class InsertLinkComponent implements OnInit {
  public linkParams: LinkParams = new LinkParams();
  public errMessageGroup: ErrMessageGroup = new ErrMessageGroup();
  @Output('changeLink') public changeLink = new EventEmitter();

  constructor() { }

  public ngOnInit() { }

  public open(link_name: string, link_url: string) {
    const openBoothModal = () => {
      timer(0).subscribe(() => {
        $('#insertLinkModal').modal();
      });
    };
    this.clear();
    this.linkParams = new LinkParams();
    this.linkParams.link_name = link_name;
    this.linkParams.link_url = link_url;
    openBoothModal();
  }

  // 确定
  public onCheckClick(): void {
    this.clear();
    if (!this.linkParams.link_name && this.linkParams.link_url) {
      this.errMessageGroup.errJson.link_name.errMes = '请输入链接名！';
      return;
    }
    if (this.linkParams.link_name && !this.linkParams.link_url) {
      this.errMessageGroup.errJson.link_url.errMes = '请输入链接！';
      return;
    }
    this.changeLink.emit({ link: this.linkParams });
    this.onClose();
  }

  // 弹框close
  public onClose() {
    $('#insertLinkModal').modal('hide');
  }

  // 清除错误信息
  private clear(): void {
    this.errMessageGroup.errJson = {};
    this.errMessageGroup.errJson.link_name = new ErrMessageBase();
    this.errMessageGroup.errJson.link_url = new ErrMessageBase();
  }
}
