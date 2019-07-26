import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { GlobalService } from '../../../../core/global.service';
import { FirstPageIconEditComponent } from '../first-page-icon-edit/first-page-icon-edit.component';

const PageSize = 15;

@Component({
  selector: 'app-first-page-icon',
  templateUrl: './first-page-icon.component.html',
  styleUrls: ['./first-page-icon.component.css']
})
export class FirstPageIconComponent implements OnInit {
  public projectList: Array<any> = [];
  public pageIndex = 1;
  public searchParams: any;
  public noResultText = '数据加载中...';

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;

  @ViewChild(FirstPageIconEditComponent, { static: true }) public firstPageIconEditComponent: FirstPageIconEditComponent;

  private get pageCount(): number {
    if (this.projectList.length % PageSize === 0) {
      return this.projectList.length / PageSize;
    }
    return this.projectList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService) {
    // this.searchParams.page_size = PageSize * 3;
  }

  ngOnInit() {
    this.searchParams = {status: 1};
    /*this.searchText$.pipe(
        debounceTime(500),
        switchMap(() =>
            this.projectService.requestUsersList(this.searchParams))
    ).subscribe(res => {
      this.projectList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();*/
  }

  // 显示添加编辑项目modal
  public onShowModal(isCreateProject, data) {
    const showMes = isCreateProject ? '确定添加' : '确定修改';
    this.firstPageIconEditComponent.open(data, () => {
       this.firstPageIconEditComponent.clear();
       this.pageIndex = 1;
       timer(0).subscribe(() => {
         // this.searchText$.next();
       });
     }, showMes, () => {
       this.firstPageIconEditComponent.clear();
     });
  }

  // 查询按钮
  public onSearchBtnClick() {
    // this.searchParams.project_name = this.searchParams.project_name.trim();
    this.searchText$.next();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 清空按钮
  public onResetBtnClick() {
    // this.searchParams = new SearchProjectParams();
    this.searchText$.next();
  }

  public onNZPageIndexChange(pageIndex: number) {
    /*this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.projectService.continueUsersList(this.linkUrl).subscribe(res => {
        this.projectList = this.projectList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }*/
  }

  public onHideBtnClick(data) {

  }

  // 删除某一项目
  public onDeleteBtnClick(data: any) {
    /*this.globalService.confirmationBox.open('警告', '您确认删除，删除后信息将无法恢复。', () => {
      this.globalService.confirmationBox.close();
      this.projectService.requestDeleteUser(data.project_id).subscribe((e) => {
        this.projectList = this.projectList.filter(project => project.project_id !== data.project_id);
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });*/
  }

  public onCheckStatusClicked(index) {
    this.searchParams.status = index;
  }
}
