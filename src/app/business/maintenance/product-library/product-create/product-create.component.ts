import { Component, OnInit, ViewChild } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';


export class ErrMessageItem {
  public isError = false;
  public errMes: string;

  constructor(isError?: boolean, errMes?: string) {
    if (!isError || isNullOrUndefined(errMes)) {
      return;
    }
    this.isError = isError;
    this.errMes = errMes;
  }
}
export class ErrPositionItem {
  icon: ErrMessageItem = new ErrMessageItem();
  ic_name: ErrMessageItem = new ErrMessageItem();

  constructor(icon?: ErrMessageItem, title?: ErrMessageItem, ic_name?: ErrMessageItem,
    corner?: ErrMessageItem) {
    if (isNullOrUndefined(icon) || isNullOrUndefined(ic_name)) {
      return;
    }
    this.icon = icon;
    this.ic_name = ic_name;
  }
}
@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {

  public productParams = []; // 产品 新建/编辑参数

  public productErrMsg = ''; // 错误信息

  public cover_url = []; // 图片集合

  public errPositionItem: ErrPositionItem = new ErrPositionItem();

  @ViewChild('coverImg', { static: false }) public coverImgSelectComponent: ZPhotoSelectComponent;


  constructor() { }

  ngOnInit() {
  }

  public onSelectedPicture(event: any) {
    this.errPositionItem.icon.isError = false;
    if (event === 'type_error') {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '格式错误，请重新上传！';
    } else if (event === 'size_over') {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '图片大小不得高于2M！';
    }
  }

}
