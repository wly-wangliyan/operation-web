import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { GlobalService } from '../../../../core/global.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { isUndefined } from 'util';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { WriteServiceImportViewModel } from './first-page-icon-edit.model';

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
  project_name: ErrMessageItem = new ErrMessageItem();
  address: ErrMessageItem = new ErrMessageItem();
  leader: ErrMessageItem = new ErrMessageItem();
  mobile: ErrMessageItem = new ErrMessageItem();

  constructor(project_name?: ErrMessageItem, address?: ErrMessageItem, leader?: ErrMessageItem, mobile?: ErrMessageItem) {
    if (isUndefined(project_name) || isUndefined(address) || isUndefined(leader) || isUndefined(mobile)) {
      return;
    }
    this.project_name = project_name;
    this.address = address;
    this.leader = leader;
    this.mobile = mobile;
  }
}

@Component({
  selector: 'app-first-page-icon-edit',
  templateUrl: './first-page-icon-edit.component.html',
  styleUrls: ['./first-page-icon-edit.component.css']
})
export class FirstPageIconEditComponent implements OnInit {
  public isCreateProject = true;
  public currentProject: any;
  public cameraBrand: any;
  public brandModelList: Array<any> = [];
  public cameraBrandList: Array<any> = [];
  public noResultText = '数据加载中...';
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public cover_url = [];
  public uploadImg: string;
  public importViewModel: WriteServiceImportViewModel = new WriteServiceImportViewModel();

  private flag = 0;
  private searchText$ = new Subject<any>();
  private sureCallback: any;
  private closeCallback: any;

  @Input() public data: any;
  @Input() public sureName: string;

  @ViewChild('projectPromptDiv', { static: true }) public projectPromptDiv: ElementRef;
  @ViewChild('coverImg', {static: false}) public coverImgSelectComponent: ZPhotoSelectComponent;

  constructor(
              private globalService: GlobalService) {
  }

  public ngOnInit(): void {
    /*this.clear();
    this.searchText$.pipe(debounceTime(500), switchMap(() => this.projectService.requestCameraBrandList()))
        .subscribe(res => {
          this.cameraBrandList = res;
          this.noResultText = '暂无数据';
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
    this.searchText$.next();*/
  }


  /*public ngAfterViewInit() {
    // this.clear();
    $(this.projectPromptDiv.nativeElement).on('hidden.bs.modal', () => {
      if (this.closeCallback) {
        const temp = this.closeCallback;
        this.closeCallback = null;
        this.sureCallback = null;
        temp();
      }
    });
  }*/

  // 键盘按下事件
  public onKeydownEvent(event: any) {
    if (event.keyCode === 13) {
      this.onEditFormSubmit();
      return false;
    }
  }

  // 弹框close
  public onClose() {
    // this.clear();
    $(this.projectPromptDiv.nativeElement).modal('hide');
  }

  /**
   * 打开确认框
   * @param sureName 确认按钮文本(默认为确定)
   * @param sureFunc 确认回调
   * @param closeFunc 取消回调
   */
  public open(project_id: string, sureFunc: any, sureName: string = '确定', closeFunc: any = null) {
    const openProjectModal = (data?: any) => {
      timer(0).subscribe(() => {
        $(this.projectPromptDiv.nativeElement).modal('show');
      });
    };
    this.isCreateProject = project_id ? false : true;
    this.sureName = sureName;
    this.sureCallback = sureFunc;
    this.closeCallback = closeFunc;
    if (this.isCreateProject) {
      this.currentProject = {};
      openProjectModal();
      return;
    }
  }

  // form提交
  public onEditFormSubmit() {
    this.clear();
    // this.verification();

    /*if (this.flag === 0 ||
        (this.errPositionItem.project_name.isError && this.errPositionItem.mobile.isError && this.errPositionItem.address.isError )) {
      if (this.isCreateProject) {
        // 添加项目
        this.projectService.requestAddProject(this.currentProject).subscribe(() => {
          this.globalService.promptBox.open('添加成功！', () => {
            this.sureCallbackInfo();
            this.brandModelList = [];
            this.onClose();
            this.currentProject = new ProjectVM();
          });
        }, err => {
          this.errorProcess(err);

        });
      } else {
        // 编辑项目
        this.projectService.requestModifyProject(this.currentProject).subscribe(() => {
          this.globalService.promptBox.open('修改成功！', () => {
            this.sureCallbackInfo();
            this.brandModelList = [];
            this.onClose();
          });
        }, err => {
          this.errorProcess(err);
        });
      }
    }*/
  }

  // 清空
  public clear() {
    this.errPositionItem.project_name.isError = false;
    this.errPositionItem.project_name.errMes = '';
    this.errPositionItem.mobile.isError = false;
    this.errPositionItem.mobile.errMes = '';
    this.errPositionItem.address.isError = false;
    this.errPositionItem.address.errMes = '';
    this.errPositionItem.leader.isError = false;
    this.errPositionItem.leader.errMes = '';
    this.flag = 0;
  }

  // 确定按钮回调
  private sureCallbackInfo() {
    if (this.sureCallback) {
      const temp = this.sureCallback;
      this.closeCallback = null;
      this.sureCallback = null;
      temp();
    }
  }

  // 接口错误状态
  private errorProcess(err) {
    if (!this.globalService.httpErrorProcess(err)) {
      /*if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
        for (const content of error.errors) {
          if (content.code === 'already_existed' && content.resource === 'project_name') {
            this.errPositionItem.project_name.isError = true;
            this.errPositionItem.project_name.errMes = '该项目名称已存在，请使用其他名称！';
            return;
          }
        }
      }*/
    }
  }

  // 选择图片时校验图片格式
  public onSelectedPicture(event) {
    if (event === 'type_error') {
      this.globalService.promptBox.open('不接受此文件类型！');
    } else if (event === 'size_over') {
      this.globalService.promptBox.open('图片大小不得高于1M！');
    }
  }

  // 图片上传服务器，确认上传图片
  confirmUpload() {
    if (this.importViewModel.file) {
      /*this.infoNewsService.requestUploadPicture(this.importViewModel.file).subscribe(results => {
        if (results.sourceUrl) {
          this.uploadImg = results.sourceUrl;
          this.importViewModel.uploadImg = true;
          this.importViewModel.initImportData();
          $('#uploadModal').modal('hide');
          if (this.importViewModel.uploadImg) {
            let uploadStr: string;
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
                uploadStr = ` <img src=' ${ this.uploadImg } ' style='width:100%' /> `;
              } else {
                uploadStr = ` <img src=' ${ this.uploadImg } '/> `;
              }
              if (this.uploadImg) {
                CKEDITOR.instances.editor1.insertHtml(uploadStr);
              }
            };
          }
        }
      }, err => {
        this.importViewModel.uploadImg = false;
        console.log(err);
      });*/
    } else {
      this.importViewModel.uploadImg = false;
    }
    this.importViewModel.uploadImg = false;
  }

  // 取消上传图片
  cancleUpload() {
    this.clearUploadImgInfo();
  }

  closeUpload() {
    this.clearUploadImgInfo();
  }

  // 清空上传图片信息
  clearUploadImgInfo() {
    this.importViewModel.initImportData();
    this.importViewModel.file = '';
    this.uploadImg = '';
    this.importViewModel.uploadImg = false;
    this.importViewModel.hasErrorTip = false;
  }


}
