import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ChooseProjectComponent } from './choose-project/choose-project.component';
import { ChooseBrandComponent } from './choose-brand/choose-brand.component';
import { isUndefined } from 'util';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GlobalService } from '../../../core/global.service';
import { Subject, timer, forkJoin } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  AccessoryLibraryService,
  SpecificationEntity,
  AccessoryEntity,
  SearchAccessoryParams,
  ProjectEntity,
  PriceInfoEntity,
  AccessoryParamsEntity,
} from '../accessory-library.service';
import { HttpErrorEntity } from '../../../core/http.service';
import { ZPhotoSelectComponent } from '../../../share/components/z-photo-select/z-photo-select.component';
import { ParamEntity } from '../../project-management/project-management-http.service';

export class ErrMessageItem {
  public isError = false;
  public errMes: string;

  constructor(isError?: boolean, errMes?: string) {
    if (!isError || isUndefined(errMes)) {
      return;
    }
    this.isError = isError;
    this.errMes = errMes;
  }
}

export class ErrPositionItem {
  icon: ErrMessageItem = new ErrMessageItem();
  ic_name: ErrMessageItem = new ErrMessageItem();

  constructor(icon?: ErrMessageItem, title?: ErrMessageItem, ic_name?: ErrMessageItem,
    corner?: ErrMessageItem) {
    if (isUndefined(icon) || isUndefined(ic_name)) {
      return;
    }
    this.icon = icon;
    this.ic_name = ic_name;
  }
}

@Component({
  selector: 'app-accessory-edit',
  templateUrl: './accessory-edit.component.html',
  styleUrls: ['./accessory-edit.component.css']
})
export class AccessoryEditComponent implements OnInit {
  public loading = true;
  public spaceList = ['']; // 占位数组
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public errSpecificationsItem: ErrPositionItem = new ErrPositionItem();
  public accessoryParams = new SearchAccessoryParams(); // 编辑配件参数
  public specificationsList: Array<SpecificationEntity> = [];
  public specificationsDelList: Array<SpecificationEntity> = [];
  public tempSpecificationsParams: Array<SpecificationEntity> = []; // 规格参数
  public price_info: PriceInfoEntity = new PriceInfoEntity(); // 机滤价格参数
  public projectInfo: ProjectEntity = new ProjectEntity();
  public accessoryData = new AccessoryEntity(); // 配件详情
  public noResultText = '数据加载中...';
  public accessory_id = ''; // 配件id
  public operationTelErrors = ''; // 运营手机号错误信息
  public prepaidSalePriceErrors = ''; // 预付价格错误信息
  public accessoryDetailErrors = ''; // 图文描述错误信息
  public specificationErrors = ''; // 规格参数错误信息
  public accessory_image_url: Array<any> = [];
  public specifications_image_num: number;
  public isSaveBtnDisabled = false;
  public params: Array<ParamEntity> = []; // 配件参数
  public accessory_params = new AccessoryParamsEntity(); // 机油参数
  public oil_num = [];
  public oil_type = [];
  public oil_api = [];
  public real_prepaid_fee: number;
  public right_prepaid_fee: number;
  private num = 0;

  private searchText$ = new Subject<any>();

  @ViewChild('chooseProject', { static: true }) public chooseProject: ChooseProjectComponent;
  @ViewChild('chooseBrand', { static: true }) public chooseBrand: ChooseBrandComponent;
  @ViewChild('accessoryImg', { static: true }) public accessoryImgComponent: ZPhotoSelectComponent;
  @ViewChildren('specificationsImg') public specificationsImgSelectList: QueryList<ZPhotoSelectComponent>;

  constructor(private globalService: GlobalService, private routerInfo: ActivatedRoute,
    private router: Router, private accessoryLibraryService: AccessoryLibraryService) { }

