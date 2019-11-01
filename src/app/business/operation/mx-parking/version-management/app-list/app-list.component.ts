import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../../core/global.service';
import { AppAddComponent } from '../app-add/app-add.component';
import { Router } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AppEntity, FirstPageIconService } from '../../first-page-icon/first-page-icon.service';
import { VersionManagementService } from '../version-management.service';

@Component({
  selector: 'app-version-management-app',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.css']
})
export class AppListComponent implements OnInit {
  public appList: Array<AppEntity> = [];
  public pageIndex = 1;
  public searchParams: any;
  public noResultText = '数据加载中...';

  private searchText$ = new Subject<any>();

  @ViewChild(AppAddComponent, { static: true }) public appComponent: AppAddComponent;

  constructor(private globalService: GlobalService,
              private firstPageIconService: FirstPageIconService,
              private versionManagementService: VersionManagementService,
              private router: Router) {
  }

  ngOnInit() {
    this.searchText$.pipe(debounceTime(500), switchMap(() => this.firstPageIconService.requestAppList()))
      .subscribe(res => {
        this.appList = res;
        this.noResultText = '暂无数据';
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    this.searchText$.next();
  }

  // 显示添加编辑项目modal
  public onShowModal() {
    if (this.appList.length > 7) {
      this.globalService.promptBox.open('最多可添加8个应用！', null, 2000, '/assets/images/warning.png');
      return;
    }
    this.appComponent.open(() => {
      this.appComponent.clear();
      this.pageIndex = 1;
      timer(0).subscribe(() => {
        this.searchText$.next();
      });
    }, '保存', () => {
      this.appComponent.clear();
    });
  }

  // 版本管理
  public onVersionBtnClick(data) {
    this.router.navigate(['/main/operation/parking/version-management/version-list'],
      { queryParams: { application_name: data.application_name, application_id: data.application_id } });
  }

  // 删除某一项目
  public onDeleteBtnClick(data: any) {
    this.globalService.confirmationBox.open('警告', '删除后将不可恢复，确认删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.versionManagementService.requestDeleteApplication(data.application_id).subscribe((e) => {
        this.appList = this.appList.filter(app => app.application_id !== data.application_id);
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
  }
}
