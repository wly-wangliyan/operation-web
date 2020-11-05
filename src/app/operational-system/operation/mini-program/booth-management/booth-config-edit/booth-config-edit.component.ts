import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { timer } from 'rxjs';
import { BoothEntity, BoothService } from '../booth.service';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { ErrMessageGroup, ErrMessageBase } from '../../../../../../utils/error-message-helper';

export class CheckItem {
    key: number;
    name: string;
    isChecked: boolean;

    constructor(key?: number, name?: string, isChecked: boolean = false) {
        this.key = key;
        this.name = name;
        this.isChecked = isChecked;
    }
}

@Component({
    selector: 'app-booth-config-edit',
    templateUrl: './booth-config-edit.component.html',
    styleUrls: ['./booth-config-edit.component.css']
})
export class BoothConfigEditComponent implements OnInit {
    public boothData: BoothEntity = new BoothEntity(); // 展位数据
    public boothType = [1, 2, 3]; // 1:轮播图(5个) 2:焦点图(1个)
    public formatList: Array<CheckItem> = []; // 支持格式
    public linkTypeList: Array<CheckItem> = []; // 跳转链接
    public isCreate = true; // 标记新建\编辑
    public errMessageGroup: ErrMessageGroup = new ErrMessageGroup();
    private saving = false; // 保存中
    private sureCallback: any;
    private closeCallback: any;

    constructor(
        private globalService: GlobalService,
        private boothService: BoothService) {
    }

    public ngOnInit() {
    }

    public open(data: BoothEntity, sureFunc: any, closeFunc: any = null) {
        const openBoothModal = () => {
            timer(0).subscribe(() => {
                $('#boothConfigModal').modal();
            });
        };
        this.initForm();
        this.isCreate = !(data && data.booth_id);
        if (!this.isCreate) {
            this.boothData = data.clone();
        }
        this.initFormats();
        this.initLinkTypes();
        this.sureCallback = sureFunc;
        this.closeCallback = closeFunc;
        openBoothModal();
    }

    private initForm(): void {
        this.clear();
        this.saving = false;
        this.boothData = new BoothEntity();
        this.boothData.booth_type = '';
        this.boothData.formats = ['PNG', 'JPG', 'GIF'];
        this.boothData.link_types = [1, 2, 3, 4];
    }

    private initFormats() {
        const formats = ['PNG', 'JPG', 'GIF'];
        this.formatList = [];
        formats.forEach(format => {
            const checkItem = new CheckItem(null, format);
            if (this.boothData.formats && this.boothData.formats.includes(format)) {
                checkItem.isChecked = true;
            }
            this.formatList.push(checkItem);
        });
    }

    private initLinkTypes() {
        let index = 1;
        this.linkTypeList = [];
        while (index <= 4) {
            const checkItem = new CheckItem(index);
            if (this.boothData.link_types && this.boothData.link_types.includes(index)) {
                checkItem.isChecked = true;
            }
            this.linkTypeList.push(checkItem);
            index++;
        }
    }

    // 清除错误信息
    public clear(): void {
        this.errMessageGroup.errJson = {};
        this.errMessageGroup.errJson.booth_name = new ErrMessageBase();
        this.errMessageGroup.errJson.booth_key = new ErrMessageBase();
        this.errMessageGroup.errJson.icon_size = new ErrMessageBase();
    }

    // 弹框close
    public onClose() {
        $('#boothConfigModal').modal('hide');
    }

    // 变更展位类型
    public onChangeBoothType(event: any): void {
        const targetValue = event.target.value;
        if (targetValue) {
            this.boothData.booth_type = Number(targetValue);
            if (this.boothData.booth_type === 3) {
                this.boothData.booth_num = 6;
                this.boothData.width = 100;
                this.boothData.height = 100;
            } else {
                this.boothData.width = null;
                this.boothData.height = null;
                this.boothData.booth_num = null;
            }
        }
    }

    // 改变支持格式
    public onChangeCheckedFormat(): void {
        const result = [];
        this.formatList.forEach(checkItem => {
            if (checkItem.isChecked) {
                result.push(checkItem.name);
            }
        });
        this.boothData.formats = result;
    }

    // 改变跳转链接
    public onChangeCheckedLinkType(): void {
        const result = [];
        this.linkTypeList.forEach(checkItem => {
            if (checkItem.isChecked) {
                result.push(checkItem.key);
            }
        });
        this.boothData.link_types = result;
    }

    // 支持格式及跳转链接都至少选择一项
    public ifDisabled(): boolean {
        return !this.formatList.some(checkItem => checkItem.isChecked)
            || !this.linkTypeList.some(checkItem => checkItem.isChecked);
    }

    // 保存
    public onCheckClick() {
        if (this.saving) {
            return;
        }
        if (this.generateAndCheckParamsValid()) {
            this.saving = true;
            if (this.isCreate) {
                this.requestAddBooth();
            } else {
                this.requestEditBooth();
            }
        } else {
            this.saving = false;
        }
    }

    // 新建展位
    private requestAddBooth(): void {
        this.boothService.requestAddBoothData(this.boothData)
            .subscribe(res => {
                this.onClose();
                this.sureCallbackInfo();
                this.globalService.promptBox.open('新建展位成功');
            }, err => {
                this.errorProcess(err);
            });
    }

    // 编辑展位
    private requestEditBooth(): void {
        this.boothService.requestUpdateBoothData(this.boothData.booth_id, this.boothData)
            .subscribe(res => {
                this.onClose();
                this.sureCallbackInfo();
                this.globalService.promptBox.open('编辑展位成功');
            }, err => {
                this.errorProcess(err);
            });
    }

    // 格式展位数量
    private generateAndCheckParamsValid(): boolean {
        if (!this.boothData.width || Number(this.boothData.width) === 0) {
            this.errMessageGroup.errJson.icon_size.errMes = this.boothData.booth_type === 1 ? '宽应大于0px！' : '总宽应大于0px！';
            return false;
        }

        if (!this.boothData.height || Number(this.boothData.height) === 0) {
            this.errMessageGroup.errJson.icon_size.errMes = '高应大于0px！';
            return false;
        }

        return true;
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

    private errorProcess(err: any): void {
        this.saving = false;
        const tipMag = this.isCreate ? '新建展位' : '编辑展位';
        if (!this.globalService.httpErrorProcess(err)) {
            if (err.status === 422) {
                const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
                for (const content of error.errors) {
                    if (content.code === 'already_existed' && content.field === 'booth_name') {
                        this.errMessageGroup.errJson.booth_name.errMes = '展位名称已存在！';
                    } else if (content.code === 'already_existed' && content.field === 'booth_key') {
                        this.errMessageGroup.errJson.booth_key.errMes = '关键字已存在！';
                    } else {
                        this.globalService.promptBox.open('参数缺失或不合法，请重试！', null, 2000, null, false);
                    }
                }
            }
        }
    }
}
