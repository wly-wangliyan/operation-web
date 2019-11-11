import { Component, OnInit, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { GlobalService } from '../../../../core/global.service';
import { ProductService, SearchLabelParams, LabelEntity } from '../product.service';
import { LabelEditComponent } from './label-edit/label-edit.component';

@Component({
  selector: 'app-label-management',
  templateUrl: './label-management.component.html',
  styleUrls: ['./label-management.component.css']
})
export class LabelManagementComponent implements OnInit {
  public labelList: Array<LabelEntity> = [];
  public searchParams: SearchLabelParams = new SearchLabelParams();
  public noResultText = '数据加载中...';
  public tabs: Array<any> = [];
  public selectedTabIndex = 0;

  @ViewChild('labelEdit', { static: true }) public labelEdit: LabelEditComponent;

  constructor(private globalService: GlobalService, private productService: ProductService, ) { }

  ngOnInit() {
    this.tabs = [
      { key: 0, value: '全部' },
      { key: 1, value: '已推荐' },
    ];
    this.selectedTabIndex = 0;
    this.onTabChange(this.selectedTabIndex);
  }

  // 切换tab加载页面
  public onTabChange(key: number) {
    this.searchParams.is_recommended = key === 0 ? false : true;
    this.productService.requestLabelListData(this.searchParams).subscribe(res => {
      this.labelList = res.results;
      this.noResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 新建/编辑标签
  public onEditLabel(tag_id: string, name: string, index: number) {
    this.labelEdit.open(tag_id, name, () => {
      timer(1000).subscribe(() => {
        this.selectedTabIndex = index;
        this.onTabChange(this.selectedTabIndex);
      });
    });
  }

  // 推荐标签
  public onRecommendeLabel(tag_id: string, is_recommended: boolean) {
    const text = is_recommended ? '推荐' : '取消推荐';
    this.productService.requestRecommendeLabelData(tag_id, is_recommended).subscribe(() => {
      this.globalService.promptBox.open(`${text}成功`, () => {
        this.selectedTabIndex = is_recommended ? 0 : 1;
        this.onTabChange(this.selectedTabIndex);
      });
    }, err => {
      this.globalService.promptBox.open(`${text}失败，请重试!`, null, 2000, '/assets/images/warning.png');
    });
  }

  // 删除标签
  public onDelLabel(tag_id: string) {
    this.globalService.confirmationBox.open('提示', '此操作不可恢复，确定要删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.productService.requestDeleteLabelData(tag_id).subscribe(() => {
        this.globalService.promptBox.open('删除成功', () => {
          this.selectedTabIndex = 0;
          this.onTabChange(this.selectedTabIndex);
        });
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
  }

  // 列表排序
  public onDropLabelList(event: CdkDragDrop<string[]>, data: any): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    let param = {};
    if (event.previousIndex > event.currentIndex) {
      const index = event.currentIndex > 0 ? event.currentIndex - 1 : 0;
      param = { order_num: this.labelList[index].order_num };
      if (event.currentIndex === 0 && this.labelList[index].order_num === 1) {
        param = { order_num: 0 };
      }
    } else {
      param = { order_num: this.labelList[event.currentIndex].order_num };
    }
    moveItemInArray(data, event.previousIndex, event.currentIndex);
    this.productService.requestLabelSort(this.labelList[event.previousIndex].tag_id, param).subscribe((e) => {
      this.selectedTabIndex = 1;
      this.onTabChange(this.selectedTabIndex);
      this.globalService.promptBox.open('排序成功');
    }, err => {
      this.globalService.promptBox.open('排序失败，请重试!', null, 2000, '/assets/images/warning.png');
      this.selectedTabIndex = 1;
      this.onTabChange(this.selectedTabIndex);
    });
  }

}
