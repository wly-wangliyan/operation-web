import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarPartEntity, CarPartParamEntity, VehicleManagementHttpService } from '../vehicle-management-http.service';
import { GlobalService } from '../../../core/global.service';

@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  styleUrls: ['./vehicle-edit.component.css']
})
export class VehicleEditComponent implements OnInit {

  public paramList: Array<CarPartEntity> = [];
  public carInfo: CarPartParamEntity = new CarPartParamEntity();
  public pageIndex = 1;
  public noResultText = '数据加载中...';

  private car_param_id: string;
  private car_series_id: string;

  constructor(private route: ActivatedRoute,
              private globalService: GlobalService,
              private vehicleService: VehicleManagementHttpService) {
    route.queryParams.subscribe(queryParams => {
      this.car_param_id = queryParams.car_param_id;
      this.car_series_id = queryParams.car_series_id;
    });
  }

  ngOnInit() {
    this.requestCarDetail();
  }

  private requestCarDetail() {
    this.vehicleService.requestCarDetail(this.car_series_id, this.car_param_id).subscribe(res => {
      this.paramList = res;
      this.carInfo = res[0].car_param;
      this.noResultText = '暂无数据';
    }, err => {
      this.noResultText = '暂无数据';
      this.globalService.httpErrorProcess(err);
    });
  }
}
