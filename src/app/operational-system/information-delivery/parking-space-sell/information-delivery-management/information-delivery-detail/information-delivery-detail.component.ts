import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import {
    InformationDeliveryManagementService,
    ParkingPlaceEntity
} from '../information-delivery-management.service';
import { ReviewStatus } from '../../../used-car/information-delivery-management/information-delivery-management.service';

@Component({
    selector: 'app-information-delivery-detail',
    templateUrl: './information-delivery-detail.component.html',
    styleUrls: ['./information-delivery-detail.component.css']
})
export class InformationDeliveryDetailComponent implements OnInit {
    public loading = true; // 标记loading
    public videoAndImgList = [];
    public ReviewStatus = ReviewStatus;
    public parkingPlaceDetail: ParkingPlaceEntity = new ParkingPlaceEntity();
    private parking_place_info_id = '';

    constructor(private route: ActivatedRoute,
                private router: Router,
                private globalService: GlobalService,
                private informationDeliveryManagementService: InformationDeliveryManagementService) {
        this.route.paramMap.subscribe(map => {
            this.parking_place_info_id = map.get('parking_place_info_id');
        });
    }

    public ngOnInit() {
        this.requestParkingPlaceDetail();
    }

    /**
     * 查看详情
     * @private
     */
    private requestParkingPlaceDetail() {
        this.informationDeliveryManagementService.requestParkingPlaceDetailData(this.parking_place_info_id).subscribe(data => {
            this.loading = false;
            this.parkingPlaceDetail = data;
            // this.selectTagList = data.labels;
            this.videoAndImgList = data.images ? data.images.split(',') : [];
        }, err => {
            this.loading = false;
            this.globalService.httpErrorProcess(err);
        });
    }
}
