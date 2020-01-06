import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subject, timer } from 'rxjs/index';
import { debounceTime } from 'rxjs/internal/operators';
import { HttpErrorEntity } from '../../../core/http.service';
import { GlobalService } from '../../../core/global.service';
import { ServiceConfigService, ParkingEntity } from '../service-config.service';


@Component({
    selector: 'app-service-config-edit',
    templateUrl: './service-config-edit.component.html',
    styleUrls: ['./service-config-edit.component.css']
})
export class ServiceConfigEditComponent implements OnInit {

    public loading = false;

    public tag = '';

    public parkingDetailData: ParkingEntity = new ParkingEntity();

    public spotTypeStatus: SpotTypeStatusItem = new SpotTypeStatusItem();

    public configInfoErrMsg: ConfigInfoErrorMsgItem = new ConfigInfoErrorMsgItem();

    private searchText$ = new Subject<any>();

    private parking_id: string;

    // 校验支持车位类型是否有效
    public get CheckSpotTypeValid(): boolean {
        for (let spotTypeStatusIndex in this.spotTypeStatus) {
            if (this.spotTypeStatus[spotTypeStatusIndex]) {
                return true;
            }
        }
        return false;
    }

    constructor(private globalService: GlobalService, private serviceConfigService: ServiceConfigService,
                private routerInfo: ActivatedRoute, private router: Router) {
        this.routerInfo.params.subscribe((params: Params) => {
            this.parking_id = params.parking_id;
        });
    }

    public ngOnInit() {
        this.searchText$.pipe(debounceTime(500)).subscribe(() => {
            this.serviceConfigService.requestParkingDetailData(this.parking_id).subscribe(res => {
                this.parkingDetailData = new ParkingEntity(res);
                this.spotTypeStatus = new SpotTypeStatusItem(this.parkingDetailData.spot_types);
                this.getEditorData(this.parkingDetailData.instruction, this.parkingDetailData.notice);
            }, err => {
                this.globalService.httpErrorProcess(err);
            });
        });
        this.searchText$.next();
    }

    // 添加标签
    public onAddTagClick() {
        const labelList = this.parkingDetailData.tags.filter(i => i.name === this.tag);
        if (this.tag === '' || this.tag === null) {
            this.configInfoErrMsg.tagNameErrors = '请勿添加空标签!';
        } else if (labelList.length !== 0) {
            this.configInfoErrMsg.tagNameErrors = '添加的标签重复!';
        } else {
            this.parkingDetailData.tags.push(this.tag);
            this.tag = '';
            this.configInfoErrMsg.tagNameErrors = '';
        }
    }

    // 删除标签
    public onDelTag(i: number) {
        this.parkingDetailData.tags.splice(i, 1);
    }

