import { Component, OnInit } from '@angular/core';
import { ActivityConfigService } from '../../activity-config.service';
import { ImageImportViewModel } from '../upload-image.model';

@Component({
  selector: 'app-description-editor',
  templateUrl: './description-editor.component.html',
  styleUrls: ['./description-editor.component.css']
})
export class DescriptionEditorComponent implements OnInit {

  public importViewModel: ImageImportViewModel = new ImageImportViewModel();
  public uploadImg: string;
  public flag = 0;
  public isEditorChange = false;
  public isFill = false;

  constructor(private activityService: ActivityConfigService) {
  }

  public ngOnInit() {
    setTimeout(() => {
      CKEDITOR.replace('descriptionEditor');
      CKEDITOR.on('instanceReady', event => {
        event.editor.on('change', () => {
          this.isEditorChange = true;
          this.isFill = CKEDITOR.instances.descriptionEditor.getData() ? true : false;
        });
      });
    }, 0);
  }

  // 取消上传图片
  public cancleUpload() {
    this.clearUploadImgInfo();
  }

  // 确认上传图片
  public confirmUpload() {
    if (this.importViewModel.file) {
      this.activityService.requestUploadPicture(this.importViewModel.file).subscribe(results => {
        if (results.sourceUrl) {
          this.uploadImg = results.sourceUrl;
          this.importViewModel.uploadImg = true;
          this.importViewModel.initImportData();
          $('#descriptionUploadModal').modal('hide');
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
                CKEDITOR.instances.descriptionEditor.insertHtml(str);
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
