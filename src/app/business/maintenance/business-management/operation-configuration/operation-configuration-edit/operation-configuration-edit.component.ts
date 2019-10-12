import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BusinessManagementService,
  UpkeepMerchantAccessoryEntity,
  UpkeepMerchantProjectEntity
} from '../../business-management.service';
import { Subject, Subscription, timer } from 'rxjs';
import { ChooseAccessoryComponent } from './choose-accessory/choose-accessory.component';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { CreateAccessoryComponent } from './create-accessory/create-accessory.component';

class ProjectItem {
  public is_show_accessory = false;
  public is_edit_price = false;
  public upkeep_merchant_project_id_copy: string;
  public time = new Date().getTime();
  public source: UpkeepMerchantProjectEntity;

  constructor(source: UpkeepMerchantProjectEntity) {
    this.source = source;
  }
}

class AccessoryItem {
  public is_edit_price = false;
  public time = new Date().getTime();
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

  public accessoryList: Array<UpkeepMerchantAccessoryEntity> = []; // 保养商户配件列表
  public accessoryItemList: Array<AccessoryItem> = []; // 格式化后的保养商户配件列表
  public projectList: Array<UpkeepMerchantProjectEntity> = []; // 项目列表
  public projectList_copy: Array<UpkeepMerchantProjectEntity> = []; // 被复制的产品项目列表
  public projectList_maintain: Array<ProjectItem> = []; // 格式化后的保养项目列表
  public projectList_clear: Array<ProjectItem> = []; // 格式化后的清洗项目列表
  public projectList_fix: Array<ProjectItem> = []; // 格式化后的维修项目列表
  public projectItemList: Array<ProjectItem> = []; // 格式化后的项目列表
  public image_space = '../../../../../../assets/images/image_space.png'; // 默认图片
  public currentProjectId: string; // 当前项目id
  public currentProjectId_copy: string; // 当前被复制的产品项目id
  public currentProject = new UpkeepMerchantProjectEntity();
  public isLoading = true; // 是否加载中
  public upkeep_merchant_product_id: string; // 商家产品id
  public upkeep_merchant_product_id_copy: string; // 被复制的产品id

