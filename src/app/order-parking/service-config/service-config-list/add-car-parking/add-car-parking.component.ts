import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Subject, timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpErrorEntity } from '../../../../core/http.service';
import { GlobalService } from '../../../../core/global.service';
import { ServiceConfigService, ParkingEntity } from '../../service-config.service';

@Component({
  selector: 'app-add-car-parking',
  templateUrl: './add-car-parking.component.html',
  styleUrls: ['./add-car-parking.component.css']
})

export class AddCarParkingComponent implements OnInit {

  public checkCarParkingList: Array<any> = [];
  public checkParkingList: Array<any> = [];
  public parkingList: Array<ParkingEntity> = [];
  public parking_name = '';

  private sureCallback: any;
  private subscription: Subscription;
  private searchText$ = new Subject<any>();

  @Input() public tagsList: Array<any> = [];

  @ViewChild('promptDiv', { static: true }) public promptDiv: ElementRef;

  constructor(private globalService: GlobalService, private serviceConfigService: ServiceConfigService) {
  }

  ngOnInit() {
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.serviceConfigService.requestBeanParkingListData(this.parking_name).subscribe(res => {
        this.parkingList = res.results;
        this.checkParkingList = this.parkingList.map(i => ({ ...i, checked: false }));
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
    this.searchText$.next();

  }

  // 查询按钮
  public onSearchBtnClick() {
    this.searchText$.next();
  }

  /**
   * 取消按钮触发关闭模态框，释放订阅。
   */
  public onClose() {
    this.searchText$.next();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.sureCallback) {
      this.sureCallback = null;
    }
    $(this.promptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param tagsList 标签数组
   * @param sureFunc 确认回调
   */
  public open(sureFunc: any) {
    this.searchText$.next();
    this.sureCallback = sureFunc;
    timer(0).subscribe(() => {
      $(this.promptDiv.nativeElement).modal('show');
    });
  }

  // 保存选择的标签
  public onSaveParkingIds() {
    const checkedParkingList = this.checkParkingList.filter(i => i.checked);
    if (checkedParkingList.length === 0) {
      this.globalService.promptBox.open(`请添加停车场!`, null, 2000, '/assets/images/warning.png');
    } else {
      const park_ids = checkedParkingList.map(i => i.parking_id).join(',');
      this.serviceConfigService.requestAddParkingIds(park_ids).subscribe(() => {
        this.globalService.promptBox.open('添加成功！');
        this.searchText$.next();
        if (this.sureCallback) {
          const temp = this.sureCallback;
          temp();
        }
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
        if (this.sureCallback) {
          this.sureCallback = null;
        }
        $(this.promptDiv.nativeElement).modal('hide');
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          if (err.status === 422) {
            const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
            for (const content of error.errors) {
              if (content.code === 'parking_already_existed') {
                this.globalService.promptBox.open(`存在已添加的停车场！`, null, 2000, '/assets/images/warning.png');
              } else {
                this.globalService.promptBox.open('保存失败,请重试!', null, 2000, '/assets/images/warning.png');
              }
            }
          }
        }
      });
    }
  }

}

