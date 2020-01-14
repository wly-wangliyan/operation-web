import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ZPhotoSelectComponent } from '../../../../../share/components/z-photo-select/z-photo-select.component';
import { GlobalService } from '../../../../../core/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorEntity } from '../../../../../core/http.service';
import { differenceInCalendarDays } from 'date-fns';
import { isUndefined } from 'util';
import { PrizeCreateComponent } from './prize-create/prize-create.component';
import { forkJoin, Subject, timer } from 'rxjs';
import { ActivityParams, LuckDrawService, NoPrizeParams, PrizeEntity } from '../luck-draw.service';
import { debounceTime } from 'rxjs/internal/operators';

export class ErrMessageItem {
  public isError = false;
  public errMes: string;

  constructor(isError?: boolean, errMes?: string) {
    if (!isError || isUndefined(errMes)) {
      return;
    }
    this.isError = isError;
    this.errMes = errMes;
  }
}

export class ErrPositionItem {
  cover_image: ErrMessageItem = new ErrMessageItem();
  wx_share_image: ErrMessageItem = new ErrMessageItem();
  wx_share_poster: ErrMessageItem = new ErrMessageItem();
  missed_image: ErrMessageItem = new ErrMessageItem();
  end_time: ErrMessageItem = new ErrMessageItem();
  push_plan_rank: ErrMessageItem = new ErrMessageItem();
  daily_participation_limit: ErrMessageItem = new ErrMessageItem();

  constructor(cover_image?: ErrMessageItem, wx_share_poster?: ErrMessageItem, wx_share_image?: ErrMessageItem,
              missed_image?: ErrMessageItem, end_time?: ErrMessageItem, push_plan_rank?: ErrMessageItem, daily_participation_limit?: ErrMessageItem) {
    if (isUndefined(cover_image) || isUndefined(wx_share_image) || isUndefined(wx_share_poster) || isUndefined(missed_image)
        || isUndefined(end_time) || isUndefined(push_plan_rank) || isUndefined(daily_participation_limit)) {
      return;
    }
    this.cover_image = cover_image;
    this.wx_share_image = wx_share_image;
    this.wx_share_poster = wx_share_poster;
    this.missed_image = missed_image;
    this.end_time = end_time;
    this.push_plan_rank = push_plan_rank;
    this.daily_participation_limit = daily_participation_limit;
  }
}

@Component({
  selector: 'app-luck-draw-edit',
  templateUrl: './luck-draw-edit.component.html',
  styleUrls: ['./luck-draw-edit.component.css']
})
export class LuckDrawEditComponent implements OnInit, OnDestroy {

  public activityParams: ActivityParams = new ActivityParams();
  public noPrizeParams: NoPrizeParams = new NoPrizeParams();
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public imgReg = /(jpg|jpeg|png|gif)$/; // 允许上传的图片格式
  public levelName = '新建抽奖活动';
  public prizeList: Array<PrizeEntity> = [];  // 奖品列表
  public noResultText = ' ';
  public tabIndex = 1;
  public cover_image = []; // 活动封面图
  public wx_share_image = []; // 微信分享图
  public wx_share_poster = []; // 微信海报图
  public missed_image = []; // 未中奖图
  public start_time = null; // 活动开始时间
  public end_time = null; // 活动开始时间
  public extra_times: boolean; // 每人首次分享后额外参与

  private lottery_activity_id: string;
  private is_save = false; // 防止连续出发保存事件
  private searchText$ = new Subject<any>();

  @Input() public data: any;
  @ViewChild('coverImg', { static: false }) public coverImgSelectComponent: ZPhotoSelectComponent;
  @ViewChild('wxShareImg', { static: false }) public wxShareImgSelectComponent: ZPhotoSelectComponent;
  @ViewChild('wxPosterImg', { static: false }) public wxPosterImgSelectComponent: ZPhotoSelectComponent;
  @ViewChild('missedImg', { static: false }) public missedImgSelectComponent: ZPhotoSelectComponent;
  @ViewChild(PrizeCreateComponent, { static: false }) public prizeCreateComponent: PrizeCreateComponent;

  constructor(
      private globalService: GlobalService,
      private luckDrawService: LuckDrawService,
      private route: ActivatedRoute,
      private router: Router) {
    route.queryParams.subscribe(queryParams => {
      this.lottery_activity_id = queryParams.lottery_activity_id;
    });
  }

  public ngOnInit() {
    this.levelName = this.lottery_activity_id ? '编辑抽奖活动' : '新建抽奖活动';
    if (this.lottery_activity_id) {
      this.searchText$.pipe(debounceTime(100)).subscribe(() => {
        this.getActivityDetail();
      });
      this.searchText$.next();
    }
  }

  public ngOnDestroy() {
    this.searchText$ && this.searchText$.unsubscribe();
  }

