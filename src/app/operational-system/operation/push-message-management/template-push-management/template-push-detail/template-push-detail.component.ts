import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoodsOrderRemarkComponent } from '../../../../mall/goods-order-management/goods-order-remark/goods-order-remark.component';
import { timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-application-push-detail',
    templateUrl: './template-push-detail.component.html',
    styleUrls: ['./template-push-detail.component.css']
})
export class TemplatePushDetailComponent implements OnInit {
    @ViewChild('remarkPromptDiv', {static: true}) public remarkPromptDiv: ElementRef;

    private push_id: string;

    constructor(private route: ActivatedRoute,
                private router: Router) {
        this.route.paramMap.subscribe(map => {
            this.push_id = map.get('push_plan_id');
        });
    }

    ngOnInit() {
    }

    /*
     * 修改备注信息
     * @param data GoodsOrderEntity 商品信息
   * */
    public onUpdateRemarkClick() {
        $(this.remarkPromptDiv.nativeElement).modal('show');
    }

    public onEditRemarkFormSubmit() {

    }
}
