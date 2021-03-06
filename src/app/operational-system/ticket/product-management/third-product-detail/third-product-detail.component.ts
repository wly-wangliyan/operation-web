import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import { Subject, timer } from 'rxjs/index';
import { debounceTime, switchMap } from 'rxjs/internal/operators';
import { ProductService, ThirdProductEntity } from '../product.service';
import { CalendarDetailComponent } from '../product-detail/calendar-detail/calendar-detail.component';

@Component({
  selector: 'app-third-product-detail',
  templateUrl: './third-product-detail.component.html',
  styleUrls: ['./third-product-detail.component.css']
})
export class ThirdProductDetailComponent implements OnInit {

  constructor(private globalService: GlobalService, private productService: ProductService,
    private route: ActivatedRoute, private router: Router) { }

  public thirdProductData: ThirdProductEntity = new ThirdProductEntity();
  public thirdProductInfoList: Array<any> = [];
  public productTicketList: Array<any> = [];
  public imgUrls: Array<any> = [];
  public loading = true;
  public noResultTicketText = '数据加载中...';
  public noResultInfoText = '数据加载中...';
  public tempContent1: string;
  public product_id: string;
  public add_status: string;
  public type: string;

  private searchText$ = new Subject<any>();

  @ViewChild('priceCalendarDetail', { static: true }) public priceCalendarDetail: CalendarDetailComponent;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.product_id = params.product_id;
      this.add_status = params.add_status;
      this.type = params.type;
    });

    // 第三方产品详情
    this.searchText$.pipe(
      debounceTime(500),
      switchMap(() =>
        this.productService.requestThirdProductsDetail(this.product_id))
    ).subscribe(res => {
      this.thirdProductData = res;
      // 票务详情
      this.imgUrls = this.thirdProductData.third_product_image ? this.thirdProductData.third_product_image.split(',') : [];
      // 产品信息列表
      this.thirdProductInfoList = [
        {
          tp_id: this.thirdProductData.tp_id,
          third_product_name: this.thirdProductData.third_product_name,
          third_product_image: this.imgUrls.length !== 0 ? this.imgUrls[0] : '',
          third_address: this.thirdProductData.address,
          sale_status: this.thirdProductData.sale_status,
        }
      ];
      this.noResultInfoText = '暂无数据';
      // 产品门票列表
      this.productTicketList = this.thirdProductData.tickets.map(i => ({
        ...i,
        isShowInsutructions: false,
        isShowDescriptions: false
      }));
      this.noResultTicketText = '暂无数据';
      this.loading = false;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
    this.searchText$.next();
  }

  // 面包屑>>通知中心跳转
  public onBackNoticeList() {
    this.router.navigateByUrl('/main/notice-center/list');
  }

  // 更新数据
  public onUpdateData() {
    this.productService.requesThirdTicketsList(this.product_id).subscribe(res => {
      this.productTicketList = res.results.map(i => ({
        ...i,
        isShowInsutructions: false,
        isEditTicketInsutruction: false,
      }));
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 价格日历
  public onOpenPriceCalendar(ticket_id) {
    this.priceCalendarDetail.open(null, 2, this.product_id, ticket_id, null);
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

  // 选用
  public onChooseTicket() {
    this.globalService.confirmationBox.open('提示', '确定选用此产品吗？', () => {
      this.globalService.confirmationBox.close();
      this.productService.requestAddProductData(this.product_id).subscribe(res => {
        this.globalService.promptBox.open('选用成功！', () => {
          timer(0).subscribe(() => {
            this.router.navigateByUrl('/main/ticket/product-management');
          });
        });
      }, err => {
        this.globalService.httpErrorProcess(err);
        this.globalService.promptBox.open('选用失败，请重试！', null, 2000, null, false);
      });
    });
  }
}
