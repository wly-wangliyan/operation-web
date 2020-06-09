import { Component, OnInit, ViewChild } from '@angular/core';
import { isUndefined } from 'util';
import { NzSearchAssistant } from '../../../../share/nz-search-assistant';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { GlobalService } from '../../../../core/global.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorEntity } from '../../../../core/http.service';
import { GarageGiftService, GiftEntity, GiftParams } from './garage-gift.service';
import { timer } from 'rxjs';

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

  constructor(image?: ErrMessageItem) {
    if (isUndefined(image)) {
      return;
    }
    this.image = image;
  }
}

@Component({
  selector: 'app-garag-gift',
  templateUrl: './garage-gift.component.html',
  styleUrls: ['./garage-gift.component.css']
})
export class GarageGiftComponent implements OnInit {
  public nzSearchAssistant: NzSearchAssistant;
  public cover_url = [];
  public currentGift: GiftEntity = new GiftEntity();
  public errPositionItem: ErrPositionItem = new ErrPositionItem();
  public repair_shop_id: string;
  public imgReg = /(jpg|jpeg|png|gif)$/;
  public giftList: Array<GiftEntity> = [];

  @ViewChild('coverImg', { static: false }) public coverImgSelectComponent: ZPhotoSelectComponent;

  constructor(private garageGiftService: GarageGiftService,
              private globalService: GlobalService,
              private route: ActivatedRoute) {
    this.route.paramMap.subscribe(map => {
      this.repair_shop_id = map.get('repair_shop_id');
    });
    this.nzSearchAssistant = new NzSearchAssistant(this);
    this.nzSearchAssistant.submitSearch(true);
  }

  ngOnInit() {
  }

  // 新建、编辑赠品
  public onEditGift(data: GiftEntity) {
    this.currentGift = data ? JSON.parse(JSON.stringify(data)) : new GiftEntity();
    this.cover_url = this.currentGift.images ? this.currentGift.images.split(',') : [];
    const tempContent = this.currentGift.details ? this.currentGift.details.replace('/\r\n/g', '<br>').replace(/\n/g, '') : '';
    timer(200).subscribe(() => {
      CKEDITOR.instances.giftInfoEditor.setData(tempContent);
      $('#configModal').modal('show');
    });
  }

  // 保存赠品信息
  public onSaveGiftClick() {
    this.clear();
    this.coverImgSelectComponent.upload().subscribe(() => {
      this.currentGift.images = this.coverImgSelectComponent.imageList.map(i => i.sourceUrl).join(',');
      const tempContent = CKEDITOR.instances.giftInfoEditor.getData();
      if (tempContent) {
        this.currentGift.details = tempContent.replace('/\r\n/g', '').replace(/\n/g, '');
      } else {
        this.currentGift.details = '';
      }
      const failFun = err => {
        if (err.status === 422) {
          const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);
          for (const content of error.errors) {
            this.globalService.promptBox.open('保存失败，请重试!', null, 2000, null, false);
          }
        }
      };
      const successFun = () => {
        this.globalService.promptBox.open('保存成功!');
        this.nzSearchAssistant.submitSearch(true);
        $('#configModal').modal('hide');
      };
      const saveParams = new GiftParams(this.currentGift);
      if (!this.currentGift.gift_id) {
        this.garageGiftService.requestCreateGift(this.repair_shop_id, saveParams).subscribe(res => {
          successFun();
        }, error => {
          failFun(error);
        });
      } else {
        this.garageGiftService.requestEditGift(this.repair_shop_id, this.currentGift.gift_id, saveParams)
            .subscribe(res => {
              successFun();
            }, error => {
              failFun(error);
            });
      }
    });
  }

  private clear() {
    this.errPositionItem.image.isError = false;
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

  // 删除赠品
  public onDelGift(gift_id: string) {
    this.globalService.confirmationBox.open('警告', '此操作不可逆，是否确认删除？', () => {
      this.globalService.confirmationBox.close();
      this.garageGiftService.requestDelGift(this.repair_shop_id, gift_id).subscribe(res => {
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
    return this.garageGiftService.requestGiftList(this.repair_shop_id);
  }

  public continueSearch(url: string): any {
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
  public searchCompleteProcess(results: Array<any>, isFuzzySearch: boolean) {
  }
}
