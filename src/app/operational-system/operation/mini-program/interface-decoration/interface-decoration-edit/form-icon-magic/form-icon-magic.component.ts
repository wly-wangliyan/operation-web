import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  IconMagicContentEntity, TemplateEntity
} from '../../interface-decoration.service';

@Component({
  selector: 'app-form-icon-magic',
  templateUrl: './form-icon-magic.component.html',
  styleUrls: ['./form-icon-magic.component.css']
})
export class FormIconMagicComponent implements OnInit {

  public currentTemplate: TemplateEntity = new TemplateEntity(); // 当前选中的模板
  public contentIndex = 0; // 模板内容index
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

  // 单行显示数量change, 创建模板初始化数据
  public onImgNumChange(template: TemplateEntity) {
    const contentsList = [];
    const count = template.template_content.count - template.template_content.contents.length;
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const contents = new IconMagicContentEntity();
        contents.image = [];
        contentsList.push(contents);
        template.template_content.contents.push(contents);
      }
    } else {
      for (let i = 0; i < -count; i++) {
        const index = template.template_content.contents.length - 1;
        template.template_content.contents.splice(index, 1);
        this.contentIndex = this.contentIndex + 1 > template.template_content.count ? index - 1 : this.contentIndex;
      }
    }
  }

  // 点击图片，标题联动
  public onImgClick(index: number) {
    this.contentIndex = index;
  }

  // 选择图片时校验图片格式
  public onSelectedPicture(event: any, index: number = 0): any {
    if (event.isDeleteImg && (!event.imageList || event.imageList.length === 0)) {
      this.currentTemplate.template_content.contents[index].image = [];
    } else if (event) {
      this.errMsg = event.errMsg;
    }
  }

  // 上传图片结果
  public onUploadFinish(event: any): void {
    if (event) {
      this.currentTemplate.template_content.contents[event.file_id].image = event.imageList ? event.imageList.split(',') : [];
    }
  }

  // 取消编辑模板
  public onCancelClick() {
    this.currentTemplate = new TemplateEntity();
    this.contentIndex = 0;
    this.cancelEdit.emit();
  }

  // 模板Form表单提交
  public onEditFormSubmit() {
    const saveData = JSON.parse(JSON.stringify(this.currentTemplate));
    delete saveData.height;
    saveData.template_content.contents.forEach(value => {
      value.image = value.image && value.image.length > 0 ? value.image[0] : '';
    });
    saveData.template_content = JSON.stringify(saveData.template_content);
    this.saveTemplate.emit(saveData);
  }

  // 校验保存按钮
  public get CheckSaveTempValid(): boolean {
    let checkValid = true;
    this.currentTemplate.template_content.contents.forEach(value => {
      if (!value.image || value.image.length === 0 || !value.title || (value.url_type && !value.url) || (!value.url_type && value.url)) {
        checkValid = false;
      }
    });
    return checkValid;
  }
}
