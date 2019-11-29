import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { UploadService } from '../../../core/upload.service';
import { Observable, timer } from 'rxjs';

@Component({
  selector: 'app-z-photo-select',
  templateUrl: './z-photo-select.component.html',
  styleUrls: ['./z-photo-select.component.css']
})
export class ZPhotoSelectComponent implements OnInit {

  @Input() public maxLength = 1;  // 图片可添加最多张数

  @Input() public limitImgSize = 5; // 限制上传图片大小，默认为5M

  @Input() public file_id = 'file';

  @Input()
  public set imageUrls(imageUrls: Array<string>) {
    if (isNullOrUndefined(imageUrls)) {
      return;
    }
    this.imageList = [];
    imageUrls.forEach(imageUrl => {
      this.imageList.push(new ZPhotoImageEntity(imageUrl));
    });
  }

  @Input() public imageWidth = '88';

  @Input() public imageHeight = '88';

  @Input() public imageAddHeight = null;

  @Input() public imageDelWidth = '22';

  @Input() public imageDelHeight = '22';

  @Input() public imageShowWidth = null; // 剪裁后的图片显示的宽度

  @Input() public minCropBoxWidth = 150; // 剪裁框的最小宽度

  @Input() public minCropBoxHeight = 150; // 最大值400

  @Input() public isChangeAddPic = false; // 是否改变添加图片的样式

  public get transformLineHeight(): string {
    return (Number(this.imageHeight) - 2).toString();
  }

  @Input() public zoomWidth = 1000; // 图像剪裁模态框的宽

  @Input() public zoomHeight = '560'; // 图像剪裁模态框的高

  public get transformZoomLineHeight(): string {
    return (Number(this.zoomHeight) - 36).toString();
  }

  @Input() public hasDeletePicture = false;

  @Input() public hasAddPicture = false;

  @Input() public isShowMinImg = true; // 是否显示小图，默认显示

  @Input() public isCutCoverImg = false; // 是否需要进行裁剪

  @Output() public selectedImgChange = new EventEmitter(); // 选择图片错误

  @Input() public dragCrop = false; // 是否可以重画

  @Input() public resizable = false; // 是否可以按比例自由截取

  @Input() public aspectRatio = 1 / 1; // 截取图片比例

  public imageList: Array<ZPhotoImageEntity> = [];

  private _dirty = false;

  public get dirty(): boolean {
    return this._dirty;
  }

  public currentImgNum = 1;

  public cutCoverImgUrl = ''; // 需要裁剪图片路径

  private imageItem: ZPhotoImageEntity = new ZPhotoImageEntity();

  private fileElement: any;

  private isValidImg = true;

  @ViewChild('imageModal', { static: true }) public imageModal: ElementRef; // 图片查看模态框

  @ViewChild('cutCoverUrlModal', { static: true }) public cutCoverUrlModal: ElementRef; // 裁剪图片模态框

  @ViewChild('imgContainer', { static: true }) public imgContainer: ElementRef; // 成像区域

  @ViewChild('cutCoverImg', { static: true }) public cutCoverImg: ElementRef; // 被建材图片

  @ViewChildren('progressBgList') public progressBgList: QueryList<ElementRef>;

  @ViewChildren('progressBarList') public progressBarList: QueryList<ElementRef>; // 进度条

  constructor(@Optional() private uploadService: UploadService, private sanitizer: DomSanitizer, private renderer2: Renderer2) {
  }

  public ngOnInit() {
    this.hasDeletePicture = this.hasDeletePicture;
    this.hasAddPicture = this.hasAddPicture;
    this.imageAddHeight = this.imageAddHeight ? this.imageAddHeight : this.imageHeight;
    console.log(this.hasDeletePicture);
  }

  /**
   * 选择本地图片
   * @param event 参数
   * @param fileElement 选择文件的控件，使用后需要手动清空
   * JPG、JPEG或者PNG图片格式，图片大小不得高于5M
   */
  public selectPicture(event, fileElement: any) {
    const files = event.target.files;
    if (files.length > 0) {
      const imgUrl = window.URL.createObjectURL(files[0]);
      this.imageItem = new ZPhotoImageEntity();

      this._dirty = true;
      this.imageItem.sourceFile = files[0];
      // 将本地图片转为安全地址
      this.imageItem.transformSafeUrl = this.sanitizer.bypassSecurityTrustUrl(imgUrl);
      this.fileElement = fileElement;
      if (this.isCutCoverImg) {
        const imageItemList: Array<ZPhotoImageEntity> = [];
        imageItemList.push(this.imageItem);
        // 检查选择照片是否是有效图片
        this.validateImg(imageItemList);
        this.cutWriteCoverUrl();
      } else {
        const imageItemList: Array<ZPhotoImageEntity> = [];
        imageItemList.push(this.imageItem);
        // 检查选择照片是否是有效图片
        this.validateImg(imageItemList);
        if (this.isValidImg) {
          this.formatImgInfo();
        }
      }
    }
  }

