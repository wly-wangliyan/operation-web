/**
 * Created by zhoulihan on 16-8-23.
 */

import {environment} from '../environments/environment';
import { LocalStorageProvider } from '../app/share/localstorage-provider';

export let file_import = (file, path, success, error) => {
  const domain = environment.OPERATION_SERVE;
  const form = new FormData();
  for (const param in file) {
    if (file.hasOwnProperty(param)) {
      form.append(param, file[param]);
    }
  }
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.upload.addEventListener('progress', (data) => {
    // 上传进度
  });
  xhr.addEventListener('load', (data) => {

  });
  xhr.addEventListener('error', (data) => {
    // 上传失败
  });
  xhr.addEventListener('abort', (data) => {
    // 中断上传
  });
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 413) {
        alert('上传资源文件太大，服务器无法保存！');
      } else if (xhr.status === 422) {
        error && error(xhr);
        // alert('参数错误，可能文件格式错误！');
      } else if (xhr.status >= 400 && xhr.status <= 499) {
        // alert('文件格式错误!');
        error && error(xhr);
      } else if (xhr.status === 500) {
        error && error(xhr);

      } else if (xhr.status === 502) {
        error && error(xhr);
      } else if (xhr.status >= 200 && xhr.status <= 204) {
        success && success(xhr);
      } else {
        // 上传成功
        error && error(xhr);
        // var source_url = JSON.parse(xhr.responseText).source_url;
      }
    }
  };
  xhr.open('POST', `${domain}${path}`);
  xhr.setRequestHeader('Authorization', 'token ' + LocalStorageProvider.Instance.get(LocalStorageProvider.AccessToken));
  xhr.send(form);
};
