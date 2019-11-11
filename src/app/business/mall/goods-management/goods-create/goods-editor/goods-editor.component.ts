import { Component, OnInit } from '@angular/core';
import { CommodityWriteServiceImportViewModel } from '../../goods.model';
import { GoodsManagementHttpService } from '../../goods-management-http.service';

@Component({
    selector: 'app-goods-editor',
    templateUrl: './goods-editor.component.html',
    styleUrls: ['./goods-editor.component.css']
})
export class GoodsEditorComponent implements OnInit {

    public commodityImportViewModel: CommodityWriteServiceImportViewModel = new CommodityWriteServiceImportViewModel();

    public uploadImg: string;

    public flag = 0;

    public isGoodsEditorChange = false;

    constructor(private goodsManagementHttpService: GoodsManagementHttpService) {
    }

    public ngOnInit() {
        setTimeout(() => {
            CKEDITOR.replace('goodsEditor');
            CKEDITOR.on('instanceReady', event => {
                event.editor.on('change', () => {
                    this.isGoodsEditorChange = true;
                });
            });
        }, 0);
    }

    // 取消上传图片
    public cancelUpload() {
        this.clearUploadImgInfo();
    }

    // 确认上传图片
    public confirmUpload() {
        if (this.commodityImportViewModel.file) {
            this.goodsManagementHttpService.requestUploadPicture(this.commodityImportViewModel.file).subscribe(results => {
                if (results.sourceUrl) {
                    this.uploadImg = results.sourceUrl;
                    this.commodityImportViewModel.uploadImg = true;
                    this.commodityImportViewModel.initImportData();
                    $('#GoodsUploadModal').modal('hide');
                    if (this.commodityImportViewModel.uploadImg) {
                        let str: string;
                        // 图片Width > 350 百分之百显示
                        const img = new Image();
                        img.src = this.uploadImg;
                        img.onload = () => {
                            //  默认按比例压缩
                            let w = img.width;
                            if (w > 350) {
                                this.flag = 1;
                            } else {
                                this.flag = 0;
                                w = w;
                            }
                            if (this.flag === 1) {
                                str = ` <img src=' ${this.uploadImg} ' style='width:100%' /> `;
                            } else {
                                str = ` <img src=' ${this.uploadImg} '/> `;
                            }
                            if (this.uploadImg) {
                                CKEDITOR.instances.goodsEditor.insertHtml(str);
                            }
                        };
                    }
                }
            }, err => {
                this.commodityImportViewModel.uploadImg = false;
            });
        } else {
            this.commodityImportViewModel.uploadImg = false;
        }
        this.commodityImportViewModel.uploadImg = false;
    }

    // 关闭上传
    public closeUpload() {
        this.clearUploadImgInfo();
    }

    // 清空上传图片信息
    private clearUploadImgInfo() {
        this.commodityImportViewModel.initImportData();
        this.commodityImportViewModel.file = '';
        this.uploadImg = '';
        this.commodityImportViewModel.uploadImg = false;
        this.commodityImportViewModel.hasErrorTip = false;
    }
}


