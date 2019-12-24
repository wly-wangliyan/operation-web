import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ChooseProjectComponent } from './choose-project/choose-project.component';
import { isUndefined } from 'util';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GlobalService } from '../../../core/global.service';
import { Subject, timer } from 'rxjs/index';
import { debounceTime } from 'rxjs/operators';
import {
  AccessoryLibraryService,
  SpecificationEntity,
  AccessoryEntity,
  SearchAccessoryParams,
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
  public accessoryParams = new SearchAccessoryParams();
  public specificationsList: Array<SpecificationEntity> = [];
  public specificationsTempList: Array<SpecificationEntity> = [];
  public specificationsDelList: Array<SpecificationEntity> = [];
  public accessoryData = new AccessoryEntity();
  public noResultText = '数据加载中...';
  public accessory_id = '';
  public sale_fee = '';
  public right_prepaid_fee = '';
  public real_prepaid_fee = '';
  public accessoryNameErrors = '';
  public prepaidOriginPriceErrors = '';
  public prepaidSalePriceErrors = '';
  public accessoryDetailErrors = '';
  public accessory_image_url: Array<any> = [];

  private searchText$ = new Subject<any>();

  @ViewChild('chooseProject', { static: true }) public chooseProject: ChooseProjectComponent;
  @ViewChild('accessoryImg', { static: true }) public accessoryImgSelectComponent: ZPhotoSelectComponent;
  @ViewChildren('specificationsImg') public specificationsImgSelectList: QueryList<ZPhotoSelectComponent>;

  constructor(private globalService: GlobalService, private routerInfo: ActivatedRoute,
              private router: Router, private accessoryLibraryService: AccessoryLibraryService) { }

  ngOnInit() {
    this.routerInfo.params.subscribe((params: Params) => {
      this.accessory_id = params.accessory_id;
    });
    // const obj = new SpecificationEntity();
    // obj.specification_id = '2134';
    // this.specificationsList.push(obj);
    // const obj1 = new SpecificationEntity();
    // obj1.specification_id = '2313';
    // this.specificationsList.push(obj1);
    // const obj2 = new SpecificationEntity();
    // obj2.specification_id = '2313';
    // this.specificationsList.push(obj2);
    this.specificationsTempList = this.specificationsList;
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.accessoryLibraryService.requestAccessoryDetailData(this.accessory_id).subscribe(res => {
        this.accessoryData = res;
        this.specificationsList = this.accessoryData.specifications;
        this.specificationsTempList = this.accessoryData.specifications;
        this.getDetailData();
        this.getEditorData(res.detail);
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
    if (this.accessory_id) {
      this.searchText$.next();
    }
  }

  // 编辑配置库数据处理
  private getDetailData() {
    this.right_prepaid_fee = this.getFeeData(this.accessoryData.right_prepaid_fee);
    this.real_prepaid_fee = this.getFeeData(this.accessoryData.real_prepaid_fee);
  }

  // 价钱数据处理
  private getFeeData(fee: number) {
    return (fee || fee === 0) ? (Number(fee) / 100).toFixed(2) : '';
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
    }
  }

  // 清空
  public clear() {
    this.errPositionItem.icon.isError = false;
    this.errPositionItem.ic_name.isError = false;
    this.accessoryNameErrors = '';
    this.prepaidOriginPriceErrors = '';
    this.prepaidSalePriceErrors = '';
    this.accessoryDetailErrors = '';
  }

  // 选择图片时校验图片格式
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

  // 添加规格
  public onAddSpecifications() {
    timer(0).subscribe(() => {
      $('.table-form').scrollTop('400');
    });
    this.specificationsList.push(new SpecificationEntity());
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
    if (Number(this.accessoryData.real_prepaid_fee) > Number(this.accessoryData.right_prepaid_fee)) {
      this.clear();
      this.prepaidSalePriceErrors = '预付现价不得大于预付原价！';
    } else {
      this.clear();
      this.handleParams();
      if (!this.accessory_id) {// 新增
        this.accessoryLibraryService.requestAddAccessoryData(this.accessoryParams).subscribe(() => {
          this.globalService.promptBox.open('新建配件库成功！');
          this.searchText$.next();
          timer(2000).subscribe(() => this.router.navigateByUrl('/store-maintenance/accessory-library'));
        }, err => {
          this.handleErrorFunc(err, 1);
        });
      } else {// 编辑
        this.accessoryLibraryService.requestUpdateAccessoryData(this.accessoryParams, this.accessory_id).subscribe(() => {
          this.globalService.promptBox.open('编辑配件库成功！');
          this.searchText$.next();
          timer(2000).subscribe(() => this.router.navigateByUrl('/store-maintenance/accessory-library'));
        }, err => {
          this.handleErrorFunc(err, 1);
        });
      }
    }
  }


  // 处理服务配置入参
  private handleParams() {
    this.accessoryImgSelectComponent.upload().subscribe(() => {
      this.accessory_image_url = this.accessoryImgSelectComponent.imageList.map(i => i.sourceUrl);
      this.accessoryParams.accessory_images = this.accessory_image_url.join(',');
    });
    this.specificationsImgSelectList.forEach((child, index) => {
      child.upload().subscribe(() => {
        const newImage = child.imageList.map(i => i.sourceUrl);
        this.specificationsList[index].image = newImage.join(',');
      });
    });
    this.accessoryParams.specifications = this.specificationsList.concat(this.specificationsDelList);
    this.accessoryParams.right_prepaid_fee = Number(this.right_prepaid_fee) * 100;
    this.accessoryParams.real_prepaid_fee = Number(this.real_prepaid_fee) * 100;
    this.accessoryData.detail = CKEDITOR.instances.accessoryEditor.getData().replace('/\r\n/g', '').replace(/\n/g, '');
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
                : content.field === 'specifications' ? '规格' : content.field === 'right_prepaid_fee' ? '预约原价'
                  : content.field === 'real_prepaid_fee' ? '预付现价' : '';
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

}
