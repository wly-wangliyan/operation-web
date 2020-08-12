import { Component, OnInit } from '@angular/core';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../core/global.service';
import { DisabledTimeHelper } from '../../../../../utils/disabled-time-helper';
import { SearchParamsEntity, TagManagementService, TagOnlineStatus, TagManagementEntity } from '../tag-management.service';
import { HttpErrorEntity } from '../../../../core/http.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { timer } from 'rxjs';
import { TemplateManagementEntity } from '../../../operation/push-message-management/template-management/template-management.service';

@Component({
    selector: 'app-tag-list',
    templateUrl: './tag-list.component.html',
    styleUrls: ['./tag-list.component.css', '../../used-car.component.css']
})
export class TagListComponent implements OnInit {
    public start_time: any = '';
    public end_time: any = '';
    public searchParams: SearchParamsEntity = new SearchParamsEntity(); // 条件筛选参数
    public tagList: Array<TagManagementEntity> = [];
    public noResultText = '数据加载中...';
    public TagOnlineStatus = TagOnlineStatus;
    public selectedTag: TagManagementEntity = new TagManagementEntity();
    public CreateTagType = CreateTagType;

    constructor(private globalService: GlobalService,
                private tagManagementService: TagManagementService) {
    }

    public ngOnInit() {
        this.requestTagList();
    }

    /**
     * 搜索
     */
    public onClickRearch() {
        if (this.generateAndCheckParamsValid()) {
            this.requestTagList();
        }
    }

    // 开始时间的禁用部分
    public disabledStartTime = (startValue: Date): boolean => {
        return DisabledTimeHelper.disabledStartTime(startValue, this.end_time);
    };

    // 结束时间的禁用部分
    public disabledEndTime = (endValue: Date): boolean => {
        return DisabledTimeHelper.disabledEndTime(endValue, this.start_time);
    };

    // 列表排序
    public onClickDrop(event: CdkDragDrop<string[]>, results: Array<TagManagementEntity>): void {
        if (event.previousIndex === event.currentIndex) {
            return;
        }
        const to_label_id = this.tagList[event.currentIndex].label_id;
        const label_id = this.tagList[event.previousIndex].label_id;
        moveItemInArray(results, event.previousIndex, event.currentIndex);
        this.requestTagSort(label_id, to_label_id);
    }

    /**
     * 标签排序
     * @param label_id
     */
    public onTagSortClick(label_id) {
        const to_label_id = this.tagList[0].label_id;
        this.requestTagSort(label_id, to_label_id);
    }

    /**
     * 删除标签
     * @param label_id
     */
    public onDeleteTagClick(label_id: string) {
        this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
            this.globalService.confirmationBox.close();
            this.tagManagementService.requestDeleteTagData(label_id).subscribe(res => {
                this.requestTagList();
                this.globalService.promptBox.open('删除成功');
            }, err => {
                if (!this.globalService.httpErrorProcess(err)) {
                    this.globalService.promptBox.open(`删除失败，请刷新重试！`, null, 2000, null, false);
                }
            });
        }, '确定', '删除后，对应标签车辆关联关系全部失效！');
    }

    /**
     * 启停
     * @param tag
     */
    public onSwitchChange(tag: TagManagementEntity) {
        const swicth = tag.online_status === TagOnlineStatus.on ? TagOnlineStatus.off : TagOnlineStatus.on;
        this.tagManagementService.requestTagOnlineStatusData(tag.label_id, swicth).subscribe(res => {
            if (tag.online_status === TagOnlineStatus.off) {
                this.globalService.promptBox.open('开启成功', null, 2000, '/assets/images/success.png');
            } else {
                this.globalService.promptBox.open('关闭成功', null, 2000, '/assets/images/success.png');
            }
            this.requestTagList();
        }, err => {
            if (!this.globalService.httpErrorProcess(err)) {
                if (err.status === 422) {
                    const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
                    for (const content of error.errors) {
                        if (content.resource === 'label' && content.code === 'not_allowed') {
                            this.globalService.promptBox.open('标签下无车辆信息,不能上线！', null, 2000, null, false);
                            return;
                        }
                    }
                }
            }
        });
    }

    /**
     * 创建和编辑标签
     * @param selectedTag
     */
    public onClickCreateTag(selectedTag = new TagManagementEntity()) {
        this.selectedTag = selectedTag.clone();
        timer(10).subscribe(() => {
            $('#tagCreatePromptDiv').modal('show');
        });
    }

    /**
     * 创建或者编辑
     * @param type
     */
    public onCreateTagData(type: CreateTagType) {
        this.tagManagementService.requestAddTagData(this.selectedTag, this.selectedTag.label_id).subscribe(data => {
            this.globalService.promptBox.open(this.selectedTag.label_id ? '编辑成功！' : '创建成功！', null, 2000);
            if (type === CreateTagType.close) {
                $('#tagCreatePromptDiv').modal('hide');
            } else {
                this.selectedTag = new TagManagementEntity();
            }
            this.requestTagList();
        }, err => {
            if (!this.globalService.httpErrorProcess(err)) {
                if (err.status === 422) {
                    const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
                    for (const content of error.errors) {
                        if (content.code === 'already_exists' && content.field === 'label_name') {
                            this.globalService.promptBox.open('标签名重复，请重试!', null, 2000, null, false);
                            return;
                        } else {
                            this.globalService.promptBox.open('保存失败，请重试!', null, 2000, null, false);
                            return;
                        }
                    }
                }
            }
            this.globalService.httpErrorProcess(err);
        });
    }

    /**
     * 模板列表
     */
    private requestTagList() {
        this.noResultText = '数据加载中...';
        this.tagManagementService.requestTagListData(this.searchParams).subscribe(data => {
            this.tagList = data;
            if (data.length === 0) {
                this.noResultText = '暂无数据';
            }
        }, err => {
            this.noResultText = '暂无数据';
            this.globalService.httpErrorProcess(err);
        });
    }

    /* 生成并检查参数有效性 */
    public generateAndCheckParamsValid(): boolean {
        const sTime = this.start_time ? ((new Date(this.start_time).setSeconds(0, 0) / 1000)) : 0;
        const eTime = this.end_time ? ((new Date(this.end_time).setSeconds(0, 0) / 1000)) : 253370764800;
        if (sTime > eTime) {
            this.globalService.promptBox.open('创建时间的开始时间应小于等于结束时间！', null, 2000, null, false);
            return false;
        }
        this.searchParams.section = `${sTime},${eTime}`;
        return true;
    }

    /* 检索失败处理 */
    public searchErrProcess(err: any): any {
        this.globalService.httpErrorProcess(err);
    }

    /* 检索成功处理 */
    public searchCompleteProcess(): any {
    }

    /**
     * 请求排序
     * @param label_id
     * @param to_label_id
     * @param isTop
     * @private
     */
    private requestTagSort(label_id: string, to_label_id: string, isTop = false) {
        this.tagManagementService.requestTagSortData(label_id, to_label_id).subscribe(data => {
            this.requestTagList();
            this.globalService.promptBox.open(isTop ? '置顶成功！' : '排序成功！');
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }
}

enum CreateTagType {
    close,
    continue
}
