import { Component, OnInit, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer, Observable, Subject } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { HttpErrorEntity } from '../../../../../core/http.service';
import {
    ThematicActivityService, ThematicEntity,
    ThematicParams, ContentEntity, ElementItemEntity
} from '../thematic-activity.service';
import { GlobalService } from '../../../../../core/global.service';
import { debounceTime } from 'rxjs/operators';
import { ZPhonePreviewComponent } from '../components/z-phone-preview/z-phone-preview.component';
import { ZPhotoSelectComponent } from '../../../../../share/components/z-photo-select/z-photo-select.component';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit {

    public thematicDetail: ThematicEntity = new ThematicEntity(); // 专题内容详情

    public thematicParams: ThematicParams = new ThematicParams(); // 添加编辑参数

    public contentList: Array<ContentEntity> = []; // 内容数组

    public previewList: Array<ContentEntity> = []; // 预览内容数组

    public routerTitle = '新建专题活动'; // 路由标题

    public loading = true;

    public replaceWidth = 850; // 富文本宽度

    public titleErrMsg = ''; // 标题错误提示

    public imageErrMsg = ''; // 图片错误

    public imgReg = /(jpg|jpeg|png|gif)$/;

    private space_one = '/assets/images/preview/icon_preview_space_one.png';

    private space_two = '/assets/images/preview/icon_preview_space_two.png';

    private requestSubscription: Subscription;

    private searchText$ = new Subject<any>();

    private activity_id: string; // 配置id

    private is_save = false; // 标记是否保存中

    private isCreate = true; // 标记是否新建

    private sort = 0;

    private isSuccessUploadImg = true; // 标记图片是否在上传

    @ViewChild('editActivityForm', {static: false}) public editForm: ViewContainerRef;
    @ViewChild('previewModal', {static: true}) public previewModal: ZPhonePreviewComponent;
    @ViewChild('thematicImg', {static: false}) public imgSelectComponent: ZPhotoSelectComponent;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private globalService: GlobalService,
        private thematicService: ThematicActivityService
    ) {
        route.queryParams.subscribe(queryParams => {
            this.activity_id = queryParams.activity_id;
        });
    }

    public ngOnInit() {
        this.is_save = false;
        if (this.activity_id) {
            this.isCreate = false;
            this.routerTitle = '编辑专题活动';
            this.searchText$.pipe(debounceTime(500)).subscribe(() => {
                this.rquestThematicDetail();
            });
            this.searchText$.next();
        } else {
            this.loading = false;
            this.isCreate = true;
            this.thematicDetail = new ThematicEntity();
            this.contentList = [];
        }
    }

    public ngAfterViewInit() {

    }

    // 获取详情
    private rquestThematicDetail(): void {
        this.requestSubscription && this.requestSubscription.unsubscribe();
        this.requestSubscription = this.thematicService.requestThematicDetail(this.activity_id).subscribe(res => {
            this.thematicDetail = res;
            this.thematicParams = new ThematicParams(res);
            this.sort = 0;
            this.contentList = [];

            this.thematicDetail.content.forEach(contentItem => {
                this.fillContent(contentItem);
            });
            this.fillCkEditor();
        }, err => {
            this.loading = false;
            this.globalService.httpErrorProcess(err);
        });
    }

    // 填充模块数据
    private fillContent(item: ContentEntity): void {
        this.sort++;
        const contentItem = new ContentEntity();
        contentItem.content_type = item.content_type;
        contentItem.elements.push(new ElementItemEntity(item.elements[0]));
        contentItem.elements[0].type = item.content_type;
        contentItem.elements[0].time = new Date().getTime();
        contentItem.elements[0].sort_num = this.sort;
        contentItem.elements[0].element_id = `activityItem${this.sort}`;
        if (item.content_type === 1) {
            contentItem.elements[0].image_url = item.elements[0].image.split(',');
            this.sort++;
            contentItem.elements.push(new ElementItemEntity(item.elements[1]));
            contentItem.elements[1].type = item.content_type;
            contentItem.elements[1].time = new Date().getTime() + 1;
            contentItem.elements[1].sort_num = this.sort;
            contentItem.elements[1].element_id = `activityItem${this.sort}`;
            contentItem.elements[1].image_url = !item.elements[1].image || item.elements[1].image.length === 0 ? [] : item.elements[1].image.split(',');
        } else if (item.content_type === 2 || item.content_type === 4) {
            contentItem.elements[0].image_url = !item.elements[0].image || item.elements[0].image.length === 0 ? [] : item.elements[0].image.split(',');
        } else if (item.content_type === 3) {
            const tempContent = item.elements[0].rich.replace('/\r\n/g', '<br>').replace(/\n/g, '<br>');
            contentItem.elements[0].rich = tempContent;
        }

        this.contentList.push(contentItem);
    }

    // 填充富文本编辑器内容
    private fillCkEditor() {
        timer(1000).subscribe(() => {
            this.contentList.forEach(contentItem => {
                if (contentItem.content_type === 3) {
                    const tempContent = contentItem.elements[0].rich;
                    CKEDITOR.instances[`${contentItem.elements[0].element_id}`].setData(tempContent);
                }
            });
            this.loading = false;
        });
    }

    /**
     * 生成组件
     * @param type 1:双图文链接 2:单图文链接 3:富文本编辑器
     */
    public onAddComponent(type: number): void {
        if (this.contentList && this.contentList.length === 20) {
            this.globalService.promptBox.open('最多可添加20个模块！', null, 2000, null, false);
            return;
        }
        this.generateContentItem(type);
    }

    // 生成模块数据
    private generateContentItem(type: number) {
        this.sort++;
        const contentItem = new ContentEntity();
        contentItem.content_type = type;
        contentItem.elements.push(new ElementItemEntity());
        contentItem.elements[0].type = type;
        contentItem.elements[0].time = new Date().getTime();
        contentItem.elements[0].sort_num = this.sort;
        contentItem.elements[0].element_id = `activityItem${this.sort}`;
        if (type === 1) {
            contentItem.elements[0].belong_to = 2;
            this.sort++;
            contentItem.elements.push(new ElementItemEntity());
            contentItem.elements[1].type = type;
            contentItem.elements[1].time = new Date().getTime() + 2;
            contentItem.elements[1].sort_num = this.sort;
            contentItem.elements[1].element_id = `activityItem${this.sort}`;
            contentItem.elements[1].belong_to = 2;
        } else if (type === 2 || type === 5) {
            contentItem.elements[0].belong_to = 2;
        } else if (type === 3) {
            contentItem.elements[0].rich = '';
        }
        this.contentList.push(contentItem);
    }

    // 切换落地页
    public onChangeBelongTo(event: any, index: number, elementIndex?: number): void {
        if (event.target.value) {
            if (elementIndex >= 0) {
                this.contentList[index].elements[elementIndex].belong_to = Number(event.target.value);
                this.contentList[index].elements[elementIndex].link = null;
                this.contentList[index].elements[elementIndex].errMsg = '';
            } else {
                this.contentList[index].elements[0].belong_to = Number(event.target.value);
                this.contentList[index].elements[0].link = null;
                this.contentList[index].elements[0].errMsg = '';
            }
        }
    }

    /** 预览 */
    public onPreviewClick() {
        this.previewList = [];
        this.contentList.forEach(contentItem => {
            const previewItem = new ContentEntity();
            previewItem.content_type = contentItem.content_type;
            previewItem.elements.push(new ElementItemEntity());
            if (contentItem.content_type === 3) {
                const tmpContent = CKEDITOR.instances[`${contentItem.elements[0].element_id}`].getData();
                previewItem.elements[0].rich = tmpContent.replace('/\r\n/g', '').replace(/\n/g, '');
            } else {
                contentItem.elements.forEach((elementItem, index) => {
                    if (index === 1) {
                        previewItem.elements.push(new ElementItemEntity());
                    }
                    if (elementItem.height) {
                        previewItem.elements[index].height = elementItem.height / 2;
                    }
                    if (elementItem.image) {
                        previewItem.elements[index].image = elementItem.image;
                    } else {
                        if (contentItem.content_type === 1) {
                            previewItem.elements[index].image = this.space_two;
                        } else {
                            previewItem.elements[index].image = this.space_one;
                        }
                    }
                });
            }
            this.previewList.push(previewItem);
        });
        this.previewModal.open();
    }

    /** 选择图片 */
    public onWechatSelectedPicture(event: any) {
        if (event === 'type_error') {
            this.imageErrMsg = '格式错误，请重新上传！';
        } else if (event === 'size_over') {
            this.imageErrMsg = '图片大小不得高于2M！';
        }
    }

    // 点击保存
    public onEditFormSubmit(): void {
        if (this.is_save) {
            return;
        }
        if (!this.isSuccessUploadImg) {
            this.globalService.promptBox.open('图片正在保存中，请稍后保存！', null, 2000, null, false);
            return;
        }
        this.imgSelectComponent.upload().subscribe(() => {
            this.thematicParams.wechat_cover = this.imgSelectComponent.imageList.map(i => i.sourceUrl).join(',');
            this.thematicParams.content = [];
            if (this.generateAndCheckParamsValid(this.contentList)) {
                this.is_save = true;
                if (this.isCreate) {
                    this.requestAddThematic(this.thematicParams);
                } else {
                    this.requestUpdateThematic(this.thematicParams);
                }
            } else {
                this.thematicParams.content = [];
            }
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

    // 添加专题活动
    private requestAddThematic(params: ThematicParams): void {
        this.thematicService.requestAddThematicData(params).subscribe(res => {
            this.globalService.promptBox.open('保存成功！', () => {
                this.onCancelClick();
            });
        }, err => {
            this.is_save = false;
            this.errorProcess(err);
        });
    }

    // 编辑专题活动
    private requestUpdateThematic(params: ThematicParams): void {
        this.thematicService.requestUpdateThematicData(this.activity_id, params).subscribe(res => {
            this.globalService.promptBox.open('修改成功！', () => {
                this.onCancelClick();
            });
        }, err => {
            this.is_save = false;
            this.errorProcess(err);
        });
    }

    // 接口错误状态
    private errorProcess(err: any): any {
        if (!this.globalService.httpErrorProcess(err)) {
            if (err.status === 422) {
                const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
                for (const content of error.errors) {
                    if (content.code === 'invalid' && content.field === 'title') {
                        this.titleErrMsg = '标题错误，请重新输入！';
                        return;
                    }
                    if (content.code === 'invalid' && content.field === 'content') {
                        this.globalService.promptBox.open('参数错误或无效！', null, 2000, null, false);
                        return;
                    }
                }
            }
        }
    }

    private generateAndCheckParamsValid(params: Array<ContentEntity>): boolean {
        if (!this.thematicParams.title) {
            this.titleErrMsg = '请输入标题！';
            return false;
        }

        if (!params || params.length === 0) {
            this.globalService.promptBox.open('请至少添加一个模块！', null, 2000, null, false);
            return false;
        }

        for (const contentIndex in params) {
            if (params.hasOwnProperty(contentIndex)) {
                const content_type = params[contentIndex].content_type;
                const elements = params[contentIndex].elements;
                if (content_type === 3) {
                    const tmpRichContent = CKEDITOR.instances[`${elements[0].element_id}`].getData();
                    if (!tmpRichContent) {
                        elements[0].rich = null;
                        elements[0].errMsg = '模块内容不能为空!';
                        return false;
                    } else {
                        elements[0].rich = tmpRichContent.replace('/\r\n/g', '').replace(/\n/g, '');
                        elements[0].errMsg = '';
                        const tmpData = params[contentIndex].clone();
                        tmpData.elements[0] = elements[0].toEditJson();
                        this.thematicParams.content.push(tmpData);
                    }
                } else {
                    for (const elementIndex in elements) {
                        if (elements.hasOwnProperty(elementIndex)) {
                            if (isNullOrUndefined(elements[elementIndex].image)) {
                                elements[elementIndex].errMsg = '请上传图片！';
                                return false;
                            }
                            if (elements[elementIndex].belong_to === 3) {
                                if (!elements[elementIndex].app_id) {
                                    elements[elementIndex].errMsg = '请输入appID！';
                                    return false;
                                } else {
                                    elements[elementIndex].errMsg = '';
                                }
                            } else {
                                if (content_type === 4 && !elements[elementIndex].height) {
                                    elements[elementIndex].errMsg = '请输入视频高度！';
                                    return false;
                                }
                                if (elements[elementIndex].belong_to !== 4 && !elements[elementIndex].link) {
                                    if (content_type === 4) {
                                        elements[elementIndex].errMsg = '请输入视频地址！';
                                    } else {
                                        elements[elementIndex].errMsg = '请输入跳转URL！';
                                    }
                                    return false;
                                } else {
                                    elements[elementIndex].errMsg = '';
                                }
                            }
                        }
                    }

                    const tmpData = params[contentIndex].clone();
                    tmpData.elements[0] = elements[0].toEditJson();
                    if (content_type === 1) {
                        tmpData.elements[1] = elements[1].toEditJson();
                    }
                    this.thematicParams.content.push(tmpData);
                }
            }
        }
        return true;
    }

    // 删除节点
    public onDeleteClick(index: number): void {
        this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
            this.globalService.confirmationBox.close();
            this.contentList.splice(index, 1);
        });
    }

    // 变更图片结果
    public onSelectedPicture(event: any): void {
        if (event) {
            this.contentList.forEach(item => {
                if (item.content_type !== 3) {
                    item.elements.forEach(element => {
                        if (element.element_id === event.file_id) {
                            element.errMsg = event.errMsg;
                            if (!event.imageList || event.imageList.length === 0) {
                                element.image = null;
                            } else {
                                element.image = event.imageList.map(i => i.sourceUrl);
                                this.isSuccessUploadImg = false;
                            }
                        }
                    });
                }
            });
        }
    }

    // 上传图片结果
    public onUploadFinish(event: any): void {
        if (event) {
            this.contentList.forEach(item => {
                if (item.content_type !== 3) {
                    item.elements.forEach(element => {
                        if (element.element_id === event.file_id) {
                            if (!event.isUpload) {
                                element.image = null;
                            } else {
                                element.image = event.imageList;
                            }
                            element.errMsg = event.errMsg;
                        }
                    });
                }
            });
        }
        this.isSuccessUploadImg = true;
    }

    // 富文本编辑器数据变更,清空错误信息
    public onEditChange(event: any): void {
        if (event) {
            this.contentList.forEach(item => {
                if (item.content_type === 3) {
                    item.elements.forEach(element => {
                        if (element.element_id === event.ckEditorId) {
                            element.errMsg = '';
                        }
                    });
                }
            });
        }
    }

    // 点击取消
    public onCancelClick(): void {
        window.history.back();
    }
}
