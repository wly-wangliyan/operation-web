import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ChooseProjectComponent } from './choose-project/choose-project.component';
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
} from '../accessory-library.service';
import { HttpErrorEntity } from '../../../core/http.service';
import { ZPhotoSelectComponent } from '../../../share/components/z-photo-select/z-photo-select.component';

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

  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public errSpecificationsItem: ErrPositionItem = new ErrPositionItem();
  public accessoryParams = new SearchAccessoryParams();
  public specificationsList: Array<SpecificationEntity> = [];
  public specificationsTempList: Array<SpecificationEntity> = [];
  public specificationsDelList: Array<SpecificationEntity> = [];
  public projectInfo: ProjectEntity = new ProjectEntity();
  public accessoryData = new AccessoryEntity();
  public noResultText = '数据加载中...';
  public accessory_id = '';
  public right_prepaid_fee = '';
  public real_prepaid_fee = '';
  public operationTelErrors = '';
  public prepaidSalePriceErrors = '';
  public accessoryDetailErrors = '';
  public accessory_image_url: Array<any> = [];
  public specifications_image_num: number;
  public isSaveBtnDisabled = false;

  private searchText$ = new Subject<any>();

  @ViewChild('chooseProject', { static: true }) public chooseProject: ChooseProjectComponent;
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
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
    if (this.accessory_id) {
      this.searchText$.next();
    } else {
      this.specificationsList.push(new SpecificationEntity());
    }
  }

  // 数据处理
  private getDetailData() {
    this.accessoryParams.accessory_name = this.accessoryData.accessory_name;
    this.accessory_image_url = this.accessoryData.accessory_images ? this.accessoryData.accessory_images.split(',') : [];
    this.accessoryParams.operation_telephone = this.accessoryData.operation_telephone;
    this.accessoryParams.project_id = this.accessoryData.project ? this.accessoryData.project.project_id : '';
    this.accessoryParams.project_name = this.accessoryData.project ? this.accessoryData.project.project_name : '';
    this.accessoryData.specification_info.forEach(i => {
      i.imageList = i.image ? i.image.split(',') : [];
      i.original_fee = this.getCentPrice(i.original_balance_fee);
      i.sale_fee = this.getCentPrice(i.sale_balance_fee);
    });
    this.specificationsList = this.accessoryData.specification_info;
    this.specificationsTempList = this.accessoryData.specification_info;
    this.real_prepaid_fee = this.getCentPrice(this.accessoryData.real_prepaid_fee);
    this.right_prepaid_fee = this.getCentPrice(this.accessoryData.right_prepaid_fee);
    this.getProjectInfo();
  }

  // 富文本数据处理
  private getEditorData(detail: string) {
    CKEDITOR.instances.accessoryEditor.destroy(true);
    CKEDITOR.replace('accessoryEditor').setData(detail);
  }

  // 打开所属项目选择组件
  public onOpenProjectModal(): void {
    this.chooseProject.open();
  }

  // 选择所属项目回调函数
  public onSelectedProject(event: any): void {
    if (event) {
      this.accessoryParams.project_id = event.project.project_id;
      this.accessoryParams.project_name = event.project.project_name;
      this.getProjectInfo();
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

  // 清空
  public clear() {
    this.errPositionItem.icon.isError = false;
    this.errPositionItem.ic_name.isError = false;
    this.errSpecificationsItem.icon.isError = false;
    this.errSpecificationsItem.ic_name.isError = false;
    this.operationTelErrors = '';
    this.prepaidSalePriceErrors = '';
    this.accessoryDetailErrors = '';
    this.isSaveBtnDisabled = false;
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

  // 添加规格
  public onAddSpecifications() {
    const imageNoneList = this.specificationsImgSelectList.filter(i => i.imageList.length === 0);
    const batteryModelList = this.specificationsList.filter(m => !(m.battery_model));
    const originalBalanceFeeList = this.specificationsList.filter(o => !o.original_fee);
    const saleBalanceFeeList = this.specificationsList.filter(b => !b.sale_fee);
    const storeList = this.specificationsList.filter(s => !(s.store || Number(s.store) === 0));
    const specificationsPriceList = this.specificationsList.filter(i =>
      Number(i.sale_fee) > Number(i.original_fee));
    const modelNameList = this.specificationsList.map(m => m.battery_model);
    if (imageNoneList.length !== 0) {
      this.globalService.promptBox.open(`请选择规格图片后再添加!`, null, 2000, '/assets/images/warning.png');
    } else if (batteryModelList.length !== 0) {
      this.clear();
      this.globalService.promptBox.open(`请填写型号后再添加!`, null, 2000, '/assets/images/warning.png');
    } else if (new Set(modelNameList).size !== modelNameList.length) {
      this.clear();
      this.globalService.promptBox.open(`型号不可重复!`, null, 2000, '/assets/images/warning.png');
    } else if (originalBalanceFeeList.length !== 0) {
      this.clear();
      this.globalService.promptBox.open(`请填写尾款原价后再添加!`, null, 2000, '/assets/images/warning.png');
    } else if (saleBalanceFeeList.length !== 0) {
      this.clear();
      this.globalService.promptBox.open(`请填写尾款现价后再添加!`, null, 2000, '/assets/images/warning.png');
    } else if (storeList.length !== 0) {
      this.clear();
      this.globalService.promptBox.open(`请填写库存后再添加!`, null, 2000, '/assets/images/warning.png');
    } else if (specificationsPriceList.length !== 0) {
      this.globalService.promptBox.open(`规格的尾款现价不得大于尾款原价!`, null, 2000, '/assets/images/warning.png');
    } else {
      timer(0).subscribe(() => {
        this.specificationsList.push(new SpecificationEntity());
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

  // 保存数据
  public onSaveFormSubmit() {
    this.isSaveBtnDisabled = true;
    this.handleParams();
    const regPhone = /^(1[3-9])\d{9}$/g;
    const specificationsPriceList = this.accessoryParams.battery_specification.filter(a =>
      Number(a.sale_balance_fee) > Number(a.original_balance_fee));
    const modelNameList = this.accessoryParams.battery_specification.map(m => m.battery_model);
    if (this.accessoryImgComponent.imageList.length === 0) {
      this.clear();
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '请上传产品图片！';
    } else if (new Set(modelNameList).size !== modelNameList.length) {
      this.clear();
      this.globalService.promptBox.open(`型号不可重复!`, null, 2000, '/assets/images/warning.png');
    } else if (specificationsPriceList.length !== 0) {
      this.clear();
      this.globalService.promptBox.open(`规格的尾款现价不得大于尾款原价!`, null, 2000, '/assets/images/warning.png');
    } else if (Number(this.accessoryParams.right_prepaid_fee) > Number(this.accessoryParams.real_prepaid_fee)) {
      this.clear();
      this.prepaidSalePriceErrors = '预付现价不得大于预付原价！';
    } else if (!regPhone.test(this.accessoryParams.operation_telephone)) {
      this.clear();
      this.operationTelErrors = '请输入正确的运营手机号！';
    } else if (!CKEDITOR.instances.accessoryEditor.getData()) {
      this.clear();
      this.accessoryDetailErrors = '请输入图文详情！';
    } else {
      this.clear();
      this.isSaveBtnDisabled = true;
      forkJoin(this.accessoryImgComponent.upload()).subscribe(
        data => {
          this.accessory_image_url = this.accessoryImgComponent.imageList.map(i => i.sourceUrl);
          this.accessoryParams.accessory_images = this.accessory_image_url.join(',');
          let i = 0;
          const specificationsListLength = this.specificationsImgSelectList.length;
          this.specificationsImgSelectList.forEach((child, index) => {
            child.upload().subscribe(() => {
              const newImage = child.imageList.map(s => s.sourceUrl);
              this.specificationsList[index].image = newImage.join(',');
              i++;
              if (i === specificationsListLength) {
                const imageNoneList = this.accessoryParams.battery_specification.filter(v => !v.image);
                if (imageNoneList.length !== 0) {
                  this.clear();
                  this.globalService.promptBox.open(`请上传规格图片!`, null, 2000, '/assets/images/warning.png');
                } else {
                  if (!this.accessory_id) {// 新增
                    this.accessoryLibraryService.requestAddAccessoryData(this.accessoryParams).subscribe(() => {
                      this.globalService.promptBox.open('创建配件成功！');
                      this.isSaveBtnDisabled = false;
                      timer(2000).subscribe(() => this.router.navigateByUrl('/accessory-library'));
                    }, err => {
                      this.handleErrorFunc(err, 1);
                      this.isSaveBtnDisabled = false;
                    });
                  } else {// 编辑
                    this.accessoryLibraryService.requestUpdateAccessoryData(this.accessoryParams, this.accessory_id).subscribe(() => {
                      this.globalService.promptBox.open('编辑配件成功！');
                      this.isSaveBtnDisabled = false;
                      timer(2000).subscribe(() => this.router.navigateByUrl('/accessory-library'));
                    }, err => {
                      this.handleErrorFunc(err, 1);
                      this.isSaveBtnDisabled = false;
                    });
                  }
                }
              }
            });
          });
        });
    }
  }

  // 处理服务配置入参
  private handleParams() {
    this.accessoryParams.battery_specification = this.specificationsList.concat(this.specificationsDelList);
    this.accessoryParams.battery_specification.forEach(p => {
      p.original_balance_fee = this.handleCentPrice(p.original_fee);
      p.sale_balance_fee = this.handleCentPrice(p.sale_fee);
    });
    this.accessoryParams.real_prepaid_fee = this.handleCentPrice(this.real_prepaid_fee);
    this.accessoryParams.right_prepaid_fee = this.handleCentPrice(this.right_prepaid_fee);
    this.accessoryParams.detail = CKEDITOR.instances.accessoryEditor.getData().replace('/\r\n/g', '').replace(/\n/g, '');
  }

  // 钱的单位由分转换为元
  private getCentPrice(fee: number) {
    return (fee || fee === 0) ? (Number(fee) / 100).toFixed(2) : '';
  }

  // 钱的单位由元转换为分
  private handleCentPrice(fee: string) {
    return Math.round(Number(fee) * 100);
  }

  // 处理错误信息
  private handleErrorFunc(err: any, type: number) {
    const text = type === 1 ? '新建' : '编辑';
    if (!this.globalService.httpErrorProcess(err)) { } {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          const field = content.field === 'project_id' ? '项目名称' : content.field === 'accessory_name' ?
            '产品名称' : content.field === 'accessory_images' ? '图片' : content.field === 'accessory_brand_id' ? '所属品牌'
              : content.field === 'accessory_params' ? '参数' : content.field === 'detail' ? '图文详情'
                : content.field === 'battery_specification' ? '规格' : content.field === 'real_prepaid_fee' ? '预约原价'
                  : content.field === 'right_prepaid_fee' ? '预付现价' : content.field === 'operation_telephone' ? '运营手机号' : '';
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
