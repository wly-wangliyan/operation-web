import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { LinkResponse, HttpService } from 'src/app/core/http.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

export class TopicSearchParams extends EntityBase {
    section = '';	 // F	话题创建时间范围。`[start]:[end]`，开、闭区间，start、end是一个double类型的时间戳，都可以不传
    // category: string = undefined;	// F	话题分类, 不传默认所有 例: 'PK'
    page_size = 45;	// F	每页条数 默认：15
    page_num = 1;	// F	页码 默认: 1
    title = '';	// F	话题标题 模糊查询
}

export class StatisticEntity extends EntityBase {
    visit_num: number = undefined;	// 访问次数
    visitors_num: number = undefined;	// 访问人数
    participants_num: number = undefined;	// 参与人数
}

export class TopicEntity extends EntityBase {
    topic_id: string = undefined;	// 话题id
    title: string = undefined;	// 标题
    subtitle: string = undefined;	// 副标题
    content: string = undefined;	// 内容
    category: string = undefined;	// 话题分类
    start_time: number = undefined;	// 有效期开始时间
    end_time: number = undefined;	// 有效期结束时间
    author: string = undefined;	// 作者
    status: number = undefined;	// 可用状态 0 不可用, 1 可用 默认为0
    created_time: number = undefined;	// 创建时间
    updated_time: number = undefined;	// 更新时间
    remark: string = undefined;	// 备注
    statistic: StatisticEntity = new StatisticEntity(); // 访问统计
}

export class ViewpointsEntity extends EntityBase {
    name: string = undefined;	// T	观点名称
    priority: number = undefined;	// T	优先级
    remark: string = undefined;	// F	备注
    viewpoint_id: string = undefined; // 观点ID

    constructor(name: string, priority: number) {
        super();
        this.name = name;
        this.priority = priority;
    }
}
export class EditTopicParams extends EntityBase {
    title: string = undefined; // T	话题标题
    subtitle: string = undefined;	// F	话题副标题
    content: string = undefined; // T	话题内容
    start_time: number = undefined;	// False	有效期开始时间
    end_time: number = undefined;	// False	有效期结束时间
    remark: string = undefined; // F	备注
    viewpoints: Array<ViewpointsEntity> = [];	// array	F	观点信息
}

export class ViewpointsListEntity extends EntityBase {
    viewpoint_id: string = undefined;	// 观点ID
    topic_id: string = undefined;	// 话题id
    name: string = undefined;	// 观点名称
    sum: number = undefined;	// 观点计数
    created_time: number = undefined;	// 创建时间
    updated_time: number = undefined;	// 更新时间
    remark: string = undefined;	// 备注
}

export class ViewpointsSearchParams extends EntityBase {
    topic_id = '';	// F	话题id
    section = ''; // F	观点创建时间范围。`[start]:[end]`，开、闭区间，start、end是一个double类型的时间戳，都可以不传
    page_size = 15;	// F	每页条数 默认：15
    page_num = 1;	// F	页码 默认: 1
}

export class CommentSearchParams extends EntityBase {
    status = '';	// F	1:待审核,2:已通过,3:被驳回
    work_id = '';	// T	评论业务id
    object_name = '';	// F	object_name
    object_id: string = undefined;	// F	object_id
    section = '';	// F 操作时间戳区间(小, 大) 例: "1560415182.165, 1560415182.265"
    page_size = 15;	// F 每页限制
    page_num = 1; // F页码
}

export class CommentEntity extends EntityBase {
    comment_id: string = undefined;	// 评论id
    object_id: string = undefined;	// object_id
    object_name: string = undefined; // object_name
    category: number = undefined; // 类别 1用户发起 2系统创建
    order_id: string = undefined;	// 订单id
    // status: integer	评论状态 1: 待审核, 2: 已通过, 3: 被驳回
    standpoint: string = undefined;	// 所持观点
    // is_top: Integer	是否置顶该评论 1置顶 2取消置顶
    user_id: string = undefined; // 用户id
    nickname: string = undefined;	// 用户昵称
    avatar: string = undefined;	// 用户头像
    phone_num: string = undefined;	// 电话号码
    comment_content: string = undefined; // 评论内容
    image_urls: string = undefined;	// 评论图片url
    updated_time: number = undefined;	// 更新时间
    created_time: number = undefined;	// 创建时间
}


@Injectable({
    providedIn: 'root'
})
export class TopicManagementHttpService {

    private domain = environment.TOPIC_DOMAIN;
    private commentDomain = environment.COMMENT_SERVE;

    constructor(
        private service: HttpService
    ) {
    }

    /**
     * 获取话题列表
     * @param searchParams 查询参数
     */
    public requestTopicListData(searchParams: TopicSearchParams): Observable<TopicListLinkResponse> {
        const url = `${this.domain}/admin/topics`;
        return this.service.get(url, searchParams).pipe(map(res => new TopicListLinkResponse(res)));
    }

    public continueRequestTopicListData(url: string): Observable<TopicListLinkResponse> {
        return this.service.get(url).pipe(map(res => new TopicListLinkResponse(res)));
    }

    /**
     * 删除话题
     * @param topic_id id
     */
    public requestDelTopic(topic_id: string) {
        const url = `${this.domain}/admin/topics/${topic_id}`;
        return this.service.delete(url);
    }

    /**
     * 根据话题id获取话题
     * @param topic_id id
     */
    public requestViewTopic(topic_id: string): Observable<TopicEntity> {
        const url = `${this.domain}/admin/topics/${topic_id}`;
        return this.service.get(url).pipe(map(res => TopicEntity.Create(res.body)));
    }

    /** 添加话题 */
    public addTopic(topicParams: EditTopicParams) {
        const url = `${this.domain}/admin/topics`;
        return this.service.post(url, topicParams);
    }

    /**  修改话题 */
    public requestEditTopic(topic_id: string, params: EditTopicParams) {
        const url = `${this.domain}/admin/topics/${topic_id}`;
        return this.service.put(url, params);
    }

    /** 修改话题状态 */
    public changeTopicStatus(topic_id: string, status: number) {
        const url = `${this.domain}/admin/topics/${topic_id}/status`;
        const body = { status };
        return this.service.patch(url, body);
    }

    /** 获取观点列表 */
    public requestViewpointList(searchParams: ViewpointsSearchParams): Observable<ViewpointsLinkResponse> {
        const url = `${this.domain}/admin/viewpoints`;
        return this.service.get(url, searchParams).pipe(map(res => new ViewpointsLinkResponse(res)));
    }

    /** 获取评论列表 */
    public requestCommentList(searchParams: CommentSearchParams): Observable<CommentLinkResponse> {
        const url = `${this.commentDomain}/comments`;
        return this.service.get(url, searchParams).pipe(map(res => new CommentLinkResponse(res)));
    }
}


export class TopicListLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<TopicEntity> {
        return results.map(item => TopicEntity.Create(item));
    }
}

export class ViewpointsLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<ViewpointsListEntity> {
        return results.map(item => ViewpointsListEntity.Create(item));
    }
}

export class CommentLinkResponse extends LinkResponse {
    public generateEntityData(results: Array<any>): Array<CommentEntity> {
        return results.map(item => CommentEntity.Create(item));
    }
}
