import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import { Subject, timer } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/internal/operators';
import { ProductService, TicketProductEntity, SearchLabelParams, LabelEntity } from '../product.service';
import { CalendarDetailComponent } from '../product-detail/calendar-detail/calendar-detail.component';
import { HttpErrorEntity } from '../../../../core/http.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  constructor(
    private globalService: GlobalService, private productService: ProductService, private route: ActivatedRoute,
    private router: Router) { }

  public productData: TicketProductEntity = new TicketProductEntity();
  public labelList: Array<LabelEntity> = [];
  public searchParams: SearchLabelParams = new SearchLabelParams();
  public productInfoList: Array<any> = [];
  public productTicketList: Array<any> = [];
  public imgUrls: Array<any> = [];
  public noResultTicketText = '数据加载中...';
  public noResultInfoText = '数据加载中...';
  public loading = true;
  public tempContent1: string;
  public product_id: string;
  public isShowContent = true;
  public checkLabelNamesList: Array<any> = [];

  private searchText$ = new Subject<any>();
  @ViewChild('priceCalendarDetail', { static: true }) public priceCalendarDetail: CalendarDetailComponent;

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
          product_name: this.productData.product_name,
          product_image: this.imgUrls.length !== 0 ? this.imgUrls[0] : '',
          address: this.productData.address,
          status: this.productData.status,
          sale_num: this.productData.sale_num,
        }
      ];
      this.productTicketList = this.productData.tickets.map(i => ({
        ...i,
        isShowInsutructions: false,
        isShowDescriptions: false
      }));
      this.getTagsName();
      this.noResultInfoText = '暂无数据';
      this.noResultTicketText = '暂无数据';
      this.loading = false;
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 404) {
          this.loading = false;
          this.isShowContent = false;
          this.globalService.promptBox.open('该产品不存在', () => {
            window.history.back();
          }, 2000, null, false);
        }
      }
    });
    this.searchText$.next();
  }

  // 获取标签名称
  private getTagsName() {
    this.productService.requestLabelListData(this.searchParams).subscribe(res => {
      this.labelList = res.results;
      const checkLabelList = this.labelList.map((i, index) => {
        const isCheckLabel = this.productData.tag_ids.includes(i.tag_id);
        return (
          {
            ...i,
            time: new Date().getTime() + index,
            checked: isCheckLabel
          });
      });
      this.checkLabelNamesList = checkLabelList.filter(i => i.checked);
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 更新数据
  public onUpdateData(flag: number) {
    this.productService.requesTicketsList(this.product_id, flag).subscribe(res => {
      this.productTicketList = res.results.map(i => ({
        ...i,
        isShowInsutructions: false,
        isEditTicketInsutruction: false,
      }));
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.code === 'unshelved') {
              this.globalService.promptBox.open(`该产品已下架!`, null, 2000, '/assets/images/warning.png');
            } else {
              return;
            }
          }
        }
      }
    });
  }

  // 价格日历
  public onOpenPriceCalendar(ticket_id) {
    this.priceCalendarDetail.open(null, 1, this.product_id, ticket_id, null);
  }

  // 展开
  public onShowInsutructions(i: number) {
    this.productTicketList[i].isShowInsutructions = true;
  }

  // 收起
  public onHideInsutructions(i: number) {
    this.productTicketList[i].isShowInsutructions = false;
  }

  // 展开
  public onShowDescriptions(i: number) {
    this.productTicketList[i].isShowDescriptions = true;
  }

  // 收起
  public onHideDescriptions(i: number) {
    this.productTicketList[i].isShowDescriptions = false;
  }
}
