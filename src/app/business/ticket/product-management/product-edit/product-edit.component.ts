import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../core/global.service';
import { isUndefined } from 'util';
export class ErrMessageItem {
  public isError = false;
  public errMes: string;

  constructor(isError?: boolean, errMes?: string) {
    if (!isError || isUndefined(errMes)) {
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
    if (isUndefined(icon) || isUndefined(ic_name)) {
      return;
    }
    this.icon = icon;
    this.ic_name = ic_name;
  }
}

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  constructor(private globalService: GlobalService,
  ) { }

  public productTicketList: Array<any> = [];
  public isShowInsutructions = false;
  public errPositionItem: ErrPositionItem = new ErrPositionItem();

  ngOnInit() {
    setTimeout(() => {
      CKEDITOR.replace('editor1');
      CKEDITOR.replace('editor2');
      CKEDITOR.replace('editor3');
    }, 0);
    this.productTicketList = [
      {
        name: '赠项目门票', isShowInsutructions: false, time: '提前1小时', costIncludes: '15项自费项目任选其一门票一张,至5月31日；周一周二特惠套票159元,15项自费项目任选其一门票一张,至5月31日；周一周二特惠套票159元,15项自费项目任选其一门票一张,至5月31日；周一周二特惠套票159元',
        useInstructions: '至5月31日；周一周二特惠套票159元', withdrawalNotice: '未验证可退改', marketPrice: 300,
        proposalPrice: 230, settlementPrice: 260, price: 245, status: 1
      },
      {
        name: '温泉门票', isShowInsutructions: false, time: '提前2小时', costIncludes: '25项自费项目任选其一门票一张,至5月31日；周一周二特惠套票159元',
        useInstructions: '至5月31日；周一周二特惠套票159元', withdrawalNotice: '未验证可退改', marketPrice: 300,
        proposalPrice: 230, settlementPrice: 260, price: 245, status: 2
      },
      {
        name: '游乐场门票', isShowInsutructions: false, time: '提前3小时', costIncludes: '35项自费项目任选其一门票一张,至5月31日；周一周二特惠套票159元',
        useInstructions: '至5月31日；周一周二特惠套票159元', withdrawalNotice: '未验证可退改', marketPrice: 300,
        proposalPrice: 230, settlementPrice: 260, price: 245, status: 2
      },
      {
        name: '洗浴门票', isShowInsutructions: false, time: '提前4小时', costIncludes: '45项自费项目任选其一门票一张,至5月31日；周一周二特惠套票159元',
        useInstructions: '至5月31日；周一周二特惠套票159元', withdrawalNotice: '未验证可退改', marketPrice: 300,
        proposalPrice: 230, settlementPrice: 260, price: 245, status: 1
      },
    ];
  }

  public onShowInsutructions(i: number) {
    this.productTicketList[i].isShowInsutructions = true;

  }

  public onHideInsutructions(i: number) {
    this.productTicketList[i].isShowInsutructions = false;
  }

  public onReImportData() {
    this.globalService.confirmationBox.open('提示', '重新导入会覆盖现有票务详情，确定导入？', () => {
    });
  }

  // 清空
  public clear() {
    this.errPositionItem.icon.isError = false;
    this.errPositionItem.ic_name.isError = false;
  }

  // 选择图片时校验图片格式
  public onSelectedPicture(event) {
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
