import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs/index';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import { CommodityEntity, ExchangeRecordEntity, GoodsManagementHttpService } from '../goods-management-http.service';

@Component({
  selector: 'app-goods-detail',
  templateUrl: './goods-detail.component.html',
  styleUrls: ['./goods-detail.component.css']
})
export class GoodsDetailComponent implements OnInit {

  public videoAndImgList = [];

  public noResultInfoText = '数据加载中...';

  public noResultText = '数据加载中...';

  public commodityInfo: CommodityEntity = new CommodityEntity();

  public exchangeRecordList: Array<ExchangeRecordEntity> = [];

  public stock: number;

  public radioType = 1;

  private commodity_id: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private goodsManagementHttpService: GoodsManagementHttpService) {
    this.route.paramMap.subscribe(map => {
      this.commodity_id = map.get('commodity_id');
    });
  }

  public ngOnInit() {
    if (this.commodity_id) {
      this.requestCommodityById();
      this.requestExchangeRecordListById();
    } else {
      this.router.navigate(['../../list'], { relativeTo: this.route });
    }
  }

  // 获取商品详情
  private requestCommodityById() {
    this.goodsManagementHttpService.requestCommodityByIdData(this.commodity_id).subscribe(data => {
      this.noResultInfoText = '暂无数据';
      this.commodityInfo = data;
      this.commodityInfo.specifications.forEach(specificationsItem => {
        specificationsItem.unit_original_price = specificationsItem.unit_original_price / 100;
        specificationsItem.unit_sell_price = specificationsItem.unit_sell_price / 100;
      });
      this.stock = this.commodityInfo.specifications.map(v => v.stock).reduce((prev, curr) => {
        return prev + curr;
      });
      this.videoAndImgList = this.commodityInfo.commodity_videos.concat(this.commodityInfo.commodity_images);
    }, err => {
      if (err.status === 404) {
        this.globalService.promptBox.open('该条数据已删除，请刷新后重试！', null, 2000, null, false);
        timer(2000).subscribe(() => this.router.navigateByUrl('/main/mall/goods-order/list'));
      } else {
        this.globalService.httpErrorProcess(err);
      }
    });
  }

  // 获取商品兑换记录列表
  private requestExchangeRecordListById() {
    this.goodsManagementHttpService.requestExchangeRecordListData(this.commodity_id)
      .subscribe(res => {
        this.exchangeRecordList = res.results;
        this.noResultText = '暂无数据';
      }, err => {
        this.noResultText = '暂无数据';
        this.globalService.httpErrorProcess(err);
      });
  }

}