  // 获取详情
  private getActivityDetail(): void {
    this.luckDrawService.requestActivityDetail(this.lottery_activity_id).subscribe(data => {
      this.activityParams = data;
      this.noPrizeParams = data;
      this.prizeList = data.prizes;
      this.cover_image = this.activityParams.cover_image ? this.activityParams.cover_image.split(',') : [];
      this.wx_share_image = this.activityParams.wx_share_image ? this.activityParams.wx_share_image.split(',') : [];
      this.wx_share_poster = this.activityParams.wx_share_poster ? this.activityParams.wx_share_poster.split(',') : [];
      this.missed_image = this.noPrizeParams.missed_image ? this.noPrizeParams.missed_image.split(',') : [];
      this.extra_times = this.activityParams.extra_times === 0 ? false : true;
      this.start_time = this.activityParams.start_time ? new Date(this.activityParams.start_time * 1000) : '';
      this.end_time = this.activityParams.end_time ? new Date(this.activityParams.end_time * 1000) : '';
    }, err => {
      if (err.status === 404) {
        this.globalService.promptBox.open('该条数据已删除，请刷新后重试！', null, 2000, null, false);
      } else {
        this.globalService.httpErrorProcess(err);
      }
    });
  }

  // 点击取消编辑、新建
  public onClose() {
    this.globalService.confirmationBox.open('提示', '是否确认取消编辑？', () => {
      this.globalService.confirmationBox.close();
      this.router.navigate(['/main/operation/operation-config/luck-draw/list'], { relativeTo: this.route });
    });
  }

  // form提交
  public onEditFormSubmit(): void {
    if (this.is_save) {
      return;
    }
    this.clear();
    this.is_save = true;
    const httpList = [this.coverImgSelectComponent.upload(),
                      this.wxShareImgSelectComponent.upload()];
    if (this.wxPosterImgSelectComponent.imageList.length > 0) {
      httpList.push(this.wxPosterImgSelectComponent.upload());
    }
    forkJoin(httpList).subscribe(() => {
      this.activityParams.cover_image = this.coverImgSelectComponent.imageList.map(i => i.sourceUrl).join(',');
      this.activityParams.wx_share_image = this.wxShareImgSelectComponent.imageList.map(i => i.sourceUrl).join(',');
      this.activityParams.wx_share_poster = this.wxPosterImgSelectComponent.imageList.map(i => i.sourceUrl).join(',');
      this.activityParams.extra_times = this.extra_times ? 1 : 0;
      if (this.verification()) {
        if (!this.lottery_activity_id) {
          // 添加抽奖活动
           this.luckDrawService.requestAddActivityData(this.activityParams).subscribe(res => {
             this.globalService.promptBox.open('添加成功！', () => {
               this.lottery_activity_id = res.body.lottery_activity_id;
               this.tabIndex = 2;
             });
           }, err => {
             this.is_save = false;
             this.errorProcess(err);
           });
        } else {
          // 编辑抽奖活动
          this.luckDrawService.requestUpdateActivityData(this.lottery_activity_id, this.activityParams).subscribe(() => {
            this.globalService.promptBox.open('修改成功！', () => {
              this.tabIndex = 2;
            });
          }, err => {
            this.is_save = false;
            this.errorProcess(err);
          });
        }
      } else {
        this.is_save = false;
      }
    }, err => {
      this.is_save = false;
      this.upLoadErrMsg(err);
    });
  }

  // 保存未中奖设置信息
  public onEditNoPrizeSubmit() {
    this.missedImgSelectComponent.upload().subscribe(() => {
      this.noPrizeParams.missed_image = this.missedImgSelectComponent.imageList.map(i => i.sourceUrl).join(',');
      if (this.noPrizeVerification()) {
        this.luckDrawService.requestSaveNoPrizeData(this.lottery_activity_id, this.noPrizeParams).subscribe(() => {
          this.globalService.promptBox.open('保存成功！');
        }, err => {
          this.is_save = false;
          this.errorProcess(err);
        });
      }
    }, err => {
      this.upLoadErrMsg(err);
    });
  }

