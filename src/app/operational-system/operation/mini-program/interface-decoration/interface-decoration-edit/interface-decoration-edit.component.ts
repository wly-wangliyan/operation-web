import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subscription, timer } from 'rxjs';
import { debug } from 'util';
import { ZPhotoSelectComponent } from '../../../../../share/components/z-photo-select/z-photo-select.component';

@Component({
  selector: 'app-interface-decoration-edit',
  templateUrl: './interface-decoration-edit.component.html',
  styleUrls: ['./interface-decoration-edit.component.css']
})
export class InterfaceDecorationEditComponent implements OnInit {

  public mouldList = ['ICON魔方', '单行轮播广告', '左右布局(1)', '左右布局(2)', '单行左右滑动', '商品推荐'];
  public mouldType = 0;
  public mouldIndex = -1;
  public previewList = [];
  public cover_url = [];
  public bannerParams = {};

  private mouseDownSubscription: Subscription;
  private mouseMoveSubscription: Subscription;
  private mouseUpSubscription: Subscription;
  private mouseLeaveSubscription: Subscription;

  @ViewChild('coverImg', { static: false }) public coverImgSelectComponent: ZPhotoSelectComponent;

  constructor() { }

  ngOnInit() {
  }

  private drag() {
    // box是装图片的容器,fa是图片移动缩放的范围,scale是控制缩放的小图标
    const box = document.getElementById('box');
    const fa = document.getElementById('father');
    // 图片移动效果
    this.mouseDownSubscription = fromEvent(box, 'mousedown').subscribe((e: any) => {
      let oEvent = e;
      // 浏览器有一些图片的默认事件,这里要阻止
      oEvent.preventDefault();
      const disX = oEvent.clientX - box.offsetLeft;
      this.mouseMoveSubscription = fromEvent(fa, 'mousemove').subscribe((ev: any) => {
        oEvent = ev;
        oEvent.preventDefault();
        let x = oEvent.clientX - disX;
        // 图形移动的边界判断
        x = x <= 0 ? 0 : x;
        x = x >= fa.offsetWidth - box.offsetWidth ? fa.offsetWidth - box.offsetWidth : x;
        box.style.left = x + 'px';
      });
      this.mouseLeaveSubscription = fromEvent(fa, 'mouseleave').subscribe(() => {
        this.mouseMoveSubscription.unsubscribe();
      });
      this.mouseUpSubscription = fromEvent(fa, 'mouseup').subscribe(() => {
        this.mouseMoveSubscription.unsubscribe();
      });
    });
  }

  // 添加模板
  public onMouldClick(index: number) {
  }

  // 保存草稿
  public onSaveDraftClick() {

  }

  // 保存并发布
  public onReleaseClick() {

  }

  // 创建模板
  public onCreateMould(index: number) {
    this.previewList.push({template_type: index, image: [1, 2, 3]});
    if (index === 5) {
      timer(0).subscribe(() => {
        this.drag();
      });
    }
  }

  // 选择图片时校验图片格式
  public onSelectedPicture(event: any): any {
    // this.errPositionItem.icon.isError = false;
    // if (event === 'type_error') {
    //   this.errPositionItem.icon.isError = true;
    //   this.errPositionItem.icon.errMes = '格式错误，请重新上传！';
    // } else if (event === 'size_over') {
    //   this.errPositionItem.icon.isError = true;
    //   this.errPositionItem.icon.errMes = '图片大小不得高于2M！';
    // }
  }

  // 上传图片结果
  public onUploadFinish(event: any): void {
    // if (event) {
    //   this.contentList.forEach(item => {
    //     if (item.content_type !== 3) {
    //       item.elements.forEach(element => {
    //         if (element.element_id === event.file_id) {
    //           if (!event.isUpload) {
    //             element.image = null;
    //           } else {
    //             element.image = event.imageList;
    //           }
    //           element.errMsg = event.errMsg;
    //         }
    //       });
    //     }
    //   });
    // }
    // this.isSuccessUploadImg = true;
  }

  // Form表单提交
  public onEditFormSubmit() {

  }

  // 选中编辑模板
  public onMouldEditClick(type: number, index: number, event?: any) {
    this.mouldType = type;
    this.mouldIndex = index;
    const ele = document.getElementById('form');
    const ele1 = document.getElementById(`template_${type}_${index}`);
    ele.style.top = (ele1.offsetTop - 135) + 'px';
  }

  public onImgNumChange() {
  }
}
