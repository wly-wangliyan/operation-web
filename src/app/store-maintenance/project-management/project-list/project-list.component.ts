import { Component, OnInit, ViewChild } from '@angular/core';
import { BrokerageEntity, InsuranceService } from '../../../operational-system/insurance/insurance.service';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ProjectEditComponent } from '../project-edit/project-edit.component';
import { ParamEntity, ProjectEntity, ProjectManagementHttpService } from '../project-management-http.service';

const PageSize = 15;

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  public projectList: Array<ProjectEntity> = [];
  public pageIndex = 1;
  public noResultText = '数据加载中...';

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;

  @ViewChild(ProjectEditComponent, {static: true}) public projectEditComponent: ProjectEditComponent;

  private get pageCount(): number {
    if (this.projectList.length % PageSize === 0) {
      return this.projectList.length / PageSize;
    }
    return this.projectList.length / PageSize + 1;
  }

  constructor(private globalService: GlobalService,
              private projectHttpService: ProjectManagementHttpService) {
  }

  ngOnInit() {
    const temp = [];
    temp.push({});
    this.projectList = temp;
    this.searchText$.pipe(
        debounceTime(500),
        switchMap(() =>
            this.projectHttpService.requestProjectListData())
    ).subscribe(res => {
      this.projectList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.noResultText = '暂无数据';
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.projectHttpService.continueProjectListData(this.linkUrl).subscribe(res => {
        this.projectList = this.projectList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 查询
  public onSearchBtnClick() {
    this.pageIndex = 1;
    this.searchText$.next();
  }

  // 显示编辑保养项目模态框
  public onEditProjectClick(data) {
    this.projectEditComponent.openProjectModal(data, () => {
      this.projectEditComponent.clear();
      this.pageIndex = 1;
      timer(0).subscribe(() => {
        this.searchText$.next();
      });
    }, '保存', () => {
      this.projectEditComponent.clear();
    });
  }

  // 显示配件参数模态框
  public onEditParamClick(data: ProjectEntity) {
    this.projectEditComponent.openParamModal(data, () => {
      this.projectEditComponent.clear();
      this.pageIndex = 1;
      timer(0).subscribe(() => {
        this.searchText$.next();
      });
    }, '保存', () => {
      this.projectEditComponent.clear();
    });
  }
}
