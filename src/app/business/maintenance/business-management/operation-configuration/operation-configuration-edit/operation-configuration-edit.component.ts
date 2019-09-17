import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BusinessManagementService,
  UpkeepMerchantAccessoryEntity,
  UpkeepMerchantProjectEntity
} from '../../business-management.service';
import { Subject, Subscription } from 'rxjs';
import { ChooseAccessoryComponent } from './choose-accessory/choose-accessory.component';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { CreateAccessoryComponent } from './create-accessory/create-accessory.component';

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
  selector: 'app-operation-configuration-edit',
  templateUrl: './operation-configuration-edit.component.html',
  styleUrls: ['./operation-configuration-edit.component.css']
})
export class OperationConfigurationEditComponent implements OnInit {

  public accessoryList: Array<UpkeepMerchantAccessoryEntity> = [];
  public accessoryItemList: Array<AccessoryItem> = [];
  public projectList: Array<UpkeepMerchantProjectEntity> = [];
  public projectList_maintain: Array<ProjectItem> = [];
  public projectList_clear: Array<ProjectItem> = [];
  public projectList_fix: Array<ProjectItem> = [];
  public projectItemList: Array<ProjectItem> = [];

  private upkeep_merchant_id: string;
  private upkeep_merchant_product_id: string;
  private continueRequestSubscription: Subscription;
  private searchText$ = new Subject<any>();
  private currentProjectId: string;
  private currentProject = new UpkeepMerchantProjectEntity();

  @ViewChild('chooseAccessoryPromptDiv', { static: true }) public chooseAccessoryPromptDiv: ElementRef;
  @ViewChild('addAccessoryPromptDiv', { static: true }) public addAccessoryPromptDiv: ElementRef;
  @ViewChild(ChooseAccessoryComponent, {static: true}) public chooseAccessoryComponent: ChooseAccessoryComponent;
  @ViewChild(CreateAccessoryComponent, {static: true}) public createAccessoryComponent: CreateAccessoryComponent;

  constructor(private globalService: GlobalService,
              private activatedRoute: ActivatedRoute,
              private businessManagementService: BusinessManagementService,
              private router: Router) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.upkeep_merchant_id = queryParams.upkeep_merchant_id;
      this.upkeep_merchant_product_id = queryParams.upkeep_merchant_product_id;
    });
  }

  ngOnInit() {
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
    const params = {switch: swith};
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

  public onShowAccessory(upkeep_merchant_project_id) {
    this.currentProjectId = upkeep_merchant_project_id;
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

  // 编辑配件、服务
  public onEditClick(data) {
    const params = {
      number: data.number ? data.number : 0,
      sale_amount: data.sale_amount
    };
    this.businessManagementService.requestUpdateUpkeepAccessories(this.upkeep_merchant_id, this.upkeep_merchant_product_id, this.currentProjectId, data.upkeep_merchant_accessory_id, params)
        .subscribe(() => {
          this.globalService.promptBox.open('保存成功！', () => {
            const index = this.accessoryItemList.findIndex(v => v.source.upkeep_merchant_accessory_id === data.upkeep_merchant_accessory_id);
            this.accessoryItemList[index].is_edit_price = false;
          });
        }, err => {
          this.errorProcess(err);
        });
  }

  // 删除配件、服务
  public onDelClick(data) {
    this.businessManagementService.requestDeleteUpkeepAccessory(this.upkeep_merchant_id, this.upkeep_merchant_product_id, this.currentProjectId, data.upkeep_merchant_accessory_id)
        .subscribe(() => {
          this.globalService.promptBox.open('删除成功！', () => {
            this.accessoryList = this.accessoryList.filter(value => value.upkeep_merchant_accessory_id !== data.upkeep_merchant_accessory_id)
            if (this.accessoryList.length === 0) {
              const index = this.projectItemList.findIndex(v => v.source.upkeep_merchant_project_id === data.upkeep_merchant_project.upkeep_merchant_project_id);
              this.projectItemList[index].is_show_accessory = false;
            }
          });
        }, err => {
          this.errorProcess(err);
        });
  }

  // 选择配件
  public onChooseClick(event) {
    const params = {
      upkeep_accessory_id: event.upkeep_accessory_id,
      number: event.number ? event.number : 0,
      sale_amount: event.sale_amount
    };
    this.businessManagementService.requestAddUpkeepAccessories(this.upkeep_merchant_id, this.upkeep_merchant_product_id, this.currentProjectId, params)
        .subscribe(() => {
      this.globalService.promptBox.open('保存成功！', () => {
        this.onClose();
        this.onShowAccessory(this.currentProjectId);
        const index = this.projectItemList.findIndex(v => v.source.upkeep_merchant_project_id === this.currentProjectId);
        this.projectItemList[index].is_show_accessory = true;
      });
    }, err => {
      this.errorProcess(err);
    });
  }

  // 接口错误状态
  private errorProcess(err) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          /* if (content.code === 'invalid' && content.field === 'title') {
             this.errPositionItem.title.isError = true;
             this.errPositionItem.title.errMes = '标题错误或无效！';
             return;
           }*/
        }
      }
    }
  }

  // 新建配件
  public onAddAccessoryClick() {
    this.createAccessoryComponent.open(this.currentProject);
    $(this.addAccessoryPromptDiv.nativeElement).modal('show');
  }

  public onInputNumber(event: any, index: number) {
    this.accessoryList[index].number = Number(event.target.value);
  }

  public onInputSaleAmount(event: any, index: number) {
    this.accessoryList[index].sale_amount = Number(event.target.value);
  }

  public onInputWorkOriginalAmount(event: any, index: number) {
    this.projectList[index].work_original_amount = Number(event.target.value);
  }

  public onInputWorkSaleAmount(event: any, index: number) {
    this.projectList[index].work_sale_amount = Number(event.target.value);
  }

  public onProjectSaveClick(data) {
    this.currentProjectId = data.upkeep_merchant_project_id;
    const params = {
      work_original_amount: data.work_original_amount,
      work_sale_amount: data.work_sale_amount};
    this.businessManagementService.requestUpdateUpkeepProject(this.upkeep_merchant_id, this.upkeep_merchant_product_id, this.currentProjectId, params)
        .subscribe(() => {
          this.globalService.promptBox.open('保存成功！', () => {
            const index = this.projectItemList.findIndex(v => v.source.upkeep_merchant_project_id === this.currentProjectId);
            this.projectItemList[index].is_edit_price = false;
          });
        }, err => {
          this.errorProcess(err);
        });
  }

  public saveSuccess() {
    $(this.addAccessoryPromptDiv.nativeElement).modal('hide');
    this.chooseAccessoryComponent.onSearchBtnClick();
  }
}