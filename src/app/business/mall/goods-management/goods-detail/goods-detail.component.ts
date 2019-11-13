import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import { CommodityEntity, GoodsManagementHttpService } from '../goods-management-http.service';

@Component({
    selector: 'app-goods-detail',
    templateUrl: './goods-detail.component.html',
    styleUrls: ['./goods-detail.component.css']
})
export class GoodsDetailComponent implements OnInit {

    public videoAndImgList = [];

    public commodityInfo: CommodityEntity = new CommodityEntity();

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
        } else {
            this.router.navigate(['../../list'], {relativeTo: this.route});
        }
    }

    // 获取商品详情
    private requestCommodityById() {
        this.goodsManagementHttpService.requestCommodityByIdData(this.commodity_id).subscribe(data => {
            this.commodityInfo = data;
            this.commodityInfo.specifications.forEach(specificationsItem => {
                specificationsItem.unit_original_price = specificationsItem.unit_original_price / 100;
                specificationsItem.unit_sell_price = specificationsItem.unit_sell_price / 100;
            });
            this.videoAndImgList = this.commodityInfo.commodity_videos.concat(this.commodityInfo.commodity_images);
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }
}
