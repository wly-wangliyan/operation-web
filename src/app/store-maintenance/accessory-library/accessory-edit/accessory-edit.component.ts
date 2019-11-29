import { Component, OnInit, ViewChild } from '@angular/core';
import { ChooseProjectComponent } from './choose-project/choose-project.component';
import { ChooseBrandComponent } from './choose-brand/choose-brand.component';
@Component({
  selector: 'app-accessory-edit',
  templateUrl: './accessory-edit.component.html',
  styleUrls: ['./accessory-edit.component.css']
})
export class AccessoryEditComponent implements OnInit {

  public list = [];
  public noResultText = '数据加载中...';

  @ViewChild('chooseProject', { static: true }) public chooseProject: ChooseProjectComponent;
  @ViewChild('chooseBrand', { static: true }) public chooseBrand: ChooseBrandComponent;

  constructor() { }

  ngOnInit() {
    this.list = [
      { name: 1 },
    ];
    this.noResultText = '暂无数据';
    setTimeout(() => {
      CKEDITOR.instances.accessoryEditor.destroy(true);
      CKEDITOR.replace('accessoryEditor');
    }, 500);
  }

  // 打开所属项目选择组件
  public onOpenProjectModal(): void {
    this.chooseProject.open();
  }

  // 打开所属品牌选择组件
  public onOpenBrandModal(): void {
    this.chooseBrand.open();
  }

  // 添加规格
  public onAddSpecifications() {
    const obj = { name: 1 };
    this.list.push(obj);
  }

  // 删除规格
  public onDelSpecifications(i: number) {
    this.list.splice(i, 1);
  }

}
