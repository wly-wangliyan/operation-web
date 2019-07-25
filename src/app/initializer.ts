import {environment} from '../environments/environment';
import { LocalStorageProvider } from './share/localstorage-provider';

/**
 * Created by zack on 12/5/17.
 */
export const initializer: any = {

  user: null,
  startTimeStamp: null, // 首次的服务器时间戳
  isMuchCertificationSuccess: false,

  boot: () => {
    return () => {
      return new Promise((resolve) => {
        // 不返回则未启动
        const url = `${environment.CAMERA_MONITOR_DEPLOYMENT_SERVE}/user`;
        const header = {
          xhrFields: {
            withCredentials: true
          }
        };
        $.ajax(
          {
            url,
            headers: {
              Authorization: 'token ' + LocalStorageProvider.Instance.get(LocalStorageProvider.AccessToken)
            }
          }, header).done((userData, status, xhr) => {
          initializer.user = userData;
          initializer.startTimeStamp = new Date(xhr.getResponseHeader('date')).getTime() / 1000;

          resolve(null);
        }).fail(err => {
          if (err.status === 403) {
            resolve(null);
          } else {
            // 网络错误怎么办？不考虑了。。。by zwl 2017.8.17
          }
        });
      });
    };
  },
};
