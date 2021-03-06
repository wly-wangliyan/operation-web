import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../core/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentEntity, CommentService } from '../comment-management.service';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.css']
})
export class CommentDetailComponent implements OnInit {

  public currentComment = new CommentEntity(); // 评论详情

  public imageUrls = []; // 放大图片集合

  private comment_id: string; // 评论id

  constructor(
    private globalService: GlobalService,
    private activatedRoute: ActivatedRoute,
    private commentService: CommentService,
    private router: Router) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.comment_id = queryParams.comment_id;
    });
  }

  public ngOnInit(): void {
    this.commentService.requestCommentDetail(this.comment_id)
      .subscribe(res => {
        this.currentComment = res;
        this.imageUrls = res.image_urls ? res.image_urls.split(',') : [];
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
  }

  // 通过、驳回按钮触发事件
  public onPassClick(status: number) {
    this.commentService.requestUpdateStatus(this.comment_id, status).subscribe((e) => {
      const msg = status === 2 ? '通过成功！' : '驳回成功！';
      this.globalService.promptBox.open(msg, () => {
        this.router.navigate(['/main/operation/comment/comment-list']);
      });
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 置顶、取消置顶按钮触发事件
  public onTopClick(status: number) {
    this.commentService.requestUpdateTop(this.comment_id, status).subscribe((e) => {
      const msg = status === 1 ? '置顶成功！' : '取消置顶成功！';
      this.globalService.promptBox.open(msg, () => {
        this.router.navigate(['/main/operation/comment/comment-list']);
      });
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }
}
