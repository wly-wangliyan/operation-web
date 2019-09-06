import { Component, OnInit, ViewChild } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd';
import { Subscription, timer } from 'rxjs';
import { VehicleImportViewModel } from './vehicle-import.model';
import { GlobalService } from '../../../../core/global.service';
import { ProgressModalComponent } from '../../../../share/components/progress-modal/progress-modal.component';
import { LocalStorageProvider } from '../../../../share/localstorage-provider';

@Component({
  selector: 'app-vehicle-type-list',
  templateUrl: './vehicle-type-list.component.html',
  styleUrls: ['./vehicle-type-list.component.css']
})
export class VehicleTypeListComponent implements OnInit {

  public nodes: any;
  private importSpotSubscription: Subscription;
  public importViewModel: VehicleImportViewModel = new VehicleImportViewModel();

  @ViewChild('progressModal', { static: true }) public progressModalComponent: ProgressModalComponent;

  constructor(private globalService: GlobalService) {
  }

  ngOnInit() {
    this.nodes = [
      { title: '奥迪', key: '111', btn: '删除'},
      { title: '宝马', key: '222', btn: '删除' },
      { title: '奔驰', key: '333', btn: '删除', isLeaf: true }
    ];
    LocalStorageProvider.Instance.setObject(LocalStorageProvider.VehicleList, this.nodes);
  }

  nzEvent(event: Required<NzFormatEmitEvent>): void {
    if (event.eventName === 'expand') {
      const node = event.node;
      if (node && node.getChildren().length === 0 && node.isExpanded) {
        this.loadNode().then(data => {
          node.addChildren(data);
          const tempList = this.nodes;
          tempList[0].Manufacturer = data;
          LocalStorageProvider.Instance.setObject(LocalStorageProvider.VehicleList, tempList);
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
                { title: '一汽-大众奥迪', key: `${new Date().getTime()}-1` }
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
}
