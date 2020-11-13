import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import { ErrMessageBase, ErrMessageGroup } from '../../../../../../utils/error-message-helper';
import { ZPhotoSelectComponent } from '../../../../../share/components/z-photo-select/z-photo-select.component';
import {
    ProCityDistSelectComponent,
    RegionEntity
} from '../../../../../share/components/pro-city-dist-select/pro-city-dist-select.component';
import {
    MapItem,
    MapType,
} from '../../../../../share/components/z-map-select-point/z-map-select-point.component';
import { ZMapSelectPointV2Component } from '../../../../../share/components/z-map-select-point-v2/z-map-select-point-v2.component';
import { timer } from 'rxjs';
import { SelectTagComponent } from '../../../used-car/information-delivery-management/components/select-tag/select-tag.component';
import {
    InformationDeliveryManagementService,
    InformationDeliveryManagementParams
} from '../../../used-car/information-delivery-management/information-delivery-management.service';
import { TagManagementEntity } from '../../../used-car/tag-management/tag-management.service';

@Component({
    selector: 'app-information-delivery-edit',
    templateUrl: './information-delivery-edit.component.html',
    styleUrls: ['./information-delivery-edit.component.css']
})
export class InformationDeliveryEditComponent implements OnInit {
    public levelName = '创建信息';
    public imgReg = /(png|jpg|jpeg|gif)$/; // 默认图片校验格式
    public errMessageGroup: ErrMessageGroup = new ErrMessageGroup(); // 错误处理
    public regionsObj: RegionEntity = new RegionEntity(); // 基本信息-门店地址
    public mapObj: MapItem = {
        point: [],
        type: MapType.view,
        address: '',
        hasDetailedAddress: false,
        cityCode: ''
    };
    @ViewChild('informationDeliveryImg', {static: false}) public informationDeliveryImgSelectComponent: ZPhotoSelectComponent;
    @ViewChild('projectInfoPro', {static: true}) public proCityDistSelectComponent: ProCityDistSelectComponent;
    @ViewChild(ZMapSelectPointV2Component, {static: true}) public zMapSelectPointV2Component: ZMapSelectPointV2Component;
    @ViewChild(SelectTagComponent, {static: true}) public selectTagComponent: SelectTagComponent;
    public loading = true; // 标记loading
    public carDetail: InformationDeliveryManagementParams = new InformationDeliveryManagementParams();
    public imageList: Array<string> = [];
    public selectTagList: Array<TagManagementEntity> = [];
    private car_info_id = '';

    constructor(private route: ActivatedRoute,
                private router: Router,
                private globalService: GlobalService,
                private informationDeliveryManagementService: InformationDeliveryManagementService) {
        this.route.paramMap.subscribe(map => {
            this.car_info_id = map.get('car_info_id');
        });
    }

    public ngOnInit() {
        this.initData();
        this.levelName = this.car_info_id ? '编辑信息' : '创建信息';
    }

    /**
     * 校验发布按钮
     */
    public get checkDisabledValid() {
        return this.carDetail.lon && this.carDetail.lat && this.CheckImgValid;
    }

    /**
     * 搜索
     */
    public get isDisabledSearch(): boolean {
        return !(this.regionsObj.province && this.regionsObj.city && this.regionsObj.district && this.carDetail.address);
    }

