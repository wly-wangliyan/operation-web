import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Optional,
    Output,
    QueryList,
    Renderer2,
    ViewChildren
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { isNullOrUndefined } from 'util';
import { UploadService } from '../../../core/upload.service';
import { Observable, timer } from "rxjs/index";
import { HttpEventType, HttpResponse } from "@angular/common/http";

@Component({
    selector: 'app-z-video-select',
    templateUrl: './z-video-select.component.html',
    styleUrls: ['./z-video-select.component.css']
})
export class ZVideoSelectComponent implements OnInit {

    public videoList: Array<ZVideoEntity> = [];

    public get transformLineHeight(): string {
        return (Number(this.videoHeight) - 2).toString();
    }

    private videoItem: ZVideoEntity = new ZVideoEntity();

    private fileElement: any;

    private isValidVideo = true;

    private _dirty = false;

    public get dirty(): boolean {
        return this._dirty;
    }

    @Input() public maxLength = 1;  // 视频可添加最多个数

    @Input() public limitVideoSize = 20; // 限制上传视频大小，默认为20M

    @Input() public file_id = 'file';

    @Input()
    public set videoUrls(videoUrls: Array<string>) {
        if (isNullOrUndefined(videoUrls)) {
            return;
        }
        this.videoList = [];
        videoUrls.forEach(videoUrl => {
            this.videoList.push(new ZVideoEntity(videoUrl));
        });
    }

    @Input() public videoWidth = '88';

    @Input() public videoHeight = '88';

    @Input() public videoShowWidth = null;

    @Input() public videoAddHeight = null;

    @Input() public hasDeleteVideo = false;

    @Input() public hasAddVideo = false;

    @Input() public isControls = false; // 是否显示控件

    @Input() public isDisablePictureInPicture = false; // 是否禁止显示画中画控件

    @Input() public isAutoPlay = false; // 视频是否在就绪后马上播放

    @Output() public selectedVideoChange = new EventEmitter(); // 选择视频格式错误

    @ViewChildren('videoProgressBgList') public videoProgressBgList: QueryList<ElementRef>;

    @ViewChildren('videoProgressBarList') public videoProgressBarList: QueryList<ElementRef>; // 进度条

    constructor(@Optional() private uploadService: UploadService, private sanitizer: DomSanitizer, private renderer2: Renderer2) {
    }

    public ngOnInit() {
        this.hasDeleteVideo = this.hasDeleteVideo;
        this.hasAddVideo = this.hasAddVideo;
        this.videoAddHeight = this.videoAddHeight ? this.videoAddHeight : this.videoHeight;
    }

    /**
     * 选择本地视频文件
     * @param event
     * @param fileElement 选择文件的控件，使用后需要手动清空
     */
    public selectVideo(event: any, fileElement: any) {
        const files = event.target.files;
        if (files.length > 0) {
            const videoItemList: Array<ZVideoEntity> = [];
            const videoUrl = window.URL.createObjectURL(files[0]);
            this.videoItem = new ZVideoEntity();
            this._dirty = true;
            this.fileElement = fileElement;
            this.videoItem.sourceFile = files[0];
            // 将本地视频文件转为安全地址
            this.videoItem.transformSafeUrl = this.sanitizer.bypassSecurityTrustUrl(videoUrl);
            videoItemList.push(this.videoItem);
            // 检查选择视频是否是有效视频
            this.validateVideo(videoItemList);
            if (this.isValidVideo) {
                this.formatVideoInfo();
            }
        }
    }

    // 删除选择视频
    public deleteVideo(index: any) {
        this._dirty = true;
        this.videoList.splice(index, 1);
        // 检查选择视频是否是有效视频
        this.validateVideo(this.videoList);
    }

    // 上传视频
    public uploadVideo(): Observable<any> {
        if (isNullOrUndefined(this.uploadService)) {
            throw new Error('UploadService is not provided');
        }
        return Observable.create(observer => {
            let count = 0;
            const totalCount = this.videoList.length;
            let recordErrors = null;
            // 同步结果返回
            const completeProcess = (hasVideo: boolean = true) => {
                if (hasVideo) {
                    count++;
                }
                if (count !== totalCount) {
                    return;
                }
                // 添加延迟优化显示效果
                timer(1000).subscribe(() => {
                    if (recordErrors) {
                        observer.error(recordErrors);
                    } else {
                        observer.next();
                    }
                    observer.complete();
                });
            };
            if (this.videoList.length > 0) {
                const videoProcessBgArray = this.videoProgressBgList.toArray();
                const videoProcessBarArray = this.videoProgressBarList.toArray();
                this.videoList.forEach((videoEntity, index) => {
                    if (videoEntity.sourceFile) {
                        const curProcessBg = videoProcessBgArray[index];
                        const curProcessBar = videoProcessBarArray[index];
                        this.uploadService.requestUpload(videoEntity.sourceFile, 'video').subscribe(event => {
                            /**
                             * 上传图片时根据上传进度显示进度条
                             */
                            if (event.type === HttpEventType.UploadProgress) {
                                // 处理进度状态
                                const percentDone = Math.round(100 * event.loaded / event.total);
                                this.renderer2.setStyle(curProcessBg.nativeElement, 'display', 'block');
                                this.renderer2.setStyle(curProcessBar.nativeElement, 'width', percentDone + '%');
                                if (percentDone === 100) {
                                    // 添加延迟优化显示效果
                                    timer(1000).subscribe(() => {
                                        this.renderer2.setStyle(curProcessBg.nativeElement, 'display', 'none');
                                    });
                                }
                            } else if (event instanceof HttpResponse) {
                                // 结果返回，处理结果
                                videoEntity.sourceUrl = event.body.source_url;
                                videoEntity.sourceFile = null;
                                console.log(event.body.source_url);
                                completeProcess();
                            }
                        }, err => {
                            recordErrors = err;
                            completeProcess();
                        });
                    } else {
                        completeProcess();
                    }
                });
            } else {
                completeProcess(false);
            }
        });
    }

    // 检查选择视频是否是有效视频
    private validateVideo(videoList: Array<any>) {
        if (videoList.length > 0) {
            for (const index in videoList) {
                if (videoList.hasOwnProperty(index)) {
                    const videoReg = /(mp4)$/;
                    this.isValidVideo = true;

                    if (videoList[index].sourceFile) {
                        const file = videoList[index].sourceFile;
                        const type = file.type.split('/')[1];

                        if (isNullOrUndefined(type) || !videoReg.test(type.toLowerCase())) {
                            this.isValidVideo = false;
                            this.selectedVideoChange.emit('type_error');
                            return;
                        }
                        if (file.size > (this.limitVideoSize * 1024 * 1024)) {
                            this.isValidVideo = false;
                            this.selectedVideoChange.emit('size_over');
                            return;
                        }
                        this.selectedVideoChange.emit('');
                    } else {
                        this.selectedVideoChange.emit('');
                    }
                }
            }
        } else {
            this.selectedVideoChange.emit('');
        }
    }

    // 格式化视频信息
    private formatVideoInfo() {
        this.videoList.push(this.videoItem);
        // 检查选择视频是否是有效视频
        this.validateVideo(this.videoList);
        $(this.fileElement).val('');
    }
}

export class ZVideoEntity {
    public sourceUrl: string;
    public sourceFile: any;
    public transformSafeUrl: any;

    constructor(sourceUrl?: string) {
        this.sourceUrl = sourceUrl;
    }

    public get showUrl(): string {
        return this.sourceUrl ? this.sourceUrl : this.transformSafeUrl;
    }
}
