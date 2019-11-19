import { environment } from '../environments/environment';

export const initializer: any = {

    user: null,
    startTimeStamp: null, // 首次的服务器时间戳
    isMuchCertificationSuccess: false,

    boot: () => {
        return () => {
            return new Promise((resolve) => {
                // 不返回则未启动
                const header = {
                    xhrFields: {
                        withCredentials: true
                    }
                };
                $.ajax(`${environment.OPERATION_SERVE}/user`, header).done((userData, status, xhr) => {
                    initializer.user = userData;
                    initializer.startTimeStamp = new Date(xhr.getResponseHeader('date')).getTime() / 1000;
                    resolve(null);
                }).fail(err => {
                    if (err.status === 403) {
                        resolve(null);
                    } else {
                        // 暂不考虑其他网络错误
                    }
                });
            });
        };
    },
};
