import { Component, Input, OnInit } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { timer } from "rxjs/index";

@Component({
    selector: 'app-z-preview-video-photo',
    templateUrl: './z-preview-video-photo.component.html',
    styleUrls: ['./z-preview-video-photo.component.css']
})
export class ZPreviewVideoPhotoComponent implements OnInit {

    public isShowPreviewComponent = false;

    public currentPreviewIndex = 0;

    public previewVideoAndPhotoList: Array<ZPreviewVideoAndPhotoEntity> = [];

    public currentPreviewVideo: ZPreviewVideoAndPhotoEntity = new ZPreviewVideoAndPhotoEntity();

    public currentPreviewPhoto: ZPreviewVideoAndPhotoEntity = new ZPreviewVideoAndPhotoEntity();

    public isHidePreviewVideo = true;

    public get isHidePlayIcon(): boolean {
        if (this.isAutoPlay || ($('#preview-video') && !$('#preview-video').hasClass('pause'))) {
            return false;
        }
        return true;
    };

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

    @Input() public thumbNailWidth = '60';

    @Input() public thumbNailHeight = '60';

    @Input() public isControls = false; // 是否显示控件

    @Input() public isDisablePictureInPicture = false; // 是否禁止显示画中画控件

    @Input() public isAutoPlay = false; // 视频是否在就绪后马上播放

    constructor() {
    }

    public ngOnInit() {
    }

    // 预览缩略图
    public onPreviewThumbNail(previewIndex: number) {
        $('.thumb-nail-container').children().removeClass('selected-thumb-nail');

        timer(0).subscribe(() => {
            $('.thumb-nail-container').children().eq(previewIndex).addClass('selected-thumb-nail');
            const currentSelectPreviewVideoAndPhoto = this.previewVideoAndPhotoList[previewIndex];
            if (currentSelectPreviewVideoAndPhoto.isVideo) {
                this.isHidePreviewVideo = false;
                this.currentPreviewVideo = (this.currentPreviewVideo.sourceUrl === currentSelectPreviewVideoAndPhoto.sourceUrl) ?
                    this.currentPreviewVideo : currentSelectPreviewVideoAndPhoto;
            } else {
                this.isHidePreviewVideo = true;
                this.currentPreviewPhoto = (this.currentPreviewPhoto.sourceUrl === currentSelectPreviewVideoAndPhoto.sourceUrl) ?
                    this.currentPreviewPhoto : currentSelectPreviewVideoAndPhoto;
            }
            if ((previewIndex < this.currentPreviewIndex) && (this.currentPreviewIndex > 0)) {
                this.currentPreviewIndex = previewIndex--;
            } else if ((previewIndex > this.currentPreviewIndex) && (this.currentPreviewIndex < this.previewVideoAndPhotoList.length - 1)) {
                this.currentPreviewIndex = previewIndex++;
            }
        });
    }

    // 点击播放/暂停视频播放
    public onPlayPreviewVideo() {
        $('#preview-video').trigger('play');
        if ($('#preview-video').hasClass('pause')) {
            $('#preview-video').removeClass('pause');
            $('#preview-video').addClass('play');
        } else {
            $('#preview-video').removeClass('play');
            $('#preview-video').addClass('pause');
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
