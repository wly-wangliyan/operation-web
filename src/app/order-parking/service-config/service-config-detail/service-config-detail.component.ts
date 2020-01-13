import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subject } from 'rxjs/index';
import { debounceTime } from 'rxjs/internal/operators';
import { GlobalService } from '../../../core/global.service';
import { ServiceConfigService, ParkingEntity } from '../service-config.service';

@Component({
    selector: 'app-service-config-detail',
    templateUrl: './service-config-detail.component.html',
    styleUrls: ['./service-config-detail.component.css']
})
export class ServiceConfigDetailComponent implements OnInit {

    public parkingDetailData: ParkingEntity = new ParkingEntity();

    public productInfoList: Array<any> = [];

    public productTicketList: Array<any> = [];

    public imgUrls: Array<any> = [];

    public loading = true;

    public parking_id: string;

    public productNameErrors = '';

    public tagNameErrors = '';

    public trafficGuideErrors = '';

    public noticeErrors = '';

    public productIntroduceErrors = '';

    public isEditTicketInsutruction = false;

    public checkLabelNamesList: Array<any> = [];

    public tag = '';

    private searchText$ = new Subject<any>();

    constructor(private globalService: GlobalService, private serviceConfigService: ServiceConfigService,
                private routerInfo: ActivatedRoute, private router: Router) {
    }

    public ngOnInit() {
        this.routerInfo.params.subscribe((params: Params) => {
            this.parking_id = params.parking_id;
        });
        this.searchText$.pipe(debounceTime(500)).subscribe(() => {
            this.serviceConfigService.requestParkingDetailData(this.parking_id).subscribe(res => {
                this.parkingDetailData = res;
                this.imgUrls = this.parkingDetailData.images ? this.parkingDetailData.images : [];
                this.loading = false;
            }, err => {
                this.globalService.httpErrorProcess(err);
            });
        });
        this.searchText$.next();
    }
}
