import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BusinessManagementService, UpkeepMerchantAccessoryEntity, UpkeepMerchantProjectEntity } from '../../business-management.service';
import { Subject, Subscription } from 'rxjs';
import { ChooseAccessoryComponent } from '../operation-configuration-edit/choose-accessory/choose-accessory.component';
import { CreateAccessoryComponent } from '../operation-configuration-edit/create-accessory/create-accessory.component';
import { GlobalService } from '../../../../../core/global.service';
import { ActivatedRoute, Router } from '@angular/router';

class ProjectItem {
  public is_show_accessory = false;
  public is_edit_price = false;
  public source: UpkeepMerchantProjectEntity;

  constructor(source: UpkeepMerchantProjectEntity) {
    this.source = source;
  }
}

class AccessoryItem {
  public is_edit_price = false;
  public source: UpkeepMerchantAccessoryEntity;

  constructor(source: UpkeepMerchantAccessoryEntity) {
    this.source = source;
  }
}

@Component({
  selector: 'app-operation-configuration-detail',
  templateUrl: './operation-configuration-detail.component.html',
  styleUrls: ['./operation-configuration-detail.component.css']
})
export class OperationConfigurationDetailComponent implements OnInit {

  public accessoryList: Array<UpkeepMerchantAccessoryEntity> = []; // 保养商户列表
  public accessoryItemList: Array<AccessoryItem> = []; // 格式化后保养商户列表
  public projectList: Array<UpkeepMerchantProjectEntity> = []; // 保养商家产品下项目列表
  public projectList_maintain: Array<ProjectItem> = []; // 保养项目列表
  public projectList_clear: Array<ProjectItem> = []; // 清洗养护项目列表
  public projectList_fix: Array<ProjectItem> = []; // 维修项目列表
  public projectItemList: Array<ProjectItem> = []; // 格式化后保养商家产品下项目列表

  private upkeep_merchant_id: string; // 保养商户id
  private upkeep_merchant_product_id: string; // 保养商户产品id
  private continueRequestSubscription: Subscription;
  private searchText$ = new Subject<any>();
  public currentProjectId: string; // 配件id
  public currentProject = new UpkeepMerchantProjectEntity(); // 当前选择的配件

  public image_space = '../../../../../../assets/images/image_space.png'; // 默认图片

  @ViewChild('chooseAccessoryPromptDiv', { static: true }) public chooseAccessoryPromptDiv: ElementRef;
  @ViewChild('addAccessoryPromptDiv', { static: true }) public addAccessoryPromptDiv: ElementRef;
  @ViewChild(ChooseAccessoryComponent, { static: true }) public chooseAccessoryComponent: ChooseAccessoryComponent;
  @ViewChild(CreateAccessoryComponent, { static: true }) public createAccessoryComponent: CreateAccessoryComponent;

  constructor(
    private globalService: GlobalService,
    private activatedRoute: ActivatedRoute,
    private businessManagementService: BusinessManagementService,
    private router: Router) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.upkeep_merchant_id = queryParams.upkeep_merchant_id;
      this.upkeep_merchant_product_id = queryParams.upkeep_merchant_product_id;
    });
  }

  ngOnInit() {
    // 请求获取保养商家产品下项目列表
    this.businessManagementService.requestUpkeepProjectList(this.upkeep_merchant_id, this.upkeep_merchant_product_id)
      .subscribe(res => {
        this.projectList = res;
        res.forEach(value => {
          this.projectItemList.push(new ProjectItem(value));
        });
        this.projectList_maintain = this.projectItemList.filter(v => v.source.upkeep_handbook_item.item_category === 1);
        this.projectList_clear = this.projectItemList.filter(v => v.source.upkeep_handbook_item.item_category === 2);
        this.projectList_fix = this.projectItemList.filter(v => v.source.upkeep_handbook_item.item_category === 3);
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
  }

  // 选择配件
  public onChooseAccessory(data) {
    this.currentProject = data;
    this.currentProjectId = data.upkeep_merchant_project_id;
    $(this.chooseAccessoryPromptDiv.nativeElement).modal('show');
    this.chooseAccessoryComponent.upkeep_item_type = data.upkeep_handbook_item.upkeep_item_type;
  }

  public onClose() {
    $(this.chooseAccessoryPromptDiv.nativeElement).modal('hide');
  }

  // 编辑商家项目状态
  public onSwitchChange(data, event) {
    const swith = event ? true : false;
    const params = { switch: swith };
    this.businessManagementService.requestUpkeepProductStatus
      (this.upkeep_merchant_id, data.upkeep_merchant_product.upkeep_merchant_product_id, data.upkeep_merchant_project_id, params)
      .subscribe(res => {
        if (event) {
          this.globalService.promptBox.open('开启成功');
        } else {
          this.globalService.promptBox.open('关闭成功');
        }
        this.searchText$.next();
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          if (err.status === 422) {
            if (event) {
              this.globalService.promptBox.open('开启失败，请重试', null, 2000, '/assets/images/warning.png');
            } else {
              this.globalService.promptBox.open('关闭失败，请重试', null, 2000, '/assets/images/warning.png');
            }
          }
        }
        this.searchText$.next();
      });
  }

  // 获取配件列表并展示
  public onShowAccessory(upkeep_merchant_project_id) {
    this.projectItemList.forEach(value => {
      value.is_show_accessory = false;
    });
    this.currentProjectId = upkeep_merchant_project_id;
    this.accessoryItemList = [];
    this.continueRequestSubscription = this.businessManagementService.requestProjectAccessoriesList
      (this.upkeep_merchant_id, this.upkeep_merchant_product_id, upkeep_merchant_project_id)
      .subscribe(res => {
        this.accessoryList = res;
        res.forEach(value => {
          this.accessoryItemList.push(new AccessoryItem(value));
        });
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
  }
}
