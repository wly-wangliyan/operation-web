import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MapItem,
  MapType,
  ZMapSelectPointComponent
} from '../../../../share/components/z-map-select-point/z-map-select-point.component';
import { ProCityDistSelectComponent } from '../../../../share/components/pro-city-dist-select/pro-city-dist-select.component';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  constructor() { }

  public productTicketList: Array<any> = [];
  public isShowInsutructions = false;
  @ViewChild('applicationPro', { static: true }) public proCityDistSelectComponent: ProCityDistSelectComponent;

  @ViewChild(ZMapSelectPointComponent, { static: true }) public zMapSelectPointComponent: ZMapSelectPointComponent;

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
    console.log(1, this.productTicketList);

  }

  public onHideInsutructions(i: number) {
    this.productTicketList[i].isShowInsutructions = false;
  }

}
