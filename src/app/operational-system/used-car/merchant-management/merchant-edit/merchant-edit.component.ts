import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProCityDistSelectComponent, RegionEntity } from '../../../../share/components/pro-city-dist-select/pro-city-dist-select.component';
import { MerchantManagementEntity, MerchantManagementService, ConsultationEntity } from '../merchant-management.service';
import { GlobalService } from '../../../../core/global.service';
import { ValidateHelper } from '../../../../../utils/validate-helper';

@Component({
    selector: 'app-merchant-edit',
    templateUrl: './merchant-edit.component.html',
    styleUrls: ['./merchant-edit.component.css']
})
export class MerchantEditComponent implements OnInit {
    public loading = true; // 标记loading
    public consultationList: Array<ConsultationEntity> = [];
    public regionsObj: RegionEntity = new RegionEntity(); // 基本信息-门店地址
    @ViewChild('projectInfoPro', {static: true}) public proCityDistSelectComponent: ProCityDistSelectComponent;
    public ConsultationOperationType = ConsultationOperationType;
    public merchantDetail: MerchantManagementEntity = new MerchantManagementEntity();
    private merchant_id: string;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private globalService: GlobalService,
                private companyManagementService: MerchantManagementService) {
        this.route.paramMap.subscribe(map => {
            this.merchant_id = map.get('merchant_id');
        });
    }

    public ngOnInit() {
        if (this.merchant_id) {
            this.requestMerchantDetail();
        }
    }

    /**
     * 添加咨询信息
     */
    public onClickConsultation(type: ConsultationOperationType, index?: number) {
        let flag = true;
        if (type === ConsultationOperationType.add) {
            this.consultationList.forEach(item => {
                if (!item.name || !item.telephone) {
                    flag = false;
                    item.error = '请填写资询人或者资询电话！';
                } else if (item.telephone && !ValidateHelper.Phone(item.telephone)) {
                    flag = false;
                    item.error = '资询电话输入不合法！';
                }
            });
            if (!flag) {
                return;
            }
            this.consultationList.push(new ConsultationEntity());
        } else {
            this.consultationList.splice(index, 1);
        }
    }

    /**
     * 输入判断
     * @param index
     */
    public onInputConsultation(index: number) {
        const item = this.consultationList[index];
        item.error = '';
    }

    /**
     * 编辑信息
     */
    public onEditFormSubmit() {
        let flag = true;
        this.consultationList.forEach(item => {
            if (!item.name && item.telephone) {
                flag = false;
                item.error = '请填写资询人！';
            } else if (item.name && !item.telephone) {
                flag = false;
                item.error = '请填写资询电话！';
            } else if (item.telephone && !ValidateHelper.Phone(item.telephone)) {
                flag = false;
                item.error = '资询电话输入不合法！';
            }
        });
        if (flag) {
            this.companyManagementService.requestAddMerchantData(this.consultationList, this.merchant_id).subscribe(data => {
                this.globalService.promptBox.open('编辑成功！', () => {
                    this.goToListPage();
                });
            }, err => {
                this.globalService.httpErrorProcess(err);
            });
        }
    }

    /**
     * 返回列表
     */
    public goToListPage() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

    private requestMerchantDetail() {
        this.companyManagementService.requestMerchantDetailData(this.merchant_id).subscribe(data => {
            this.regionsObj = new RegionEntity(data);
            this.merchantDetail = data.clone();
            if (data.consult_info && data.consult_info.length > 0) {
                data.consult_info.forEach((item, index) => {
                    const temp = new ConsultationEntity();
                    temp.name = item.name;
                    temp.telephone = item.telephone;
                    temp.date += index;
                    this.consultationList.push(temp);
                });
            } else {
                this.consultationList = [new ConsultationEntity()];
            }
            console.log(this.consultationList);
            this.loading = false;
        }, err => {
            this.globalService.httpErrorProcess(err);
            this.loading = false;
        });
    }
}

enum ConsultationOperationType {
    add,
    delete
}
