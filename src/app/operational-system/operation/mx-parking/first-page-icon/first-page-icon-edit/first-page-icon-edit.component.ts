import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../../core/global.service';
import { isUndefined } from 'util';
import { ZPhotoSelectComponent } from '../../../../../share/components/z-photo-select/z-photo-select.component';
import { FirstPageIconEntity, FirstPageIconService, VersionEntity } from '../first-page-icon.service';
import { ValidateHelper } from '../../../../../../utils/validate-helper';
import { HttpErrorEntity } from '../../../../../core/http.service';

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
    title: ErrMessageItem = new ErrMessageItem();
    system: ErrMessageItem = new ErrMessageItem();
    jump_link: ErrMessageItem = new ErrMessageItem();
    corner: ErrMessageItem = new ErrMessageItem();

    constructor(icon?: ErrMessageItem, title?: ErrMessageItem, jump_link?: ErrMessageItem,
                corner?: ErrMessageItem) {
        if (isUndefined(icon) || isUndefined(title) || isUndefined(jump_link)
            || isUndefined(corner)) {
            return;
        }
        this.icon = icon;
        this.title = title;
        this.jump_link = jump_link;
        this.corner = corner;
    }
}

@Component({
    selector: 'app-first-page-icon-edit',
    templateUrl: './first-page-icon-edit.component.html',
    styleUrls: ['./first-page-icon-edit.component.css']
})
export class FirstPageIconEditComponent {
    public currentPage: FirstPageIconEntity = new FirstPageIconEntity();
    public errPositionItem: ErrPositionItem = new ErrPositionItem();
    public cover_url = [];
    public versionList: Array<VersionEntity>;
    public isCreatePage = true;
    private continueRequestSubscription: Subscription;
    private sureCallback: any;
    private closeCallback: any;

    @Input() private application_id: string;

    @ViewChild('pagePromptDiv', {static: true}) public pagePromptDiv: ElementRef;
    @ViewChild('coverImg', {static: false}) public coverImgSelectComponent: ZPhotoSelectComponent;

    constructor(private firstPageIconService: FirstPageIconService,
                private globalService: GlobalService) {
    }

    // 弹框close
    public onClose() {
        this.clear();
        this.currentPage = new FirstPageIconEntity();
        $(this.pagePromptDiv.nativeElement).modal('hide');
    }

    /**
     * 打开确认框
     * @param application
     * @param sureFunc 确认回调
     * @param closeFunc 取消回调
     */
    public open(application: any, sureFunc: any, closeFunc: any = null) {
        this.sureCallback = sureFunc;
        this.closeCallback = closeFunc;
        this.isCreatePage = true;
        this.requestVersionList();
        this.currentPage = new FirstPageIconEntity();
        this.cover_url = [];
        this.currentPage.system = application.system;
    }


    /**
     * 打开确认框
     * @param menu
     * @param sureFunc 确认回调
     * @param closeFunc 取消回调
     */
    public openEdit(menu: FirstPageIconEntity, sureFunc: any, closeFunc: any = null) {
        this.sureCallback = sureFunc;
        this.closeCallback = closeFunc;
        this.currentPage = menu.clone();
        this.currentPage.menu_business_name = menu.menu_business_key.menu_business_name;
        this.isCreatePage = false;
        this.cover_url = this.currentPage.icon ? this.currentPage.icon.split(',') : [];
        this.requestVersionList();
    }

    // form提交
    public onEditFormSubmit() {
        this.clear();
        if (this.verification()) {
            this.coverImgSelectComponent.upload().subscribe(() => {
                const imageUrl = this.coverImgSelectComponent.imageList.map(i => i.sourceUrl);
                this.currentPage.icon = imageUrl.join(',');
                if (this.isCreatePage) {
                    // 添加项目
                    this.firstPageIconService.requestAddPageIcon(this.currentPage, this.application_id).subscribe(() => {
                        this.onClose();
                        this.globalService.promptBox.open('添加成功！', () => {
                            this.sureCallbackInfo();
                        });
                    }, err => {
                        this.errorProcess(err);
                    });
                } else {
                    // 编辑项目
                    this.firstPageIconService.requestModifyPageIcon(this.currentPage, this.application_id, this.currentPage.menu_id)
                        .subscribe(() => {
                            this.onClose();
                            this.globalService.promptBox.open('修改成功！', () => {
                                this.sureCallbackInfo();
                            });
                        }, err => {
                            this.errorProcess(err);
                        });
                }
            });
        }
    }

    // 获取版本列表
    private requestVersionList() {
        this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
        this.continueRequestSubscription = this.firstPageIconService.requestVersionList(this.application_id)
            .subscribe(res => {
                this.versionList = res;
                timer(0).subscribe(() => {
                    $(this.pagePromptDiv.nativeElement).modal('show');
                });
            }, err => {
                this.globalService.httpErrorProcess(err);
            });
    }

    // 表单提交校验
    private verification() {
        let cisCheck = true;
        if (!ValidateHelper.checkUrl(this.currentPage.jump_link)) {
            this.errPositionItem.jump_link.isError = true;
            this.errPositionItem.jump_link.errMes = '链接格式错误，请重新输入！';
            cisCheck = false;
        }
        if (this.currentPage.background_color && !ValidateHelper.CheckIsColor(this.currentPage.background_color)) {
            this.errPositionItem.corner.isError = true;
            this.errPositionItem.corner.errMes = '颜色值格式输入错误，请重新输入！';
            cisCheck = false;
        }
        if (!this.currentPage.corner_display && (!this.currentPage.background_color || !this.currentPage.corner)) {
            this.errPositionItem.corner.isError = true;
            this.errPositionItem.corner.errMes = '显示角标必须填写显示内容和背景颜色值！';
            cisCheck = false;
        }
        return cisCheck;
    }

    // 清空
    public clear() {
        this.errPositionItem.icon.isError = false;
        this.errPositionItem.title.isError = false;
        this.errPositionItem.system.isError = false;
        this.errPositionItem.jump_link.isError = false;
        this.errPositionItem.corner.isError = false;
    }

    // 确定按钮回调
    private sureCallbackInfo() {
        if (this.sureCallback) {
            const temp = this.sureCallback;
            this.closeCallback = null;
            this.sureCallback = null;
            temp();
        }
    }

    // 接口错误状态
    private errorProcess(err) {
        if (!this.globalService.httpErrorProcess(err)) {
            if (err.status === 422) {
                const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
                for (const content of error.errors) {
                    if (content.code === 'invalid' && content.field === 'title') {
                        this.errPositionItem.title.isError = true;
                        this.errPositionItem.title.errMes = '标题错误或无效！';
                        return;
                    }
                    if (content.code === 'already_exist' && content.resource === 'operate_menu') {
                        this.errPositionItem.system.isError = true;
                        this.errPositionItem.system.errMes = '该版本已经存在此业务！';
                        return;
                    }
                }
            }
        }
    }

    // 选择图片时校验图片格式
    public onSelectedPicture(event) {
        this.errPositionItem.icon.isError = false;
        if (event === 'type_error') {
            this.errPositionItem.icon.isError = true;
            this.errPositionItem.icon.errMes = '格式错误，请重新上传！';
        } else if (event === 'size_over') {
            this.errPositionItem.icon.isError = true;
            this.errPositionItem.icon.errMes = '图片大小不得高于1M！';
        }
    }
}
