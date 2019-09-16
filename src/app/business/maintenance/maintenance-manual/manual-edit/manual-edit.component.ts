import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import {
  MaintenanceManualHttpService,
  ManualSettingEntity,
  HandbookEntity,
  ColumnEntity,
  SwitchParams
} from '../maintenance-manual-http.service';
import { VehicleTypeEntity } from '../../vehicle-type-management/vehicle-type-management.service';
import { ProjectManagemantHttpService, ProjectEntity } from '../../project-managemant/project-managemant-http.service';

@Component({
  selector: 'app-manual-edit',
  templateUrl: './manual-edit.component.html',
  styleUrls: ['./manual-edit.component.css']
})
export class ManualEditComponent implements OnInit {

  public isEdit = false; // 标记是否是编辑手册

  public title = '查看手册';

  private vehicle_type_id: string; // 车型id

  public vehicleTypeInfo: VehicleTypeEntity = new VehicleTypeEntity(); // 车型信息

  public manualSettingList: Array<ManualSettingEntity> = []; // 保养手册配置详情

  public projectList: Array<ProjectEntity> = []; // 保养项目列表

  public projectCategories = [1, 2, 3]; // 项目类别 1:保养项目 2:清洗养护项目 3:维修项目

  public mapOfProject: { [key: number]: Array<ProjectEntity> } = {}; // 大类下对应项目

  public mapOfSetting: { [key: string]: ManualSettingEntity } = {}; // 项目对应保养手册

  public mapOfHandbook: { [key: string]: Array<HandbookEntity> } = {}; // 项目对应动态配置

  public mapOfColumns: { [key: number]: Array<ColumnEntity> } = {}; // 项目对应动态配置

  public switchParams: SwitchParams = new SwitchParams(); // 更新开关参数

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private projectService: ProjectManagemantHttpService,
    private manualService: MaintenanceManualHttpService) {
    this.route.paramMap.subscribe(map => {
      this.vehicle_type_id = map.get('vehicle_type_id');
    });

    const url = this.router.routerState.snapshot.url;
    if (url.includes('/detail/')) {
      this.isEdit = false;
      this.title = '查看手册';
    } else if (url.includes('/edit/')) {
      this.isEdit = true;
      this.title = '编辑手册';
    }
  }

  public ngOnInit() {
    if (this.vehicle_type_id) {
      this.requestVehicleInfo();
      this.requestProjectList();
      this.requestManualDetail();
    } else {
      this.router.navigate(['../../list'], { relativeTo: this.route });
    }
  }

  public onEditClick() {
    this.isEdit = true;
    this.title = '编辑手册';
  }

  // 获取车型信息
  private requestVehicleInfo() {
    this.manualService.requestVehicleInfoData(this.vehicle_type_id).subscribe(res => {
      this.vehicleTypeInfo = res;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 请求项目列表
  private requestProjectList() {
    this.projectService.requestProjectListData().subscribe(res => {
      this.projectList = res;
      this.projectCategories.forEach(category => {
        this.mapOfProject[category] = this.projectList.filter(project => project.upkeep_item_category === category);
      });
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取保养手册配置详情
  private requestManualDetail() {
    this.manualService.requestManualDetailData(this.vehicle_type_id).subscribe(res => {
      this.manualSettingList = res;
      this.manualSettingList.forEach(setting => {
        this.mapOfSetting[setting.item_id] = setting;
        this.mapOfHandbook[setting.item_id] = setting.upkeep_handbook;
      });
      this.projectCategories.forEach(category => {
        const settings = this.manualSettingList.filter(setting => setting.item_category === category);
        if (settings && settings[0]) {
          this.mapOfColumns[category] = settings[0].upkeep_handbook;
        }
      });
      this.projectList.forEach(project => {
        if (!this.mapOfSetting[project.upkeep_item_id]) {
          this.mapOfSetting[project.upkeep_item_id] = new ManualSettingEntity();
          if (this.mapOfColumns[project.upkeep_item_category]) {
            const handbookRecords = [];
            this.mapOfColumns[project.upkeep_item_category].forEach((column, index) => {
              const handbook = new HandbookEntity();
              handbook.month = column.month;
              handbook.kilometer = column.kilometer;
              handbookRecords.push(handbook);
            });
            this.mapOfHandbook[project.upkeep_item_id] = handbookRecords;
          }
        }
      });
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 变更推荐值
  public onChangeBtnRecommend(handbook: HandbookEntity) {
    console.log(handbook);
  }

  // 变更开关
  public onChangeBtnSwitch(status: boolean, upkeep_item_id: string) {
    this.switchParams.vehicle_type_id = this.vehicle_type_id;
    this.switchParams.switch = !status;
    this.switchParams.item_id = upkeep_item_id;
    this.manualService.requestChangeSwitchData(this.switchParams).subscribe(res => {
      this.requestManualDetail();
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }
}
