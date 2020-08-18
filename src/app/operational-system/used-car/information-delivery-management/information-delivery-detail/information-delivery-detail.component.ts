import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrMessageBase, ErrMessageGroup } from '../../../../../utils/error-message-helper';
import { ProCityDistSelectComponent, RegionEntity } from '../../../../share/components/pro-city-dist-select/pro-city-dist-select.component';
import { MapItem, MapType } from '../../../../share/components/z-map-select-point/z-map-select-point.component';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { ImageExampleComponent } from '../components/image-example/image-example.component';
import { ZMapSelectPointV2Component } from '../../../../share/components/z-map-select-point-v2/z-map-select-point-v2.component';
import { InformationDeliveryManagementModel } from '../information-delivery-management.model';
import {
    InformationDeliveryCarParam,
    InformationDeliveryManagementParams,
    InformationDeliveryManagementService
} from '../information-delivery-management.service';
import { ConsultationEntity, MerchantManagementEntity } from '../../merchant-management/merchant-management.service';
import { TagManagementEntity } from '../../tag-management/tag-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import { VehicleManagementHttpService } from '../../../../store-maintenance/vehicle-management/vehicle-management-http.service';
import { timer } from 'rxjs';

@Component({
    selector: 'app-information-delivery-detail',
    templateUrl: './information-delivery-detail.component.html',
    styleUrls: ['./information-delivery-detail.component.css']
})
export class InformationDeliveryDetailComponent implements OnInit {
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
    // @ViewChild(ImageExampleComponent, {static: false}) public imageExampleComponent: ImageExampleComponent;
    @ViewChild(ZMapSelectPointV2Component, {static: true}) public zMapSelectPointV2Component: ZMapSelectPointV2Component;
    public carManagementModel: InformationDeliveryManagementModel = new InformationDeliveryManagementModel();
    private car_info_id = '';
    public loading = true; // 标记loading
    public carDetail: InformationDeliveryManagementParams = new InformationDeliveryManagementParams();
    public imageList: Array<string> = [];
    public selectedMerchant: MerchantManagementEntity = new MerchantManagementEntity();
    public selectTagList: Array<TagManagementEntity> = [];
    public isTransferFee = false; // 是否包含过户费
    public carParam: InformationDeliveryCarParam = new InformationDeliveryCarParam();
    public isHasTag = false;
    public lastUrl = '../';

    constructor(private route: ActivatedRoute,
                private router: Router,
                private globalService: GlobalService,
                private vehicleService: VehicleManagementHttpService,
                private informationDeliveryManagementService: InformationDeliveryManagementService) {
        this.route.paramMap.subscribe(map => {
            this.car_info_id = map.get('car_info_id');
            const label_id = map.get('label_id');
            this.lastUrl = `../../../tag-car-list/${label_id}`;
        });
        this.route.queryParamMap.subscribe(map => {
            this.isHasTag = !!map.get('isHasTag');
        });
    }

    public ngOnInit() {
        if (this.car_info_id) {
            this.requestInformationDeliveryDetail();
        }
    }

    /**
     * 查看详情
     * @private
     */
    private requestInformationDeliveryDetail() {
        this.carManagementModel.initData();
        this.informationDeliveryManagementService.requestInformationDeliveryDetailData(this.car_info_id).subscribe(data => {
            this.loading = false;
            this.carParam = data.car_param.clone();
            this.carDetail = new InformationDeliveryManagementParams(data);
            const telephone = this.carDetail.telephone.split(',')[0];
            this.carDetail.telephone = telephone;
            this.selectTagList = data.labels;
            this.isTransferFee = data.contain_transfer_fee === 1;
            this.selectedMerchant = data.merchant;
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
                CKEDITOR.instances.informationDeliveryEditor1.setData(tempContent);
                CKEDITOR.instances.informationDeliveryEditor1.setReadOnly(true);
            });
            this.mapObj.type = MapType.view;
            this.mapObj.hasDetailedAddress = true;
            this.mapObj.address = this.proCityDistSelectComponent.selectedAddress + this.carDetail.address;
            this.mapObj.cityCode = this.proCityDistSelectComponent.regionsObj.region_id;
            this.zMapSelectPointV2Component.openMap();
        }, err => {
            this.loading = false;
            this.globalService.httpErrorProcess(err);
        });
    }

}
