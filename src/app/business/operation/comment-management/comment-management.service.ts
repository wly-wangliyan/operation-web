import { EventEmitter, Injectable } from '@angular/core';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse } from '@angular/common/http';
import { EntityBase } from '../../../../utils/z-entity';
import { environment } from '../../../../environments/environment';

export class CommentEntity extends EntityBase {
  public comment_id: string = undefined; 	// 	string	评论id
  public work: string = undefined; 	// 	Object	评论业务对象 Work
  public client: string = undefined; 	// 	Object	终端对象 Client
  public object_id: string = undefined; 	// 	string	object_id
  public object_name: string = undefined; 	// 	string	object_name
  public category: number = undefined; // 类别 1用户发起 2系统创建
  public order_id: string = undefined; 	// 	string	订单id
  public status: number = undefined; 	// 	integer	评论状态 1:待审核,2:已通过,3:被驳回
  public is_top: number = undefined; 	// 	integer	是否置顶该评论
  public user_id: string = undefined; 	// 	string	用户id
  public nickname: string = undefined; 	// 	string	用户昵称
  public avatar: string = undefined; 	// 	string	用户头像
  public phone_num: string = undefined; 	// 	string	电话号码
  public comment_content: string = undefined; 	// 	string	评论内容
  public image_urls: string = undefined; 	// 	Array	评论图片url
  public created_time: number = undefined; 	// float 	创建时间
  public updated_time: number = undefined; 	// float 	修改时间
}

export class ClientEntity extends EntityBase {
  public client_id: string = undefined; 	// 	string	终端id
  public client_name: string = undefined; 	// 	string	终端名称 例如:iOS,Android
  public created_time: number = undefined; 	// float 	创建时间
  public updated_time: number = undefined; 	// float 	修改时间
}

export class WorkEntity extends EntityBase {
  public work_id: string = undefined; 	// 	string	业务id
  public work_name: string = undefined; 	// 	string	业务名称 例如:检车线
  public remark: string = undefined; 	// 	string	业务描述
  public created_time: number = undefined; 	// float 	创建时间
  public updated_time: number = undefined; 	// float 	修改时间

  public toEditJson(): any {
    const json = this.json();
    delete json.work_id;
    delete json.created_time;
    delete json.updated_time;
    return json;
  }
}

export class SearchCommentParams extends EntityBase {
  public status: any = ''; 	// 	int 	F 	1:待审核,2:已通过,3:被驳回
  public work_id: string = undefined; 	// 	String 	T 	评论业务id
  public object_name: string = undefined; 	// 	string 	F 	object_name
  public category: any = ''; // 类别
  public is_top: any = ''; 	// 	bool 	F 	是否置顶
  public section: string = undefined; 	// 	string 	F 	操作时间戳区间(小,大) 例:"1560415182.165, 1560415182.265"
  public page_size = 45; // integer	F	每页条数 默认20
  public page_num = 1; // integer	F	页码 默认1
}

// 评论列表
export class CommentLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<CommentEntity> {
    const tempList: Array<CommentEntity> = [];
    results.forEach(res => {
      tempList.push(CommentEntity.Create(res));
    });
    return tempList;
  }
}

// 管理端新增评论
export class AddCommentParams extends EntityBase {
  public work_id: string = undefined; // 业务id
  public object_id: string = undefined; // string	object_id
  public object_name: string = undefined; // string	object_name
  public nickname: string = undefined; // string	用户昵称
  public avatar: string = undefined; // string	用户头像
  public comment_content: string = undefined; // string	评论内容
  public image_urls: string = undefined; // Array	评论图片url
  public created_time: number = undefined; // 评论时间 不大于当前时间
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private COMMENT_SERVE = environment.COMMENT_SERVE;

  constructor(private httpService: HttpService) { }
  /**
   * 请求获取评论列表
   * @param application_id 应用编号
   * @returns Observable<FirstPageIconLinkResponse>
   */
  public requestCommentList(params: SearchCommentParams): Observable<CommentLinkResponse> {
    return this.httpService.get(environment.COMMENT_SERVE + `/comments`,
      params.json()).pipe(map(res => new CommentLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求获取评论列表
   * @param string url linkUrl
   * @returns Observable<CameraLinkResponse>
   */
  public continueCommentList(url: string): Observable<CommentLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new CommentLinkResponse(res)));
  }

  /**
   * 修改评论状态
   * @param comment_id 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestUpdateStatus(comment_id: string, examine_status: number): Observable<HttpResponse<any>> {
    const params = { status: examine_status };
    return this.httpService.patch(environment.COMMENT_SERVE +
      `/comments/${comment_id}/status`, params);
  }

  /**
   * 修改评论置顶状态
   * @param comment_id 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestUpdateTop(comment_id: string, top: number): Observable<HttpResponse<any>> {
    const params = { is_top: top };
    return this.httpService.patch(environment.COMMENT_SERVE + `/comments/${comment_id}/is_top`, params);
  }

  /**
   * 详情
   * @param string comment_id 编号
   * @returns Observable<CommentEntity>
   */
  public requestCommentDetail(comment_id: string): Observable<CommentEntity> {
    return this.httpService.get(environment.COMMENT_SERVE + `/comments/${comment_id}`
    ).pipe(map(res => CommentEntity.Create(res.body)));
  }

  /**
   * 新增评论
   * @param addParams 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestAddCommentData(addParams: AddCommentParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.COMMENT_SERVE}/comments`;
    return this.httpService.post(httpUrl, addParams.json());
  }

  /**
   * 新增配置
   * @param addParams 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestAddSettingData(addParams: WorkEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.COMMENT_SERVE}/works`;
    const param = addParams.toEditJson();
    return this.httpService.post(httpUrl, param);
  }

  /**
   * 编辑配置
   * @param work_id 业务线id
   * @param updateParams 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestUpdateSettingData(work_id: string, updateParams: WorkEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.COMMENT_SERVE}/works/${work_id}`;
    const param = updateParams.toEditJson();
    return this.httpService.put(httpUrl, param);
  }

  /**
   * 请求获取评论配置列表
   * @returns Observable<Array<WorkEntity>>
   */
  public requestCommentSettingListData(): Observable<Array<WorkEntity>> {
    const httpUrl = `${this.COMMENT_SERVE}/works`;
    return this.httpService.get(httpUrl).pipe(map(res => {
      const tempList: Array<WorkEntity> = [];
      res.body.forEach(data => {
        tempList.push(WorkEntity.Create(data));
      });
      return tempList;
    }));
  }

  /**
   * 开启/停用业务线
   * @param work_id 业务线id
   * @param status 状态 1启用 2停用
   * @returns Observable<HttpResponse<any>>
   */
  public requestChangeSettingStatus(work_id: string, status: number): Observable<HttpResponse<any>> {
    const httpUrl = `${this.COMMENT_SERVE}/works/${work_id}/status`;
    const body = { status };
    return this.httpService.patch(httpUrl, body);
  }
}

