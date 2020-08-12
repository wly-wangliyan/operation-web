import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SearchParamsEntity, TagManagementEntity, TagManagementService } from '../../../tag-management/tag-management.service';
import { GlobalService } from '../../../../../core/global.service';

@Component({
    selector: 'app-select-tag',
    templateUrl: './select-tag.component.html',
    styleUrls: ['./select-tag.component.css']
})
export class SelectTagComponent {
    public selectTagList: Array<TagManagementEntity> = [];
    public tagList: Array<TagManagementEntity> = [];
    @Output() public selectedTagEvent = new EventEmitter();
    public searchParams: SearchParamsEntity = new SearchParamsEntity(); // 条件筛选参数

    constructor(private globalService: GlobalService,
                private tagManagementService: TagManagementService) {
    }

    /**
     * 保存标签
     */
    public onSelectTagData() {
        $('#selectTagPromptDiv').modal('hide');
        this.selectedTagEvent.emit(this.selectTagList);
    }

    /**
     * 选择标签
     * @param tag
     */
    public onChangeTag(tag: TagManagementEntity) {
        const findIndex = this.selectTagList.findIndex(item => item.label_id === tag.label_id);
        if (findIndex > -1) {
            this.selectTagList.splice(findIndex, 1);
        } else {
            this.selectTagList.push(tag);
        }
    }

    /**
     * 模板列表
     */
    public onShowTagList(selectTagList: Array<TagManagementEntity> = []) {
        this.tagManagementService.requestTagListData(this.searchParams).subscribe(data => {
            this.tagList = data;
            this.selectTagList = selectTagList;
            if (data.length === 0) {
                this.globalService.promptBox.open(`请先去添加标签！`, null, 2000, null, false);
            } else {
                $('#selectTagPromptDiv').modal('show');
            }
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }
}