    // 保存数据
    public onSaveFormSubmit() {
        const regPhone = /^(1[3-9])\d{9}$/g;
        const regTel = /^\d{3}-\d{8}|(1[3-9])\d{9}$/g;
        const formatValueType = (sourceValue: any): number => {
            return Number(sourceValue);
        };
        this.parkingDetailData.spot_types = [];
        this.configInfoErrMsg = new ConfigInfoErrorMsgItem();

        if (this.spotTypeStatus.isIndoorChecked) {
            if (formatValueType(this.parkingDetailData.indoor_origin_fee) <= 0) {
                this.configInfoErrMsg.indoorOriginPriceErrors = '原价必须大于0';
                return;
            }
            if (formatValueType(this.parkingDetailData.indoor_sale_fee) <= 0) {
                this.configInfoErrMsg.indoorSalePriceErrors = '售价必须大于0';
                return;
            }
            if (formatValueType(this.parkingDetailData.indoor_pre_fee) <= 0) {
                this.configInfoErrMsg.indoorPrePriceErrors = '预付费必须大于0';
                return;
            }
            if (formatValueType(this.parkingDetailData.indoor_sale_fee) > formatValueType(this.parkingDetailData.indoor_origin_fee)) {
                this.configInfoErrMsg.indoorSalePriceErrors = '售价不得大于原价！';
                return;
            }
            if (formatValueType(this.parkingDetailData.indoor_pre_fee) > formatValueType(this.parkingDetailData.indoor_sale_fee)) {
                this.configInfoErrMsg.indoorPrePriceErrors = '预付费不得大于售价！';
                return;
            }
            if (formatValueType(this.parkingDetailData.indoor_minus_fee) > formatValueType(this.parkingDetailData.indoor_pre_fee)) {
                this.configInfoErrMsg.indoorMinusPriceErrors = '下单立减不得大于预付费！';
                return;
            }
            if (formatValueType(this.parkingDetailData.indoor_spot_num_left) <= 0) {
                this.configInfoErrMsg.indoorSpotNumLeftErrors = '剩余车位数必须大于0';
                return;
            }
            this.parkingDetailData.spot_types.push('1');
        }
        if (this.spotTypeStatus.isOutdoorChecked) {
            if (formatValueType(this.parkingDetailData.origin_fee) <= 0) {
                this.configInfoErrMsg.originPriceErrors = '原价必须大于0';
                return;
            }
            if (formatValueType(this.parkingDetailData.sale_fee) <= 0) {
                this.configInfoErrMsg.salePriceErrors = '售价必须大于0';
                return;
            }
            if (formatValueType(this.parkingDetailData.pre_fee) <= 0) {
                this.configInfoErrMsg.prePriceErrors = '预付费必须大于0';
                return;
            }
            if (formatValueType(this.parkingDetailData.sale_fee) > formatValueType(this.parkingDetailData.origin_fee)) {
                this.configInfoErrMsg.salePriceErrors = '售价不得大于原价！';
                return;
            }
            if (formatValueType(this.parkingDetailData.pre_fee) > formatValueType(this.parkingDetailData.sale_fee)) {
                this.configInfoErrMsg.prePriceErrors = '预付费不得大于售价！';
                return;
            }
            if (formatValueType(this.parkingDetailData.minus_fee) > formatValueType(this.parkingDetailData.pre_fee)) {
                this.configInfoErrMsg.minusPriceErrors = '下单立减不得大于预付费！';
                return;
            }
            if (formatValueType(this.parkingDetailData.spot_num_left) <= 0) {
                this.configInfoErrMsg.spotNumLeftErrors = '剩余车位数必须大于0';
                return;
            }
            this.parkingDetailData.spot_types.push('2');
        }
        if (!regPhone.test(this.parkingDetailData.main_tel)) {
            this.configInfoErrMsg.mainTelErrors = '请输入正确的常用电话！';
            return;
        }
        if (!regTel.test(this.parkingDetailData.standby_tel)) {
            this.configInfoErrMsg.standbyTelErrors = '请输入正确的备用电话！';
            return;
        }
        if (this.parkingDetailData.main_tel === this.parkingDetailData.standby_tel) {
            this.configInfoErrMsg.standbyTelErrors = '备用电话与常用电话重复！';
            return;
        }
        if (!CKEDITOR.instances.orderInstructionEditor.getData()) {
            this.configInfoErrMsg.instructionErrors = '请输入预约说明！';
            return;
        }
        if (!CKEDITOR.instances.purchaseInstructionEditor.getData()) {
            this.configInfoErrMsg.noticeErrors = '请输入购买须知！';
            return;
        }

        this.parkingDetailData.instruction = CKEDITOR.instances.orderInstructionEditor.getData().replace('/\r\n/g', '').replace(/\n/g, '');
        this.parkingDetailData.notice = CKEDITOR.instances.purchaseInstructionEditor.getData().replace('/\r\n/g', '').replace(/\n/g, '');

        this.serviceConfigService.requestUpdateServiceConfigData(this.parkingDetailData, this.parking_id).subscribe(() => {
            this.globalService.promptBox.open('服务配置保存成功！');
            this.searchText$.next();
            timer(2000).subscribe(() => this.router.navigateByUrl('/order-parking/service-config'));
        }, err => {
            this.handleErrorFunc(err);
        });
    }

