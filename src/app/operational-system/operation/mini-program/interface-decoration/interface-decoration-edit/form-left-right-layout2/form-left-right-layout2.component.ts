import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TemplateEntity } from '../../interface-decoration.service';

@Component({
  selector: 'app-form-left-right-layout2',
  templateUrl: './form-left-right-layout2.component.html',
  styleUrls: ['./form-left-right-layout2.component.css']
})
export class FormLeftRightLayout2Component implements OnInit {

  public currentTemplate: TemplateEntity = new TemplateEntity(); // 当前选中的模板
  public contentIndex = 0; // 模板内容index
  public imgIndex = 1; // 模板内容中图片的index
  public errMsg: string;
  public imgReg = /(jpg|jpeg|png|gif)$/;

  @Output('cancelEdit') public cancelEdit = new EventEmitter();
  @Output('saveTemplate') public saveTemplate = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public initForm(currentTemplate: TemplateEntity) {
    this.currentTemplate = currentTemplate;
    this.errMsg = '';
  }

  // 点击图片，标题联动
  public onImgClick(index: number, imgIndex?: number) {
    this.contentIndex = index;
    this.imgIndex = imgIndex;
  }

  // 选择图片时校验图片格式
  public onSelectedPicture(event: any): any {
    if (event.isDeleteImg && (!event.imageList || event.imageList.length === 0)) {
      if (event.file_id) {
        this.currentTemplate.template_content[event.file_id] = [];
      }
    } else if (event) {
      this.errMsg = event.errMsg;
    }
  }

  // 上传图片结果
  public onUploadFinish(event: any, type?: number): void {
    if (event) {
      switch (type) {
        case 1:
          this.currentTemplate.template_content.left_image = event.imageList ? event.imageList.split(',') : [];
          break;
        case 2:
          this.currentTemplate.template_content.right_top_image = event.imageList ? event.imageList.split(',') : [];
          break;
        case 3:
          this.currentTemplate.template_content.right_bottom_image = event.imageList ? event.imageList.split(',') : [];
          break;
      }
    }
  }

  // 取消编辑模板
  public onCancelClick() {
    this.currentTemplate = new TemplateEntity();
    this.contentIndex = 0;
    this.imgIndex = 1;
    this.cancelEdit.emit();
  }

  // 模板Form表单提交
  public onEditFormSubmit() {
    const saveData = JSON.parse(JSON.stringify(this.currentTemplate));
    delete saveData.height;
    saveData.template_content.left_image = saveData.template_content.left_image && saveData.template_content.left_image.length > 0 ?
        saveData.template_content.left_image[0] : '';
    saveData.template_content.right_top_image = saveData.template_content.right_top_image && saveData.template_content.right_top_image.length > 0 ?
        saveData.template_content.right_top_image[0] : '';
    saveData.template_content.right_bottom_image = saveData.template_content.right_bottom_image && saveData.template_content.right_bottom_image.length > 0 ?
        saveData.template_content.right_bottom_image[0] : '';
    saveData.template_content = JSON.stringify(saveData.template_content);
    this.saveTemplate.emit(saveData);
  }

  // 校验保存按钮
  public get CheckSaveTempValid(): boolean {
    let checkValid = true;
    if (!this.currentTemplate.template_content.left_image || !this.currentTemplate.template_content.right_top_image
        || !this.currentTemplate.template_content.right_bottom_image || this.currentTemplate.template_content.right_bottom_image.length === 0
        || this.currentTemplate.template_content.left_image.length === 0 || this.currentTemplate.template_content.right_top_image.length === 0
        || (!this.currentTemplate.template_content.left_url_type && this.currentTemplate.template_content.left_url)
        || (this.currentTemplate.template_content.left_url_type && !this.currentTemplate.template_content.left_url)
        || (!this.currentTemplate.template_content.right_top_url_type && this.currentTemplate.template_content.right_top_url)
        || (this.currentTemplate.template_content.right_top_url_type && !this.currentTemplate.template_content.right_top_url)
        || (this.currentTemplate.template_content.right_bottom_url_type && !this.currentTemplate.template_content.right_bottom_url)
        || (!this.currentTemplate.template_content.right_bottom_url_type && this.currentTemplate.template_content.right_bottom_url)) {
      checkValid = false;
    }
    return checkValid;
  }
}
