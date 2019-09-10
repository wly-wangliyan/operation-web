import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import { ProductLibraryHttpService, ProductEntity, SearchParams } from '../product-library-http.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  public titles = ['查看详情', '查看服务', '查看配件_原厂件', '查看配件_非原厂件']; // 页面标题集合

  public title = this.titles[0]; // 页面标题

  public no_img_url = '../../../../../assets/images/icon_no_img.png'; // 默认图片

  public product_id: string; // 产品id

  public projectTypes = [1, 2]; // 项目类型 1:配件 2:服务

  public productRecord: ProductEntity = new ProductEntity(); // 产品详情

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private productLibraryService: ProductLibraryHttpService
  ) {
    this.route.paramMap.subscribe(map => {
      this.product_id = map.get('product_id');
    });
  }

  public ngOnInit() {
    if (this.product_id) {
      this.getProductDetail();
    } else {
      this.router.navigate(['../../list'], { relativeTo: this.route });
    }
  }

  // 获取产品详情
  private getProductDetail() {
    this.productLibraryService.requestProductDetailData(this.product_id).subscribe(data => {
      this.productRecord = data;
      if (this.productRecord) {
        if (this.productRecord.upkeep_accessory_type === this.projectTypes[0]) {
          if (this.productRecord.is_original) {
            this.title = this.titles[2];
          } else {
            this.title = this.titles[3];
          }
        } else {
          this.title = this.titles[1];
        }
      }
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 删除产品
  public onDeleteClick() {
    this.globalService.confirmationBox.open('提示', '此操作不可逆，是否确认删除？', () => {
      this.globalService.confirmationBox.close();
      this.productLibraryService.requestDeleteProductData(this.product_id).subscribe(res => {
        this.globalService.promptBox.open('删除成功', () => {
          this.router.navigate(['../../list'], { relativeTo: this.route });
        });
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
  }
}
