import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { timer } from 'rxjs';
import { BoothEntity, BoothService } from '../booth.service';

export class CheckItem {
  key: number;
  name: string;
  isChecked: boolean;
  constructor(key: number, isChecked: boolean = true) {
    this.key = key;
    this.isChecked = isChecked;
  }
}

@Component({
  selector: 'app-booth-config-edit',
  templateUrl: './booth-config-edit.component.html',
  styleUrls: ['./booth-config-edit.component.css']
})
export class BoothConfigEditComponent implements OnInit {
  public boothData: BoothEntity = new BoothEntity(); // 展位数据
  public boothType = [1, 2]; // 1:轮播图(5个) 2:焦点图(1个)
  public formatList: Array<CheckItem> = []; // 支持格式
  public belongList: Array<CheckItem> = []; // 跳转链接
  public isCreate = true; // 标记新建\编辑
  private sureCallback: any;
  private closeCallback: any;
  constructor(
    private globalService: GlobalService,
    private boothService: BoothService) { }

  public ngOnInit() {
  }

  public open(data: BoothEntity, sureFunc: any, closeFunc: any = null) {
    const openBoothModal = () => {
      timer(0).subscribe(() => {
        $('#boothConfigModal').modal();
      });
    };
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    this.initFormats(null);
    this.initBelongs(null);
    openBoothModal();
  }

  // 弹框close
  public onClose() {
    this.boothData = new BoothEntity();
    $('#boothConfigModal').modal('hide');
  }

  // 改变支持格式
  public onChangeCheckedFormat(): void {
    const result = [];
    this.formatList.forEach(checkItem => {
      if (checkItem.isChecked) {
        result.push(checkItem.key);
      }
    });
    this.boothData.formats = result;
  }

  // 改变跳转链接
  public onChangeCheckedBelong(): void {
    const result = [];
    this.formatList.forEach(checkItem => {
      if (checkItem.isChecked) {
        result.push(checkItem.key);
      }
    });
    this.boothData.link_types = result;
  }

  // 支持格式及跳转链接都至少选择一项
  public ifDisabled(): boolean {
    return !this.formatList.some(checkItem => checkItem.isChecked)
      || !this.belongList.some(checkItem => checkItem.isChecked);
  }

  //
  public onCheckClick() {

  }

  // 确定按钮回调
  private sureCallbackInfo(): any {
    if (this.sureCallback) {
      const temp = this.sureCallback;
      this.closeCallback = null;
      this.sureCallback = null;
      temp();
    }
  }

  private initFormats(formats: Array<number>) {
    let index = 1;
    this.formatList = [];
    while (index <= 3) {
      const checkItem = new CheckItem(index);
      if (formats && !formats.includes(index)) {
        checkItem.isChecked = false;
      }
      this.formatList.push(checkItem);
      index++;
    }
  }

  private initBelongs(belong_to: Array<number>) {
    let index = 1;
    this.belongList = [];
    while (index <= 3) {
      const checkItem = new CheckItem(index);
      if (belong_to && !belong_to.includes(index)) {
        checkItem.isChecked = false;
      }
      this.belongList.push(checkItem);
      index++;
    }
  }
}
