import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { ErrPositionItem } from '../../../brand-management/brand-list/brand-edit/brand-edit.component';
import { ActivityEntity, ActivitySettingsService } from '../../activity-settings.service';
import { HttpErrorEntity } from '../../../../core/http.service';

@Component({
    selector: 'app-wash-car-edit',
    templateUrl: './wash-car-edit.component.html',
    styleUrls: ['./wash-car-edit.component.css']
})
export class WashCarEditComponent implements OnInit {

    constructor(
        private globalService: GlobalService,
        private activityService: ActivitySettingsService
    ) {
    }

    public currentActivity: ActivityEntity = new ActivityEntity();
    public errPositionItem: ErrPositionItem = new ErrPositionItem();
    public image_url = [];
    public aspectRatio = 1 / 1; // 截取图片比例
    private sureCallback: any;
    private closeCallback: any;
    private requestSubscription: Subscription;
    public timeError: string; // 时间错误信息
    public online_type;
    public now;
    public timing;
    public activity_id: string;
    public online_time = null; // 上线时间
    public offline_time = null; // 下线时间
    public landing_page_type = [1, 2, 3, 4, 5]; // 落地页类型(1H5 2原生页 3视频 4指定优惠券 5指定优惠券组)
    public formatList = [
        {key: 1, name: '小程序', isChecked: false, disabled: false},
        {key: 2, name: 'app', isChecked: false, disabled: true}
    ];

    private is_save = false; // 防止连续触发保存事件

    @ViewChild('activityPromptDiv', {static: false}) public activityPromptDiv: ElementRef;
    @ViewChild('coverImg', {static: false}) public coverImgSelectComponent: ZPhotoSelectComponent;

    ngOnInit() {
    }

    // 改变显示端口
    public onChangeCheckedLinkType(): void {
        this.currentActivity.display_port = this.formatList.filter(item => item.isChecked).map(item => item.key).join(',');
    }

    /**
     * 打开确认框
     * @param sureName 确认按钮文本(默认为确定)
     * @param sureFunc 确认回调
     * @param closeFunc 取消回调
     */
    public open(data: ActivityEntity, sureFunc: any, closeFunc: any = null) {
        const openBrandModal = () => {
            timer(0).subscribe(() => {
                $(this.activityPromptDiv.nativeElement).modal('show');
            });
        };
        this.currentActivity = data ? data.clone() : new ActivityEntity();
        this.activity_id = data ? data.activity_id : '';
        this.sureCallback = sureFunc;
        this.closeCallback = closeFunc;
        this.formatList.forEach(item => {
            const index = this.currentActivity.display_port.indexOf(item.key.toString());
            item.isChecked = index > -1;
        });
        this.image_url = data ? data.image.split(',') : [];
        this.is_save = false;
        this.online_time = this.currentActivity.online_time ? new Date(this.currentActivity.online_time * 1000) : null;
        this.offline_time = this.currentActivity.offline_time ? new Date(this.currentActivity.offline_time * 1000) : null;
        this.clear();
        openBrandModal();
    }



    // 清空
    public clear(): void {
        this.errPositionItem.icon.isError = false;
        this.errPositionItem.tags.isError = false;
    }

    // 显示端口至少选择一项
    public ifDisabled(): boolean {
        return !this.formatList.some(checkItem => checkItem.isChecked);
    }

    // 弹框close
    public onClose() {
        this.clear();
        this.requestSubscription && this.requestSubscription.unsubscribe();
        this.currentActivity = new ActivityEntity();
        $(this.activityPromptDiv.nativeElement).modal('hide');
    }

    // form提交
    public onEditFormSubmit(): void {
        if (this.is_save) {
            return;
        }
        this.clear();
        this.is_save = true;
        this.coverImgSelectComponent.upload().subscribe(() => {
            const imageUrl = this.coverImgSelectComponent.imageList.map(i => i.sourceUrl);
            this.currentActivity.image = imageUrl.join(',');
            if (this.verification() && this.generateAndCheckParamsValid()) {
                if (!this.activity_id) {
                    this.requestAddAccessoryBrand();
                } else {
                    this.requestUpdateAccessoryBrand();
                }
            } else {
                this.is_save = false;
            }
        }, err => {
            this.is_save = false;
            this.upLoadErrMsg(err);
        });
    }

    // 选择图片时校验图片格式
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

