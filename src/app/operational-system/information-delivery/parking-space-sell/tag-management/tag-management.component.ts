import { Component, OnInit } from '@angular/core';
import { SearchParamsEntity, TagManagementEntity, TagManagementService } from './tag-management.service';
import { GlobalService } from '../../../../core/global.service';
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
    private linkUrl = null;
    private isLoadingMore = false; // 加载下一页数据中

    constructor(private globalService: GlobalService,
                private tagManagementService: TagManagementService) {
    }

    public ngOnInit() {
        this.requestTagList();
    }

    /**
     * 删除标签
     * @param parking_place_label_id
     */
    public onDeleteTagClick(parking_place_label_id: string) {
        this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
            this.globalService.confirmationBox.close();
            this.tagManagementService.requestDeleteTagData(parking_place_label_id).subscribe(res => {
                this.requestTagList();
                this.globalService.promptBox.open('删除成功');
            }, err => {
                if (!this.globalService.httpErrorProcess(err)) {
                    this.globalService.promptBox.open(`删除失败，请刷新重试！`, null, 2000, null, false);
                }
            });
        }, '确定');
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
        this.tagManagementService.requestAddTagData(this.selectedTag, this.selectedTag.parking_place_label_id).subscribe(data => {
            this.globalService.promptBox.open(this.selectedTag.parking_place_label_id ? '编辑成功！' : '创建成功！', null, 2000);
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
            this.tagList = data.results;
            this.linkUrl = data.linkUrl;
            if (data.results.length === 0) {
                this.noResultText = '暂无数据';
            } else if (data.results.length === 15) {
                this.continueRequestTag();
            }
        }, err => {
            this.noResultText = '暂无数据';
            this.globalService.httpErrorProcess(err);
        });
    }

    /**
     * 继续请求模板列表
     */
    private continueRequestTag() {
        if (this.linkUrl && !this.isLoadingMore) {
            this.isLoadingMore = true;
            this.tagManagementService.continueRequestTagListData(this.linkUrl).subscribe(data => {
                data.results.forEach(item => {
                    this.tagList.push(item);
                });
                this.linkUrl = data.linkUrl;
                this.isLoadingMore = false;
                if (data.results.length === 15) {
                    this.continueRequestTag();
                }
            }, () => {
                this.isLoadingMore = false;
            });
        }
    }

    // public onScroll(scrollElement: any) {
    //     if (scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight - 1) {
    //         if (this.linkUrl && !this.isLoadingMore) {
    //             this.isLoadingMore = true;
    //             this.tagManagementService.continueRequestTagListData(this.linkUrl).subscribe(data => {
    //                 data.results.forEach(item => {
    //                     this.tagList.push(item);
    //                 });
    //                 this.linkUrl = data.linkUrl;
    //                 this.isLoadingMore = false;
    //             }, () => {
    //                 this.isLoadingMore = false;
    //             });
    //         }
    //     }
    // }
}