  // 保存活动信息表单提交校验
  private verification(): boolean {
    let cisCheck = true;
    if (!this.activityParams.cover_image) {
      this.errPositionItem.cover_image.isError = true;
      this.errPositionItem.cover_image.errMes = '请重新上传活动封面图！';
      cisCheck = false;
    }
    if (!this.activityParams.wx_share_image) {
      this.errPositionItem.wx_share_image.isError = true;
      this.errPositionItem.wx_share_image.errMes = '请重新上传微信好友分享图！';
      cisCheck = false;
    }
    if (this.wxPosterImgSelectComponent.imageList.length > 0 && !this.activityParams.wx_share_image) {
      this.errPositionItem.wx_share_image.isError = true;
      this.errPositionItem.wx_share_image.errMes = '请重新上传微信朋友圈分享海报！';
      cisCheck = false;
    }
    if (Number(this.activityParams.daily_participation_limit) > Number(this.activityParams.max_participation_limit)) {
      this.errPositionItem.daily_participation_limit.isError = true;
      this.errPositionItem.daily_participation_limit.errMes = '每日可参与上限不能大于最大可参与上限！';
      cisCheck = false;
    }

    const startTimestamp = new Date(this.start_time).setHours(new Date(this.start_time).getHours(),
        new Date(this.start_time).getMinutes(), 0, 0) / 1000;
    const endTimestamp = new Date(this.end_time).setHours(new Date(this.end_time).getHours(),
        new Date(this.end_time).getMinutes(), 0, 0) / 1000;
    const currentTimeStamp = new Date().getTime() / 1000;
    if (startTimestamp > endTimestamp) {
      this.errPositionItem.end_time.isError = true;
      this.errPositionItem.end_time.errMes = '活动开始时间不能大于活动结束时间！';
      cisCheck = false;
    } else if (endTimestamp - currentTimeStamp <= 0) {
      this.errPositionItem.end_time.isError = true;
      this.errPositionItem.end_time.errMes = '活动结束时间应大于当前时间！';
      cisCheck = false;
    } else {
      this.activityParams.start_time = startTimestamp;
      this.activityParams.end_time = endTimestamp;
    }
    return cisCheck;
  }

  // 设置未中奖表单提交校验
  private noPrizeVerification(): boolean {
     let cisCheck = true;
     if (!this.noPrizeParams.missed_image) {
       this.errPositionItem.missed_image.isError = true;
       this.errPositionItem.missed_image.errMes = '请重新上传未中奖图片！';
       cisCheck = false;
     }
     return cisCheck;
  }

  // 清空
  public clear(): void {
    this.errPositionItem.cover_image.isError = false;
    this.errPositionItem.wx_share_image.isError = false;
    this.errPositionItem.wx_share_poster.isError = false;
    this.errPositionItem.missed_image.isError = false;
    this.errPositionItem.end_time.isError = false;
    this.errPositionItem.push_plan_rank.isError = false;
  }

  // 接口错误状态
  private errorProcess(err: any): any {
    if (!this.globalService.httpErrorProcess(err)) {
      if (this.lottery_activity_id && err.status === 404) {
        this.globalService.promptBox.open('该条数据已删除，请刷新后重试!', null, 2000, null, false);
      } else if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          if (content.resource === 'push_plan_rank' && content.code === 'existed_rank') {
            this.errPositionItem.push_plan_rank.isError = true;
            this.errPositionItem.push_plan_rank.errMes = '此优先级重复，请重新设置！';
            return;
          }
        }
      }
    }
  }

  // 上传图片错误信息处理
  private upLoadErrMsg(err: any) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        this.errPositionItem.wx_share_poster.isError = true;
        this.errPositionItem.wx_share_poster.errMes = '参数错误，可能文件格式错误！';
      } else if (err.status === 413) {
        this.errPositionItem.wx_share_poster.isError = true;
        this.errPositionItem.wx_share_poster.errMes = '上传资源文件太大，服务器无法保存！';
      } else {
        this.errPositionItem.wx_share_poster.isError = true;
        this.errPositionItem.wx_share_poster.errMes = '上传失败，请重试！';
      }
    }
  }

  // 选择图片时校验图片格式
  public onSelectedPicture(event: any, type: string): any {
    this.errPositionItem[type].isError = false;
    if (event === 'type_error') {
      this.errPositionItem[type].isError = true;
      this.errPositionItem[type].errMes = '格式错误，请重新上传！';
    } else if (event === 'size_over') {
      this.errPositionItem[type].isError = true;
      this.errPositionItem[type].errMes = '图片大小不得高于2M！';
    }
  }

  // 上架开始时间的禁用部分
  public disabledStartTime = (startValue: Date): boolean => {
    if (!startValue || !this.end_time) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(this.end_time).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // 上架结束时间的禁用部分
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

  // tab页切换
  public onTabChange(tabIndex: number) {
    this.tabIndex = tabIndex;
  }

  // 添加、编辑奖品
  public onEditPrizeClick(index: number) {
    this.prizeCreateComponent.open(this.lottery_activity_id, this.prizeList, index,() => {
      timer(0).subscribe(() => {
        this.getActivityDetail();
      });
    }, () => {
      this.prizeCreateComponent.clear();
    });
  }

  // 删除奖品
  public onDelPrizeClick(prize_id: string) {
    this.globalService.confirmationBox.open('提示', '删除后将不可恢复，确认删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.luckDrawService.requestDeletePrizeData(this.lottery_activity_id, prize_id).subscribe(() => {
        this.globalService.promptBox.open('删除成功');
        this.getActivityDetail();
      }, err => {
        if (!this.globalService.httpErrorProcess(err)) {
          this.globalService.promptBox.open('删除失败，请重试！', null, 2000, null, false);
          this.getActivityDetail();
        }
      });
    });
  }
}