  private upkeep_merchant_id: string; // 商家id
  private continueRequestSubscription: Subscription;
  private searchText$ = new Subject<any>();
  private currentAccessory: string; // 当前配件
  private is_first_copy = true; // 是否首次复制

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
      this.upkeep_merchant_product_id_copy = queryParams.upkeep_merchant_product_id_copy;
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
            this.isLoading = false;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    // 如果是复制功能的编辑页，请求被复制产品的项目列表
    if (this.upkeep_merchant_product_id_copy) {
      this.businessManagementService.requestUpkeepProjectList(this.upkeep_merchant_id, this.upkeep_merchant_product_id_copy)
          .subscribe(res => {
            this.projectList_copy = res;
          }, err => {
            this.globalService.httpErrorProcess(err);
          });
    }
  }

  // 选择配件
  public onChooseAccessory(data: UpkeepMerchantProjectEntity) {
    if (data.accessory_count >= 10) {
      this.globalService.promptBox.open('每个项目最多可添加10个产品!', null, 2000, '/assets/images/warning.png');
      return;
    }
    this.currentProject = data;
    this.currentProjectId = data.upkeep_merchant_project_id;
    this.chooseAccessoryComponent.accessory_ids = [];
    this.continueRequestSubscription = this.businessManagementService.requestProjectAccessoriesList
    (this.upkeep_merchant_id, this.upkeep_merchant_product_id, this.currentProjectId)
        .subscribe(res => {
          this.accessoryList = res;
          res.forEach(value => {
            if (this.accessoryItemList.length === 0) {
              this.accessoryItemList.push(new AccessoryItem(value));
            }
            this.chooseAccessoryComponent.accessory_ids.push(value.upkeep_accessory.upkeep_accessory_id);
          });
          $(this.chooseAccessoryPromptDiv.nativeElement).modal('show');
          this.chooseAccessoryComponent.upkeep_item_type = data.upkeep_handbook_item.upkeep_item_type;
          this.chooseAccessoryComponent.initAccessoryType(data);
          this.chooseAccessoryComponent.upkeep_item_type = data.upkeep_handbook_item.upkeep_item_type;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
  }

  // 关闭配件选择页
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
        this.globalService.promptBox.open('开启成功', '/assets/images/success.png');
      } else {
        this.globalService.promptBox.open('关闭成功', '/assets/images/success.png');
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
    // 配件列表有内容时不再重新请求
    if (this.accessoryItemList.length === 0 ||
        upkeep_merchant_project_id !== this.accessoryItemList[0].source.upkeep_merchant_project.upkeep_merchant_project_id) {
      this.requestProjectAccessoriesList();
    }
  }

  // 获取项目配件列表
  private requestProjectAccessoriesList() {
    this.accessoryItemList = [];
    this.continueRequestSubscription = this.businessManagementService.requestProjectAccessoriesList
    (this.upkeep_merchant_id, this.upkeep_merchant_product_id, this.currentProjectId)
        .subscribe(res => {
          this.accessoryList = res;
          res.forEach(value => {
            this.accessoryItemList.push(new AccessoryItem(value));
          });
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
  }

  // 复制功能获取被复制产品下的项目配件列表
  private requestCopyAccessoriesList() {
    this.accessoryItemList = [];
    this.continueRequestSubscription = this.businessManagementService.requestProjectAccessoriesList
    (this.upkeep_merchant_id, this.upkeep_merchant_product_id_copy, this.currentProjectId_copy)
        .subscribe(res => {
          this.accessoryList = res;
          res.forEach(value => {
            const accessory = new AccessoryItem(value);
            // accessory.is_edit_price = true;
            this.accessoryItemList.push(accessory);
            // 循环关联配件和新产品下的项目
            if (this.is_first_copy) {
              const param = {
                upkeep_accessory_id: value.upkeep_accessory.upkeep_accessory_id,
                number: value.number,
                sale_amount: value.sale_amount,
                original_amount: value.original_amount
              };
              this.projectItemList.forEach(value1 => {
                if (value1.upkeep_merchant_project_id_copy === value.upkeep_merchant_project.upkeep_merchant_project_id) {
                  this.onChooseClick(param, value1.source.upkeep_merchant_project_id, true);
                }
              });
            }
          });
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
  }

  // 编辑配件、服务
  public onEditClick(data: UpkeepMerchantAccessoryEntity) {
    const params = {
      number: data.number ? data.number : 0,
      sale_amount: Number(data.sale_amount).toFixed(2),
      original_amount: Number(data.original_amount).toFixed(2)
    };
    if (Number(params.sale_amount) > Number(params.original_amount)) {
      if (data.upkeep_accessory.upkeep_accessory_type === 1) {
        this.globalService.promptBox.open(`配件原价不能小于销售单价!`, null, 2000, '/assets/images/warning.png');
      } else {
        this.globalService.promptBox.open(`服务原价不能小于销售单价!`, null, 2000, '/assets/images/warning.png');
      }
      return;
    }
    if (params.number <= 0 || params.number > 100) {
      this.globalService.promptBox.open('所需数量应大于0小于100!', null, 2000, '/assets/images/warning.png');
      return;
    }
    this.businessManagementService.requestUpdateUpkeepAccessories(this.upkeep_merchant_id, this.upkeep_merchant_product_id, data.upkeep_merchant_project.upkeep_merchant_project_id, data.upkeep_merchant_accessory_id, params)
        .subscribe(() => {
          this.globalService.promptBox.open('保存成功！', () => {
            const index = this.accessoryItemList.findIndex(v => v.source.upkeep_merchant_accessory_id === data.upkeep_merchant_accessory_id);
            this.accessoryItemList[index].is_edit_price = false;
          }, 2000, '/assets/images/success.png');
        }, err => {
          this.errorProcess(err);
        });
  }

  // 删除配件、服务
  public onDelClick(data: UpkeepMerchantAccessoryEntity) {
    this.businessManagementService.requestDeleteUpkeepAccessory(this.upkeep_merchant_id, this.upkeep_merchant_product_id, this.currentProjectId, data.upkeep_merchant_accessory_id)
        .subscribe(() => {
          this.globalService.promptBox.open('删除成功！', () => {
            this.accessoryItemList = this.accessoryItemList.filter(value => value.source.upkeep_merchant_accessory_id !== data.upkeep_merchant_accessory_id)
            const index = this.projectItemList.findIndex(v => v.source.upkeep_merchant_project_id === data.upkeep_merchant_project.upkeep_merchant_project_id);
            if (this.accessoryList.length === 0) {
              this.projectItemList[index].is_show_accessory = false;
            }
            this.projectItemList[index].source.accessory_count = this.projectItemList[index].source.accessory_count - 1;
          }, 2000, '/assets/images/success.png');
        }, err => {
          this.errorProcess(err);
        });
  }

  // 选择配件
  public onChooseClick(event, project_id ?: string, is_copy ?: boolean) {
    const params = {
      upkeep_accessory_id: event.upkeep_accessory_id,
      number: event.number ? event.number : 0,
      sale_amount: event.sale_amount,
      original_amount: event.original_amount
    };
    const projectId = project_id ? project_id : this.currentProjectId;
    this.businessManagementService.requestAddUpkeepAccessories(this.upkeep_merchant_id, this.upkeep_merchant_product_id, projectId, params)
        .subscribe(() => {
          if (is_copy) {
            this.globalService.promptBox.open('导入成功！', () => {}, 2000, '/assets/images/success.png');
          } else {
            this.globalService.promptBox.open('保存成功！', () => {
              this.onClose();
              this.requestProjectAccessoriesList();
              const index = this.projectItemList.findIndex(v => v.source.upkeep_merchant_project_id === this.currentProjectId);
              this.projectItemList[index].is_show_accessory = true;
              this.projectItemList[index].source.accessory_count = this.projectItemList[index].source.accessory_count + 1;
            }, 2000, '/assets/images/success.png');
          }
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
           if (content.code === 'already_existed' && content.resource === 'object') {
             this.globalService.promptBox.open('配件已绑定项目！', null, 2000, '/assets/images/warning.png');
           } else {
             this.globalService.promptBox.open('参数错误或无效！', null, 2000, '/assets/images/warning.png');
           }
        }
      }
    }
  }

  // 新建配件
  public onAddAccessoryClick() {
    this.createAccessoryComponent.open(this.currentProject);
    $(this.addAccessoryPromptDiv.nativeElement).modal('show');
  }

  public onAmountChange(event: any) {
    if (!isNaN(Number(event.target.value))) {
    event.target.value = Number(event.target.value).toFixed(2);
    } else {
      event.target.value = '';
    }
  }

  // 保存工时费
  public onProjectSaveClick(data) {
    this.currentProjectId = data.upkeep_merchant_project_id;
    const params = {
      work_original_amount: Number(data.work_original_amount).toFixed(2),
      work_sale_amount: Number(data.work_sale_amount).toFixed(2)
    };
    if (params.work_sale_amount > params.work_original_amount) {
      this.globalService.promptBox.open('工时费原价不能小于工时费售价!', null, 2000, '/assets/images/warning.png');
      return;
    }
    this.businessManagementService.requestUpdateUpkeepProject(this.upkeep_merchant_id, this.upkeep_merchant_product_id, this.currentProjectId, params)
        .subscribe(() => {
          this.globalService.promptBox.open('保存成功！', () => {
            const index = this.projectItemList.findIndex(v => v.source.upkeep_merchant_project_id === this.currentProjectId);
            this.projectItemList[index].is_edit_price = false;
          }, 2000, '/assets/images/success.png');
        }, err => {
          this.errorProcess(err);
        });
  }

  public saveSuccess() {
    $(this.addAccessoryPromptDiv.nativeElement).modal('hide');
    this.chooseAccessoryComponent.onSearchBtnClick();
  }

  // 限制input[type='number']输入e
  public inputNumberLimit(event: any): boolean {
    const reg = /^\d*?\.?\d*?$/;
    const keyCode = String.fromCharCode(event.keyCode);
    return (keyCode && reg.test(keyCode));
  }

  // 限制input[type='number']输入e
  public inputOnlyNumberLimit(event: any): boolean {
    const reg = /[\d]/;
    const keyCode = String.fromCharCode(event.keyCode);
    return (keyCode && reg.test(keyCode));
  }

  // 点击编辑按钮，暂存数据，取消时重新恢复数据
  public onDoEditClick(data) {
    const param = JSON.stringify(data);
    this.currentAccessory = param;
  }

  // 点击取消按钮，恢复未保存的数据
  public onConcleClick(index) {
    if (this.accessoryItemList && this.accessoryItemList[index]) {
      this.accessoryItemList[index].source = JSON.parse(this.currentAccessory);
    }
  }

  // 点击一键导入项目信息
  public onImportProjectClick() {
    this.projectItemList.forEach(value => {
      this.projectList_copy.forEach(value1 => {
        if (value.source.upkeep_handbook_item.item_id === value1.upkeep_handbook_item.item_id && value1.switch) {
          this.currentProjectId = value.source.upkeep_merchant_project_id;
          this.currentProjectId_copy = value1.upkeep_merchant_project_id;
          this.currentProject = value.source;
          value.source.accessory_count = value1.accessory_count;
          value.source.work_original_amount = value1.work_original_amount;
          value.source.work_sale_amount = value1.work_sale_amount;
          value.is_edit_price = true;
          value.is_show_accessory = true;
          value.upkeep_merchant_project_id_copy = value1.upkeep_merchant_project_id;
          this.requestCopyAccessoriesList();
        }
      });
    });
    timer(500).subscribe(() => {
      this.is_first_copy = false;
    });
  }
}
