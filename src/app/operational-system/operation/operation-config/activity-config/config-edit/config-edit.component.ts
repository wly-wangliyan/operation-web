import { Component, ElementRef, Input, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { Subscription, timer, Observable, Subject } from 'rxjs';
import { isUndefined, isNullOrUndefined } from 'util';
import { ZPhotoSelectComponent } from '../../../../../share/components/z-photo-select/z-photo-select.component';
import { ValidateHelper } from '../../../../../../utils/validate-helper';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { RewardEntity, PromotionEntity, ActivityConfigService } from '../activity-config.service';
import { GlobalService } from '../../../../../core/global.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-config-edit',
  templateUrl: './config-edit.component.html',
  styleUrls: ['./config-edit.component.css']
})
export class ConfigEditComponent implements OnInit {

  private requestSubscription: Subscription;

  private promotion_id: string; // 配置id

  private is_save = false; // 标记是否保存中

  private isCreateConfig = true; // 标记是否新建

  public configParams: PromotionEntity = new PromotionEntity(); // 配置详情

  private detailRewardList: Array<RewardEntity> = []; // 奖赠领取设置

  public editRewardList: Array<RewardEntity> = []; // 奖赠领取设置

  public activity_url = []; // 活动图片

  public start_time: any = ''; // 开始时间

  public end_time: any = ''; // 结束时间

  public configErrMsg = ''; // 错误信息

  public activityImgErrMsg = '';  // 图片错误信息

  public rewardErrMsg = ''; // 奖赠设置错误信息

  public title = '添加活动'; // 路由标题

  private tempContent = ''; // 活动描述富文本框内容

  private isInstanceReady = false; // 标记富文本编辑器是否加载完成;

  public loading = true;

  private searchText$ = new Subject<any>();

