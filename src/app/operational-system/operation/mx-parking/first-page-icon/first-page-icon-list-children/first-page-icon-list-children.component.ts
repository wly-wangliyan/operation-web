import { Component, OnInit, ViewChild } from '@angular/core';
import {
    FirstPageIconEntity,
    FirstPageIconService,
    SearchFirstPageIconParams
} from '../first-page-icon.service';
import { FirstPageIconEditComponent } from '../first-page-icon-edit/first-page-icon-edit.component';
import { GlobalService } from '../../../../../core/global.service';
import { NzSearchAdapter, NzSearchAssistant } from '../../../../../share/nz-search-assistant';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-first-page-icon-list-children',
    templateUrl: './first-page-icon-list-children.component.html',
    styleUrls: ['./first-page-icon-list-children.component.css']
})
export class FirstPageIconListChildrenComponent implements OnInit, NzSearchAdapter {
    public nzSearchAssistant: NzSearchAssistant;
    public application_id: string;
    public iconList: Array<FirstPageIconEntity> = [];
    @ViewChild('firstPageIconEdit', {static: true}) public firstPageIconEdit: FirstPageIconEditComponent;
    private menu_business_key_id: string;

    constructor(private route: ActivatedRoute,
                private router: Router, private globalService: GlobalService,
                private firstPageIconService: FirstPageIconService) {
        this.route.paramMap.subscribe(map => {
            this.application_id = map.get('application_id');
            this.menu_business_key_id = map.get('menu_business_key_id') || '';
            console.log(this.menu_business_key_id);
        });
        this.nzSearchAssistant = new NzSearchAssistant(this);
    }

    ngOnInit() {
        this.requestFirstPageIconList();
        this.nzSearchAssistant.submitSearch(true);
    }

    // 显示添加编辑项目modal
    public onShowModal(data: FirstPageIconEntity) {
        this.firstPageIconEdit.openEdit(data, () => {
            this.firstPageIconEdit.clear();
            this.nzSearchAssistant.submitSearch(true);
        }, () => {
            this.firstPageIconEdit.clear();
        });
    }

    // 隐藏、开启按钮触发事件
    public onHideBtnClick(data: any, dispaly: boolean) {
        const icon_display = this.iconList.filter(v => !v.is_display);
        if (!dispaly && icon_display.length >= 10) {
            this.globalService.promptBox.open('每个系统最大可同时显示10个icon!', null, 2000, '/assets/images/warning.png');
            return;
        }
        const param = {is_display: dispaly};
        this.firstPageIconService.requestDisplayMenu(this.application_id, data.menu_id, param).subscribe((e) => {
            const msg = dispaly ? '隐藏成功！' : '显示成功！';
            this.globalService.promptBox.open(msg);
            this.nzSearchAssistant.submitSearch(true);
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }

    // 删除某一App首页图标配置
    public onDeleteBtnClick(data: any) {
        this.globalService.confirmationBox.open('警告', '删除后将不可恢复，确认删除吗？', () => {
            this.globalService.confirmationBox.close();
            this.firstPageIconService.requestDeleteFirstPageIcon(data.menu_id, this.application_id).subscribe((e) => {
                this.nzSearchAssistant.submitSearch(true);
            }, err => {
                this.globalService.httpErrorProcess(err);
            });
        });
    }


    /* SearchDecorator 接口实现 */

    /* 请求检索 */
    public requestSearch(): any {
        return this.firstPageIconService.requestFirstPageIconList(this.application_id, this.menu_business_key_id);
    }

    public continueSearch(url: string): any {
        return this.firstPageIconService.continueFirstPageIconList(url);
    }

    /* 生成并检查参数有效性 */
    public generateAndCheckParamsValid(): boolean {
        return true;
    }

    /* 检索失败处理 */
    public searchErrProcess(err: any): any {
        this.globalService.httpErrorProcess(err);
    }

    /* 检索成功处理 */
    public searchCompleteProcess(): any {
    }

    //  请求App首页图标配置信息
    private requestFirstPageIconList() {
        this.firstPageIconService.requestFirstPageIconList(this.application_id).subscribe(res => {
            this.iconList = res.results;
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
    }
}
