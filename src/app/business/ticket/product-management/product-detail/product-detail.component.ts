import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import { Subject } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/internal/operators';
import { ProductService, TicketProductEntity } from '../product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  constructor(private globalService: GlobalService, private productService: ProductService, private route: ActivatedRoute,
              private router: Router) { }

  public productData: TicketProductEntity = new TicketProductEntity();
  public productInfoList: Array<any> = [];
  public productTicketList: Array<any> = [];
  public imgUrls: Array<any> = [];
  public noResultTicketText = '数据加载中...';
  public noResultInfoText = '数据加载中...';
  public tempContent1: string;
  public product_id: string;

  private searchText$ = new Subject<any>();

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.product_id = params.product_id;
    });

    // 产品详情
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.productService.requestProductsDetail(this.product_id))
    ).subscribe(res => {
      this.productData = res;
      this.imgUrls = this.productData.image_urls ? this.productData.image_urls.split(',') : [];
      this.productInfoList = [
        {
          product_id: this.productData.product_id,
          product_name: '',
          product_image: this.imgUrls.length !== 0 ? this.imgUrls[0] : '',
          address: this.productData.address,
          status: this.productData.status,
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

}
