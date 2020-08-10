import { Component, OnInit } from '@angular/core';
import { SearchParamsEntity, TagManagementEntity, TagManagementService } from '../tag-management.service';
import { GlobalService } from '../../../../core/global.service';
import { DisabledTimeHelper } from '../../../../../utils/disabled-time-helper';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { HttpErrorEntity } from '../../../../core/http.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-tag-car-list',
  templateUrl: './tag-car-list.component.html',
  styleUrls: ['./tag-car-list.component.css']
})
export class TagCarListComponent implements OnInit {

  public start_time: any = '';
  public end_time: any = '';
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
    let to_label_id = '';
    if (event.previousIndex > event.currentIndex) {
      const index = event.currentIndex > 0 ? event.currentIndex - 1 : 0;
      to_label_id = results[index].label_id;
    } else {
      to_label_id = results[event.currentIndex].label_id;
    }
    // moveItemInArray(results, event.previousIndex, event.currentIndex);
    this.requestTagSort(this.tagList[event.previousIndex].label_id, to_label_id);
  }

  /**
   * 标签排序
   * @param label_id
   */
  public onTagSortClick(label_id) {
    const findIndex = this.tagList.findIndex(item => item.label_id === label_id);
    const to_label_id = this.tagList[findIndex - 1].label_id;
    this.requestTagSort(label_id, to_label_id);
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
    if (this.start_time && this.end_time) {
      const sTime = ((new Date(this.start_time).setSeconds(0, 0) / 1000));
      const eTime = ((new Date(this.end_time).setSeconds(0, 0) / 1000));
      if (sTime > eTime) {
        this.globalService.promptBox.open('创建时间的开始时间应小于等于结束时间！', null, 2000, null, false);
        return false;
      }
      this.searchParams.section = `${sTime},${eTime}`;
    } else {
      this.searchParams.section = null;
    }
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
      this.globalService.promptBox.open(isTop ? '置顶成功！' : '排序成功！', () => {
        this.requestTagList();
      });
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }
}
