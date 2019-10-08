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
  public mapObj: MapItem = {
    point: [],
    type: MapType.edit,
    address: '',
    hasDetailedAddress: false,
    cityCode: ''
  };

  public parkingDetail = {
    address: '',
    lon: '',
    lat: '',
    region_id: ''
  };

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
        name: '赠项目门票', time: '提前1小时', costIncludes: '15项自费项目任选其一门票一张',
        useInstructions: '至5月31日；周一周二特惠套票159元', withdrawalNotice: '未验证可退改', marketPrice: 300,
        proposalPrice: 230, settlementPrice: 260, price: 245
      },
      {
        name: '温泉门票', time: '提前2小时', costIncludes: '25项自费项目任选其一门票一张',
        useInstructions: '至5月31日；周一周二特惠套票159元', withdrawalNotice: '未验证可退改', marketPrice: 300,
        proposalPrice: 230, settlementPrice: 260, price: 245
      },
      {
        name: '游乐场门票', time: '提前3小时', costIncludes: '35项自费项目任选其一门票一张',
        useInstructions: '至5月31日；周一周二特惠套票159元', withdrawalNotice: '未验证可退改', marketPrice: 300,
        proposalPrice: 230, settlementPrice: 260, price: 245
      },
      {
        name: '洗浴门票', time: '提前4小时', costIncludes: '45项自费项目任选其一门票一张',
        useInstructions: '至5月31日；周一周二特惠套票159元', withdrawalNotice: '未验证可退改', marketPrice: 300,
        proposalPrice: 230, settlementPrice: 260, price: 245
      },
    ];
  }

  // 省市区code改变时清空详细地址等数据
  public onRegionIdChanged(event) {
    // this.parkingDetail.region_id = event;
    this.parkingDetail.address = this.parkingDetail.lon = this.parkingDetail.lat = '';
  }

  // 打开地图组件
  public openMapModal() {
    this.mapObj.point = [];
    this.parkingDetail.address = this.parkingDetail.address ? this.parkingDetail.address : '';
    if (this.parkingDetail.address) {
      this.mapObj.hasDetailedAddress = true;
    }
    if (this.parkingDetail.lon && this.parkingDetail.lat) {
      this.mapObj.point.push(Number(this.parkingDetail.lon));
      this.mapObj.point.push(Number(this.parkingDetail.lat));
    }
    this.mapObj.address = this.proCityDistSelectComponent.selectedAddress + this.parkingDetail.address;
    this.zMapSelectPointComponent.openMap();
  }

  // 获取地图选择结果
  public getSelectedMarker(event) {
    if (event.selectedMarker && event.selectedMarker.regeocode) {
      const regeocode = event.selectedMarker.regeocode;
      const addressComponent = regeocode.addressComponent;
      this.parkingDetail.region_id = addressComponent.adcode;
      // this.parkingDetail.address = regeocode.formattedAddress.replace(addressComponent.province + addressComponent.city + addressComponent.district, '');
      this.parkingDetail.lon = event.selectedMarker.point.lng;
      this.parkingDetail.lat = event.selectedMarker.point.lat;
    }
  }

}