    // 新建洗车服务
    private requestAddAccessoryBrand(): void {
        this.activityService
            .requestAddActivityData(this.currentActivity).subscribe(() => {
            this.onClose();
            this.globalService.promptBox.open('新建成功！', () => {
                this.sureCallbackInfo();
            });
        }, err => {
            this.is_save = false;
            this.errorProcess(err, 1);
        });
    }

    // 编辑洗车服务
    private requestUpdateAccessoryBrand(): void {
        this.activityService.requestUpdateActivityData(
            this.activity_id,
            this.currentActivity
        ).subscribe(() => {
            this.onClose();
            this.globalService.promptBox.open('编辑成功！', () => {
                this.sureCallbackInfo();
            });
        }, err => {
            this.is_save = false;
            this.errorProcess(err, 2);
        });
    }

    // 校验下线时间
    public disabledOfflineReserveDate = (offValue: Date): boolean => {
        if (new Date(offValue).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
            return true;
        } else if (this.online_time && new Date(offValue).setHours(0, 0, 0, 0) < new Date(this.online_time).setHours(0, 0, 0, 0)) {
            return true;
        } else {
            return false;
        }
    }

    // 校验上线时间
    public disabledOnlineReserveDate = (startValue: Date): boolean => {
        if (new Date(startValue).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
            return true;
        } else if (this.offline_time && new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.offline_time).setHours(0, 0, 0, 0)) {
            return true;
        } else {
            return false;
        }
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

    // 表单提交校验
    private verification(): boolean {
        if (!this.currentActivity.image) {
            this.errPositionItem.icon.isError = true;
            this.errPositionItem.icon.errMes = '请重新上传图片！';
            return false;
        }
        return true;
    }

    // 数据校验
    public generateAndCheckParamsValid(): boolean {
        this.timeError = '';
        const sTimestamp = this.online_time ? (new Date(this.online_time).setSeconds(0, 0) / 1000).toString() : null;
        const eTimeStamp = this.offline_time ? (new Date(this.offline_time).setSeconds(0, 0) / 1000).toString() : null;

        if (sTimestamp && eTimeStamp && sTimestamp > eTimeStamp) {
            this.timeError = '定时上线时间不能大于定时下线时间！';
            return false;
        } else if (eTimeStamp && Number(eTimeStamp) < new Date().getTime() / 1000) {
            this.timeError = '定时下线时间不能小于当前时间！';
            return false;
        } else {
            this.currentActivity.online_time = sTimestamp ? Number(sTimestamp) : null;
            this.currentActivity.offline_time = eTimeStamp ? Number(eTimeStamp) : null;
        }
        return true;
    }


    // 接口错误状态
    private errorProcess(err: any, type: number) {
        const text = type === 1 ? '新建' : '编辑';
        if (!this.globalService.httpErrorProcess(err)) {
            if (err.status === 422) {
                const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
                for (const content of error.errors) {
                    const field = content.field === 'brand_name' ?
                        '品牌名称' : content.field === 'sign_image' ?
                            '品牌标志' : content.field === 'introduce' ?
                                '简介' : content.field === 'tag' ? '品牌标签' : '';
                    if (content.code === 'missing_field') {
                        this.globalService.promptBox.open(`${field}字段未填写!`, null, 2000, null, false);
                    } else if (content.code === 'invalid') {
                        this.globalService.promptBox.open(`${field}字段输入错误!`, null, 2000, null, false);
                    } else if (content.code === 'already_existed') {
                        this.globalService.promptBox.open(`配件品牌已经存在!`, null, 2000, null, false);
                    } else {
                        this.globalService.promptBox.open(`${text}配件品牌失败,请重试!`, null, 2000, null, false);
                    }
                }
            }
        }
    }

    // 上传图片错误信息处理
    private upLoadErrMsg(err: any) {
        if (!this.globalService.httpErrorProcess(err)) {
            if (err.status === 422) {
                this.errPositionItem.icon.isError = true;
                this.errPositionItem.icon.errMes = '参数错误，可能文件格式错误！';
            } else if (err.status === 413) {
                this.errPositionItem.icon.isError = true;
                this.errPositionItem.icon.errMes = '上传资源文件太大，服务器无法保存！';
            } else {
                this.errPositionItem.icon.isError = true;
                this.errPositionItem.icon.errMes = '上传失败，请重试！';
            }
        }
    }

}
