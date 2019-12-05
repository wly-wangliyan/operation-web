import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Subject, timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GlobalService } from '../../../core/global.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})

export class DetailComponent implements OnInit {

  public noResultText = '数据加载中...';
  public checkLabelList: Array<any> = [];
  public checkedLabelList: Array<any> = [];
  public name: string;

  private sureCallback: any;
  private subscription: Subscription;
  private searchText$ = new Subject<any>();

  @Input() public tagsList: Array<any> = [];

  @ViewChild('promptDiv', { static: true }) public promptDiv: ElementRef;

  constructor(private globalService: GlobalService) {
  }

  ngOnInit() {

  }

  // 查询按钮
  public onSearchBtnClick() {
    this.searchText$.next();
  }

  /**
   * 取消按钮触发关闭模态框，释放订阅。
   */
  public onCloseLabel() {
    this.searchText$.next();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.sureCallback) {
      this.sureCallback = null;
    }
    $(this.promptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param tagsList 标签数组
   * @param sureFunc 确认回调
   */
  public open(tagsList: Array<any>, sureFunc: any) {
    this.tagsList = tagsList;
    this.searchText$.next();
    this.sureCallback = sureFunc;
    timer(0).subscribe(() => {
      $(this.promptDiv.nativeElement).modal('show');
    });
  }

  // 保存选择的标签
  public onSaveTagsId() {
    this.checkedLabelList = this.checkLabelList.filter(i => i.checked);
    if (this.checkedLabelList.length === 0) {
      this.globalService.promptBox.open(`请选择标签!`, null, 2000, '/assets/images/warning.png');
    } else if (this.checkedLabelList.length > 3) {
      this.globalService.promptBox.open(`最多可添加3个标签!`, null, 2000, '/assets/images/warning.png');
    } else {
      if (this.sureCallback) {
        const temp = this.sureCallback;
        temp();
      }
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      if (this.sureCallback) {
        this.sureCallback = null;
      }
      $(this.promptDiv.nativeElement).modal('hide');
    }
  }

}

