import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { IntegralRightsHttpService } from '../integral-rights-http.service';
import { Subject, forkJoin } from 'rxjs';
import { ValidDateConfigModalComponent } from './valid-date-config-modal/valid-date-config-modal.component';
import { LimitConfigModalComponent } from './limit-config-modal/limit-config-modal.component';

@Component({
  selector: 'app-common-rules',
  templateUrl: './common-rules.component.html',
  styleUrls: ['./common-rules.component.less']
})
export class CommonRulesComponent implements OnInit {
  public ruleDetail: any;
  public nzDataList = [];
  public noResultText = '数据加载中...';
  public searchText$ = new Subject<any>();

  @ViewChild('validDateConfigModal', { static: false }) private validDateConfigModal: ValidDateConfigModalComponent;
  @ViewChild('limitConfigModal', { static: false }) private limitConfigModal: LimitConfigModalComponent;
  constructor(
    private globalService: GlobalService,
    private integralRightsHttpService: IntegralRightsHttpService
  ) { }

  ngOnInit() {
  }

  private requestCommonIntegralRule(): void {
    forkJoin(this.integralRightsHttpService.requestCommonIntegralRuleDetail())
      .subscribe(res => {
        this.nzDataList = [res[0]];
        this.noResultText = '暂无数据';
      }, err => {
        this.noResultText = '暂无数据';
        this.globalService.httpErrorProcess(err);
      });
  }

  // 设置
  public onSettingClick(): void {
    this.limitConfigModal.open(null);
  }

}