  ngOnInit() {
    this.routerInfo.params.subscribe((params: Params) => {
      this.accessory_id = params.accessory_id;
    });
    // 配件库列表
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.accessoryLibraryService.requestAccessoryDetailData(this.accessory_id).subscribe(res => {
        this.accessoryData = res;
        this.getDetailData();
        this.getEditorData(res.detail);
        this.loading = false;
      }, err => {
        this.loading = false;
        this.getEditorData(null);
        this.globalService.httpErrorProcess(err);
      });
    });
    if (this.accessory_id) {
      this.searchText$.next();
    } else {
      this.loading = false;
      this.num++;
      const specification = new SpecificationEntity();
      specification.time = this.num;
      this.specificationsList.push(specification);
    }
  }

  // 数据处理
  private getDetailData() {
    this.accessoryParams.accessory_name = this.accessoryData.accessory_name;
    this.accessory_image_url = this.accessoryData.accessory_images ? this.accessoryData.accessory_images.split(',') : [];
    this.accessoryParams.operation_telephone = this.accessoryData.operation_telephone;
    this.accessoryParams.project_id = this.accessoryData.project ? this.accessoryData.project.project_id : '';
    this.accessoryParams.project_name = this.accessoryData.project ? this.accessoryData.project.project_name : '';
    if (this.accessoryParams.project_id && this.accessoryParams.project_name === '机油') {
      this.requestProjectParams();
    }
    this.accessoryParams.accessory_brand_id = this.accessoryData.accessory_brand ?
      this.accessoryData.accessory_brand.accessory_brand_id : '';
    this.accessoryParams.accessory_brand_name = this.accessoryData.accessory_brand ?
      this.accessoryData.accessory_brand.brand_name : '';
    this.accessoryData.specification_info.forEach(i => {
      i.imageList = i.image ? i.image.split(',') : [];
      i.original_balance_fee = this.getCentPrice(i.original_balance_fee);
      i.sale_balance_fee = this.getCentPrice(i.sale_balance_fee);
      i.original_fee = this.getCentPrice(i.original_fee);
      i.settlement_fee = this.getCentPrice(i.settlement_fee);
      i.sale_fee = this.getCentPrice(i.sale_fee);
      this.num++;
      i.time = this.num;
    });
    if (!this.accessoryData.specification_info || this.accessoryData.specification_info.length === 0) {
      this.num++;
      const specification = new SpecificationEntity();
      specification.time = this.num;
      this.specificationsList.push(specification);
    } else {
      this.specificationsList = this.accessoryData.specification_info;
    }
    this.price_info = this.accessoryData.specification_info ?
      new PriceInfoEntity(this.accessoryData.specification_info[0]) : new PriceInfoEntity();
    this.accessoryParams.accessory_params = this.accessoryData.accessory_params ?
      this.accessoryData.accessory_params : new AccessoryParamsEntity();
    this.real_prepaid_fee = this.getCentPrice(this.accessoryData.real_prepaid_fee);
    this.right_prepaid_fee = this.getCentPrice(this.accessoryData.right_prepaid_fee);
    this.getProjectInfo();
  }

  // 富文本数据处理
  private getEditorData(detail: string) {
    const tempContent = detail ? detail.replace('/\r\n/g', '').replace(/\n/g, '') : '';
    CKEDITOR.instances.accessoryEditor.setData(tempContent);
  }

  // 打开所属项目选择组件
  public onOpenProjectModal(): void {
    this.chooseProject.open();
  }

  // 选择所属项目回调函数
  public onSelectedProject(event: any): void {
    if (event && this.accessoryParams.project_id !== event.project.project_id) {
      this.clear();
      this.accessoryParams = new SearchAccessoryParams();
      this.accessoryParams.project_id = event.project.project_id;
      this.accessoryParams.project_name = event.project.project_name;
      if (event.project.project_name === '机油') {
        this.requestProjectParams();
        this.accessoryParams.accessory_params = new AccessoryParamsEntity();
      }
      this.getProjectInfo();
      this.accessory_image_url = [];
      this.specificationsList = [];
      this.specificationsDelList = [];
      this.num++;
      const specification = new SpecificationEntity();
      specification.time = this.num;
      this.specificationsList.push(specification);
      if (this.accessory_id) {
        this.accessoryData.specification_info.forEach((item, index) => {
          this.specificationsDelList[index] = item.clone();
          this.specificationsDelList[index].is_deleted = true;
        });
      }
      this.price_info = new PriceInfoEntity();
      this.getEditorData(null);
    }
  }

  // 打开所属品牌选择组件
  public onOpenBrandModal(): void {
    this.chooseBrand.open();
  }

  // 选择所属品牌回调函数
  public onSelectedBrand(event: any): void {
    if (event) {
      this.accessoryParams.accessory_brand_id = event.brand.accessory_brand_id;
      this.accessoryParams.accessory_brand_name = event.brand.brand_name;
    }
  }

  // 获取项目信息
  private getProjectInfo() {
    this.accessoryLibraryService.requestProjectDetailData(this.accessoryParams.project_id).subscribe(res => {
      this.projectInfo = res;
    }, err => {
      this.handleErrorFunc(err, 1);
    });
  }

  // 获取配置参数
  private requestProjectParams(): void {
    this.accessoryLibraryService.requestProjectParamsData(this.accessoryParams.project_id).subscribe(res => {
      this.params = res;
      this.oil_num = res.filter(param => param.param_name === '机油标号')[0].option;
      this.oil_type = res.filter(param => param.param_name === '机油类别')[0].option;
      this.oil_api = res.filter(param => param.param_name === 'API等级')[0].option;
      this.accessoryParams.accessory_params.oil_num = this.oil_num.includes(this.accessoryParams.accessory_params.oil_num) ?
        this.accessoryParams.accessory_params.oil_num : '';
      this.accessoryParams.accessory_params.oil_type = this.oil_type.includes(this.accessoryParams.accessory_params.oil_type) ?
        this.accessoryParams.accessory_params.oil_type : '';
      this.accessoryParams.accessory_params.oil_api = this.oil_api.includes(this.accessoryParams.accessory_params.oil_api) ?
        this.accessoryParams.accessory_params.oil_api : '';
    }, err => {
      this.params = [];
      this.globalService.httpErrorProcess(err);
    });
  }

  // 清空
  public clear() {
    this.errPositionItem.icon.isError = false;
    this.errPositionItem.ic_name.isError = false;
    this.errSpecificationsItem.icon.isError = false;
    this.errSpecificationsItem.ic_name.isError = false;
    this.operationTelErrors = '';
    this.prepaidSalePriceErrors = '';
    this.accessoryDetailErrors = '';
    this.specificationErrors = '';
  }

  // 产品图片：选择图片时校验图片格式
  public onSelectedPicture(event) {
    this.errPositionItem.icon.isError = false;
    if (event === 'type_error') {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '格式错误，请重新上传！';
    } else if (event === 'size_over') {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '图片大小不得高于2M！';
    }
  }

  // 规格：选择图片时校验图片格式
  public onSelectSpecificationsPic(event: any, i: number) {
    this.errSpecificationsItem.icon.isError = false;
    this.specifications_image_num = i;
    if (event === 'type_error') {
      this.errSpecificationsItem.icon.isError = true;
      this.errSpecificationsItem.icon.errMes = '格式错误，请重新上传！';
    } else if (event === 'size_over') {
      this.errSpecificationsItem.icon.isError = true;
      this.errSpecificationsItem.icon.errMes = '图片大小不得高于2M！';
    }
  }

  // 添加蓄电池规格
  public onAddSpecifications() {
    this.clear();
    const imageNoneList = this.specificationsImgSelectList.filter(i => i.imageList.length === 0);
    const batteryModelList = this.specificationsList.filter(m => !(m.battery_model));
    const originalBalanceFeeList = this.specificationsList.filter(o => !o.original_balance_fee);
    const saleBalanceFeeList = this.specificationsList.filter(b => !b.sale_balance_fee);
    const storeList = this.specificationsList.filter(s => !(s.store || Number(s.store) === 0));
    const specificationsPriceList = this.specificationsList.filter(i =>
      Number(i.sale_balance_fee) > Number(i.original_balance_fee));
    const modelNameList = this.specificationsList.map(m => m.battery_model);
    if (imageNoneList.length !== 0) {
      this.specificationErrors = `请先选择规格图片!`;
    } else if (batteryModelList.length !== 0) {
      this.specificationErrors = `请填写型号后再添加!`;
    } else if (new Set(modelNameList).size !== modelNameList.length) {
      this.specificationErrors = `型号不可重复!`;
    } else if (originalBalanceFeeList.length !== 0) {
      this.specificationErrors = `请填写尾款原价后再添加!`;
    } else if (saleBalanceFeeList.length !== 0) {
      this.specificationErrors = `请填写尾款现价后再添加!`;
    } else if (storeList.length !== 0) {
      this.specificationErrors = `请填写库存后再添加!`;
    } else if (specificationsPriceList.length !== 0) {
      this.specificationErrors = `规格的尾款现价不得大于尾款原价!`;
    } else {
      timer(0).subscribe(() => {
        this.num++;
        const specification = new SpecificationEntity();
        specification.time = this.num;
        this.specificationsList.push(specification);
      });
      timer(0).subscribe(() => {
        $('.ant-table-body').scrollTop($('.ant-table-body')[0].scrollHeight);

      });
    }
  }

  // 删除规格
  public onDelSpecifications(data: SpecificationEntity, i: number) {
    if (data.specification_id) {
      data.is_deleted = true;
      this.specificationsDelList.push(data);
      this.specificationsList.splice(i, 1);
    } else {
      this.specificationsList.splice(i, 1);
    }
  }

  public ifImageNone(): boolean {
    if (this.accessoryParams.project_id) {
      if (this.accessoryParams.project_name === '机油滤清器') {
        return this.accessoryImgComponent.imageList.length === 0;
      } else {
        const imageNoneList = this.specificationsImgSelectList.filter(i => i.imageList.length === 0);
        return this.accessoryImgComponent.imageList.length === 0 || imageNoneList.length > 0;
      }
    }
  }

  // 保存数据
  public onSaveFormSubmit() {
    this.clear();
    this.accessoryParams.detail = CKEDITOR.instances.accessoryEditor.getData().replace('/\r\n/g', '').replace(/\n/g, '');
    if (this.accessoryImgComponent.imageList.length === 0) {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '请上传产品图片！';
    } else if (this.accessoryParams.project_name === '蓄电池') {
      this.handleParams();
      const regPhone = /^(1[3-9])\d{9}$/g;
      const specificationsPriceList = this.accessoryParams.specifications.filter(a =>
        Number(a.sale_balance_fee) > Number(a.original_balance_fee));
      const modelNameList = this.accessoryParams.specifications.map(m => m.battery_model);
      if (new Set(modelNameList).size !== modelNameList.length) {
        this.specificationErrors = `规格型号不可重复!`;
      } else if (specificationsPriceList.length !== 0) {
        this.specificationErrors = `规格的尾款现价不得大于尾款原价!`;
      } else if (Number(this.accessoryParams.right_prepaid_fee) > Number(this.accessoryParams.real_prepaid_fee)) {
        this.prepaidSalePriceErrors = '预付现价不得大于预付原价！';
      } else if (!regPhone.test(this.accessoryParams.operation_telephone)) {
        this.operationTelErrors = '请输入正确的运营手机号！';
      } else {
        this.isSaveBtnDisabled = true;
        this.handleUpdateAssessoryData();
      }
    } else if (this.accessoryParams.project_name === '机油') {
      this.handleParams();
      const specificationsPriceNew1List = this.accessoryParams.specifications.filter(a =>
        Number(a.sale_fee) > Number(a.original_fee));
      const specificationsPriceNew2List = this.accessoryParams.specifications.filter(a =>
        Number(a.settlement_fee) > Number(a.sale_fee));
      if (specificationsPriceNew1List.length !== 0) {
        this.specificationErrors = `规格的原价应大于等于售价!`;
      } else if (specificationsPriceNew2List.length !== 0) {
        this.specificationErrors = `规格的结算价应小于等于售价!`;
      } else {
        this.isSaveBtnDisabled = true;
        this.handleUpdateAssessoryData();
      }
    } else { // 机油滤清器
      if (!this.price_info.original_fee || Number(this.price_info.original_fee) === 0) {
        this.specificationErrors = '原价应大于0！';
      } else if (!this.price_info.settlement_fee || Number(this.price_info.settlement_fee) === 0) {
        this.specificationErrors = '结算价应大于0！';
      } else if (!this.price_info.sale_fee || Number(this.price_info.sale_fee) === 0) {
        this.specificationErrors = '售价应大于0！';
      } else if (Number(this.price_info.sale_fee) > Number(this.price_info.original_fee)) {
        this.specificationErrors = '原价应大于等于售价！';
      } else if (Number(this.price_info.settlement_fee) > Number(this.price_info.sale_fee)) {
        this.specificationErrors = '结算价应小于等于售价！';
      } else {
        this.isSaveBtnDisabled = true;
        this.accessoryParams.price_info = this.price_info.clone().toEditJson();
        forkJoin(this.accessoryImgComponent.upload()).subscribe(
          data => {
            this.accessory_image_url = this.accessoryImgComponent.imageList.map(i => i.sourceUrl);
            this.accessoryParams.accessory_images = this.accessory_image_url.join(',');
            this.requestUpdateAssessoryData();
          }, err => {
            this.isSaveBtnDisabled = false;
            if (!this.globalService.httpErrorProcess(err)) {
              if (err.status === 422) {
                this.errPositionItem.icon.isError = true;
                this.errPositionItem.icon.errMes = '参数错误，可能文件格式错误！';
              } else if (err.status === 413) {
                this.errPositionItem.icon.isError = true;
                this.errPositionItem.icon.errMes = '上传资源文件太大，服务器无法保存！';
              } else {
                this.errPositionItem.icon.isError = true;
                this.errPositionItem.icon.errMes = '上传失败，请重试！';
              }
            }
          });
      }
    }
  }


  // 处理服务配置入参
  private handleParams() {
    this.tempSpecificationsParams = [];
    this.specificationsList.forEach(item => {
      const specification = item.toEditJson();
      this.tempSpecificationsParams.push(specification);
    });
    this.accessoryParams.specifications = this.tempSpecificationsParams.concat(this.specificationsDelList);
    this.accessoryParams.real_prepaid_fee = this.handleCentPrice(this.real_prepaid_fee);
    this.accessoryParams.right_prepaid_fee = this.handleCentPrice(this.right_prepaid_fee);
  }

  // 钱的单位由分转换为元
  private getCentPrice(fee: number): number {
    return (fee || fee === 0) ? Number((Number(fee) / 100).toFixed(2)) : null;
  }

  // 钱的单位由元转换为分
  private handleCentPrice(fee: any): number {
    return Math.round(Number(fee) * 100);
  }

  // 处理上传图片并更新配件库接口
  private handleUpdateAssessoryData() {
    forkJoin(this.accessoryImgComponent.upload()).subscribe(
      data => {
        this.accessory_image_url = this.accessoryImgComponent.imageList.map(image => image.sourceUrl);
        this.accessoryParams.accessory_images = this.accessory_image_url.join(',');
        let i = 0;
        const specificationsListLength = this.specificationsImgSelectList.length;
        this.specificationsImgSelectList.forEach((child, index) => {
          child.upload().subscribe(() => {
            const newImage = child.imageList.map(s => s.sourceUrl);
            this.specificationsList[index].image = newImage.join(',');
            i++;
            if (i === specificationsListLength) {
              const imageNoneList = this.specificationsList.filter(v => !v.image);
              if (imageNoneList.length !== 0) {
                this.isSaveBtnDisabled = false;
                this.globalService.promptBox.open(`请上传规格图片!`, null, 2000, '/assets/images/warning.png');
              } else {
                this.requestUpdateAssessoryData();
              }
            }
          }, err => {
            this.isSaveBtnDisabled = false;
            if (!this.globalService.httpErrorProcess(err)) {
              if (err.status === 422) {
                this.errSpecificationsItem.icon.isError = true;
                this.errSpecificationsItem.icon.errMes = '参数错误，可能文件格式错误！';
              } else if (err.status === 413) {
                this.errSpecificationsItem.icon.isError = true;
                this.errSpecificationsItem.icon.errMes = '上传资源文件太大，服务器无法保存！';
              } else {
                this.errSpecificationsItem.icon.isError = true;
                this.errSpecificationsItem.icon.errMes = '上传失败，请重试！';
              }
            }
          });
        });
      }, err => {
        this.isSaveBtnDisabled = false;
        if (!this.globalService.httpErrorProcess(err)) {
          if (err.status === 422) {
            this.errPositionItem.icon.isError = true;
            this.errPositionItem.icon.errMes = '参数错误，可能文件格式错误！';
          } else if (err.status === 413) {
            this.errPositionItem.icon.isError = true;
            this.errPositionItem.icon.errMes = '上传资源文件太大，服务器无法保存！';
          } else {
            this.errPositionItem.icon.isError = true;
            this.errPositionItem.icon.errMes = '上传失败，请重试！';
          }
        }
      });
  }

  // 校验规格信息
  private validSpecificationInfo(): boolean {
    let result = true;
    const tempSpecificationNameList = [];
    this.accessoryParams.specifications = [];
    this.specificationsList.forEach((specification, index) => {
      let model_name = '';
      if (!specification.image) {
        this.specificationErrors = `第${index + 1}条规格信息-请上传规格图片！`;
        result = false;
        return;
      }
      if (this.accessoryParams.project_name === '蓄电池') {
        model_name = specification.battery_model;
        if (tempSpecificationNameList.includes(specification.battery_model)) {
          this.specificationErrors = `第${index + 1}条规格信息-${this.projectInfo.specification.name}名称重复！`;
          result = false;
          return;
        } else if (!specification.original_balance_fee || Number(specification.original_balance_fee) === 0) {
          this.specificationErrors = `第${index + 1}条规格信息-尾款原价应大于0！`;
          result = false;
          return;
        } else if (!specification.sale_balance_fee || Number(specification.sale_balance_fee) === 0) {
          this.specificationErrors = `第${index + 1}条规格信息-尾款现价应大于0！`;
          result = false;
          return;
        } else if (Number(specification.sale_balance_fee) > Number(specification.original_balance_fee)) {
          this.specificationErrors = `第${index + 1}条规格信息-尾款现价应小于等于尾款原价！`;
          result = false;
          return;
        }
      } else if (this.accessoryParams.project_name === '机油') {
        model_name = specification.content;
        if (tempSpecificationNameList.includes(specification.content)) {
          this.specificationErrors = `第${index + 1}条规格信息-${this.projectInfo.specification.name}名称重复！`;
          result = false;
          return;
        } else if (!specification.original_fee || Number(specification.original_fee) === 0) {
          this.specificationErrors = `第${index + 1}条规格信息-原价应大于0！`;
          result = false;
          return;
        } else if (!specification.settlement_fee || Number(specification.settlement_fee) === 0) {
          this.specificationErrors = `第${index + 1}条规格信息-结算价应大于0！`;
          result = false;
          return;
        } else if (!specification.sale_fee || Number(specification.sale_fee) === 0) {
          this.specificationErrors = `第${index + 1}条规格信息-售价应大于0！`;
          result = false;
          return;
        } else if (Number(specification.sale_fee) > Number(specification.original_fee)) {
          this.specificationErrors = `第${index + 1}条规格信息-原价应大于等于售价！`;
          result = false;
          return;
        } else if (Number(specification.settlement_fee) > Number(specification.sale_fee)) {
          this.specificationErrors = `第${index + 1}条规格信息-结算价应小于等于售价！`;
          result = false;
          return;
        }
      }
      if (!specification.store || Number(specification.store) !== 0) {
        this.specificationErrors = `第${index + 1}条规格信息-库存应输入0-99999！`;
        result = false;
        return;
      }
      if (result) {
        tempSpecificationNameList.push(model_name);
      }
      this.accessoryParams.specifications.push(specification.toEditJson());
    });
    return result;
  }

  // 调用更新配件库接口
  private requestUpdateAssessoryData() {
    if (!this.accessory_id) {// 新增
      this.accessoryLibraryService.requestAddAccessoryData(this.accessoryParams).subscribe(() => {
        this.globalService.promptBox.open('创建配件成功！', () => {
          this.onCancelBtn();
        });
      }, err => {
        this.handleErrorFunc(err, 1);
        this.isSaveBtnDisabled = false;
      });
    } else {// 编辑
      this.accessoryLibraryService.requestUpdateAccessoryData(this.accessoryParams, this.accessory_id).subscribe(() => {
        this.globalService.promptBox.open('编辑配件成功！', () => {
          this.onCancelBtn();
        });
        this.isSaveBtnDisabled = false;
      }, err => {
        this.handleErrorFunc(err, 1);
        this.isSaveBtnDisabled = false;
      });
    }
  }

  // 处理错误信息
  private handleErrorFunc(err: any, type: number) {
    const text = type === 1 ? '新建' : '编辑';
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          const field = content.field === 'project_id' ? '项目名称' : content.field === 'accessory_name' ?
            '产品名称' : content.field === 'accessory_images' ? '图片' : content.field === 'accessory_brand_id' ? '所属品牌'
              : content.field === 'accessory_params' ? '参数' : content.field === 'detail' ? '图文详情'
                : content.field === 'battery_specification' ? '规格' : content.field === 'real_prepaid_fee' ? '预约原价'
                  : content.field === 'right_prepaid_fee' ? '预付现价' : content.field === 'operation_telephone' ? '运营手机号'
                    : content.field === 'price_info' ? '价格' : content.field === 'oil_filter_original_fee' ? '原价'
                      : content.field === 'oil_filter_original_fee' ? '结算价' : content.field === 'oil_filter_sale_fee'
                        ? '售价' : content.field === 'oil_filter_store' ? '库存' : content.field === 'params' ? '参数' : '';
          if (content.code === 'missing_field') {
            this.globalService.promptBox.open(`${field}字段未填写!`, null, 2000, '/assets/images/warning.png');
            return;
          } else if (content.code === 'invalid') {
            this.globalService.promptBox.open(`${field}字段输入错误!`, null, 2000, '/assets/images/warning.png');
          } else if (content.code === 'already_existed') {
            this.globalService.promptBox.open(`配件已经存在!`, null, 2000, '/assets/images/warning.png');
          } else {
            this.globalService.promptBox.open(`${text}配件库失败,请重试!`, null, 2000, '/assets/images/warning.png');
          }
        }
      }
    }
  }

  // 取消
  public onCancelBtn() {
    this.router.navigateByUrl('/accessory-library');
  }
}
