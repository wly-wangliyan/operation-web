import { Component, Input, OnInit } from '@angular/core';
import { timer } from 'rxjs/index';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'app-z-preview-video-photo',
    templateUrl: './z-preview-video-photo.component.html',
    styleUrls: ['./z-preview-video-photo.component.css']
})
export class ZPreviewVideoPhotoComponent implements OnInit {

    public isShowPreviewComponent = false;

    public previewVideoAndPhotoList: Array<ZPreviewVideoAndPhotoEntity> = [];

    public currentPreviewVideo: ZPreviewVideoAndPhotoEntity = new ZPreviewVideoAndPhotoEntity();

    public currentPreviewPhoto: ZPreviewVideoAndPhotoEntity = new ZPreviewVideoAndPhotoEntity();

    public isHidePreviewVideo = true;

    @Input()
    public set videoAndPhotoUrls(videoAndPhotoUrls: Array<string>) {
        if (isNullOrUndefined(videoAndPhotoUrls)) {
            return;
        }
        const tempPreviewVideoList: Array<ZPreviewVideoAndPhotoEntity> = [];
        const tempPreviewPhotoList: Array<ZPreviewVideoAndPhotoEntity> = [];
        this.previewVideoAndPhotoList = [];
        videoAndPhotoUrls.forEach((videoAndPhotoUrl, videoAndPhotoUrlIndex) => {
            const tempVideoAndPhotoUrl = new ZPreviewVideoAndPhotoEntity(videoAndPhotoUrl);
            const sourceUrl = tempVideoAndPhotoUrl.sourceUrl;
            const videoUrlType = '.mp4';
            if (videoUrlType === sourceUrl.substr(sourceUrl.length - videoUrlType.length, videoUrlType.length)) {
                tempVideoAndPhotoUrl.isVideo = true;
                tempPreviewVideoList.push(tempVideoAndPhotoUrl);
            } else {
                tempPreviewPhotoList.push(tempVideoAndPhotoUrl);
            }
            if (videoAndPhotoUrlIndex === videoAndPhotoUrls.length - 1) {
                this.isShowPreviewComponent = true;
                this.previewVideoAndPhotoList = tempPreviewVideoList.concat(tempPreviewPhotoList);
                if (this.previewVideoAndPhotoList[0].isVideo) {
                    this.isHidePreviewVideo = false;
                    this.currentPreviewVideo = this.previewVideoAndPhotoList[0];
                } else {
                    this.isHidePreviewVideo = true;
                    this.currentPreviewPhoto = this.previewVideoAndPhotoList[0];
                }
            }
        });
    }

    @Input() public previewContainerWidth = '400';

    @Input() public previewWidth = '400';

    @Input() public previewHeight = '400';

    @Input() public thumbNailWidth = '50';

    @Input() public thumbNailHeight = '50';

    @Input() public isControls = false; // 是否显示控件

    @Input() public isAutoPlay = false; // 视频是否在就绪后马上播放

    constructor() {
    }

    public ngOnInit() {
    }

    // 鼠标进入预览当前缩略图
    public onMouseEnterPreview(previewVideoAndPhoto: ZPreviewVideoAndPhotoEntity) {
        if (previewVideoAndPhoto.isVideo) {
            this.isHidePreviewVideo = false;
            this.currentPreviewVideo = (this.currentPreviewVideo.sourceUrl === previewVideoAndPhoto.sourceUrl) ?
                this.currentPreviewVideo : previewVideoAndPhoto;
        } else {
            this.isHidePreviewVideo = true;
            this.currentPreviewPhoto = new ZPreviewVideoAndPhotoEntity();

            timer().subscribe(() => {
                this.currentPreviewPhoto = previewVideoAndPhoto;
            });
        }
    }
}

export class ZPreviewVideoAndPhotoEntity {
    public isVideo = false;
    public sourceUrl = '';

    constructor(sourceUrl?: string, isVideo: boolean = false) {
        this.sourceUrl = sourceUrl ? sourceUrl : '';
        this.isVideo = isVideo;
    }
}
