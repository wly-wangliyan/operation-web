import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  SingleRowBroadcastContentEntity,
  TemplateEntity
} from '../../interface-decoration.service';

@Component({
  selector: 'app-form-single-row-broadcast',
  templateUrl: './form-single-row-broadcast.component.html',
  styleUrls: ['./form-single-row-broadcast.component.css']
})
export class FormSingleRowBroadcastComponent implements OnInit {

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

  // 删除模板内容信息
  public onDelContentClick(index: number) {
    this.errMsg = '';
    this.currentTemplate.template_content.contents.splice(index, 1);
    this.contentIndex -= 1;
  }

  // 添加广告图
  public onAddAdvertClick() {
    if (this.CheckSaveTempValid) {
      const contents = new SingleRowBroadcastContentEntity();
      contents.image = [];
      this.contentIndex += 1;
      this.currentTemplate.template_content.contents.push(contents);
    }
  }

  // 点击图片，标题联动
  public onImgClick(index: number) {
    this.contentIndex = index;
  }

  // 选择图片时校验图片格式
  public onSelectedPicture(event: any, index: number = 0, imgPosition?: string): any {
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
    if (Number(this.currentTemplate.template_type) === 2) {
      this.currentTemplate.template_content.contents.forEach(value => {
        if (!value.image || value.image.length === 0 || !value.name || (value.url_type && !value.url) || (!value.url_type && value.url)) {
          checkValid = false;
        }
      });
    }
    return checkValid;
  }
}
