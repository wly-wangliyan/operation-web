import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { GlobalService } from '../../../../../core/global.service';
import { FirstPageIconEditComponent } from '../first-page-icon-edit/first-page-icon-edit.component';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { AppEntity, FirstPageIconEntity, FirstPageIconService, SearchFirstPageIconParams } from '../first-page-icon.service';

@Component({
    selector: 'app-first-page-icon',
    templateUrl: './first-page-icon.component.html',
    styleUrls: ['./first-page-icon.component.css']
})
export class FirstPageIconComponent implements OnInit {
    public iconList: Array<FirstPageIconEntity> = [];
    public appList: Array<AppEntity> = [];
    public noResultText = '数据加载中...';
    public application_id: string;
    private searchText$ = new Subject<any>();
    private searchAppText$ = new Subject<any>();

    @ViewChild('firstPageIconEdit', {static: true}) public firstPageIconEdit: FirstPageIconEditComponent;

    constructor(private globalService: GlobalService,
                private firstPageIconService: FirstPageIconService) {
    }

    ngOnInit() {
        this.searchAppText$.pipe(debounceTime(500), switchMap(() => this.firstPageIconService.requestAppList()))
            .subscribe(res => {
                this.appList = res;
                this.application_id = this.appList.length > 0 ? this.appList[0].application_id : null;
                this.requestFirstPageIconList();
            }, err => {
                this.globalService.httpErrorProcess(err);
            });
        this.searchAppText$.next();
    }

    //  请求App首页图标配置信息
    private requestFirstPageIconList() {
        this.searchText$.pipe(debounceTime(500), switchMap(() => this.firstPageIconService.requestFirstPageIconList(this.application_id))
        ).subscribe(res => {
            this.iconList = res.results;
            this.noResultText = '暂无数据';
        }, err => {
            this.globalService.httpErrorProcess(err);
        });
        this.searchText$.next();
    }

    // 显示添加编辑项目modal
    public onShowModal() {
        const app = this.appList.filter(v => v.application_id === this.application_id);
        this.firstPageIconEdit.open(app[0], () => {
            this.firstPageIconEdit.clear();
            timer(0).subscribe(() => {
                this.searchText$.next();
            });
        }, () => {
            this.firstPageIconEdit.clear();
        });
    }

    //  切换应用
    public onCheckStatusClicked(application_id: string) {
        this.application_id = application_id;
        this.searchText$.next();
    }

    // 列表排序
    public drop(event: CdkDragDrop<string[]>, data: any): void {
        if (event.previousIndex === event.currentIndex) {
            return;
        }
        let param = {};
        if (event.previousIndex > event.currentIndex) {
            const index = event.currentIndex > 0 ? event.currentIndex - 1 : 0;
            param = {to_menu_id: this.iconList[index].menu_id};
            if (event.currentIndex === 0 && this.iconList[index].sort_num === 1) {
                param = {to_menu_id: ''};
            }
        } else {
            param = {to_menu_id: this.iconList[event.currentIndex].menu_id};
        }
        moveItemInArray(data, event.previousIndex, event.currentIndex);
        this.firstPageIconService.requestUpdateSort(this.iconList[event.previousIndex].menu_id, param).subscribe((e) => {
            this.searchText$.next();
            this.globalService.promptBox.open('排序成功');
        }, err => {
            this.globalService.httpErrorProcess(err);
            this.searchText$.next();
        });
    }
}
