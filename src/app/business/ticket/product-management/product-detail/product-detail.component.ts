import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../core/global.service';
import { Subject, timer } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/internal/operators';
import { ProductService, ThirdProductEntity, SearchParams } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  constructor(private globalService: GlobalService, private productService: ProductService, private route: ActivatedRoute,
              private router: Router) { }

  public thirdProductData: ThirdProductEntity = new ThirdProductEntity();
  public thirdProductInfoList: Array<any> = [];
  public productTicketList: Array<any> = [];
  public noResultInfoText = '数据加载中...';
  public noResultTicketText = '数据加载中...';

  private searchText$ = new Subject<any>();

  ngOnInit() {
    // 第三方产品详情
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.productService.requestThirdProductsDetail('1212'))
    ).subscribe(res => {
      this.thirdProductData = res;
      this.thirdProductInfoList = [
        {
          third_product_id: this.thirdProductData.third_product_id,
          third_product_name: this.thirdProductData.third_product_name,
          third_product_image: this.thirdProductData.third_product_image,
          third_address: `${this.thirdProductData.provice}${this.thirdProductData.city}${this.thirdProductData.district}
          ${this.thirdProductData.district}`,
          sale_status: this.thirdProductData.sale_status,
        }
      ];
      this.noResultInfoText = '暂无数据';
      this.noResultTicketText = '暂无数据';
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();

    this.productTicketList = [
      {
        name: '赠项目门票', isShowInsutructions: false, time: '提前1小时', costIncludes: '15项自费项目任选其一门票一张,至5月31日；周一周二特惠套票159元,15项自费项目任选其一门票一张,至5月31日；周一周二特惠套票159元,15项自费项目任选其一门票一张,至5月31日；周一周二特惠套票159元',
        useInstructions: '至5月31日；周一周二特惠套票159元', withdrawalNotice: '未验证可退改', marketPrice: 300,
        proposalPrice: 230, settlementPrice: 260, price: 245, status: 1
      },
      {
        name: '温泉门票', isShowInsutructions: false, time: '提前2小时', costIncludes: '25项自费项目任选其一门票一张,至5月31日；周一周二特惠套票159元',
        useInstructions: '至5月31日；周一周二特惠套票159元', withdrawalNotice: '未验证可退改', marketPrice: 300,
        proposalPrice: 230, settlementPrice: 260, price: 245, status: 2
      },
      {
        name: '游乐场门票', isShowInsutructions: false, time: '提前3小时', costIncludes: '35项自费项目任选其一门票一张,至5月31日；周一周二特惠套票159元',
        useInstructions: '至5月31日；周一周二特惠套票159元', withdrawalNotice: '未验证可退改', marketPrice: 300,
        proposalPrice: 230, settlementPrice: 260, price: 245, status: 2
      },
      {
        name: '洗浴门票', isShowInsutructions: false, time: '提前4小时', costIncludes: '45项自费项目任选其一门票一张,至5月31日；周一周二特惠套票159元',
        useInstructions: '至5月31日；周一周二特惠套票159元', withdrawalNotice: '未验证可退改', marketPrice: 300,
        proposalPrice: 230, settlementPrice: 260, price: 245, status: 1
      },
    ];
  }

  // 展开
  public onShowInsutructions(i: number) {
    this.productTicketList[i].isShowInsutructions = true;
  }

  // 收起
  public onHideInsutructions(i: number) {
    this.productTicketList[i].isShowInsutructions = false;
  }

  // 选用
  public onChooseTicket() {
    this.globalService.confirmationBox.open('提示', '确定选用此产品吗？', () => {
      this.globalService.confirmationBox.close();
      this.productService.requestAddProductData('121221').subscribe(res => {
        this.globalService.promptBox.open('选用成功！', () => {
          timer(0).subscribe(() => {
            this.router.navigateByUrl('/main/ticket/product-management');
          });
        });
      }, err => {
        this.globalService.httpErrorProcess(err);
        this.globalService.promptBox.open('选用失败，请重试！');
      });
    });
  }

}
