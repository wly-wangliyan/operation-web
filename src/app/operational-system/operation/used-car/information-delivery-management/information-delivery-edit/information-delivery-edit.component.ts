import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../../core/global.service';
import { TemplateManagementService } from '../../../push-message-management/template-management/template-management.service';
import { TemplatePushManagementService } from '../../../push-message-management/template-push-management/template-push-management.service';
import { ErrMessageGroup } from '../../../../../../utils/error-message-helper';
import { ZPhotoSelectComponent } from '../../../../../share/components/z-photo-select/z-photo-select.component';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { differenceInCalendarDays } from 'date-fns';
import {
    ProCityDistSelectComponent,
    RegionEntity
} from '../../../../../share/components/pro-city-dist-select/pro-city-dist-select.component';

@Component({
    selector: 'app-information-delivery-edit',
    templateUrl: './information-delivery-edit.component.html',
    styleUrls: ['./information-delivery-edit.component.css']
})
export class InformationDeliveryEditComponent implements OnInit {
    public levelName = '创建信息';
    public imgReg = /(png|jpg|jpeg|gif)$/; // 默认图片校验格式
    public errMessageGroup: ErrMessageGroup = new ErrMessageGroup(); // 错误处理
    @ViewChild('commodityImg', {static: false}) public commodityImgSelectComponent: ZPhotoSelectComponent;
    @ViewChild('projectInfoPro', { static: true }) public proCityDistSelectComponent: ProCityDistSelectComponent
    public regionsObj: RegionEntity = new RegionEntity(); // 基本信息-门店地址
    public carColorList: Array<CarColorItem> = [];
    public registration_time = '';
    private id = '';

    constructor(private route: ActivatedRoute,
                private router: Router,
                private globalService: GlobalService,
                private templateManagementService: TemplateManagementService,
                private templatePushManagementService: TemplatePushManagementService) {
        this.route.paramMap.subscribe(map => {
            this.id = map.get('id');
        });
    }

    public ngOnInit() {
        this.initData();
        this.levelName = this.id ? '编辑信息' : '创建信息';
    }

    // 上架开始时间的禁用部分
    public disabledRegistrationTime = (startValue: Date): boolean => {
        return differenceInCalendarDays(new Date(), startValue) > 0;
    };

    private initData() {
        this.carColorList = [
            new CarColorItem('黑色', 1),
            new CarColorItem('白色', 2),
            new CarColorItem('红色', 3),
            new CarColorItem('灰色', 4),
            new CarColorItem('银色', 5),
            new CarColorItem('蓝色', 1),
            new CarColorItem('黄色', 2),
            new CarColorItem('棕色', 3),
            new CarColorItem('绿色', 4),
            new CarColorItem('橙色', 5),
            new CarColorItem('紫色', 2),
            new CarColorItem('香槟', 1),
            new CarColorItem('金色', 3),
            new CarColorItem('粉红', 4),
            new CarColorItem('其他颜色', 5),
        ];
    }

    /** 选择图片 */
    public onSelectedPicture(event: any, key: string) {
        if (event === 'type_error') {
            this.errMessageGroup.errJson[key].errMes = '格式错误，请重新上传！';
        } else if (event === 'size_over') {
            this.errMessageGroup.errJson[key].errMes = '图片大小不得高于2M！';
        }
    }

    public onEditFormSubmit() {

    }

    /**
     * 返回列表
     */
    public goToListPage() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

}

class CarColorItem {
    public name = '';
    public value = null;

    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }
}
