import { environment } from '../environments/environment';

export const initializer: any = {

  user: null,
  startTimeStamp: null, // 首次的服务器时间戳
  isMuchCertificationSuccess: false,

  boot: () => {
    return () => {
      return new Promise((resolve) => {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.withCredentials = true;
        xmlhttp.onreadystatechange = () => {
          if ((xmlhttp.readyState === 4 && xmlhttp.status === 200) || xmlhttp.status === 403) {
            initializer.user = xmlhttp.responseText && JSON.parse(xmlhttp.responseText);
            initializer.startTimeStamp = new Date(xmlhttp.getResponseHeader('date')).getTime() / 1000;
            resolve(null);
          } else {
            // 暂不考虑其他网络错误
          }
        };
        xmlhttp.open('GET', `${environment.OPERATION_SERVE}/user`, true);
        xmlhttp.send();
      });
    };
  },
};
