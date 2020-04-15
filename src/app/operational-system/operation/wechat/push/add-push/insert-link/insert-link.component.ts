import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GlobalService } from '../../../../../../core/global.service';
import { timer } from 'rxjs';
import { HttpErrorEntity } from '../../../../../../core/http.service';
import { ErrMessageGroup, ErrMessageBase } from '../../../../../../../utils/error-message-helper';
import { EntityBase } from 'src/utils/z-entity';

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

  public ngOnInit() {
  }

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

  // 清除错误信息
  public clear(): void {
    this.errMessageGroup.errJson = {};
    this.errMessageGroup.errJson.link_name = new ErrMessageBase();
    this.errMessageGroup.errJson.link_url = new ErrMessageBase();
  }

  public onCheckClick(): void {
    this.changeLink.emit({ link: this.linkParams });
  }

  // 弹框close
  public onClose() {
    $('#insertLinkModal').modal('hide');
  }
}
