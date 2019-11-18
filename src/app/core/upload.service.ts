import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/index';
import { isNullOrUndefined } from 'util';
import { FileUpdate } from '../../utils/file-update';

export interface UploadConfig {
  img_config?: {
    url: string;
    source?: string;
    reportProcess?: boolean;
  };
  video_config?: {
    url: string;
    source?: string;
    reportProcess?: boolean;
  };
}

// 提供服务的数据源配置信息
export const UPLOAD_TOKEN = new InjectionToken<UploadConfig>('upload');

@Injectable()
export class UploadService {
  constructor(@Optional() @Inject(UPLOAD_TOKEN) private config: UploadConfig, private httpClient: HttpClient) {
    if (isNullOrUndefined(config)) {
      console.error('config is undefined,you can define token yourself.');
    }
  }
  private imageDomain: string = environment.STORAGE_DOMAIN;

  /**
   * 请求上传文件
   * @param file 文件内容
   * @param uploadType 上传文件类型
   */
  public requestUpload(file: any, uploadType: string = 'img'): Observable<HttpEvent<any>> {
    if (!this.config) {
      console.error('config is undefined,you can not use this function.you can define token yourself or use anther method to implement. by zwl');
      return;
    }
    const uploadConfig = (uploadType === 'img') ? this.config.img_config : this.config.video_config;
    const formData = new FormData();
    formData.append('file', file);
    if (uploadConfig.source) {
      formData.append('source', uploadConfig.source);
    }
    const request = new HttpRequest('POST', uploadConfig.url, formData, {
      withCredentials: true,
      reportProgress: uploadConfig.reportProcess
    });
    return this.httpClient.request(request);
  }

  /**
   * 请求上传文件
   * @param file 文件
   * @param url 服务器地址
   * @param reportProcess 是否显示进度
   * @param source 数据源
   */
  public requestOriginUpload(file: any, url: string, reportProcess: boolean = false, source?: string): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);
    if (source) {
      formData.append('source', source);
    }
    const request = new HttpRequest('POST', url, formData, {
      withCredentials: true,
      reportProgress: reportProcess
    });
    return this.httpClient.request(request);
  }


  /**
   * 上传图片
   * @param file
   * @returns {any}
   */
  public requestUploadPicture(file: any): Observable<any> {
    const url = this.imageDomain + `/storages/images`;
    return Observable.create(observer => {
      FileUpdate(file, url, (sourceUrl) => {
        observer.next({ sourceUrl });
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });
  }
}


