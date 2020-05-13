import { Component, OnInit, ViewChild } from '@angular/core';
import { NzSearchAssistant } from '../../../share/nz-search-assistant';
import { GarageManagementService, MechanicEntity } from '../garage-management.service';
import { GlobalService } from '../../../core/global.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorEntity } from '../../../core/http.service';
import { isUndefined } from 'util';
import { ZPhotoSelectComponent } from '../../../share/components/z-photo-select/z-photo-select.component';

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
  image: ErrMessageItem = new ErrMessageItem();
  name: ErrMessageItem = new ErrMessageItem();
  tags: ErrMessageItem = new ErrMessageItem();

  constructor(image?: ErrMessageItem, name?: ErrMessageItem, tags?: ErrMessageItem) {
    if (isUndefined(image) || isUndefined(name) || isUndefined(tags)) {
      return;
    }
    this.image = image;
    this.name = name;
    this.tags = tags;
  }
}

@Component({
  selector: 'app-technician-list',
  templateUrl: './technician-list.component.html',
  styleUrls: ['./technician-list.component.css']
})
export class TechnicianListComponent implements OnInit {

  public nzSearchAssistant: NzSearchAssistant;
  public cover_url = [];
  public repair_shop_name: string;
  public currentTechnician: MechanicEntity = new MechanicEntity();
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public repair_shop_id: string;

  @ViewChild('coverImg', { static: false }) public coverImgSelectComponent: ZPhotoSelectComponent;

  constructor(private garageService: GarageManagementService,
              private globalService: GlobalService,
              private route: ActivatedRoute) {
    this.route.paramMap.subscribe(map => {
      this.repair_shop_id = map.get('repair_shop_id');
      this.repair_shop_name = map.get('repair_shop_name');
    });
    this.nzSearchAssistant = new NzSearchAssistant(this);
    this.nzSearchAssistant.submitSearch(true);
  }

  ngOnInit() {
  }

  // 新建、编辑技师
  public onEditTechnician(data: MechanicEntity) {
    this.currentTechnician = data ? JSON.parse(JSON.stringify(data)) : new MechanicEntity();
    this.cover_url = data ? data.image.split(',') : [];
    $('#configModal').modal('show');
  }

  // 保存技师信息
  public onSaveTechClick() {
    this.clear();
    this.coverImgSelectComponent.upload().subscribe(() => {
      this.currentTechnician.image = this.coverImgSelectComponent.imageList.map(i => i.sourceUrl).join(',');
      if (this.validTechnician()) {
        const failFun = err => {
          if (err.status === 422) {
            const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
            for (const content of error.errors) {
              if (content.field === 'name' && content.code === 'already_exists') {
                this.errPositionItem.name.isError = true;
                this.errPositionItem.name.errMes = '技师名称已存在！';
                return;
              } else {
                switch (content.field) {
                  case 'name':
                    this.errPositionItem.name.isError = true;
                    this.errPositionItem.name.errMes = '技师名称无效或不存在！';
                    break;
                  case 'image':
                    this.errPositionItem.image.isError = true;
                    this.errPositionItem.image.errMes = '图片无效或不存在！';
                    break;
                  case 'tags':
                    this.errPositionItem.tags.isError = true;
                    this.errPositionItem.tags.errMes = '标签无效或不存在！';
                    break;
                  default:
                    this.globalService.promptBox.open('保存失败，请重试!', null, 2000, null, false);
                    break;
                }
              }
            }
          }
        };
        const successFun = () => {
          this.globalService.promptBox.open('保存成功!');
          this.nzSearchAssistant.submitSearch(true);
          $('#configModal').modal('hide');
        };

        if (!this.currentTechnician.mechanic_id) {
          this.garageService.requestCreateTechnician(this.repair_shop_id, this.currentTechnician).subscribe(res => {
            successFun();
          }, error => {
            failFun(error);
          });
        } else {
          this.garageService.requestEditTechnician(this.repair_shop_id, this.currentTechnician.mechanic_id, this.currentTechnician)
              .subscribe(res => {
                successFun();
              }, error => {
                failFun(error);
              });
        }
      }
    });
  }

  // 数据校验
  private validTechnician(): boolean {
    if (this.currentTechnician.tags) {
      const tagList = this.currentTechnician.tags.split(',');
      if (tagList.length > 5) {
        this.errPositionItem.tags.isError = true;
        this.errPositionItem.tags.errMes = '标签最多添加5个！';
        return false;
      }
      let isValid = true;
      tagList.forEach(value => {
        if (value.length > 10) {
          this.errPositionItem.tags.isError = true;
          this.errPositionItem.tags.errMes = `每个标签字数在10字以内！`;
          isValid = false;
        }
      });
      if (!isValid) {
        return isValid;
      }
    }
    return true;
  }

  private clear() {
    this.errPositionItem.name.isError = false;
    this.errPositionItem.image.isError = false;
    this.errPositionItem.tags.isError = false;
  }

  // 选择图片时校验图片格式
  public onSelectedPicture(event) {
    this.errPositionItem.image.isError = false;
    if (event === 'type_error') {
      this.errPositionItem.image.isError = true;
      this.errPositionItem.image.errMes = '格式错误，请重新上传！';
    } else if (event === 'size_over') {
      this.errPositionItem.image.isError = true;
      this.errPositionItem.image.errMes = '图片大小不得高于1M！';
    }
  }

  // 删除技师
  public onDelTechnician(mechanic_id: string) {
    this.globalService.confirmationBox.open('警告', '此操作不可逆，是否确认删除？', () => {
      this.globalService.confirmationBox.close();
      this.garageService.requestDelTechnician(this.repair_shop_id, mechanic_id).subscribe(res => {
        this.globalService.promptBox.open('删除成功！');
        this.nzSearchAssistant.submitSearch(true);
      }, error => {
        this.globalService.promptBox.open('删除失败！', null, 2000, '/assets/images/warning.png');
        this.globalService.httpErrorProcess(error);
      });
    });
  }

  /* NzSearchAdapter 接口实现 */

  /* 请求检索 */
  public requestSearch(): any {
    return this.garageService.requestTechnicianList(this.repair_shop_id);
  }

  public continueSearch(url: string): any {
    return this.garageService.continueTechnicianList(url);
  }

  /* 生成并检查参数有效性 */
  public generateAndCheckParamsValid(): boolean {
    return true;
  }

  /* 检索失败处理 */
  public searchErrProcess(err: any) {
    this.globalService.httpErrorProcess(err);
  }

  /* 检索成功处理 */
  public searchCompleteProcess(results: Array<any>, isFuzzySearch: boolean) { }
}