    /**
     * 校验是否选择了图片
     * @returns boolean
     */
    private get CheckImgValid(): boolean {
        if (this.informationDeliveryImgSelectComponent) {
            const images = this.informationDeliveryImgSelectComponent.imageList.map(item => item.sourceUrl);
            if (images.length > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * 选择标签
     * @param event
     */
    public onSelectedTag(event) {
        this.selectTagList = event;
    }

    /**
     * 删除标签
     * @param index
     */
    public onClickDeleteTag(index: number) {
        this.selectTagList.splice(index, 1);
    }

    /**
     * 选择标签
     */
    public onClickTag() {
        const selectTagList = this.selectTagList.map(item => item.label_id);
        this.selectTagComponent.onShowTagList(selectTagList);
    }

    /** 初始化错误信息 */
    public clearErr(): void {
        this.errMessageGroup.errJson = {};
        this.errMessageGroup.errJson.images = new ErrMessageBase();
    }

    /**
     * 搜索
     * @param isSearch
     */
    public onClickReach(isSearch = true) {
        this.mapObj.type = MapType.edit;
        if (isSearch) {
            this.mapObj.point = [];
        }
        this.mapObj.hasDetailedAddress = true;
        this.mapObj.address = this.proCityDistSelectComponent.selectedAddress + this.carDetail.address;
        this.mapObj.cityCode = this.proCityDistSelectComponent.regionsObj.region_id;
        this.zMapSelectPointV2Component.openMap(!!this.mapObj.address);
    }

    /**
     * 选择marker
     * @param event
     */
    public selectedMarkerInfo(event) {
        if (event.selectedMarker.point.lng && event.selectedMarker.point.lat) {
            this.carDetail.lon = event.selectedMarker.point.lng;
            this.carDetail.lat = event.selectedMarker.point.lat;
        }
        this.carDetail.province = this.regionsObj.province;
        this.carDetail.city = this.regionsObj.city;
        this.carDetail.district = this.regionsObj.district;
        this.carDetail.region_id = this.regionsObj.region_id;
    }

    /** 选择图片 */
    public onSelectedPicture(event: any, key: string) {
        if (event === 'type_error') {
            this.errMessageGroup.errJson[key].errMes = '格式错误，请重新上传！';
        } else if (event === 'size_over') {
            this.errMessageGroup.errJson[key].errMes = '图片大小不得高于2M！';
        }
    }

    /**
     * 返回列表
     */
    public goToListPage() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

    public onEditFormSubmit() {
        this.carDetail.label_ids = this.selectTagList.map(item => item.label_id).join(',');
        const params: InformationDeliveryManagementParams = JSON.parse(JSON.stringify(this.carDetail));
        const vinReg = /^(?!(?:\d+|[a-zA-Z]+)$)[\dA-HJ-NPR-Z]{17}$/;
        this.clearErr();
        if (!vinReg.test(params.vin)) {
            this.globalService.promptBox.open('VIN码是由17位数字和因为字母组合，不包含QIO！', null, 2000, null, false);
            return;
        } else if (!params.color) {
            this.globalService.promptBox.open('请选择车辆颜色！', null, 2000, null, false);
            return;
        } else if (!params.car_type) {
            this.globalService.promptBox.open('请选择车辆类型！', null, 2000, null, false);
            return;
        }
        params.telephone = params.telephone.split(',')[0];
        params.registration_time = new Date(params.registration_time).getTime() / 1000;
        params.check_deadline = new Date(params.check_deadline).getTime() / 1000;
        params.compulsory_traffic_insurance_deadline = new Date(params.compulsory_traffic_insurance_deadline).getTime() / 1000;
        params.commercial_insurance_deadline = new Date(params.commercial_insurance_deadline).getTime() / 1000;
        params.mileage = parseInt((parseFloat(params.mileage) * 10000) as any);
        params.price = parseInt((parseFloat(params.price) * 10000) as any);
        this.informationDeliveryImgSelectComponent.upload().subscribe(() => {
            params.images = this.informationDeliveryImgSelectComponent.imageList.map(i => i.sourceUrl).join(',');
            this.informationDeliveryManagementService.requestAddInformationDeliveryData(params, this.car_info_id).subscribe(data => {
                this.globalService.promptBox.open(this.car_info_id ? '编辑成功！' : '创建成功', () => {
                    this.goToListPage();
                });
            }, err => {
                this.globalService.httpErrorProcess(err);
            });
        }, err => {
            this.upLoadErrMsg(err);
        });
    }

    // 上传图片/视频错误信息处理
    private upLoadErrMsg(err: any) {
        if (!this.globalService.httpErrorProcess(err)) {
            if (err.status === 422) {
                this.globalService.promptBox.open('参数错误，可能文件格式错误！', null, 2000, null, false);
            } else if (err.status === 413) {
                this.globalService.promptBox.open('上传资源文件太大，服务器无法保存！', null, 2000, null, false);
            } else if (err.status === 500) {
                this.globalService.promptBox.open('服务器出问题了，请刷新后再次尝试！', null, 2000, null, false);
            } else if (err.status === 404) {
                this.globalService.promptBox.open('请求地址错误！', null, 2000, null, false);
            }
        }
    }

    /**
     * 初始化
     * @private
     */
    private initData() {
        this.clearErr();
        if (!this.car_info_id) {
            this.loading = false;
            this.mapObj.point = this.zMapSelectPointV2Component.defaultPoint;
            this.zMapSelectPointV2Component.openMap();
        } else {
            this.requestInformationDeliveryDetail();
        }
    }

    /**
     * 查看详情
     * @private
     */
    private requestInformationDeliveryDetail() {
        this.informationDeliveryManagementService.requestInformationDeliveryDetailData(this.car_info_id).subscribe(data => {
            this.loading = false;
            this.carDetail = new InformationDeliveryManagementParams(data);
            this.selectTagList = data.labels;
            this.mapObj.point = [parseFloat(data.lon), parseFloat(data.lat)];
            this.regionsObj = new RegionEntity(data);
            this.imageList = data.images ? data.images.split(',') : [];
            this.onClickReach(false);
        }, err => {
            this.loading = false;
            this.globalService.httpErrorProcess(err);
        });
    }

}
