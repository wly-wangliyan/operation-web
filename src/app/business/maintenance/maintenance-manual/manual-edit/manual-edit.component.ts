import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import {
  MaintenanceManualHttpService,
  ManualSettingEntity,
  HandbookEntity,
  ColumnEntity,
  SwitchParams,
  BatcSaveParams,
  ProjectItemParams,
  RecommendParams
} from '../maintenance-manual-http.service';
import { VehicleTypeEntity } from '../../vehicle-type-management/vehicle-type-management.service';
import { ProjectManagemantHttpService, ProjectEntity } from '../../project-managemant/project-managemant-http.service';
import { HttpErrorEntity } from 'src/app/core/http.service';

@Component({
  selector: 'app-manual-edit',
  templateUrl: './manual-edit.component.html',
  styleUrls: ['./manual-edit.component.css']
})
export class ManualEditComponent implements OnInit {

  public isEdit = false; // 标记是否是编辑手册

  public isShowSetting = false; // 为true时显示手册配置

  public title = '查看手册'; // 路由标题

  public vehicleTypeInfo: VehicleTypeEntity = new VehicleTypeEntity(); // 车型信息

  public projectCategories = [1, 2, 3]; // 项目类别 1:保养项目 2:清洗养护项目 3:维修项目

  public mapOfProject: { [key: number]: Array<ProjectEntity> } = {}; // 大类下对应项目

  public mapOfSetting: { [key: string]: ManualSettingEntity } = {}; // 项目对应保养手册

  public mapOfHandbook: { [key: string]: Array<HandbookEntity> } = {}; // 项目对应动态配置

  public mapOfColumns: { [key: number]: Array<ColumnEntity> } = {}; // 项目对应动态配置

  public mapOfShow = []; // 大类对应是否显示

  public loading = true; // 标记loading

  private vehicle_type_id: string; // 车型id

  private manualSettingList: Array<ManualSettingEntity> = []; // 保养手册配置详情

  private projectList: Array<ProjectEntity> = []; // 保养项目列表

