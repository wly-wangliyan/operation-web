import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BusinessManagementService, UpkeepMerchantEntity } from '../../../maintenance/business-management/business-management.service';
import { MapItem, ZMapSelectPointComponent } from '../../../../share/components/z-map-select-point/z-map-select-point.component';
import { Subscription } from 'rxjs';
import { ZPhotoSelectComponent } from '../../../../share/components/z-photo-select/z-photo-select.component';
import { ProCityDistSelectComponent, RegionEntity } from '../../../../share/components/pro-city-dist-select/pro-city-dist-select.component';
import { SelectBrandFirmComponent } from '../../../../share/components/select-brand-firm/select-brand-firm.component';
import { GlobalService } from '../../../../core/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorEntity } from '../../../../core/http.service';
import { ErrPositionItem } from '../../../maintenance/business-management/business-edit/business-edit.component';
import { CommentEntity, CommentService } from '../comment-management.service';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.css']
})
export class CommentDetailComponent implements OnInit {

  public currentComment = new CommentEntity();

  private continueRequestSubscription: Subscription;
  private comment_id: string;

  @Input() public data: any;
  @Input() public sureName: string;

  @ViewChild('pagePromptDiv', {static: true}) public pagePromptDiv: ElementRef;
  @ViewChild('coverImg', {static: true}) public coverImgSelectComponent: ZPhotoSelectComponent;
  @ViewChild('projectInfoPro', {static: true}) public proCityDistSelectComponent: ProCityDistSelectComponent;
  @ViewChild(ZMapSelectPointComponent, {static: true}) public zMapSelectPointComponent: ZMapSelectPointComponent;
  @ViewChild(SelectBrandFirmComponent, {static: true}) public selectBrandFirmComponent: SelectBrandFirmComponent;

  constructor(private globalService: GlobalService,
              private activatedRoute: ActivatedRoute,
              private commentService: CommentService,
              private router: Router) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.comment_id = queryParams.comment_id;
    });
  }

  public ngOnInit(): void {
    this.continueRequestSubscription = this.commentService.requestCommentDetail(this.comment_id)
        .subscribe(res => {
          this.currentComment = res;
        }, err => {
          this.globalService.httpErrorProcess(err);
        });
  }

  // 通过、驳回按钮触发事件
  public onPassClick(status: number) {
    this.commentService.requestUpdateStatus(this.comment_id, status).subscribe((e) => {
      const msg = status === 2 ? '通过成功！' : '驳回成功！';
      this.globalService.promptBox.open(msg);
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 置顶、取消置顶按钮触发事件
  public onTopClick(status: number) {
    this.commentService.requestUpdateTop(this.comment_id, status).subscribe((e) => {
      const msg = status ? '置顶成功！' : '取消置顶成功！';
      this.globalService.promptBox.open(msg);
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }
}
