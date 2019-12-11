import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GlobalService } from '../../../core/global.service';
import { Subject } from 'rxjs/index';
import { debounceTime } from 'rxjs/internal/operators';
import { ServiceConfigService, ParkingEntity, ParkingSearchParams } from '../service-config.service';

@Component({
  selector: 'app-service-config-detail',
  templateUrl: './service-config-detail.component.html',
  styleUrls: ['./service-config-detail.component.css']
})
export class ServiceConfigDetailComponent implements OnInit {

  constructor(private globalService: GlobalService, private serviceConfigService: ServiceConfigService,
              private routerInfo: ActivatedRoute, private router: Router) {
  }

  public parkingDetailData: ParkingEntity = new ParkingEntity();
  public productInfoList: Array<any> = [];
  public productTicketList: Array<any> = [];
  public imgUrls: Array<any> = [];
  public product_image_url: Array<any> = [];
  public loading = false;
  public parking_id: string;
  public productNameErrors = '';
  public tagNameErrors = '';
  public trafficGuideErrors = '';
  public noticeErrors = '';
  public productIntroduceErrors = '';
  public isEditTicketInsutruction = false;
  public initCheckLabelNamesList: Array<any> = [];
  public checkLabelNamesList: Array<any> = [];
  public isSaleTicketSwitch = true;
  public editorWidth = '500';
  public tag = '';

  private searchText$ = new Subject<any>();

  ngOnInit() {
    this.routerInfo.params.subscribe((params: Params) => {
      this.parking_id = params.parking_id;
    });
    this.checkLabelNamesList = ['标签111'];

    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.serviceConfigService.requestParkingDetailData(this.parking_id).subscribe(res => {
        this.parkingDetailData = res;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
    this.searchText$.next();
  }

}