  private switchParams: SwitchParams = new SwitchParams(); // 更新开关参数

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
    } else {
      this.router.navigate(['../../list'], { relativeTo: this.route });
    }
  }

  // 查看详情》点击编辑
  public onEditClick(): void {
    this.router.navigateByUrl(`/main/maintenance/maintenance-manual/edit/${this.vehicle_type_id}`);
  }

  // 获取车型信息
  private requestVehicleInfo(): void {
    this.manualService.requestVehicleInfoData(this.vehicle_type_id).subscribe(res => {
      this.vehicleTypeInfo = res;
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取所有项目列表
  private requestProjectList(): void {
    this.projectService.requestProjectListData().subscribe(res => {
      this.projectList = res;
      // 项目显示在对应大类下
      this.projectCategories.forEach(category => {
        this.mapOfProject[category] = this.projectList.filter(project => project.upkeep_item_category === category);
      });
      this.requestManualDetail();
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 根据车型id获取保养手册配置详情
  private requestManualDetail(): void {
    this.manualService.requestManualDetailData(this.vehicle_type_id).subscribe(res => {
      this.manualSettingList = res;

      this.manualSettingList.forEach(setting => {
        // 临时存储车型下已有项目的配置详情
        this.mapOfSetting[setting.item_id] = setting;
        // 临时存储车型下已有项目的保养手册
        this.mapOfHandbook[setting.item_id] = setting.upkeep_handbook;
      });

      // 获取每大类下的动态列
      this.projectCategories.forEach(category => {
        const settings = this.manualSettingList.filter(setting => setting.item_category === category);

        // 动态列默认以每大类下的第一条数据为准
        if (settings && settings[0]) {
          this.mapOfColumns[category] = settings[0].upkeep_handbook;
        }

        // 查看模式下，只显示已配置且已开启的项目
        if (!this.isEdit) {
          this.mapOfShow[category] = this.manualSettingList.some(setting => setting.switch && setting.item_category === category);
        } else {
          // 编辑模式下，显示已有大类下所有项目
          this.mapOfShow[category] = this.mapOfProject[category] && this.mapOfProject[category].length > 0;
        }
      });

      // 编辑模式下，当无可显示项目类别时，隐藏
      this.isShowSetting = this.isEdit || (!this.isEdit && this.mapOfShow.some(show => show === true));
      this.loading = false;
      this.projectList.forEach(project => {

        // 如果某个项目在车型已有配置中不存在
        if (!this.mapOfSetting[project.upkeep_item_id]) {
          // 则新填充一条
          this.mapOfSetting[project.upkeep_item_id] = new ManualSettingEntity();

          // 如果原保养手册下该大类已有保养手册
          if (this.mapOfColumns[project.upkeep_item_category]) {
            // 则为其复刻一份
            const handbookRecords = [];
            this.mapOfColumns[project.upkeep_item_category].forEach(column => {
              const handbook = new HandbookEntity();
              handbook.month = column.month;
              handbook.kilometer = column.kilometer;
              handbookRecords.push(handbook);
            });
            this.mapOfHandbook[project.upkeep_item_id] = handbookRecords;
          }
        } else {
          // 如果该项目已配置且大类下已有保养手册
          if (this.mapOfColumns[project.upkeep_item_category]) {
            const handbookRecords = this.mapOfHandbook[project.upkeep_item_id];
            this.mapOfColumns[project.upkeep_item_category].forEach((column, index) => {
              let handbookIndex = -1;
              if (this.mapOfHandbook[project.upkeep_item_id]) {
                handbookIndex = this.mapOfHandbook[project.upkeep_item_id].findIndex(handbook =>
                  // 月数相等且公里数相等才是同一配置
                  column.month === handbook.month && column.kilometer === handbook.kilometer);
              }
              // 则按标准列进行补全
              if (handbookIndex === -1) {
                const handbook = new HandbookEntity();
                handbook.month = column.month;
                handbook.kilometer = column.kilometer;
                handbookRecords.push(handbook);
              }
            });
            this.mapOfHandbook[project.upkeep_item_id] = handbookRecords;
          }
        }
      });
    }, err => {
      this.loading = false;
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          this.globalService.promptBox.open('获取保养手册失败！', null, 2000, null, false);
        }
      }
    });
  }

  // 变更推荐值
  public onChangeBtnRecommend(handbook: HandbookEntity, uh_item_id: string): any {
    const recommendParams = new RecommendParams();
    recommendParams.recommend_value = handbook.recommend_value === 1 ? 2 : 1; // 推荐值 1不做2做
    if (handbook.upkeep_handbook_id) {
      recommendParams.upkeep_handbook_id = handbook.upkeep_handbook_id;
    } else {
      recommendParams.uh_item_id = uh_item_id;
      recommendParams.month = handbook.month;
      recommendParams.kilometer = handbook.kilometer;
    }
    this.manualService.requestChangeRecommendData(recommendParams).subscribe(() => {
      this.requestManualDetail();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            if (content.field === 'parameter' && content.code === 'format_wrong') {
              this.globalService.promptBox.open('数据缺失,请重试！', null, 2000, null, false);
              return;
            } else {
              this.globalService.promptBox.open('参数错误或无效！', null, 2000, null, false);
            }
          }
        }
      }
    });
  }

  // 变更开关
  public onChangeBtnSwitch(status: boolean, upkeep_item_id: string): void {
    this.switchParams.vehicle_type_id = this.vehicle_type_id;
    this.switchParams.switch = !status;
    this.switchParams.item_id = upkeep_item_id;
    this.manualService.requestChangeSwitchData(this.switchParams).subscribe(() => {
      this.requestManualDetail();
    }, err => {
      if (!this.globalService.httpErrorProcess(err)) {
        if (err.status === 422) {
          let errMsg = '开启失败,请重试';
          if (status) {
            errMsg = '关闭失败，请重试';
          }
          this.globalService.promptBox.open(errMsg, null, 2000, null, false);
        }
      }
    });
  }

  // 保存按钮可用状态,当没有任意配置是开启状态时，则保存按钮禁用
  public saveBtnStatus(): boolean {
    for (const setting in this.mapOfSetting) {
      if (this.mapOfSetting.hasOwnProperty(setting)) {
        if (this.mapOfSetting[setting].switch) {
          return false;
        }
      }
    }
    return true;
  }

  // 批量保存描述
  public onEditFormSubmit(): void {
    this.loading = true;
    const uh_items = [];
    const batcSaveParams = new BatcSaveParams();
    for (const settingId in this.mapOfSetting) {
      if (this.mapOfSetting.hasOwnProperty(settingId)) {
        if (this.mapOfSetting[settingId].switch) {
          const projectItemParams = new ProjectItemParams();
          projectItemParams.item_id = settingId;
          projectItemParams.vehicle_type_id = this.vehicle_type_id;
          const description = this.mapOfSetting[settingId].description;
          projectItemParams.description = description ? description : '';
          uh_items.push(projectItemParams);
        }
      }
    }

    batcSaveParams.uh_items = uh_items;
    if (batcSaveParams.uh_items.length > 0) {
      this.manualService.requestBatcSaveDescriptionData(batcSaveParams).subscribe(() => {
        this.loading = false;
        this.globalService.promptBox.open('保存成功');
      }, err => {
        this.loading = false;
        if (!this.globalService.httpErrorProcess(err)) {
          if (err.status === 422) {
            this.globalService.promptBox.open('保存描述失败，请重试', null, 2000, null, false);
          }
        }
      });
    }
  }

  // 点击取消
  public onCancelClick(): void {
    window.history.back();
  }
}
