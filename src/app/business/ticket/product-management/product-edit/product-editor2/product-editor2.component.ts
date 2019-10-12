import { Component, OnInit, Input } from '@angular/core';
import { WriteServiceImportViewModel } from '../../product.model';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-product-editor2',
  templateUrl: './product-editor2.component.html',
  styleUrls: ['./product-editor2.component.css']
})
export class ProductEditor2Component implements OnInit {
  public importViewModel: WriteServiceImportViewModel = new WriteServiceImportViewModel();
  public uploadImg: string;
  public tempContent1: string; // 交通指南富文本框内容
  public tempContent2: string; // 预定须知富文本框内容
  public tempContent3: string; // 景区介绍富文本框内容
  public flag = 0;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    setTimeout(() => {
      CKEDITOR.replace('editor2');
    }, 0);

  }

  // 取消上传图片
  public cancleUpload() {
    this.clearUploadImgInfo();
  }

  // 确认上传图片
  public confirmUpload() {
    if (this.importViewModel.file) {
      this.productService.requestUploadPicture(this.importViewModel.file).subscribe(results => {
        if (results.sourceUrl) {
          this.uploadImg = results.sourceUrl;
          this.importViewModel.uploadImg = true;
          this.importViewModel.initImportData();
          $('#uploadModal2').modal('hide');
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
                CKEDITOR.instances.editor2.insertHtml(str);
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

