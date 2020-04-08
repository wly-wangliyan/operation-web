import { Component, OnInit, ViewChild } from '@angular/core';
import { BoothService, BoothContentEntity, BoothEntity } from '../booth.service';
import { GlobalService } from '../../../../../core/global.service';
import { timer } from 'rxjs';
import { ErrMessageGroup, ErrMessageBase } from '../../../../../../utils/error-message-helper';
import { ZPhotoSelectComponent } from '../../../../../share/components/z-photo-select/z-photo-select.component';
import { DisabledTimeHelper } from '../../../../../../utils/disabled-time-helper';
import { HttpErrorEntity } from '../../../../../core/http.service';

@Component({
  selector: 'app-booth-content-edit',
  templateUrl: './booth-content-edit.component.html',
  styleUrls: ['./booth-content-edit.component.css']
})
export class BoothContentEditComponent implements OnInit {

  public boothParams: BoothContentEntity = new BoothContentEntity(); // 展位数据
  public boothData: BoothEntity = new BoothEntity();
  public isCreate = true; // 标记新建\编辑
  public cover_url = []; // 图片
  public aspectRatio = 1 / 1; // 图片比例
  public offline_date: any = ''; // 下线时间
  public imgReg = /(png|jpg|jpeg|gif)$/; // 默认图片校验格式
  public errMessageGroup: ErrMessageGroup = new ErrMessageGroup();
  private saving = false;
  @ViewChild('coverImg', { static: false }) public coverImgSelectComponent: ZPhotoSelectComponent;

  private sureCallback: any;
  private closeCallback: any;
  constructor(
    private globalService: GlobalService,
    private boothService: BoothService) { }

  public ngOnInit() {
  }

  public open(data: BoothContentEntity, boothData: BoothEntity, sureFunc: any, closeFunc: any = null) {
    const openBoothModal = () => {
      timer(0).subscribe(() => {
        $('#boothContentModal').modal();
      });
    };
    this.isCreate = data && data.booth_content_id ? false : true;
    if (!this.isCreate) {
      this.boothParams = data.clone();
    } else {
      this.boothParams = new BoothContentEntity();
    }
    this.boothData = boothData || new BoothEntity();
    this.initForm();
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    openBoothModal();
  }

  // 初始化表单
  private initForm(): void {
    this.clear();
    this.saving = false;
    // 图片组件相关参数
    this.cover_url = this.boothParams.image ? this.boothParams.image.split(',') : [];
    const aspectRatio = this.boothData.width && this.boothData.height ?
      Number((this.boothData.width / this.boothData.height).toFixed(2)) : 1 / 1;
    this.aspectRatio = aspectRatio > 4.28 ? 4.28 : aspectRatio;
    const imgReg = ['jpeg'];
    this.boothData.formats && this.boothData.formats.forEach(format => {
      imgReg.push(format.toLowerCase());
    });
    this.imgReg = new RegExp('(' + imgReg.join('|') + ')$');
    // 落地页
    this.boothParams.link_type =
      this.boothData.link_types && this.boothData.link_types.includes(this.boothParams.link_type)
        ? this.boothParams.link_type : '';
    // 下线时间
    this.boothParams.offline_type = this.boothParams.offline_type || 1; // 默认永不下线
    if (this.boothParams.offline_type === 2) {
      this.offline_date = this.boothParams.offline_date ? new Date(this.boothParams.offline_date * 1000) : '';
    }
  }

  // 切换落地页
  public onChangeLinkType(event: any): void {
    this.errMessageGroup.errJson.link_url.errMes = '';
    this.boothParams.link_url = null;
    if (event.target.value) {
      this.boothParams.link_type = Number(event.target.value);
    }
  }

  // 切换下线方式
  public onChangeOfflineType(offline_type: number): void {
    this.errMessageGroup.errJson.offline_date.errMes = '';
    this.offline_date = '';
    this.boothParams.offline_type = offline_type;
  }

  // 弹框close
  public onClose() {
    $('#boothContentModal').modal('hide');
  }

  // 清除错误信息
  private clear(): void {
    this.errMessageGroup.errJson = {};
    this.errMessageGroup.errJson.title = new ErrMessageBase();
    this.errMessageGroup.errJson.icon = new ErrMessageBase();
    this.errMessageGroup.errJson.link_url = new ErrMessageBase();
    this.errMessageGroup.errJson.offline_date = new ErrMessageBase();
  }

  // 选择图片时校验图片格式
  public onSelectedPicture(event: any): any {
    this.errMessageGroup.errJson.icon.errMes = '';
    if (event === 'type_error') {
      this.errMessageGroup.errJson.icon.errMes = '格式错误，请重新上传！';
    } else if (event === 'size_over') {
      this.errMessageGroup.errJson.icon.errMes = '图片大小不得高于2M！';
    }
  }

