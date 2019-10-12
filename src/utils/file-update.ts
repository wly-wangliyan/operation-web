export let FileUpdate = (file: File, storageUrl: string, success, error) => {
  const form = new FormData();
  form.append('file', file);
  // source值为park_data时图片大小不能超过2M，需求是图片大小超过2M时值改为park
  form.append('source', 'park');

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 413) {
        alert('上传资源文件太大，服务器无法保存！');
      } else if (xhr.status === 422) {
        if (error) {
          error(xhr);
        }
      } else if (xhr.status >= 400 && xhr.status <= 499) {
        if (error) {
          error(xhr);
        }
      } else if (xhr.status === 500) {
        if (error) {
          error(xhr);
        }

      } else if (xhr.status === 502) {
        if (error) {
          error(xhr);
        }
      } else if (xhr.status >= 200 && xhr.status <= 204) {
        const source_url = JSON.parse(xhr.responseText).source_url;
        if (success) {
          success(source_url);
        }
      }
    }
  };
  xhr.open('POST', storageUrl);
  xhr.send(form);
};
