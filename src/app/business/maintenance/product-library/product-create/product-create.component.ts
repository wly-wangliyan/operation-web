import { Component, OnInit, ViewChild } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute, Router } from '@angular/router';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { GlobalService } from '../../../../core/global.service';
import { ProductLibraryHttpService, ProductEntity } from '../product-library-http.service';
import { ProjectDialogComponent } from '../../../../share/components/project-dialog/project-dialog.component';
import { ProjectCategory } from '../../../../share/pipes/project-type.pipe';

export class ErrMessageItem {
  public isError = false;
  public errMes: string;

  constructor(isError?: boolean, errMes?: string) {
    if (!isError || isNullOrUndefined(errMes)) {
      return;
    }
    this.isError = isError;
    this.errMes = errMes;
  }
}
export class ErrPositionItem {
  icon: ErrMessageItem = new ErrMessageItem();
  ic_name: ErrMessageItem = new ErrMessageItem();

  constructor(icon?: ErrMessageItem, title?: ErrMessageItem, ic_name?: ErrMessageItem, corner?: ErrMessageItem) {
    if (isNullOrUndefined(icon) || isNullOrUndefined(ic_name)) {
      return;
    }
    this.icon = icon;
    this.ic_name = ic_name;
  }
}
@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {

  public isCreateProduct = true;

  public title = '新建产品';

  public product_id: string;

  public productRecord: ProductEntity = new ProductEntity(); // 产品 新建/编辑参数

  private projectCategory = ProjectCategory;

  public productParams = []; // 产品 新建/编辑参数

  public productErrMsg = ''; // 错误信息

  public cover_url = []; // 图片集合

  public selectedCategory: number; // 所属项目》所属项目类别

  public selectedProjectid: number; // 所属项目》所属项目 》项目id

  public selected_info: string; // 所属项目信息

  public errPositionItem: ErrPositionItem = new ErrPositionItem();

  @ViewChild('coverImg', { static: false }) public coverImgSelectComponent: ZPhotoSelectComponent;
  @ViewChild(ProjectDialogComponent, { static: true }) public projectDialogComponent: ProjectDialogComponent;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private productLibraryService: ProductLibraryHttpService) {
    this.route.paramMap.subscribe(map => {
      this.product_id = map.get('product_id');
    });
  }

  public ngOnInit() {
    if (this.product_id) {
      this.isCreateProduct = false;
      this.title = '编辑产品';
      this.getProductDetail();
    } else {
      this.isCreateProduct = true;
    }
  }

  // 获取产品详情
  private getProductDetail() {
    this.productLibraryService.requestProductDetailData(this.product_id).subscribe(data => {
      this.productRecord = data;
      if (this.productRecord) {
        this.initForm();
      }
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  private initForm() {
  }

  // 打开所属项目选择组件
  public onOpenProjectModal() {
    this.projectDialogComponent.open();
  }

  // 选择所属项目回调函数
  public onSelectedProject(event: any) {
    if (event) {
      this.selectedProjectid = event.project.upkeep_item_id;
      this.selectedCategory = event.category;
      this.selected_info = this.projectCategory[event.category] + ' > ' + event.project.upkeep_item_name;
    }
  }

  public onSelectedPicture(event: any) {
    this.errPositionItem.icon.isError = false;
    if (event === 'type_error') {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '格式错误，请重新上传！';
    } else if (event === 'size_over') {
      this.errPositionItem.icon.isError = true;
      this.errPositionItem.icon.errMes = '图片大小不得高于2M！';
    }
  }

}
