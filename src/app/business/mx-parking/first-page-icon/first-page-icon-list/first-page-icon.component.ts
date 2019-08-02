import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { GlobalService } from '../../../../core/global.service';
import { FirstPageIconEditComponent } from '../first-page-icon-edit/first-page-icon-edit.component';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { AppEntity, FirstPageIconEntity, FirstPageIconService, SearchFirstPageIconParams } from '../first-page-icon.service';

const PageSize = 15;

@Component({
  selector: 'app-first-page-icon',
  templateUrl: './first-page-icon.component.html',
  styleUrls: ['./first-page-icon.component.css']
})
export class FirstPageIconComponent implements OnInit {
  public iconList: Array<FirstPageIconEntity> = [];
  // public iconList: Array<any> = [];
  public appList: Array<AppEntity> = [];
  public pageIndex = 1;
  public searchParams: SearchFirstPageIconParams = new SearchFirstPageIconParams();
  public noResultText = '数据加载中...';
  public application_id: string;

  private searchText$ = new Subject<any>();
  private searchAppText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;

  @ViewChild(FirstPageIconEditComponent, { static: true }) public firstPageIconEditComponent: FirstPageIconEditComponent;
  @ViewChild('basicTable', { static: true }) public basicTable: ElementRef;

  private get pageCount(): number {
    if (this.iconList.length % PageSize === 0) {
      return this.iconList.length / PageSize;
    }
    return this.iconList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService,
              private firstPageIconService: FirstPageIconService) {
    this.searchParams.page_size = PageSize * 3;
  }

  ngOnInit() {
    this.searchAppText$.pipe(debounceTime(500), switchMap(() => this.firstPageIconService.requestAppList()))
        .subscribe(res => {
          this.appList = res;
          this.application_id = this.appList.length > 0 ? this.appList[0].application_id : null;
          this.requestFirstPageIconList();
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    this.searchAppText$.next();
  }

  //  请求App首页图标配置信息
  private requestFirstPageIconList() {
    this.searchText$.pipe(debounceTime(500), switchMap(() => this.firstPageIconService.requestFirstPageIconList(this.application_id))
    ).subscribe(res => {
      this.iconList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  // 显示添加编辑项目modal
  public onShowModal(data) {
    if (data && (data.title === '自助缴费' || data.title === '油卡充值' || data.title === '检车服务' || data.title === '月卡服务')) {
      this.globalService.promptBox.open('自助缴费、油卡充值、检车服务、月卡服务不可编辑!', null, 2000, '/assets/images/warning.png');
      return;
    }
    const app = this.appList.filter(v => v.application_id === this.application_id);
    const menu_id = data ? data.menu_id : null;
    this.firstPageIconEditComponent.open(menu_id, app[0], () => {
       this.firstPageIconEditComponent.clear();
       this.pageIndex = 1;
       timer(0).subscribe(() => {
         this.searchText$.next();
       });
     }, '保存', () => {
       this.firstPageIconEditComponent.clear();
     });
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.firstPageIconService.continueFirstPageIconList(this.linkUrl).subscribe(res => {
        this.iconList = this.iconList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 隐藏、开启按钮触发事件
  public onHideBtnClick(data: any, dispaly: boolean) {
    if (data && dispaly && data.title === '自助缴费') {
      this.globalService.promptBox.open('自助缴费不可隐藏!', null, 2000, '/assets/images/warning.png');
      return;
    }
    const icon_display = this.iconList.filter(v => !v.is_display);
    if (!dispaly && icon_display.length >= 10) {
      this.globalService.promptBox.open('每个系统最大可同时显示10个icon!', null, 2000, '/assets/images/warning.png');
      return;
    }
    const param = {is_display: dispaly};
    this.firstPageIconService.requestDisplayMenu(this.application_id, data.menu_id, param).subscribe((e) => {
      const msg = dispaly ? '隐藏成功！' : '显示成功！';
      this.globalService.promptBox.open(msg);
      this.searchText$.next();
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 删除某一App首页图标配置
  public onDeleteBtnClick(data: any) {
    if (data && (data.title === '自助缴费' || data.title === '油卡充值' || data.title === '检车服务' || data.title === '月卡服务')) {
      this.globalService.promptBox.open('自助缴费、油卡充值、检车服务、月卡服务不可删除!', null, 2000, '/assets/images/warning.png');
      return;
    }
    this.globalService.confirmationBox.open('警告', '删除后将不可恢复，确认删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.firstPageIconService.requestDeleteFirstPageIcon(data.menu_id, this.application_id).subscribe((e) => {
        this.iconList = this.iconList.filter(icon => icon.menu_id !== data.menu_id);
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
  }

  //  切换应用
  public onCheckStatusClicked(application_id) {
    this.application_id = application_id;
    this.searchText$.next();
  }

  // 列表排序
  public drop(event: CdkDragDrop<string[]>, data): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    let param = {};
    if (event.previousIndex > event.currentIndex) {
      const index = event.currentIndex > 0 ? event.currentIndex - 1 : 0;
      param = {move_num: this.iconList[index].sort_num};
      if (event.currentIndex === 0 && this.iconList[index].sort_num === 1) {
        param = {move_num: 0};
      }
    } else {
      param = {move_num: this.iconList[event.currentIndex].sort_num};
    }
    moveItemInArray(data, event.previousIndex, event.currentIndex);
    this.firstPageIconService.requestUpdateSort(this.iconList[event.previousIndex].menu_id, param).subscribe((e) => {
      this.searchText$.next();
      this.globalService.promptBox.open('排序成功');
    }, err => {
      this.globalService.httpErrorProcess(err);
      this.searchText$.next();
    });
  }
}
