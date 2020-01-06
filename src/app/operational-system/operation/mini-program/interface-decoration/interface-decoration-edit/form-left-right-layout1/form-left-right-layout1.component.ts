import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LeftAndRightLayout1ContentEntity, TemplateEntity } from '../../interface-decoration.service';

@Component({
  selector: 'app-form-left-right-layout1',
  templateUrl: './form-left-right-layout1.component.html',
  styleUrls: ['./form-left-right-layout1.component.css']
})
export class FormLeftRightLayout1Component implements OnInit {

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

  // 删除模板内容信息
  public onDelContentClick(index: number) {
    this.errMsg = '';
    this.currentTemplate.template_content.contents.splice(index, 1);
    this.contentIndex -= 1;
    this.imgIndex = 1;
  }

  // 添加广告图
  public onAddAdvertClick() {
    if (this.CheckSaveTempValid) {
      const contents = new LeftAndRightLayout1ContentEntity();
      this.contentIndex += 1;
      this.imgIndex = 1;
      this.currentTemplate.template_content.contents.push(contents);
    }
  }

  // 点击图片，标题联动
  public onImgClick(index: number, imgIndex?: number) {
    this.contentIndex = index;
    this.imgIndex = imgIndex;
  }

  // 选择图片时校验图片格式
  public onSelectedPicture(event: any, index: number = 0, imgPosition?: string): any {
    if (event.isDeleteImg && (!event.imageList || event.imageList.length === 0)) {
      if (imgPosition) {
        this.currentTemplate.template_content.contents[index][imgPosition] = [];
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
          this.currentTemplate.template_content.contents[event.file_id].left_image = event.imageList ? event.imageList.split(',') : [];
          break;
        case 2:
          this.currentTemplate.template_content.contents[event.file_id].right_image = event.imageList ? event.imageList.split(',') : [];
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
    saveData.template_content.contents.forEach(value => {
      value.left_image = value.left_image && value.left_image.length > 0 ? value.left_image[0] : '';
      value.right_image = value.right_image && value.right_image.length > 0 ? value.right_image[0] : '';
    });
    saveData.template_content = JSON.stringify(saveData.template_content);
    this.saveTemplate.emit(saveData);
  }

  // 校验保存按钮
  public get CheckSaveTempValid(): boolean {
    let checkValid = true;
    this.currentTemplate.template_content.contents.forEach(value => {
      if (!value.left_image || !value.right_image || value.left_image.length === 0 || value.right_image.length === 0
          || (!value.left_url_type && value.left_url) || (value.left_url_type && !value.left_url)
          || (value.right_url_type && !value.right_url) || (!value.right_url_type && value.right_url)) {
        checkValid = false;
      }
    });
    return checkValid;
  }
}
