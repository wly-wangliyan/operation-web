import { Component, ElementRef, Input, OnInit, AfterViewInit, ViewChild, ViewContainerRef, ComponentFactory } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { Subscription, timer, Observable, Subject } from 'rxjs';
import { isUndefined, isNullOrUndefined } from 'util';
import { ZPhotoSelectComponent } from '../../../../../share/components/z-photo-select/z-photo-select.component';
import { ValidateHelper } from '../../../../../../utils/validate-helper';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { ThematicActivityService, ThematicEntity, ReadStatisticsEntity, ThematicParams } from '../thematic-activity.service';
import { GlobalService } from '../../../../../core/global.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit {

  public thematicDetail: ThematicEntity = new ThematicEntity(); // 专题内容详情

  public thematicParams: ThematicParams = new ThematicParams(); // 添加编辑参数

  public contentList: Array<any> = []; // 内容数组

  public routerTitle = '新建专题活动'; // 路由标题

  public loading = true;

  private requestSubscription: Subscription;

  private searchText$ = new Subject<any>();

  private thematic_id: string; // 配置id

  private is_save = false; // 标记是否保存中

  private isCreate = true; // 标记是否新建

  @ViewChild('vc', { read: ViewContainerRef, static: false }) vc: ViewContainerRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    // private componentFactory: ComponentFactory,
    private globalService: GlobalService,
    private thematicService: ThematicActivityService
  ) {
    route.queryParams.subscribe(queryParams => {
      this.thematic_id = queryParams.thematic_id;
    });
  }

  public ngOnInit() {
    this.is_save = false;
    if (this.thematic_id) {
      this.isCreate = false;
      this.routerTitle = '编辑专题活动';
      // this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      //   this.rquestThematicDetail();
      // });
      this.searchText$.next();
    } else {
      this.loading = false;
      this.isCreate = true;
      this.thematicDetail = new ThematicEntity();
      this.contentList = [];
    }
  }

  public ngAfterViewInit() {
    // this.vc.createComponent(componentFactory);
  }

  // 获取详情
  private rquestThematicDetail(): void {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.requestSubscription = this.thematicService.requestThematicDetail(this.thematic_id).subscribe(res => {
      this.thematicDetail = res;
      this.loading = false;
    }, err => {
      this.loading = false;
      this.globalService.httpErrorProcess(err);
    });
  }

}
