import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoodsOrderRemarkComponent } from '../../../../mall/goods-order-management/goods-order-remark/goods-order-remark.component';
import { forkJoin, timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import { TemplateManagementService } from '../../template-management/template-management.service';
import { SendRecordEntity, TemplatePushManagementEntity, TemplatePushManagementService } from '../template-push-management.service';

@Component({
    selector: 'app-application-push-detail',
    templateUrl: './template-push-detail.component.html',
    styleUrls: ['./template-push-detail.component.css']
})
export class TemplatePushDetailComponent implements OnInit {
    @ViewChild('remarkPromptDiv', {static: true}) public remarkPromptDiv: ElementRef;
    public templatePushDetail: TemplatePushManagementEntity = new TemplatePushManagementEntity();
    public sendRecordList: Array<SendRecordEntity> = [];
    private template_message_id: string;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private globalService: GlobalService,
                private templatePushManagementService: TemplatePushManagementService) {
        this.route.paramMap.subscribe(map => {
            this.template_message_id = map.get('template_message_id');
        });
    }

    public ngOnInit() {
        this.requestTemplatePushDetail();
    }

    /**
     * 请求详情
     */
    private requestTemplatePushDetail() {
        const httpList = [];
        httpList.push(this.templatePushManagementService.requestTemplatePushDetailData(this.template_message_id));
        httpList.push(this.templatePushManagementService.requestTemplatePushRecordListData(this.template_message_id));
        forkJoin(httpList).subscribe(results => {
            this.templatePushDetail = results[0];
            this.sendRecordList = results[1];
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
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
