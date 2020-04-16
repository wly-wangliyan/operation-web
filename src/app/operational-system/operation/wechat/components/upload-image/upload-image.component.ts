import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UploadImageModel } from './upload-image.model';
import { UploadService } from '../../../../../core/upload.service';
import { HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.less']
})
export class UploadImageComponent implements OnInit {

  public uploadImageModel: UploadImageModel = new UploadImageModel();

  @Input() public limitImgSize = 5; // 限制上传图片大小，默认为5M

  @Input() public uploadModalId = 'UploadModal';

  @Input() public fileTypes = ['jpg', 'png', 'gif']; // 限制图片格式

  public uploading = false;

  private uploadSubscription$: Subscription;

  @Output() public selectedImgChange = new EventEmitter(); // 选择图片

  constructor(private uploadService: UploadService, private sanitizer: DomSanitizer) {
  }

  public ngOnInit() {
    this.uploadImageModel.limitImgSize = this.limitImgSize;
    this.uploadImageModel.fileTypes = this.fileTypes;
  }

  public open() {
    this.clear();
    timer(0).subscribe(() => {
      $(`#${this.uploadModalId}`).modal();
    });
  }

  // 检测数据变更
  public getDirty(): boolean {
    return this.uploadImageModel.dirty;
  }

  // 确认上传图片
  public confirmUpload(): void {
    if (this.uploading) {
      return;
    }
    if (this.uploadImageModel.file) {
      this.uploading = true;
      this.uploadSubscription$ = this.uploadService
        .requestUploadWxMediafIle(this.uploadImageModel.file, 'sy_wxmp', 'image').subscribe(event => {
          if (event instanceof HttpResponse) {
            // 结果返回，处理结果
            const body = event.body;
            if (body.hasOwnProperty('media_id')) {
              const safeUrl = this.sanitizer.bypassSecurityTrustUrl(this.uploadImageModel.img_url);
              // tslint:disable-next-line: no-string-literal
              this.selectedImgChange.emit({ media_id: body['media_id'], safeUrl });
              this.onCloseUpload();
            } else {
              this.uploadImageModel.hasErrorTip = true;
              this.uploadImageModel.errorTip = 'media_id缺失，请重新上传！';
            }
          }
        }, err => {
          this.uploading = false;
          this.uploadImageModel.hasErrorTip = true;
          this.uploadImageModel.errorTip = '上传失败，请重新上传！';
        });
    } else {
      this.uploading = false;
      this.uploadImageModel.hasErrorTip = true;
      this.uploadImageModel.errorTip = '请上传图片！';
    }
  }

  private clear(): void {
    this.uploading = false;
    this.uploadImageModel.initImportData();
    this.uploadSubscription$ && this.uploadSubscription$.unsubscribe();
  }

  // 关闭上传
  public onCloseUpload(): void {
    this.clear();
    $(`#${this.uploadModalId}`).modal('hide');
  }
}
