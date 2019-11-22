import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { InsuranceEntity, InsuranceService } from '../../insurance.service';
import { InsuranceCompanyEditComponent } from '../insurance-company-edit/insurance-company-edit.component';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-insurance-company-list',
    templateUrl: './insurance-company-list.component.html',
    styleUrls: ['./insurance-company-list.component.css']
})
export class InsuranceCompanyListComponent implements OnInit {
    public insuranceList: Array<InsuranceEntity> = [];
    public pageIndex = 1;
    public noResultText = '数据加载中...';

    private searchText$ = new Subject<any>();
    private linkUrl: string;

    @ViewChild(InsuranceCompanyEditComponent, {static: true}) public insuranceEditComponent: InsuranceCompanyEditComponent;

    constructor(private globalService: GlobalService,
                private insuranceService: InsuranceService) {
    }

    ngOnInit() {
        this.searchText$.pipe(
            debounceTime(500),
            switchMap(() =>
                this.insuranceService.requestInsuranceList())
        ).subscribe(res => {
            this.insuranceList = res.results;
            this.linkUrl = res.linkUrl;
            this.noResultText = '暂无数据';
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
        this.searchText$.next();
    }

    // 显示添加编辑项目modal
    public onShowModal(data: InsuranceEntity) {
        const ic_id = data ? data.ic_id : null;
        this.insuranceEditComponent.open(ic_id, () => {
            this.insuranceEditComponent.clear();
            this.pageIndex = 1;
            timer(0).subscribe(() => {
                this.searchText$.next();
            });
        }, '保存', () => {
            this.insuranceEditComponent.clear();
        });
    }

    // 停用、启用(如果停用保险公司 需要二次确认)
    public onCloseBtnClick(data: any, use: boolean) {
        const param = {discontinue_use: use};
        if (use) {
            this.globalService.confirmationBox.open('提示', '确定要停用该保险公司吗？', () => {
                this.globalService.confirmationBox.close();
                this.insuranceService.requestUseInsurance(data.ic_id, param).subscribe((e) => {
                    this.searchText$.next();
                }, err => {
                    this.globalService.httpErrorProcess(err);
                });
            });
        } else {
            this.insuranceService.requestUseInsurance(data.ic_id, param).subscribe((e) => {
                const msg = use ? '停用成功！' : '启用成功！';
                this.globalService.promptBox.open(msg);
                this.searchText$.next();
            }, err => {
                this.globalService.httpErrorProcess(err);
            });
        }
    }

    // 列表排序(停用的保险公司不发送请求，位置没有发生变化的不发送请求)
    public drop(event: CdkDragDrop<string[]>, data): void {
        // 停用的保险公司不发送请求
        if (data[event.previousIndex].discontinue_use) {
            return;
        }
        // 位置没有发生变化的不发送请求
        if (event.previousIndex === event.currentIndex) {
            return;
        }
        let param = {};
        if (event.previousIndex > event.currentIndex) {
            const index = event.currentIndex > 0 ? event.currentIndex - 1 : 0;
            param = {move_num: this.insuranceList[index].sort_num};
            if (event.currentIndex === 0 && this.insuranceList[index].sort_num === 1) {
                param = {move_num: 0};
            }
        } else {
            param = {move_num: this.insuranceList[event.currentIndex].sort_num};
        }
        moveItemInArray(data, event.previousIndex, event.currentIndex);
        this.insuranceService.requestUpdateSort(this.insuranceList[event.previousIndex].ic_id, param).subscribe((e) => {
            this.searchText$.next();
            this.globalService.promptBox.open('排序成功');
        }, err => {
            this.globalService.httpErrorProcess(err);
            this.searchText$.next();
        });
    }
}