  // 删除图片
  public deletePicture(index: any) {
    this._dirty = true;
    this.imageList.splice(index, 1);
    // 检查选择照片是否是有效图片
    this.validateImg(this.imageList);
  }

  // 放大图片
  public zoomPicture(index: any = 0) {
    if ((!this.hasDeletePicture) && (this.imageList.length > 0)) {
      this.currentImgNum = index + 1;
      timer(0).subscribe(() => {
        $(this.imageModal.nativeElement).children().css({
          width: this.zoomWidth + 'px',
          height: this.zoomHeight + 'px',
          'margin-top': -(Number(this.zoomHeight) / 2) + 'px',
          'margin-left': -(Number(this.zoomWidth) / 2) + 'px'
        });
        $(this.imageModal.nativeElement).modal('show');
      });
    }
  }

  // 选择查看上一张/下一张图片
  public selectedShowImage(flag) {
    if (flag) {
      if (this.currentImgNum > 1) {
        this.currentImgNum--;
      }
    } else {
      if (this.currentImgNum < this.imageList.length) {
        this.currentImgNum++;
      }
    }
  }

  // 关闭图片查看模态框
  public closeShowZoomPicture() {
    timer(0).subscribe(() => {
      $(this.imageModal.nativeElement).modal('hide');
    });
  }

  /**
   * 上传图片
   * @returns Observable<any>
   */
  public upload(): Observable<any> {
    if (isNullOrUndefined(this.uploadService)) {
      throw new Error('UploadService is not provided');
    }
    return Observable.create(observer => {
      let count = 0;
      const totalCount = this.imageList.length;
      let recordErrors = null;
      // 同步结果返回
      const completeProcess = (hasImg: boolean = true) => {
        if (hasImg) {
          count++;
        }
        if (count !== totalCount) {
          return;
        }
        // 添加延迟优化显示效果
        timer(1000).subscribe(() => {
          if (recordErrors) {
            observer.error(recordErrors);
          } else {
            observer.next();
          }
          observer.complete();
        });
      };
      if (this.imageList.length > 0) {
        const processBgArray = this.progressBgList.toArray();
        const processBarArray = this.progressBarList.toArray();
        this.imageList.forEach((imageEntity, index) => {
          if (imageEntity.sourceFile) {
            const curProcessBg = processBgArray[index];
            const curProcessBar = processBarArray[index];
            this.uploadService.requestUpload(imageEntity.sourceFile).subscribe(event => {
              /**
               * 上传图片时根据上传进度显示进度条
               */
              if (event.type === HttpEventType.UploadProgress) {
                // 处理进度状态
                const percentDone = Math.round(100 * event.loaded / event.total);
                this.renderer2.setStyle(curProcessBg.nativeElement, 'display', 'block');
                this.renderer2.setStyle(curProcessBar.nativeElement, 'width', percentDone + '%');
                if (percentDone === 100) {
                  // 添加延迟优化显示效果
                  timer(1000).subscribe(() => {
                    this.renderer2.setStyle(curProcessBg.nativeElement, 'display', 'none');
                  });
                }
              } else if (event instanceof HttpResponse) {
                // 结果返回，处理结果
                imageEntity.sourceUrl = event.body.source_url;
                imageEntity.sourceFile = null;
                console.log(event.body.source_url);
                completeProcess();
              }
            }, err => {
              recordErrors = err;
              completeProcess();
            });
          } else {
            completeProcess();
          }
        });
      } else {
        completeProcess(false);
      }
    });
  }

