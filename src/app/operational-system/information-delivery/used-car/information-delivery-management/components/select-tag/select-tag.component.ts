import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SearchParamsEntity, TagManagementEntity, TagManagementService } from '../../../tag-management/tag-management.service';
import { GlobalService } from '../../../../../../core/global.service';

@Component({
    selector: 'app-select-tag',
    templateUrl: './select-tag.component.html',
    styleUrls: ['./select-tag.component.css']
})
export class SelectTagComponent {
    public selectTagList: Array<string> = [];
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
        const selectTagList = [];
        this.tagList.forEach(item => {
            if (this.selectTagList.indexOf(item.label_id) > -1) {
                selectTagList.push(item);
            }
        });
        this.selectedTagEvent.emit(selectTagList);
    }

    /**
     * 选择标签
     * @param tag
     */
    public onChangeTag(tag: TagManagementEntity) {
        const findIndex = this.selectTagList.findIndex(item => item === tag.label_id);
        if (findIndex > -1) {
            this.selectTagList.splice(findIndex, 1);
        } else {
            this.selectTagList.push(tag.label_id);
        }
    }

    /**
     * 模板列表
     */
    public onShowTagList(selectTagList: Array<string> = [], isOpen = true) {
        isOpen && (this.searchParams = new SearchParamsEntity());
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
