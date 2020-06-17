import { Component, OnInit, ViewChild } from '@angular/core';
import { NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { GlobalService } from '../../../../../core/global.service';
import { BusinessEditComponent } from '../components/business-edit/business-edit.component';
import { BusinessChooseComponent } from '../components/business-choose/business-choose.component';
import { ActivityBusinessService, ActivityEntity, BusinessEntity } from '../activity-business.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-activity-business-edit',
  templateUrl: './activity-business-edit.component.html',
  styleUrls: ['./activity-business-edit.component.css']
})
export class ActivityBusinessEditComponent implements OnInit {

  public tab_index = 1; // 1： 基础信息 2：商家列表
  public activityParams: ActivityEntity = new ActivityEntity();
  public nzSearchAssistant: NzSearchAssistant;

  private movement_id: string;
  private searchText$ = new Subject<any>();

  @ViewChild(BusinessEditComponent, {static: true}) public businessEditComponent: BusinessEditComponent;
  @ViewChild(BusinessChooseComponent, {static: true}) public businessChooseComponent: BusinessChooseComponent;

  constructor(private globalService: GlobalService,
              private activityService: ActivityBusinessService,
              private route: ActivatedRoute,
              private router: Router) {
    this.nzSearchAssistant = new NzSearchAssistant(this);
    this.route.paramMap.subscribe(map => {
      this.movement_id = map.get('movement_id');
    });
  }

  ngOnInit() {
    this.searchText$.pipe().subscribe(() => {
      this.requestActivityDetail();
    });
    this.searchText$.next();
  }

  // 获取详情
  private requestActivityDetail() {
    this.activityService.requestActivityDetail(this.movement_id).subscribe(res => {
      this.activityParams = res;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  public onTabChange(index: number) {
    this.tab_index = index;
    if (index === 1) {
      this.searchText$.next();
    } else {
      this.nzSearchAssistant.submitSearch(true);
    }
  }

  // form表单提交
  public onEditFormSubmit() {
    this.activityService.requestUpdateActivity(this.movement_id, this.activityParams).subscribe(res => {
      this.globalService.promptBox.open('保存成功!');
    }, err => {
      this.globalService.promptBox.open('保存失败，请重试!', null, 2000, null, false);
      this.globalService.httpErrorProcess(err);
    });
  }

  // 取消
  public onCancelClick() {
    window.history.back();
  }

  // 选择门店
  public onChooseClick() {
    this.businessChooseComponent.open(this.movement_id, () => {
      this.nzSearchAssistant.submitSearch(false);
    });
  }

  // 新建、编辑活动门店
  public onEditBusinessClick(data: BusinessEntity) {
    this.businessEditComponent.open(data, () => {
      this.nzSearchAssistant.submitSearch(false);
    });
  }

  // 删除商家
  public onDelBusinessClick(movement_shop_id: string) {
    this.globalService.confirmationBox.open('提示', '删除后将不可恢复，确认删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.activityService.requestDeleteBusiness(movement_shop_id).subscribe(() => {
        this.globalService.promptBox.open('删除成功!');
        this.nzSearchAssistant.submitSearch(false);
      }, error => {
        this.globalService.promptBox.open('删除失败，请重试!', null, 2000, null, false);
        this.globalService.httpErrorProcess(error);
      });
    });
  }

  /* NzSearchAdapter 接口实现 */

  /* 请求检索 */
  public requestSearch(): any {
    return this.activityService.requestBusinessList(this.movement_id);
  }

  public continueSearch(url: string): any {
    return this.activityService.continueBusinessList(url);
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    return true;
  }

  /* 检索失败处理 */
  public searchErrProcess(err: any) {
    this.globalService.httpErrorProcess(err);
  }

  /* 检索成功处理 */
  public searchCompleteProcess(results: Array<any>, isFuzzySearch: boolean) { }
}
