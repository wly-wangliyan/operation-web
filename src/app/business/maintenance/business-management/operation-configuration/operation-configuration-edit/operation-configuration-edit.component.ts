import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessManagementService, UpkeepMerchantProductEntity, UpkeepMerchantProjectEntity } from '../../business-management.service';
import { RegionEntity } from '../../../../../share/components/pro-city-dist-select/pro-city-dist-select.component';
import { Subscription } from 'rxjs';
import { SelectBrandFirmTypeComponent } from '../../../../../share/components/select-brand-firm-type/select-brand-firm-type.component';
import { ChooseAccessoryComponent } from './choose-accessory/choose-accessory.component';

@Component({
  selector: 'app-operation-configuration-edit',
  templateUrl: './operation-configuration-edit.component.html',
  styleUrls: ['./operation-configuration-edit.component.css']
})
export class OperationConfigurationEditComponent implements OnInit {

  public accessoryList = [{a: 1}, {a: 2}, {a: 3}];
  public projectList = [{a: 1}, {a: 2}, {a: 3}];
  // public projectList: Array<UpkeepMerchantProjectEntity> = [];

  private upkeep_merchant_id: string;
  private upkeep_merchant_product_id: string;
  private continueRequestSubscription: Subscription;

  @ViewChild('chooseAccessoryPromptDiv', { static: true }) public chooseAccessoryPromptDiv: ElementRef;
  @ViewChild(ChooseAccessoryComponent, {static: true}) public chooseAccessoryComponent: ChooseAccessoryComponent;

  constructor(private globalService: GlobalService,
              private activatedRoute: ActivatedRoute,
              private businessManagementService: BusinessManagementService,
              private router: Router) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.upkeep_merchant_id = queryParams.upkeep_merchant_id;
      this.upkeep_merchant_product_id = queryParams.upkeep_merchant_product_id;
    });
  }

  ngOnInit() {
    /*this.continueRequestSubscription = this.businessManagementService.requestUpkeepProjectList(this.upkeep_merchant_id, this.upkeep_merchant_product_id)
        .subscribe(res => {
            this.projectList = res;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });*/
  }

  // 选择配件
  public onChooseAccessory() {
    $(this.chooseAccessoryPromptDiv.nativeElement).modal('show');
  }

  public onClose() {
    $(this.chooseAccessoryPromptDiv.nativeElement).modal('hide');
  }
}
