import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import { TemplateManagementService } from '../../../operation/push-message-management/template-management/template-management.service';
import { TemplatePushManagementService } from '../../../operation/push-message-management/template-push-management/template-push-management.service';
import { ErrMessageGroup } from '../../../../../utils/error-message-helper';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { differenceInCalendarDays } from 'date-fns';
import {
    ProCityDistSelectComponent,
    RegionEntity
} from '../../../../share/components/pro-city-dist-select/pro-city-dist-select.component';
import {
    MapItem,
    MapType,
} from '../../../../share/components/z-map-select-point/z-map-select-point.component';
import { ZMapSelectPointV2Component } from '../../../../share/components/z-map-select-point-v2/z-map-select-point-v2.component';
import { AccessoryLibraryService } from '../../../../store-maintenance/accessory-library/accessory-library.service';
import { SelectBrandComponent } from '../components/select-brand/select-brand.component';
import { VehicleManagementHttpService } from '../../../../store-maintenance/vehicle-management/vehicle-management-http.service';

@Component({
    selector: 'app-information-delivery-edit',
    templateUrl: './information-delivery-edit.component.html',
    styleUrls: ['./information-delivery-edit.component.css']
})
export class InformationDeliveryEditComponent implements OnInit {
    public levelName = '创建信息';
    public imgReg = /(png|jpg|jpeg|gif)$/; // 默认图片校验格式
    public errMessageGroup: ErrMessageGroup = new ErrMessageGroup(); // 错误处理
    @ViewChild('commodityImg', {static: false}) public commodityImgSelectComponent: ZPhotoSelectComponent;
    @ViewChild('projectInfoPro', {static: true}) public proCityDistSelectComponent: ProCityDistSelectComponent;
    public regionsObj: RegionEntity = new RegionEntity(); // 基本信息-门店地址
    public carColorList: Array<CarColorItem> = [];
    public registration_time = '';
    public mapObj: MapItem = {
        point: [],
        type: MapType.view,
        address: '',
        hasDetailedAddress: false,
        cityCode: ''
    };
    @ViewChild(ZMapSelectPointV2Component, {static: true}) public zMapSelectPointV2Component: ZMapSelectPointV2Component;
    @ViewChild(SelectBrandComponent, {static: true}) public selectBrandComponent: SelectBrandComponent;
    public checkOptions = [
        {label: 'CPS导航', value: 1, checked: false},
        {label: '倒车影像', value: 2, checked: false},
        {label: '定速巡航', value: 3, checked: false},
        {label: '多媒体控制', value: 4, checked: false},
        {label: '行车显示屏', value: 5, checked: false},
        {label: '前雷达', value: 6, checked: false},
        {label: '全景摄像头', value: 7, checked: false},
        {label: '胎压监测', value: 6, checked: false},
        {label: '氙气大灯', value: 7, checked: false},
        {label: '运动座椅', value: 6, checked: false},
        {label: '车内氛围灯', value: 7, checked: false},
        {label: '车载电视', value: 6, checked: false},
        {label: '铝合金轮圈', value: 7, checked: false},
        {label: '车载冰箱', value: 7, checked: false}
    ];
    private id = '';

    constructor(private route: ActivatedRoute,
                private router: Router,
                private globalService: GlobalService,
                private vehicleService: VehicleManagementHttpService,
                private templateManagementService: TemplateManagementService,
                private templatePushManagementService: TemplatePushManagementService) {
        this.route.paramMap.subscribe(map => {
            this.id = map.get('id');
        });
    }

    public ngOnInit() {
        this.initData();
        this.levelName = this.id ? '编辑信息' : '创建信息';
    }

    // 推荐设置打开所属厂商选择组件
    public onClickBrand(): void {
        const data = {
            car_series_id: '05720b6c27fd11eaaca60242ac150006',
            car_param_id: '0572f6bc27fd11eaaca60242ac150006',
            car_series_list: [],
        };
        // 获取推荐设置
        this.vehicleService.requestCarDetail(data.car_series_id, data.car_param_id).subscribe(res => {
            data.car_series_list = res;

            this.selectBrandComponent.open(data, () => {
                // this.accessoryNewList = [];
                // this.noResultText = '数据加载中...';
                // this.searchText$.next();
            });
        }, error => {
            this.globalService.httpErrorProcess(error);
        });

    }

    public onClickReach() {
        this.mapObj.type = MapType.edit;
        this.mapObj.point = [];
        // this.currentBusiness.address = this.currentBusiness.address ? this.currentBusiness.address : '';
        // if (this.currentBusiness.address) {
        //     this.mapObj.hasDetailedAddress = true;
        // }
        this.mapObj.hasDetailedAddress = true;
        // if (this.currentBusiness.lon && this.currentBusiness.lat) {
        //     this.mapObj.point.push(Number(this.currentBusiness.lon));
        //     this.mapObj.point.push(Number(this.currentBusiness.lat));
        // }
        this.mapObj.address = this.proCityDistSelectComponent.selectedAddress + '昂立信息园';
        this.mapObj.cityCode = this.proCityDistSelectComponent.regionsObj.region_id;
        this.zMapSelectPointV2Component.openMap();
    }

    // 上架开始时间的禁用部分
    public disabledRegistrationTime = (startValue: Date): boolean => {
        return differenceInCalendarDays(new Date(), startValue) > 0;
    };

    private initData() {
        this.mapObj.point = this.zMapSelectPointV2Component.defaultPoint;
        this.zMapSelectPointV2Component.openMap();
        this.carColorList = [
            new CarColorItem('黑色', 1),
            new CarColorItem('白色', 2),
            new CarColorItem('红色', 3),
            new CarColorItem('灰色', 4),
            new CarColorItem('银色', 5),
            new CarColorItem('蓝色', 1),
            new CarColorItem('黄色', 2),
            new CarColorItem('棕色', 3),
            new CarColorItem('绿色', 4),
            new CarColorItem('橙色', 5),
            new CarColorItem('紫色', 2),
            new CarColorItem('香槟', 1),
            new CarColorItem('金色', 3),
            new CarColorItem('粉红', 4),
            new CarColorItem('其他颜色', 5),
        ];
    }

    /** 选择图片 */
    public onSelectedPicture(event: any, key: string) {
        if (event === 'type_error') {
            this.errMessageGroup.errJson[key].errMes = '格式错误，请重新上传！';
        } else if (event === 'size_over') {
            this.errMessageGroup.errJson[key].errMes = '图片大小不得高于2M！';
        }
    }

    public onEditFormSubmit() {

    }

    /**
     * 返回列表
     */
    public goToListPage() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

}

class CarColorItem {
    public name = '';
    public value = null;

    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }
}
