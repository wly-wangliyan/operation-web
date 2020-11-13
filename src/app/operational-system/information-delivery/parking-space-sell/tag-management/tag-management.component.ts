import { Component, OnInit } from '@angular/core';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../share/nz-search-assistant';
import { SearchParamsEntity, TagManagementEntity, TagManagementService } from '../../used-car/tag-management/tag-management.service';
import { GlobalService } from '../../../../core/global.service';
import { DisabledTimeHelper } from '../../../../../utils/disabled-time-helper';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpErrorEntity } from '../../../../core/http.service';
import { timer } from 'rxjs';

@Component({
    selector: 'app-tag-management',
    templateUrl: './tag-management.component.html',
    styleUrls: ['../parking-space-sell.component.css', './tag-management.component.css']
})
export class TagManagementComponent implements OnInit {
    public searchParams: SearchParamsEntity = new SearchParamsEntity(); // 条件筛选参数
    public tagList: Array<TagManagementEntity> = [];
    public noResultText = '数据加载中...';
    public selectedTag: TagManagementEntity = new TagManagementEntity();

    constructor(private globalService: GlobalService,
                private tagManagementService: TagManagementService) {
    }

    public ngOnInit() {
        this.requestTagList();
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
     */
    public onCreateTagData() {
        this.tagManagementService.requestAddTagData(this.selectedTag, this.selectedTag.label_id).subscribe(data => {
            this.globalService.promptBox.open(this.selectedTag.label_id ? '编辑成功！' : '创建成功！', null, 2000);
            $('#tagCreatePromptDiv').modal('hide');
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
    public requestTagList() {
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
}