  // 确认裁剪封面
  public confirmCutWriteCoverUrl() {
    $(this.cutCoverUrlModal.nativeElement).modal('hide');
    const canvas = $(this.cutCoverImg.nativeElement).cropper('getCroppedCanvas');
    const base64url = canvas.toDataURL(this.imageItem.sourceFile.type);
    const files = this.convertBase64UrlToFile(base64url, this.imageItem.sourceFile.name);
    this.imageItem.sourceFile = files;
    this.imageItem.transformSafeUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(files));
    this.formatImgInfo();
    $(this.cutCoverImg.nativeElement).cropper('destroy');
  }

  // 取消裁剪
  public cancelCutWriteCoverUrl() {
    this.cutCoverImgUrl = '';
    $(this.cutCoverImg.nativeElement).cropper('destroy');
    $(this.fileElement).val('');
    $(this.cutCoverUrlModal.nativeElement).modal('hide');
  }

  // 检查选择照片是否是有效图片
  private validateImg(imageList: Array<any>) {
    if (imageList.length > 0) {
      for (const index in imageList) {
        if (imageList.hasOwnProperty(index)) {
          const imgReg = /(jpg|jpeg|png)$/;
          this.isValidImg = true;

          if (imageList[index].sourceFile) {
            const file = imageList[index].sourceFile;
            const type = file.type.split('/')[1];

            if (isNullOrUndefined(type) || !imgReg.test(type.toLowerCase())) {
              this.isValidImg = false;
              this.selectedImgChange.emit('type_error');
              return;
            }
            if (file.size > (this.limitImgSize * 1024 * 1024)) {
              this.isValidImg = false;
              this.selectedImgChange.emit('size_over');
              return;
            }
            this.selectedImgChange.emit('');
          } else {
            this.selectedImgChange.emit('');
          }
        }
      }
    } else {
      this.selectedImgChange.emit('');
    }
  }

  // 裁剪图片
  private cutWriteCoverUrl() {
    if (this.isValidImg) {
      $(this.cutCoverUrlModal.nativeElement).children().css({
        width: this.zoomWidth + 'px',
        height: this.zoomHeight + 'px',
        'margin-top': -(Number(this.zoomHeight) / 2) + 'px',
        'margin-left': -(Number(this.zoomWidth) / 2) + 'px'
      });
      $(this.imgContainer.nativeElement).css({
        width: (Number(this.zoomWidth) / 1.78) + 'px',
        height: (Number(this.zoomHeight) / 1.78) < Number(this.minCropBoxHeight) ? Number(this.minCropBoxHeight) : (Number(this.zoomHeight) / 1.78) + 'px'
      });
      $(this.cutCoverUrlModal.nativeElement).modal('show');
      this.cutCoverImgUrl = this.imageItem.showUrl ? this.imageItem.showUrl : '';

      timer(0).subscribe(() => {
        $(this.cutCoverImg.nativeElement).cropper({
          aspectRatio: this.aspectRatio,
          viewMode: 1,
          dragMode: 'crop',
          preview: '.small-img',
          responsive: false,
          restore: false,
          minContainerWidth: Number(this.imageWidth),
          minContainerHeight: Number(this.imageHeight),
          minCanvasWidth: 0,
          minCanvasHeight: 0,
          minCropBoxWidth: this.minCropBoxWidth,
          minCropBoxHeight: this.minCropBoxHeight,
          movable: true,
          onlyColorChanged: false,
          checkCrossOrigin: true,
          toggleDragModeOnDblclick: false,
          checkImageOrigin: true,
          dragCrop: this.dragCrop,
          resizable: this.resizable,
          autoCropArea: 0.2
        });
      });
    }
  }

  // 格式化图片信息
  private formatImgInfo() {
    this.cutCoverImgUrl = '';
    this.imageList.push(this.imageItem);
    // 检查选择照片是否是有效图片
    this.validateImg(this.imageList);
    $(this.fileElement).val('');
  }

  /**
   * 将以base64的图片url数据转换为File
   * @param urlData 用url方式表示的base64图片数据
   */
  private convertBase64UrlToFile(urlData: string, fileName: string): any {
    const urlDataArr = urlData.split(',');
    const imgType = urlDataArr[0].match(/:(.*?);/)[1];
    const bytes = atob(urlDataArr[1]);
    let bytesLen = bytes.length;
    const u8arr = new Uint8Array(bytesLen);
    while (bytesLen--) {
      u8arr[bytesLen] = bytes.charCodeAt(bytesLen);
    }
    return new File([u8arr], fileName, { type: imgType });
  }
}

export class ZPhotoImageEntity {
  public sourceUrl: string;
  public sourceFile: any;
  public transformSafeUrl: any;

  constructor(sourceUrl?: string) {
    this.sourceUrl = sourceUrl;
  }

  public get showUrl(): string {
    return this.sourceUrl ? this.sourceUrl : this.transformSafeUrl;
  }
}