  @ViewChild('activityImg', { static: false }) public activityImgSelectComponent: ZPhotoSelectComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private activityService: ActivityConfigService
  ) {
    route.queryParams.subscribe(queryParams => {
      this.promotion_id = queryParams.promotion_id;
    });
  }

  public ngOnInit() {
    this.is_save = false;
    if (this.promotion_id) {
      this.isCreateConfig = false;
      this.title = '编辑活动';
      this.searchText$.pipe(debounceTime(500)).subscribe(() => {
        this.rquestConfigDetail();
      });
      this.searchText$.next();
    } else {
      this.loading = true;
      this.isCreateConfig = true;
      this.isInstanceReady = false;
      this.configParams = new PromotionEntity();
      this.configParams.promotion_type = 1;
      this.editRewardList.push(new RewardEntity());
      timer(500).subscribe(() => {
        CKEDITOR.instances.descriptionEditor.destroy(true);
        CKEDITOR.replace('descriptionEditor', { width: 1130 });
        this.loading = false;
        this.isInstanceReady = true;
      });
    }
  }

  // 获取详情
  private rquestConfigDetail(): void {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.requestSubscription = this.activityService.requestActivityConfigDetail(this.promotion_id).subscribe(res => {
      this.configParams = res;
      this.start_time = new Date(res.start_time * 1000);
      this.end_time = new Date(res.end_time * 1000);
      this.activity_url = this.configParams.image ? this.configParams.image.split(',') : [];
      if (res.rewards && res.rewards.length > 0) {
        res.rewards.forEach(item => {
          item.time = new Date().getTime();
          this.detailRewardList.push(new RewardEntity(item));
          this.editRewardList.push(new RewardEntity(item));
        });
      } else {
        this.editRewardList.push(new RewardEntity());
      }
      this.getEditorData();
      this.loading = false;
    }, err => {
      this.loading = false;
      this.globalService.httpErrorProcess(err);
    });
  }

  // 富文本数据处理
  public getEditorData() {
    CKEDITOR.instances.descriptionEditor.destroy(true);
    this.tempContent = this.configParams.description.replace('/\r\n/g', '<br>').replace(/\n/g, '<br>');
    CKEDITOR.replace('descriptionEditor', { width: 1130 }).setData(this.tempContent);
    this.isInstanceReady = true;
  }

  // 修改活动类型
  public onChangeType(event: any): void {
    if (event.target.value) {
      this.configParams.promotion_type = Number(event.target.value);
    }
  }

  // 添加奖赠设置
  public onAddRewardClick(): void {
    this.rewardErrMsg = '';
    const item = new RewardEntity();
    item.time = new Date().getTime();
    this.editRewardList.push(item);
  }

  // 移除奖赠设置
  public onDeleteRewardClick(reward: RewardEntity, index: number): void {
    this.rewardErrMsg = '';
    const reward_record_id = reward.reward_record_id;
    if (reward_record_id) {
      if (this.detailRewardList && this.detailRewardList.length > 0) {
        const rewardIndex = this.detailRewardList.findIndex(rewardItem =>
          rewardItem.reward_record_id === reward_record_id
        );
        if (rewardIndex !== -1) {
          this.detailRewardList[rewardIndex].is_deleted = true;
        }
      }
    }
    this.editRewardList.splice(index, 1);
  }

  // 改变赠品类型
  public onRelatedChange(event: any, index: number): void {
    if (event) {
      this.editRewardList[index].related_reward_type = Number(event.target.value);
      this.editRewardList[index].related_reward_id = '';
    }
  }

  // 富文本编辑器是否有值
  public isAlreadyFill(): boolean {
    if (this.isInstanceReady) {
      return CKEDITOR.instances.descriptionEditor.getData() ? true : false;
    } else {
      return false;
    }
  }

  // form提交
  public onEditFormSubmit(): void {
    if (this.is_save) {
      return;
    }
    this.configErrMsg = '';
    this.rewardErrMsg = '';
    this.is_save = true;
    this.activityImgSelectComponent.upload().subscribe(() => {
      const imageUrl = this.activityImgSelectComponent.imageList.map(i => i.sourceUrl);
      this.configParams.image = imageUrl.join(',');
      if (this.generateAndCheckParamsValid()) {
        if (this.isCreateConfig) {
          this.requestAddConfig(this.configParams);
        } else {
          this.requestUpdateConfig(this.configParams);
        }
      } else {
        this.is_save = false;
      }
    }, err => {
      this.is_save = false;
      this.upLoadErrMsg(err);
    });
  }

  // 添加活动
  private requestAddConfig(params: PromotionEntity): void {
    this.activityService.requestAddActivityConfigData(params).subscribe(res => {
      this.promotion_id = res.body.promotion_id;
      this.requestEditRewars(this.configParams.rewards, 1);
    }, err => {
      this.is_save = false;
      this.errorProcess(err);
    });
  }

  // 编辑活动
  private requestUpdateConfig(params: PromotionEntity): void {
    this.activityService.requestUpdateActivityConfigData(this.promotion_id, params).subscribe(res => {
      this.requestEditRewars(this.configParams.rewards, 2);
    }, err => {
      this.is_save = false;
      this.errorProcess(err);
    });
  }

  /** 编辑领赠设置
   * @param rewars 领赠设置
   * @param type 1添加 2编辑
   */
  private requestEditRewars(rewars: Array<RewardEntity>, type: number): void {
    const message = type === 1 ? '添加' : '保存';
    this.activityService.requestUpdateRewardData(this.promotion_id, rewars).subscribe(res => {
      this.globalService.promptBox.open(message + '成功', () => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
    }, err => {
      this.is_save = false;
      this.errorProcess(err);
      if (type === 1) {
        this.isCreateConfig = false;
        this.title = '编辑活动';
      }
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
          if (content.resource === 'reward_id' && content.code === 'already_exist') {
            this.rewardErrMsg = '优惠券模板ID已存在！';
            return;
          }
        }
      }
    }
  }

  // 校验数据
  private generateAndCheckParamsValid(): boolean {
    if (!this.configParams.image) {
      this.activityImgErrMsg = '请重新上传图片！';
      return false;
    }
    if (!this.start_time) {
      this.configErrMsg = '请选择活动开始时间！';
      return false;
    }
    if (!this.end_time) {
      this.configErrMsg = '请选择活动截止时间！';
      return false;
    }
    if (this.start_time && this.end_time) {
      const sTimestamp = new Date(this.start_time).setHours(new Date(this.start_time).getHours(),
        new Date(this.start_time).getMinutes(), 0, 0) / 1000;
      const eTimestamp = new Date(this.end_time).setHours(new Date(this.end_time).getHours(),
        new Date(this.end_time).getMinutes(), 0, 0) / 1000;
      const currentTimeStamp = new Date().getTime() / 1000;

      if (sTimestamp - eTimestamp >= 0) {
        this.configErrMsg = '活动开始时间应小于截止时间！';
        return false;
      }

      // 添加时，活动开始时间大于等于当前时间; 编辑时，活动截止时间应大于等于当前时间
      if (this.isCreateConfig) {
        if (sTimestamp - currentTimeStamp < 0) {
          this.configErrMsg = '活动开始时间应大于等于当前时间！';
          return false;
        }
      } else {
        if (eTimestamp - currentTimeStamp < 0) {
          this.configErrMsg = '活动截止时间应大于等于当前时间！';
          return false;
        }
      }
      this.configParams.start_time = sTimestamp;
      this.configParams.end_time = eTimestamp;
    }

    if (!this.editRewardList || this.editRewardList.length === 0) {
      this.rewardErrMsg = '请填写领赠设置';
      return false;
    } else {
      let total_probability = 0;
      const rewards: Array<RewardEntity> = [];
      // 校验领赠设置数据
      for (const rewardIndex in this.editRewardList) {
        if (this.editRewardList.hasOwnProperty(rewardIndex)) {

          // if (this.editRewardList[rewardIndex].reward_num === 0) {
          //   this.rewardErrMsg = '库存应大于0！';
          //   return false;
          // }

          if (this.editRewardList[rewardIndex].reward_probability === 0) {
            this.rewardErrMsg = '中奖概率应大于等于0.00001';
            return;
          }

          if (!this.editRewardList[rewardIndex].reward_id
            || isNullOrUndefined(this.editRewardList[rewardIndex].reward_num)
            || !this.editRewardList[rewardIndex].reward_probability) {
            this.rewardErrMsg = '请完善领赠设置！';
            return false;
          }

          if (this.isAlready(this.editRewardList[rewardIndex].reward_id)) {
            this.rewardErrMsg = '优惠券模板ID不能重复！';
            return false;
          }
          total_probability = (total_probability * 100000 + this.editRewardList[rewardIndex].reward_probability * 100000) / 100000;
          rewards.push(new RewardEntity(this.editRewardList[rewardIndex]));
        }
      }
      if (total_probability !== 1) {
        this.rewardErrMsg = '中奖概率之和必须等于1！';
        return false;
      }

      /***处理被移除记录(detailRewardList中存储的为活动详情中获取的领赠设置，编辑过程中不发生改变)
       *  1、如果待保存记录中存在与被移除记录的优惠券模板ID(非赠品)一致的，且待保存记录：
       *    1.1 无记录id(新增)，将被移除记录的记录id 赋值给待保存记录
       *    1.2 有记录id的，回传该条被移除记录
       *  2、不存在优惠券模板ID一致的，回传该条被移除记录
       */
      this.detailRewardList.forEach(detailReward => {

        if (detailReward.is_deleted) {

          const itemIndex = rewards.findIndex(editItem => editItem.reward_id === detailReward.reward_id);

          // 2、
          if (itemIndex === -1) {
            rewards.push(new RewardEntity(detailReward));
          } else {
            // 1.1
            if (!rewards[itemIndex].reward_record_id) {
              rewards[itemIndex].reward_record_id = detailReward.reward_record_id;
            } else {
              // 1.2
              rewards.push(new RewardEntity(detailReward));
            }
          }
        }
      });
      this.configParams.rewards = rewards;
    }

    if (!CKEDITOR.instances.descriptionEditor.getData()) {
      this.configErrMsg = '请填写活动描述！';
      return false;
    } else {
      this.configParams.description = CKEDITOR.instances.descriptionEditor.getData().replace('/\r\n/g', '').replace(/\n/g, '');
    }
    return true;
  }

  // 优惠券模板id是否重复
  private isAlready(reward_id: string): boolean {
    const rewardRecords = this.editRewardList.filter(item => item.reward_id === reward_id);
    if (rewardRecords && rewardRecords.length > 1) {
      return true;
    }
    return false;
  }

  // 上传图片错误信息处理
  private upLoadErrMsg(err: any): any {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        this.activityImgErrMsg = '参数错误，可能文件格式错误！';
      } else if (err.status === 413) {
        this.activityImgErrMsg = '上传资源文件太大，服务器无法保存！';
      } else {
        this.activityImgErrMsg = '上传失败，请重试！';
      }
    }
  }

  // 选择图片时校验图片格式
  public onSelectedPicture(event: any) {
    this.configErrMsg = '';
    if (event === 'type_error') {
      this.activityImgErrMsg = '格式错误，请重新上传！';
      return;
    } else if (event === 'size_over') {
      this.activityImgErrMsg = '图片大小不得高于2M！';
      return;
    } else {
      this.activityImgErrMsg = '';
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

  // 修改优惠券模板id
  public onChangeRewardID(event: any, index: number): void {
    this.rewardErrMsg = '';
  }

  /** 库存keyup事件 */
  public onNumberKeyUp(index: number): void {
    if (this.editRewardList[index].reward_num) {
      this.editRewardList[index].reward_num = Number(this.editRewardList[index].reward_num);
    }
  }

  // 格式化中奖概率
  public onRateChange(event: any, index: number): void {
    this.rewardErrMsg = '';
    if (this.editRewardList[index].reward_probability) {
      if (isNaN(parseFloat(String(this.editRewardList[index].reward_probability)))) {
        this.editRewardList[index].reward_probability = null;
      } else {
        const reward_probability = parseFloat(String(this.editRewardList[index].reward_probability)).toFixed(5);
        this.editRewardList[index].reward_probability = parseFloat(reward_probability);
      }
    }
  }

  // 限制input[type='number']输入e
  public inputNumberLimit(event: any): boolean {
    const reg = /^\d*?\.?\d*?$/;
    const keyCode = String.fromCharCode(event.keyCode);
    return (keyCode && reg.test(keyCode));
  }

  // 取消
  public onCancelClick(): void {
    window.history.back();
  }
}
