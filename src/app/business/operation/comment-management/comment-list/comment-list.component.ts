import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AppEntity,
  FirstPageIconEntity,
  FirstPageIconService,
} from '../../mx-parking/first-page-icon/first-page-icon.service';
import { Subject, Subscription, timer } from 'rxjs';
import { FirstPageIconEditComponent } from '../../mx-parking/first-page-icon/first-page-icon-edit/first-page-icon-edit.component';
import { GlobalService } from '../../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { SearchCommentParams } from '../comment-management.service';

const PageSize = 15;

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {

  public iconList: Array<FirstPageIconEntity> = [];
  public appList: Array<AppEntity> = [];
  public pageIndex = 1;
  public searchParams: SearchCommentParams = new SearchCommentParams();
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
  public onCheckStatusClicked(status) {
    this.searchParams.status = status;
    this.searchText$.next();
  }

  // 查询按钮
  public onSearchBtnClick() {
    this.pageIndex = 1;
    this.searchText$.next();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }
}
