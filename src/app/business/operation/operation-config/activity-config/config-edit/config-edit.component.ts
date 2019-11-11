import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { Subscription, timer } from 'rxjs';
import { isUndefined } from 'util';
import { ZPhotoSelectComponent } from '../../../../../share/components/z-photo-select/z-photo-select.component';
import { ValidateHelper } from '../../../../../../utils/validate-helper';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { RewardEntity, PromotionEntity, ActivityConfigService } from '../activity-config.service';
import { GlobalService } from '../../../../../core/global.service';
import { DescriptionEditorComponent } from '../component/description-editor/description-editor.component';

@Component({
  selector: 'app-config-edit',
  templateUrl: './config-edit.component.html',
  styleUrls: ['./config-edit.component.css']
})
export class ConfigEditComponent implements OnInit {

  private requestSubscription: Subscription;

  private promotion_id: string; // 配置id

  private is_save = false; // 标记是否保存中

  public isCreateConfig = true; // 标记是否新建

  public configParams: PromotionEntity = new PromotionEntity(); // 配置详情

  public activity_url = []; // 活动图片

  public start_time: any = ''; // 开始时间

  public end_time: any = ''; // 结束时间

  public configErrMsg = '';

  public activityImgErrMag = '';

  public title = '添加活动';

  public tempContent = ''; // 活动描述富文本框内容

  @ViewChild('activityImg', { static: false }) public activityImgSelectComponent: ZPhotoSelectComponent;
  @ViewChild('descriptionEditor', { static: true }) public descriptionEditor: DescriptionEditorComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private activityService: ActivityConfigService
  ) {
    this.route.paramMap.subscribe(map => {
      this.promotion_id = map.get('promotion_id');
    });
  }

  public ngOnInit() {
    this.is_save = false;
    if (this.promotion_id) {
      this.isCreateConfig = false;
      this.title = '编辑活动';
      // this.rquestConfigDetail();
    } else {
      this.isCreateConfig = true;
      this.configParams = new PromotionEntity();
      this.configParams.promotion_type = 1;
    }
  }

  // 获取详情
  private rquestConfigDetail(): void {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.requestSubscription = this.activityService.requestActivityConfigDetail(this.promotion_id).subscribe(res => {
      this.configParams = res;
      this.activity_url = this.configParams.image ? this.configParams.image.split(',') : [];
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 富文本数据处理
  public getEditorData() {
    CKEDITOR.instances.descriptionEditor.destroy(true);
    this.tempContent = this.configParams.description.replace('/\r\n/g', '<br>').replace(/\n/g, '<br>');
    CKEDITOR.replace('descriptionEditor').setData(this.tempContent);
  }

  // 修改活动类型
  public onChangeType(event: any): void {
    if (event.target.value) {
      this.configParams.promotion_type = Number(event.target.value);
    }
  }

  // form提交
  public onEditFormSubmit(): void {
    if (this.is_save) {
      return;
    }
    this.configErrMsg = '';
    this.is_save = true;
    const params = this.configParams.clone();
    this.activityImgSelectComponent.upload().subscribe(() => {
      const imageUrl = this.activityImgSelectComponent.imageList.map(i => i.sourceUrl);
      this.configParams.image = imageUrl.join(',');
      if (this.generateAndCheckParamsValid()) {
        params.image = this.configParams.image;
        if (this.isCreateConfig) {
          this.requestAddConfig(params);
        } else {
          this.requestUpdateConfig(params);
        }
      } else {
        this.is_save = false;
      }
    }, err => {
      this.is_save = false;
      this.upLoadErrMsg(err);
    });
  }

  // 添加
  private requestAddConfig(params: PromotionEntity): void {
    this.activityService.requestAddActivityConfigData(params).subscribe(res => {
      this.globalService.promptBox.open('添加成功', () => {
        this.router.navigate(['../config-list'], { relativeTo: this.route });
      });
    }, err => {
      this.is_save = false;
      this.errorProcess(err);
    });
  }

  // 编辑
  private requestUpdateConfig(params: PromotionEntity): void {
    this.activityService.requestUpdateActivityConfigData(this.promotion_id, params).subscribe(res => {
      this.globalService.promptBox.open('修改成功', () => {
        this.router.navigate(['../../config-list'], { relativeTo: this.route });
      });
    }, err => {
      this.is_save = false;
      this.errorProcess(err);
    });
  }

  // 接口错误状态
  private errorProcess(err: any): any {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          if (content.code === 'description' && content.field === 'invalid') {
            this.configErrMsg = '活动描述错误或无效！';
            return;
          }
          if (content.code === 'description' && content.field === 'missing_field') {
            this.configErrMsg = '请填写活动描述！';
            return;
          }
        }
      }
    }
  }

  // 校验数据
  private generateAndCheckParamsValid(): boolean {
    if (!this.configParams.image) {
      this.activityImgErrMag = '请重新上传图片！';
      return false;
    }
    if (!this.start_time) {
      this.configErrMsg = '请选择活动开始时间！';
      return false;
    }
    if (!this.end_time) {
      this.configErrMsg = '请选择活动结束时间！';
      return false;
    }
    if (this.start_time && this.end_time) {
      const sTimestamp = new Date(this.start_time).setHours(new Date(this.start_time).getHours(),
        new Date(this.start_time).getMinutes(), 0, 0) / 1000;
      const eTimestamp = new Date(this.end_time).setHours(new Date(this.end_time).getHours(),
        new Date(this.end_time).getMinutes(), 0, 0) / 1000;
      const currentTimeStamp = new Date().getTime() / 1000;
      if (sTimestamp - currentTimeStamp < 0) {
        this.configErrMsg = '活动开始时间应大于等于当前时间！';
        return false;
      }
      if (sTimestamp - eTimestamp >= 0) {
        this.configErrMsg = '活动开始时间应小于结束时间！';
        return false;
      }
      this.configParams.start_time = sTimestamp;
      this.configParams.end_time = eTimestamp;
    }

    if (!CKEDITOR.instances.descriptionEditor.getData()) {
      this.configErrMsg = '请填写活动描述！';
      return false;
    } else {
      this.configParams.description = CKEDITOR.instances.descriptionEditor.getData().replace('/\r\n/g', '').replace(/\n/g, '');
    }
    console.log(this.configParams);
    return true;
  }

  // 上传图片错误信息处理
  private upLoadErrMsg(err: any): any {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        this.activityImgErrMag = '参数错误，可能文件格式错误！';
      } else if (err.status === 413) {
        this.activityImgErrMag = '上传资源文件太大，服务器无法保存！';
      } else {
        this.activityImgErrMag = '上传失败，请重试！';
      }
    }
  }

  // 选择头像图片时校验图片格式
  public onSelectedPicture(event: any) {
    this.configErrMsg = '';
    if (event === 'type_error') {
      this.activityImgErrMag = '格式错误，请重新上传！';
      return;
    } else if (event === 'size_over') {
      this.activityImgErrMag = '图片大小不得高于2M！';
      return;
    } else {
      this.activityImgErrMag = '';
    }
  }

  // 活动开始时间的禁用部分
  public disabledStartTime = (startValue: Date): boolean => {
    if (differenceInCalendarDays(startValue, new Date()) < 0) {
      return true;
    } else if (!startValue || !this.end_time) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.end_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 活动结束时间的禁用部分
  public disabledEndTime = (endValue: Date): boolean => {
    if (differenceInCalendarDays(endValue, new Date()) < 0) {
      return true;
    } else if (!endValue || !this.start_time) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(this.start_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 取消
  public onCancelClick(): void {
    window.history.back();
  }
}
