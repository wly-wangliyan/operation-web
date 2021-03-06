import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList
} from '@angular/core';
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
  AccessoryParamsEntity
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

  constructor(
    icon?: ErrMessageItem,
    title?: ErrMessageItem,
    ic_name?: ErrMessageItem,
    corner?: ErrMessageItem
  ) {
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
  public specificationsList: Array<SpecificationEntity> = []; // 规格列表
  public specificationsDelList: Array<SpecificationEntity> = []; // 被移除的原有规格信息
  public price_info: PriceInfoEntity = new PriceInfoEntity(); // 机滤价格参数
  public projectInfo: ProjectEntity = new ProjectEntity(); // 项目信息
  public accessoryData = new AccessoryEntity(); // 配件详情
  public noResultText = '数据加载中...';
  public accessory_id = ''; // 配件id
  public operationTelErrors = ''; // 运营手机号错误信息
  public accessoryDetailErrors = ''; // 图文描述错误信息
  public accessorySourceErrors = ''; // 正品溯源错误信息
  public specificationErrors = ''; // 规格参数错误信息
  public accessory_image_url: Array<any> = []; // 配件图片
  public specifications_image_num: number; // 规格图片索引
  public isSaveBtnDisabled = false;
  public params: Array<ParamEntity> = []; // 配件参数
  public accessory_params = new AccessoryParamsEntity(); // 机油参数
  public oil_num = [];
  public oil_type = [1, 2, 3]; // 1:全合成 2:半合成 3:矿物质
  public oil_api = [];
  private num = 0;

  private searchText$ = new Subject<any>();

  @ViewChild('chooseProject', { static: true })
  public chooseProject: ChooseProjectComponent;
  @ViewChild('chooseBrand', { static: true })
  public chooseBrand: ChooseBrandComponent;
  @ViewChild('accessoryImg', { static: true })
  public accessoryImgComponent: ZPhotoSelectComponent;
  @ViewChildren('specificationsImg')
  public specificationsImgSelectList: QueryList<ZPhotoSelectComponent>;

  constructor(
    private globalService: GlobalService,
    private routerInfo: ActivatedRoute,
    private router: Router,
    private accessoryLibraryService: AccessoryLibraryService
  ) { }

  ngOnInit() {
    this.routerInfo.params.subscribe((params: Params) => {
      this.accessory_id = params.accessory_id;
    });
    // 配件库列表
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.accessoryLibraryService.requestAccessoryDetailData(this.accessory_id).subscribe(
        res => {
          this.accessoryData = res;
          this.getDetailData();
          this.getEditorData(res);
          this.loading = false;
        },
        err => {
          this.loading = false;
          this.getEditorData(null);
          this.globalService.httpErrorProcess(err);
        }
      );
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
    this.accessory_image_url = this.accessoryData.accessory_images
      ? this.accessoryData.accessory_images.split(',') : [];
    this.accessoryParams.operation_telephone = this.accessoryData.operation_telephone;
    this.accessoryParams.project_id = this.accessoryData.project
      ? this.accessoryData.project.project_id : '';
    this.accessoryParams.project_num = this.accessoryData.project
        ? this.accessoryData.project.project_num : '';
    this.accessoryParams.project_name = this.accessoryData.project
      ? this.accessoryData.project.project_name : '';
    if (this.accessoryParams.project_id && this.accessoryParams.project_name === '机油') {
      this.requestProjectParams();
    }
    this.accessoryParams.accessory_brand_id = this.accessoryData.accessory_brand
      ? this.accessoryData.accessory_brand.accessory_brand_id : '';
    this.accessoryParams.accessory_brand_name = this.accessoryData.accessory_brand
      ? this.accessoryData.accessory_brand.brand_name : '';
    this.accessoryParams.small_title = this.accessoryData.small_title;
    this.accessoryParams.sale_point = this.accessoryData.sale_point;
    this.accessoryData.specification_info.forEach(i => {
      i.imageList = i.image ? i.image.split(',') : [];
      i.original_balance_fee = this.getCentPrice(i.original_balance_fee);
      i.sale_balance_fee = this.getCentPrice(i.sale_balance_fee);
      i.original_prepaid_fee = this.getCentPrice(i.original_prepaid_fee);
      i.sale_prepaid_fee = this.getCentPrice(i.sale_prepaid_fee);
      i.original_fee = this.getCentPrice(i.original_fee);
      i.settlement_fee = this.getCentPrice(i.settlement_fee);
      i.sale_fee = this.getCentPrice(i.sale_fee);
      this.num++;
      i.time = this.num;
    });
    if (!this.accessoryData.specification_info
      || this.accessoryData.specification_info.length === 0) {
      this.num++;
      const specification = new SpecificationEntity();
      specification.time = this.num;
      this.specificationsList.push(specification);
    } else {
      this.specificationsList = this.accessoryData.specification_info;
    }
    this.price_info = this.accessoryData.specification_info
      ? new PriceInfoEntity(this.accessoryData.specification_info[0])
      : new PriceInfoEntity();
    this.accessoryParams.accessory_params = this.accessoryData.accessory_params
      ? this.accessoryData.accessory_params
      : new AccessoryParamsEntity();
    this.getProjectInfo();
  }

  // 富文本数据处理
  private getEditorData(accessory: AccessoryEntity) {
    const detailContent = accessory.detail
      ? accessory.detail.replace('/\r\n/g', '').replace(/\n/g, '')
      : '';
    const sourceContent = accessory.accessory_source
        ? accessory.accessory_source.replace('/\r\n/g', '').replace(/\n/g, '')
        : '';
    CKEDITOR.instances.accessoryEditor.setData(detailContent);
    CKEDITOR.instances.accessorySourceEditor.setData(sourceContent);
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
      this.accessoryParams.project_num = event.project.project_num;
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
      /*if (this.accessory_id) {
        this.accessoryData.specification_info.forEach((item, index) => {
          this.specificationsDelList[index] = item.clone();
          this.specificationsDelList[index].is_deleted = true;
        });
      }*/
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
    this.accessoryLibraryService
      .requestProjectDetailData(this.accessoryParams.project_id)
      .subscribe(
        res => {
          this.projectInfo = res;
        },
        err => {
          this.handleErrorFunc(err, 1);
        }
      );
  }

  // 获取配置参数
  private requestProjectParams(): void {
    this.accessoryLibraryService
      .requestProjectParamsData(this.accessoryParams.project_id)
      .subscribe(
        res => {
          this.params = res;
          this.oil_num = res.filter(param => param.param_name === '机油标号')[0]
            ? res.filter(param => param.param_name === '机油标号')[0].option
            : [];
          this.oil_api = res.filter(param => param.param_name === 'API等级')[0]
            ? res.filter(param => param.param_name === 'API等级')[0].option
            : [];
          this.accessoryParams.accessory_params.oil_num = this.oil_num.includes(
            this.accessoryParams.accessory_params.oil_num
          )
            ? this.accessoryParams.accessory_params.oil_num
            : '';
          this.accessoryParams.accessory_params.oil_api = this.oil_api.includes(
            this.accessoryParams.accessory_params.oil_api
          )
            ? this.accessoryParams.accessory_params.oil_api
            : '';
        },
        err => {
          this.params = [];
          this.globalService.httpErrorProcess(err);
        }
      );
  }

  // 清空
  public clear() {
    this.errPositionItem.icon.isError = false;
    this.errPositionItem.ic_name.isError = false;
    this.errSpecificationsItem.icon.isError = false;
    this.errSpecificationsItem.ic_name.isError = false;
    this.operationTelErrors = '';
    this.accessoryDetailErrors = '';
    this.accessorySourceErrors = '';
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
    const imageNoneList = this.specificationsImgSelectList.filter(
      i => i.imageList.length === 0
    );
    if (imageNoneList.length !== 0) {
      this.specificationErrors = `请先选择规格图片!`;
    } else if (this.validSpecificationInfo(false)) {
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
      } else if (
        this.accessoryImgComponent &&
        this.specificationsImgSelectList
      ) {
        const imageNoneList = this.specificationsImgSelectList.filter(
          i => i.imageList.length === 0
        );
        return (
          this.accessoryImgComponent.imageList.length === 0 ||
          imageNoneList.length > 0
        );
      }
    }
  }

  // 保存数据
  public onSaveFormSubmit() {
    this.clear();
    this.accessoryParams.detail = CKEDITOR.instances.accessoryEditor
      .getData()
      .replace('/\r\n/g', '')
      .replace(/\n/g, '');
    this.accessoryParams.accessory_source = CKEDITOR.instances.accessorySourceEditor
        .getData()
        .replace('/\r\n/g', '')
        .replace(/\n/g, '');
    if (this.accessoryImgComponent.imageList.length === 0) {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '请上传图片！';
    } else if (this.accessoryParams.project_name === '蓄电池') {
      const regPhone = /^(1[3-9])\d{9}$/g;
      if (this.specificationsList && this.specificationsList.length > 50) {
        this.specificationErrors = '规格信息最多50条！';
      } else if (!regPhone.test(this.accessoryParams.operation_telephone)) {
        this.operationTelErrors = '请输入正确的运营手机号！';
      } else {
        this.isSaveBtnDisabled = true;
        this.handleUpdateAssessoryData();
      }
    } else if (this.accessoryParams.project_name === '机油') {
      if (this.specificationsList && this.specificationsList.length > 5) {
        this.specificationErrors = '规格信息最多5条！';
      } else {
        this.isSaveBtnDisabled = true;
        this.handleUpdateAssessoryData();
      }
    } else {
      // 机油滤清器
      if (
        !this.price_info.original_fee ||
        Number(this.price_info.original_fee) === 0
      ) {
        this.specificationErrors = '原价应大于0！';
      } else if (
        !this.price_info.settlement_fee ||
        Number(this.price_info.settlement_fee) === 0
      ) {
        this.specificationErrors = '结算价应大于0！';
      } else if (
        !this.price_info.sale_fee ||
        Number(this.price_info.sale_fee) === 0
      ) {
        this.specificationErrors = '售价应大于0！';
      } else if (
        Number(this.price_info.sale_fee) > Number(this.price_info.original_fee)
      ) {
        this.specificationErrors = '原价应大于等于售价！';
      } else if (
        Number(this.price_info.settlement_fee) >
        Number(this.price_info.sale_fee)
      ) {
        this.specificationErrors = '结算价应小于等于售价！';
      } else {
        this.isSaveBtnDisabled = true;
        this.accessoryParams.price_info = this.price_info.clone().toEditJson();
        this.handleUpdateAssessoryData();
      }
    }
  }

  // 处理服务配置入参
  private handleParams() {
    const tempSpecificationsParams = [];
    this.specificationsList.forEach(item => {
      const specification = item.toEditJson();
      tempSpecificationsParams.push(specification);
    });
    this.accessoryParams.specifications = tempSpecificationsParams;
  }

  // 钱的单位由分转换为元
  private getCentPrice(fee: number): number {
    return fee || fee === 0 ? Number((Number(fee) / 100).toFixed(2)) : null;
  }

  // 钱的单位由元转换为分
  private handleCentPrice(fee: any): number {
    return Math.round(Number(fee) * 100);
  }

  // 处理上传图片并更新配件库接口
  private handleUpdateAssessoryData() {
    forkJoin(this.accessoryImgComponent.upload()).subscribe(data => {
      this.accessory_image_url = this.accessoryImgComponent.imageList.map(
        image => image.sourceUrl
      );
      this.accessoryParams.accessory_images = this.accessory_image_url.join(',');

      if (this.accessoryParams.project_name !== '机油滤清器') {
        const specificationsListLength = this.specificationsImgSelectList.length;
        let i = 0;
        this.specificationsImgSelectList.forEach((child, index) => {
          child.upload().subscribe(() => {
            const newImage = child.imageList.map(s => s.sourceUrl);
            this.specificationsList[index].image = newImage.join(',');
            i++;

            if (i === specificationsListLength) {
              if (this.validSpecificationInfo()) {
                this.accessoryParams.specifications = this.accessoryParams.specifications
                  .concat(this.specificationsDelList);
                this.requestUpdateAssessoryData();
              } else {
                this.isSaveBtnDisabled = false;
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
      } else {
        this.requestUpdateAssessoryData();
      }
    }, err => {
      this.isSaveBtnDisabled = false;
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          this.errPositionItem.icon.isError = true;
          this.errPositionItem.icon.errMes = '参数错误，可能文件格式错误！';
        } else if (err.status === 413) {
          this.errPositionItem.icon.isError = true;
          this.errPositionItem.icon.errMes =
            '上传资源文件太大，服务器无法保存！';
        } else {
          this.errPositionItem.icon.isError = true;
          this.errPositionItem.icon.errMes = '上传失败，请重试！';
        }
      }
    }
    );
  }

  // 校验规格信息
  private validSpecificationInfo(validImg: boolean = true): boolean {
    const tempSpecificationNameList = [];
    this.accessoryParams.specifications = [];
    for (const key in this.specificationsList) {
      if (this.specificationsList.hasOwnProperty(key)) {
        const specification = this.specificationsList[key];
        const index = Number(key);
        let model_name = '';
        if (validImg && !specification.image) {
          this.specificationErrors = `第${index + 1}条规格信息-请重新上传规格图片！`;
          return false;
        }
        if (this.accessoryParams.project_name === '蓄电池') {
          model_name = specification.battery_model;
          if (!specification.battery_model) {
            this.specificationErrors = `第${index + 1}条规格信息-请输入${this.projectInfo.specification.name}！`;
            return false;
          } else if (
            tempSpecificationNameList.includes(specification.battery_model)
          ) {
            this.specificationErrors = `第${index + 1}条规格信息-${this.projectInfo.specification.name}重复！`;
            return false;
          } else if (!specification.original_balance_fee ||
            Number(specification.original_balance_fee) === 0) {
            this.specificationErrors = `第${index + 1}条规格信息-尾款原价应大于0！`;
            return false;
          } else if (!specification.sale_balance_fee ||
            Number(specification.sale_balance_fee) === 0) {
            this.specificationErrors = `第${index + 1}条规格信息-尾款现价应大于0！`;
            return false;
          } else if (Number(specification.sale_balance_fee) > Number(specification.original_balance_fee)) {
            this.specificationErrors = `第${index + 1}条规格信息-尾款现价应小于等于尾款原价！`;
            return false;
          } else if (!specification.original_prepaid_fee ||
            Number(specification.original_prepaid_fee) === 0) {
            this.specificationErrors = `第${index + 1}条规格信息-预付原价应大于0！`;
            return false;
          } else if (!specification.sale_prepaid_fee ||
            Number(specification.sale_prepaid_fee) === 0) {
            this.specificationErrors = `第${index + 1}条规格信息-预付现价应大于0！`;
            return false;
          } else if (Number(specification.sale_prepaid_fee) > Number(specification.original_prepaid_fee)) {
            this.specificationErrors = `第${index + 1}条规格信息-预付现价应小于等于预付原价！`;
            return false;
          }
        } else if (this.accessoryParams.project_name === '机油') {
          model_name = specification.content ? String(specification.content) : '';
          if (!specification.content) {
            if (String(specification.content) === '0') {
              this.specificationErrors = `第${index + 1}条规格信息-${this.projectInfo.specification.name}应大于0`;
            } else {
              this.specificationErrors = `第${index + 1}条规格信息-请输入${this.projectInfo.specification.name}！`;
            }
            return false;
          } else if (tempSpecificationNameList.includes(String(specification.content))) {
            this.specificationErrors = `第${index + 1}条规格信息-${this.projectInfo.specification.name}重复！`;
            return false;
          } else if (!specification.original_fee ||
            Number(specification.original_fee) === 0
          ) {
            this.specificationErrors = `第${index + 1}条规格信息-原价应大于0！`;
            return false;
          } else if (!specification.settlement_fee ||
            Number(specification.settlement_fee) === 0
          ) {
            this.specificationErrors = `第${index + 1}条规格信息-结算价应大于0！`;
            return false;
          } else if (!specification.sale_fee ||
            Number(specification.sale_fee) === 0
          ) {
            this.specificationErrors = `第${index + 1}条规格信息-售价应大于0！`;
            return false;
          } else if (
            Number(specification.sale_fee) > Number(specification.original_fee)
          ) {
            this.specificationErrors = `第${index + 1}条规格信息-原价应大于等于售价！`;
            return false;
          } else if (
            Number(specification.settlement_fee) > Number(specification.sale_fee)
          ) {
            this.specificationErrors = `第${index + 1}条规格信息-结算价应小于等于售价！`;
            return false;
          }
        }

        if (!specification.store && Number(specification.store) !== 0) {
          this.specificationErrors = `第${index + 1}条规格信息-库存应输入0-99999！`;
          return false;
        }
        tempSpecificationNameList.push(model_name);
        this.accessoryParams.specifications.push(specification.toEditJson());
      }
    }
    return true;
  }

  // 调用更新配件库接口
  private requestUpdateAssessoryData() {
    if (!this.accessory_id) {
      // 新增
      this.accessoryLibraryService.requestAddAccessoryData(this.accessoryParams)
        .subscribe(() => {
          this.globalService.promptBox.open('创建配件成功！', () => {
            this.onCancelBtn();
          });
        }, err => {
          this.handleErrorFunc(err, 1);
          this.isSaveBtnDisabled = false;
        });
    } else {
      // 编辑
      this.accessoryLibraryService.requestUpdateAccessoryData(this.accessoryParams, this.accessory_id)
        .subscribe(() => {
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
          const field =
            content.field === 'project_id'
              ? '项目名称'
              : content.field === 'accessory_name'
                ? '产品名称'
                : content.field === 'accessory_images'
                  ? '图片'
                  : content.field === 'accessory_brand_id'
                    ? '所属品牌'
                    : content.field === 'accessory_params'
                      ? '参数'
                      : content.field === 'detail'
                        ? '图文详情'
                        : (content.field === 'battery_specification'
                          || content.field === 'specifications')
                          ? '规格'
                          : content.field === 'original_prepaid_fee'
                            ? '预付原价'
                            : content.field === 'sale_prepaid_fee'
                              ? '预付现价'
                              : content.field === 'operation_telephone'
                                ? '运营手机号'
                                : content.field === 'price_info'
                                  ? '价格'
                                  : content.field === 'oil_filter_original_fee'
                                    ? '原价'
                                    : content.field === 'oil_filter_original_fee'
                                      ? '结算价'
                                      : content.field === 'oil_filter_sale_fee'
                                        ? '售价'
                                        : content.field === 'oil_filter_store'
                                          ? '库存'
                                          : content.field === 'params'
                                            ? '参数'
                                            : '';
          if (content.code === 'missing_field') {
            this.globalService.promptBox.open(
              `${field}字段未填写!`, null, 2000, null, false);
            return;
          } else if (content.code === 'invalid') {
            this.globalService.promptBox.open(
              `${field}字段输入错误!`, null, 2000, null, false);
          } else if (content.code === 'already_existed') {
            this.globalService.promptBox.open(
              `配件已经存在!`, null, 2000, null, false);
          } else {
            this.globalService.promptBox.open(
              `${text}配件失败,请重试!`, null, 2000, null, false);
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