  // 保存
  public onCheckClick() {
    if (this.saving) {
      return;
    }
    this.clear();
    this.saving = true;
    this.coverImgSelectComponent.upload().subscribe(() => {
      const imageUrl = this.coverImgSelectComponent.imageList.map(i => i.sourceUrl);
      this.boothParams.image = imageUrl.join(',');
      if (this.generateAndCheckParamsValid()) {
        if (this.isCreate) {
          this.requestAddBoothContent();
        } else {
          this.requestEditBoothContent();
        }
      } else {
        this.saving = false;
      }
    }, err => {
      this.saving = false;
      this.upLoadErrMsg(err);
    });
  }

  // 新建展位
  private requestAddBoothContent(): void {
    this.boothService.requestAddBoothContentData(this.boothData.booth_id, this.boothParams)
      .subscribe(res => {
        this.onClose();
        this.sureCallbackInfo();
        this.globalService.promptBox.open('新建展位内容成功');
      }, err => {
        this.errorProcess(err);
      });
  }

  // 编辑展位
  private requestEditBoothContent(): void {
    this.boothService.requestUpdateBoothContentData(this.boothData.booth_id, this.boothParams.booth_content_id, this.boothParams)
      .subscribe(res => {
        this.onClose();
        this.sureCallbackInfo();
        this.globalService.promptBox.open('编辑展位内容成功');
      }, err => {
        this.errorProcess(err);
      });
  }

  // 确定按钮回调
  private sureCallbackInfo(): any {
    if (this.sureCallback) {
      const temp = this.sureCallback;
      this.closeCallback = null;
      this.sureCallback = null;
      temp();
    }
  }

  // 表单提交校验
  private generateAndCheckParamsValid(): boolean {

    if (!this.boothParams.image) {
      this.errMessageGroup.errJson.icon.errMes = '请重新上传图片！';
      return false;
    }

    if (!this.boothParams.link_url && this.boothParams.link_type) {
      this.errMessageGroup.errJson.link_url.errMes = '请输入跳转URL！';
      return false;
    }

    if (this.boothParams.link_type && this.boothParams.link_type === 1) {
      const reg = /^(http|https)?.+\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4)$/;
      if (this.boothParams.link_url && !reg.test(this.boothParams.link_url)) {
        this.errMessageGroup.errJson.link_url.errMes = '请输入正确的视频链接！';
        return false;
      }
    }

    if (this.boothParams.offline_type === 2) {
      if (!this.offline_date) {
        this.errMessageGroup.errJson.offline_date.errMes = '请选择下线时间！';
        return false;
      } else {
        const offlineTimestamp = new Date(this.offline_date).setHours(new Date(this.offline_date).getHours(),
          new Date(this.offline_date).getMinutes(), 0, 0) / 1000;
        const currentTimeStamp = new Date().getTime() / 1000;
        if (offlineTimestamp - currentTimeStamp <= 0) {
          this.errMessageGroup.errJson.offline_date.errMes = '下线时间应大于当前时间！';
          return false;
        } else {
          this.boothParams.offline_date = offlineTimestamp;
        }
      }
    }
    return true;
  }

  // 接口错误状态
  private errorProcess(err: any): any {
    this.saving = false;
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          if (content.code === ('invalid' || 'missing_field') && content.field === 'title') {
            this.errMessageGroup.errJson.title.errMes = '标题错误！';
          } else if (content.code === ('invalid' || 'missing_field') && content.field === 'image') {
            this.errMessageGroup.errJson.icon.errMes = '图片数据错误！';
          } else if (content.code === ('invalid' || 'missing_field') && content.field === 'link_url') {
            this.errMessageGroup.errJson.link_url.errMes = '跳转URL错误！';
          } else if (content.code === ('invalid' || 'missing_field') && content.field === 'offline_date') {
            this.errMessageGroup.errJson.offline_date.errMes = '下线时间错误！';
          } else {
            this.globalService.promptBox.open('参数缺失或无效！', null, 2000, null, false);
          }
        }
      } else if (err.status === 404) {
        this.globalService.promptBox.open('展位内容不存在，请刷新重试！', null, 2000, null, false);
      }
    }
  }

  // 上传图片错误信息处理
  private upLoadErrMsg(err: any) {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        this.errMessageGroup.errJson.icon.errMes = '参数错误，可能文件格式错误！';
      } else if (err.status === 413) {
        this.errMessageGroup.errJson.icon.errMes = '上传资源文件太大，服务器无法保存！';
      } else {
        this.errMessageGroup.errJson.icon.errMes = '上传失败，请重试！';
      }
    }
  }

  // 下线时间的禁用部分
  public disabledTime = (startValue: Date): boolean => {
    return DisabledTimeHelper.disabledFutureStartTime(startValue, null);
  }
}
