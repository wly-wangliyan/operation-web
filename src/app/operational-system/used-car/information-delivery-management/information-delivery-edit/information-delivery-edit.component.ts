import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import { ErrMessageBase, ErrMessageGroup } from '../../../../../utils/error-message-helper';
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
import { SelectBrandComponent } from '../components/select-brand/select-brand.component';
import { VehicleManagementHttpService } from '../../../../store-maintenance/vehicle-management/vehicle-management-http.service';
import { ImageExampleComponent } from '../components/image-example/image-example.component';
import { SelectTagComponent } from '../components/select-tag/select-tag.component';
import { InformationDeliveryManagementModel } from '../information-delivery-management.model';
import {
    InformationDeliveryCarParam,
    InformationDeliveryManagementParams,
    InformationDeliveryManagementService
} from '../information-delivery-management.service';
import { SelectMerchantComponent } from '../components/select-merchant/select-merchant.component';
import { ConsultationEntity, MerchantManagementEntity } from '../../merchant-management/merchant-management.service';
import { TagManagementEntity } from '../../tag-management/tag-management.service';
import { timer } from 'rxjs';

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
    @ViewChild(ImageExampleComponent, {static: false}) public imageExampleComponent: ImageExampleComponent;
    @ViewChild(ZMapSelectPointV2Component, {static: true}) public zMapSelectPointV2Component: ZMapSelectPointV2Component;
    @ViewChild(SelectBrandComponent, {static: true}) public selectBrandComponent: SelectBrandComponent;
    @ViewChild(SelectTagComponent, {static: true}) public selectTagComponent: SelectTagComponent;
    @ViewChild('chooseMerchant', {static: false}) public selectMerchantComponent: SelectMerchantComponent;
    public carManagementModel: InformationDeliveryManagementModel = new InformationDeliveryManagementModel();
    public car_info_id = '';
    public loading = true; // 标记loading
    public carDetail: InformationDeliveryManagementParams = new InformationDeliveryManagementParams();
    public imageList: Array<string> = [];
    public selectedMerchant: MerchantManagementEntity = new MerchantManagementEntity();
    public consultationList: Array<ConsultationEntity> = [];
    public selectTagList: Array<TagManagementEntity> = [];
    public isTransferFee = false; // 是否包含过户费
    public carParam: InformationDeliveryCarParam = new InformationDeliveryCarParam();

    constructor(private route: ActivatedRoute,
                private router: Router,
                private globalService: GlobalService,
                private vehicleService: VehicleManagementHttpService,
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
        if (this.carDetail.registration_time && this.carParam.car_param_id && this.carDetail.merchant_id && this.carDetail.lon && this.carDetail.lat && !this.isAlreadyFill && this.CheckImgValid) {
            return true;
        } else {
            return false;
        }
    }

    // 富文本编辑器是否有值
    public get isAlreadyFill(): boolean {
        if (CKEDITOR.instances.informationDeliveryCreate) {
            const informationDeliveryCreate = !!CKEDITOR.instances.informationDeliveryCreate.getData();
            return !informationDeliveryCreate;
        } else {
            return true;
        }
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
     * 选择商户
     * @param event
     */
    public onSelectedMerchant(event) {
        this.selectedMerchant = event;
        this.carDetail.telephone = '';
        this.carDetail.contact = '';
        this.consultationList = [];
        this.carDetail.merchant_id = this.selectedMerchant.merchant_id;
        if (event.consult_info && event.consult_info.length > 0) {
            event.consult_info.forEach(item => {
                const temp = new ConsultationEntity();
                temp.name = item.name;
                temp.telephone = item.telephone;
                this.consultationList.push(temp);
            });
        } else {
            this.consultationList = [new ConsultationEntity()];
        }
    }

    /**
     * 选择标签
     * @param event
     */
    public onSelectedTag(event) {
        this.selectTagList = event;
    }

    /**
     * 选择电话
     * @param event
     */
    public onChangeTelephone(event) {
        const value = event.target.value;
        if (value) {
            const index = value.split(',')[1];
            this.carDetail.contact = this.consultationList[parseFloat(index)].name;
        }
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

    public disabledRegistrationTime = (startValue: Date): boolean => {
        return differenceInCalendarDays(new Date(), startValue) < 0;
    };


    public disabledTime = (startValue: Date): boolean => {
        return differenceInCalendarDays(new Date(), startValue) > 0;
    };

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
        params.contain_transfer_fee = this.isTransferFee ? 1 : 2;
        params.registration_time = new Date(params.registration_time).getTime() / 1000;
        params.check_deadline = new Date(params.check_deadline).getTime() / 1000;
        params.compulsory_traffic_insurance_deadline = new Date(params.compulsory_traffic_insurance_deadline).getTime() / 1000;
        params.commercial_insurance_deadline = new Date(params.commercial_insurance_deadline).getTime() / 1000;
        params.mileage = parseFloat(params.mileage) * 10000;
        params.price = parseFloat(params.price) * 10000;
        params.car_description = CKEDITOR.instances.informationDeliveryCreate.getData().replace('/\r\n/g', '').replace(/\n/g, '');
        const _checkOptions = this.carManagementModel.checkOptions.filter(item => item.checked);
        params.extra_info = _checkOptions.map(item => item.value).join(',');
        this.informationDeliveryImgSelectComponent.upload().subscribe(() => {
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
        this.carManagementModel.initData();
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
            this.carParam = data.car_param.clone();
            this.carDetail = new InformationDeliveryManagementParams(data);
            this.selectTagList = data.labels;
            this.isTransferFee = data.contain_transfer_fee === 1;
            this.selectedMerchant = data.merchant;
            this.consultationList = data.merchant.consult_info || [];
            this.mapObj.point = [parseFloat(data.lon), parseFloat(data.lat)];
            this.regionsObj = new RegionEntity(data);
            this.imageList = data.images ? data.images.split(',') : [];
            const _checkOptions = data.extra_info.split(',');
            this.carManagementModel.checkOptions.forEach(item => {
                if (_checkOptions.indexOf(item.value.toString()) > -1) {
                    item.checked = true;
                }
            });
            timer(1000).subscribe(() => {
                const tempContent = data.car_description.replace('/\r\n/g', '').replace(/\n/g, '');
                CKEDITOR.instances.informationDeliveryCreate.setData(tempContent);
            });
            this.onClickReach(false);
        }, err => {
            this.loading = false;
            this.globalService.httpErrorProcess(err);
        });
    }

}