    // 点击取消按钮取消编辑
    public onCancelBtn() {
        this.router.navigateByUrl('/order-parking/service-config');
    }

    // 富文本数据处理
    private getEditorData(instruction: string, notice: string) {
        CKEDITOR.instances.orderInstructionEditor.destroy(true);
        CKEDITOR.instances.purchaseInstructionEditor.destroy(true);
        CKEDITOR.replace('orderInstructionEditor', {width: 1400}).setData(instruction);
        CKEDITOR.replace('purchaseInstructionEditor', {width: 1400}).setData(notice);
    }

    // 处理错误信息
    private handleErrorFunc(err) {
        if (!this.globalService.httpErrorProcess(err)) {
            if (err.status === 422) {
                const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
                for (const content of error.errors) {
                    let field = '';
                    switch (content.field) {
                        case 'tags':
                            field = '标签';
                            break;
                        case 'origin_fee':
                        case 'indoor_origin_fee':
                            field = '原价/日';
                            break;
                        case 'sale_fee':
                        case 'indoor_sale_fee':
                            field = '售价/日';
                            break;
                        case 'pre_fee':
                        case 'indoor_pre_fee':
                            field = '预付';
                            break;
                        case 'minus_fee':
                        case 'indoor_minus_fee':
                            field = '下单立减';
                            break;
                        case 'main_tel':
                            field = '常用联系电话';
                            break;
                        case 'standby_tel':
                            field = '备用联系电话';
                            break;
                        case 'instruction':
                            field = '预约说明';
                            break;
                        case 'notice':
                            field = '购买须知';
                            break;
                        case 'indoor_spot_num_left':
                        case 'spot_num_left':
                            field = '剩余车位数';
                            break;
                    }
                    if (content.code === 'missing_field') {
                        this.globalService.promptBox.open(`${field}字段未填写!`, null, 2000, null, false);
                        return;
                    } else if (content.code === 'invalid') {
                        this.globalService.promptBox.open(`${field}字段输入错误`, null, 2000, null, false);
                    } else if (content.resource === 'fee' && content.code === 'not_allow') {
                        this.globalService.promptBox.open('金额填写不正确', null, 2000, null, false);
                    } else {
                        this.globalService.promptBox.open('服务配置保存失败,请重试!', null, 2000, null, false);
                    }
                }
            }
        }
    }
}

// 支持车位类型类别
export class SpotTypeStatusItem {
    public isIndoorChecked: boolean = false;
    public isOutdoorChecked: boolean = false;

    constructor(spotType: Array<string> = []) {
        spotType.forEach(spotTypeItem => {
            // '1':室内车位 '2':室外车位
            if (spotTypeItem === '1') {
                this.isIndoorChecked = true;
            } else if (spotTypeItem === '2') {
                this.isOutdoorChecked = true;
            }
        });
    }
}

// 错误提示消息
export class ConfigInfoErrorMsgItem {
    public tagNameErrors: string = ''; // 标签错误消息
    public originPriceErrors: string = ''; // 室外原价错误消息
    public salePriceErrors: string = ''; // 室外售价错误消息
    public prePriceErrors: string = ''; // 室外预付费错误消息
    public minusPriceErrors: string = ''; // 室外下单立减错误消息
    public spotNumLeftErrors: string = ''; // 室外剩余车位数错误消息
    public indoorOriginPriceErrors: string = ''; // 室内原价错误消息
    public indoorSalePriceErrors: string = ''; // 室内售价错误消息
    public indoorPrePriceErrors: string = ''; // 室内预付费错误消息
    public indoorMinusPriceErrors: string = ''; // 室内下单立减错误消息
    public indoorSpotNumLeftErrors: string = ''; // 室内剩余车位数错误消息
    public minDaysErrors: string = ''; // 最低预付错误消息
    public mainTelErrors: string = ''; // 常用电话错误消息
    public standbyTelErrors: string = ''; // 备用电话误消息
    public instructionErrors: string = ''; // 预约说明错误消息
    public noticeErrors: string = ''; // 购买须知错误消息
}
