import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileImportViewModel } from '../../../../utils/file-import.model';
import { Subject, Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { HttpErrorEntity } from '../../../core/http.service';
import { GarageManagementService, SupplyConfigParams, SupplyConfigEntity, SetSupplyConfigParams } from '../garage-management.service';
import { ProjectEntity, AccessoryLibraryService, AccessoryEntity } from '../../accessory-library/accessory-library.service';

const PageSize = 15;

@Component({
  selector: 'app-supply-config-list',
  templateUrl: './supply-config-list.component.html',
  styleUrls: ['./supply-config-list.component.css']
})
export class SupplyConfigListComponent implements OnInit {

  public accessoryList: Array<AccessoryEntity> = []; // 配件列表

  public searchParams: SupplyConfigParams = new SupplyConfigParams();
  public importViewModel: FileImportViewModel = new FileImportViewModel();
  public projectList: Array<ProjectEntity> = []; // 所属项目
  public configParams: SetSupplyConfigParams = new SetSupplyConfigParams();

  private searchText$ = new Subject<any>();
  private continueRequestSubscription: Subscription;
  private linkUrl: string;
  public pageIndex = 1;
  public noResultText = '数据加载中...';

  private repair_shop_id: string; // 汽修店id

  private get pageCount(): number {
    if (this.accessoryList.length % PageSize === 0) {
      return this.accessoryList.length / PageSize;
    }
    return this.accessoryList.length / PageSize + 1;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private accessoryService: AccessoryLibraryService,
    private garageService: GarageManagementService) {
    this.route.paramMap.subscribe(map => {
      this.repair_shop_id = map.get('repair_shop_id');
    });
  }

  public ngOnInit() {
    if (this.repair_shop_id) {
      this.generateConfigList();
      this.requestProjectList();
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  // 初始化获取供货配置列表
  private generateConfigList() {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestConfigList();
    });
    this.searchText$.next();
  }

  // 请求配置列表
  private requestConfigList() {
    this.garageService.requestSupplyConfigList(this.searchParams, this.repair_shop_id).subscribe(res => {
      this.accessoryList = res.results;
      this.linkUrl = res.linkUrl;
      this.pageIndex = 1;
      this.noResultText = '暂无数据';
    }, err => {
      this.pageIndex = 1;
      this.noResultText = '暂无数据';
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取项目列表
  private requestProjectList() {
    this.accessoryService.requestProjectListData().subscribe(res => {
      this.projectList = res.results;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 翻页方法
  public onNZPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.garageService.continueSupplyConfigList(this.linkUrl).subscribe(res => {
        this.accessoryList = this.accessoryList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }

  // 查询
  public onSearchBtnClick() {
    this.searchText$.next();
  }

  public onSettingClick(data: AccessoryEntity): void {
    this.configParams = new SetSupplyConfigParams();
    this.configParams.supply_type = data.supply_type || '';
    this.configParams.accessory_ids = data.accessory_id;
    $('#configModal').modal();
  }

  public onChangeSupplyType(event: any): void {
    if (event.target.value) {
      this.configParams.supply_type = Number(event.target.value);
    }
  }

  public onCheckClick(): void {
    this.garageService.requestSetSupplyConfig(this.repair_shop_id, this.configParams).subscribe(() => {
      $('#configModal').modal('hide');
      this.globalService.promptBox.open('保存成功');
      this.searchText$.next();
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }
}
