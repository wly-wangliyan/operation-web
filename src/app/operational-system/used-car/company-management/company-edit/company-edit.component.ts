import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProCityDistSelectComponent, RegionEntity } from '../../../../share/components/pro-city-dist-select/pro-city-dist-select.component';
import { CompanyManagementEntity, CompanyManagementService, ConsultationEntity } from '../company-management.service';
import { GlobalService } from '../../../../core/global.service';
import { ValidateHelper } from '../../../../../utils/validate-helper';

@Component({
    selector: 'app-company-edit',
    templateUrl: './company-edit.component.html',
    styleUrls: ['./company-edit.component.css']
})
export class CompanyEditComponent implements OnInit {
    public loading = true; // 标记loading
    public consultationList: Array<ConsultationEntity> = [];
    public regionsObj: RegionEntity = new RegionEntity(); // 基本信息-门店地址
    @ViewChild('projectInfoPro', {static: true}) public proCityDistSelectComponent: ProCityDistSelectComponent;
    public ConsultationOperationType = ConsultationOperationType;
    public companyDetail: CompanyManagementEntity = new CompanyManagementEntity();
    private merchant_id: string;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private globalService: GlobalService,
                private companyManagementService: CompanyManagementService) {
        this.route.paramMap.subscribe(map => {
            this.merchant_id = map.get('merchant_id');
        });
    }

    ngOnInit() {
        if (this.merchant_id) {
            this.requestCompanyDetail();
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
                    item.error = '请填写资询电话或者资询人！';
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
        if (item.name && item.telephone) {
            item.error = '';
        }
    }

    /**
     * 编辑信息
     */
    public onEditFormSubmit() {
        let flag = true;
        this.consultationList.forEach(item => {
            if (!ValidateHelper.Phone(item.telephone)) {
                flag = false;
                item.error = '资询电话输入不合法！';
            }
        });
        if (flag) {
            this.companyManagementService.requestAddCompanyData(this.consultationList, this.merchant_id).subscribe(data => {
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

    private requestCompanyDetail() {
        this.companyManagementService.requestCompanyDetailData(this.merchant_id).subscribe(data => {
            this.regionsObj = new RegionEntity(data);
            this.companyDetail = data.clone();
            if (data.consult_info && data.consult_info.length > 0) {
                data.consult_info.forEach(item => {
                    const temp = new ConsultationEntity();
                    temp.name = item.name;
                    temp.telephone = item.telephone;
                    this.consultationList.push(temp);
                });
            } else {
                this.consultationList = [new ConsultationEntity()];
            }
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
