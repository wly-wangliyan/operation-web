import { Component, OnInit, ViewChild } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd';
import { Subscription, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { ProgressModalComponent } from '../../../../share/components/progress-modal/progress-modal.component';
import { LocalStorageProvider } from '../../../../share/localstorage-provider';
import { FileImportViewModel } from '../../../../../utils/file-import.model';

@Component({
  selector: 'app-vehicle-type-list',
  templateUrl: './vehicle-type-list.component.html',
  styleUrls: ['./vehicle-type-list.component.css']
})
export class VehicleTypeListComponent implements OnInit {

  public nodes: any;
  public nodes_1: any;
  public nodes_2: any;
  public nodes_3: any;
  public key = '111';
  public index = 0;
  private vehicleList = [];
  private importSpotSubscription: Subscription;
  public importViewModel: FileImportViewModel = new FileImportViewModel();

  @ViewChild('progressModal', { static: true }) public progressModalComponent: ProgressModalComponent;

  constructor(private globalService: GlobalService) {
  }

  ngOnInit() {
    this.nodes = [
      { title: '奥迪', key: '111', btn: '删除'},
      { title: '宝马', key: '222', btn: '删除' },
      { title: '奔驰', key: '333', btn: '删除', isLeaf: false }
    ];
    LocalStorageProvider.Instance.setObject(LocalStorageProvider.VehicleList, this.nodes);
  }

  nzEvent(event: Required<NzFormatEmitEvent>): void {
    if (event.eventName === 'expand') {
      const node = event.node;
      if (node && node.getChildren().length === 0 && node.isExpanded) {
        this.loadNode().then(data => {
          node.addChildren(data);
          const temp = this.vehicleList.length > 0 ? JSON.stringify(this.vehicleList) : JSON.stringify(this.nodes);
          this.vehicleList = JSON.parse(temp);
          data.forEach(value => {
            this.vehicleList.push(value);
          });
          LocalStorageProvider.Instance.setObject(LocalStorageProvider.VehicleList, this.vehicleList);
          let sizeStore = 0;
          if (window.localStorage) {
          // 遍历所有存储
            for (const item in window.localStorage) {
              if (window.localStorage.hasOwnProperty(item)) {
                sizeStore += window.localStorage.getItem(item).length;
              }
            }
          }
          console.log((sizeStore / 1024 / 1024).toFixed(2) + 'M');
        });
      }
    }
  }

  loadNode(): Promise<NzTreeNodeOptions[]> {
    return new Promise(resolve => {
      setTimeout(
          () =>
              resolve([
                { title: 'Audi Sport', key: `${new Date().getTime()}-0` },
                { title: '一汽-大众奥迪', key: `${new Date().getTime()}-1`, isLeaf: true }
              ]),
          500
      );
    });
  }

  public onImportClick() {
    console.log(LocalStorageProvider.Instance.getObject(LocalStorageProvider.VehicleList));
    $('#importBerthPromptDiv').modal('show');
    this.importViewModel.initImportData();
  }

  /* 导入数据 */
  public onSubmitImportBerth() {
    LocalStorageProvider.Instance.setObject(LocalStorageProvider.VehicleList, []);
    if (this.importViewModel.address) {
      const length = this.importViewModel.address.length;
      const index = this.importViewModel.address.lastIndexOf('.');
      const type = this.importViewModel.address.substring(index, length);
      if (type !== '.xlsx' && type !== '.xls' && type !== '.csv') {
        this.globalService.promptBox.open('文件格式错误！');
        return;
      }
    }
    if (this.importViewModel.checkFormDataValid()) {
     /* this.progressModalComponent.openOrClose(true);
      this.importSpotSubscription = this.setBerthService.requestImportSpot(
          this.importViewModel.type, this.importViewModel.file, this.projectId).subscribe(() => {
        $('#dataImportModal').modal('hide');
        this.globalService.promptBox.open('名单导入成功！', () => {
          this.importViewModel.initImportData();
          $('#importBerthPromptDiv').modal('hide');
          this.progressModalComponent.openOrClose(false);
        }, -1);
      }, err => {
        this.progressModalComponent.openOrClose(false);
        timer(300).subscribe(() => {
          if (!this.globalService.httpErrorProcess(err)) {
            if (err.status === 422) {
              const tempErr = JSON.parse(err.responseText);
              const error = tempErr.length > 0 ? tempErr[0].errors[0] : tempErr.errors[0];
              if (error.resource === 'file' && error.code === 'missing') {
                this.globalService.promptBox.open('泊位文件不能为空！');
              } else {
                this.globalService.promptBox.open('泊位文件错误');
              }
            }
          }
        });
      });*/
    }
  }

  // 解订阅
  public onCloseUnsubscribe() {
    this.importSpotSubscription && this.importSpotSubscription.unsubscribe();
  }

  public onCancelData() {
    this.onCloseUnsubscribe();
    this.importViewModel.initImportData();
    $('#importBerthPromptDiv').modal('hide');
  }

  // 删除车型
  public onDeleteVehicleClick() {
    this.globalService.confirmationBox.open('警告', '删除后将不可恢复，确认删除吗？', () => {
      this.globalService.confirmationBox.close();
      /*this.versionManagementService.requestDeleteVersion(data.version_id).subscribe((e) => {
        this.versionList = this.versionList.filter(version => version.version_id !== data.version_id);
      }, err => {
        this.globalService.httpErrorProcess(err);
      });*/
    });
  }

  public onBrandClick(data) {
    this.key = data.key;
  }

  public onManufacturerClick(data, index) {
    this.index = index;
    this.nodes_2 = [{ title: 'Audi Sport', key: `${new Date().getTime()}-0`, key_1: '111' },
      { title: '一汽-大众奥迪', key: `${new Date().getTime()}-1`, key_1: '222' }];
  }

  public onTypeClick(data) {
    this.nodes_3 = [{ title: '2017', key: `${new Date().getTime()}-0` },
      { title: '2018', key: `${new Date().getTime()}-1` }];
  }
}
