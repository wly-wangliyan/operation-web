import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WriteServiceImportViewModel } from './ckeditor.model';
import { UploadService } from '../../../core/upload.service';

@Component({
  selector: 'app-z-text-ckeditor',
  templateUrl: './z-text-ckeditor.component.html',
  styleUrls: ['./z-text-ckeditor.component.css']
})
export class ZTextCkeditorComponent implements OnInit {
  public importViewModel: WriteServiceImportViewModel = new WriteServiceImportViewModel();

  public isEditorChange = false;

  public uploadModalId = '';

  private uploadImg: string;

  private flag = 0;

  @Input() public ckEditorId = 'editor';

  @Input() public isNeedEmit = false;

  @Input() public replaceWidth = 900;

  @Input() public replaceHeight = 500;

  @Output() public editorChange = new EventEmitter(); // 上传完成

  constructor(private uploadService: UploadService) {
  }

  public ngOnInit() {
    setTimeout(() => {
      CKEDITOR.replace(this.ckEditorId, { width: this.replaceWidth, height: this.replaceHeight});
      CKEDITOR.on('instanceReady', event => {
        event.editor.on('change', () => {
          this.isEditorChange = true;
          if (this.isNeedEmit) {
            this.editorChange.emit({ ckEditorId: this.ckEditorId });
          }
        });
      });
    }, 0);
    this.uploadModalId = `${this.ckEditorId}UploadModal`;
  }

  // 取消上传图片
  public cancleUpload() {
    this.clearUploadImgInfo();
  }

  // 确认上传图片
  public confirmUpload() {
    if (this.importViewModel.file) {
      this.uploadService.requestUploadPicture(this.importViewModel.file).subscribe(results => {
        if (results.sourceUrl) {
          this.uploadImg = results.sourceUrl;
          this.importViewModel.uploadImg = true;
          this.importViewModel.initImportData();
          $(`#${this.uploadModalId}`).modal('hide');
          if (this.importViewModel.uploadImg) {
            let str: string;
            // 图片Width > 350 百分之百显示
            const img = new Image();
            img.src = this.uploadImg;
            img.onload = () => {
              //  默认按比例压缩
              let w = img.width;
              if (w > 350) {
                this.flag = 1;
              } else {
                this.flag = 0;
                w = w;
              }
              if (this.flag === 1) {
                str = ` <img src=' ${this.uploadImg} ' style='width:100%' /> `;
              } else {
                str = ` <img src=' ${this.uploadImg} '/> `;
              }
              if (this.uploadImg) {
                CKEDITOR.instances[this.ckEditorId].insertHtml(str);
              }
            };
          }
        }
      }, err => {
        this.importViewModel.uploadImg = false;
      });
    } else {
      this.importViewModel.uploadImg = false;
    }
    this.importViewModel.uploadImg = false;
  }

  // 关闭上传
  public closeUpload() {
    this.clearUploadImgInfo();
  }

  // 清空上传图片信息
  private clearUploadImgInfo() {
    this.importViewModel.initImportData();
    this.importViewModel.file = '';
    this.uploadImg = '';
    this.importViewModel.uploadImg = false;
    this.importViewModel.hasErrorTip = false;
  }

}

