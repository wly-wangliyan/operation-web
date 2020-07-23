import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
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
    public remark = '';
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

    /*
     * 修改备注信息
   * */
    public onUpdateRemarkClick() {
        $(this.remarkPromptDiv.nativeElement).modal('show');
    }

    /**
     * 编辑备注
     */
    public onEditRemarkFormSubmit() {
        const params = new TemplatePushManagementEntity();
        params.remark = this.remark;
        this.templatePushManagementService.requestAddTemplatePushData(params, this.template_message_id).subscribe(data => {
            this.globalService.promptBox.open('保存成功！', () => {
                this.requestTemplatePushDetail();
            });
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
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
            this.remark = this.templatePushDetail.clone().remark;
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }
}
