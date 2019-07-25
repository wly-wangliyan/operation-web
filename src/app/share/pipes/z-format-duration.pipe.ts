import {Pipe, PipeTransform} from '@angular/core';
import {isNullOrUndefined} from 'util';

/* 格式化一个秒数为时间字符串,单位秒 */
@Pipe({
  name: 'zFormatDuration'
})
export class ZFormatDurationPipe implements PipeTransform {

  public transform(value: any, ignoreSeconds: boolean = false): any {
    let totalSeconds = value;

    if (totalSeconds <= 0) {
      return '0天';
    }

    if (ignoreSeconds) {
      const second = totalSeconds % 3600 % 60;
      if (second !== 0) {
        totalSeconds = totalSeconds - second + 60; // 当秒数不为0时进位(进一分钟)
      }
    }

    const days = Math.floor(Number(totalSeconds / (3600 * 24)));
    const hours = Math.floor(Number(totalSeconds % (3600 * 24) / 3600));
    const minutes = Math.floor(Number(totalSeconds % 3600 / 60));
    const seconds = Math.floor(Number(totalSeconds % 3600 % 60));
    let formatDate = days ? days + '天' : null;
    formatDate = hours ? formatDate + hours + '小时' : formatDate;
    formatDate = minutes ? formatDate + minutes + '分' : formatDate;
    formatDate = seconds ? formatDate + seconds + '秒' : formatDate;

    return isNullOrUndefined(formatDate) ? '--' : formatDate;
  }
}

/* 时长 日时分秒 */
@Pipe({name: 'durationFormatHMS'})
export class DurationFormatHMSPipe implements PipeTransform {
  transform(duration, ignoreSeconds: boolean = false): string {
    let second = Math.floor(Number(duration));
    if (second <= 0) { return '0秒'; }

    if (ignoreSeconds) {
      const second_temp = second % 3600 % 60;
      if (second_temp !== 0) {
        second = second - second_temp + 60; // 当秒数不为0时进位(进一分钟)
      }
    }

    const day = Math.floor(Number(second / (3600 * 24)));
    const hour = Math.floor(Number(second % (3600 * 24) / 3600));
    const m = Math.floor(Number(second % 3600 / 60));
    const s = Math.floor(Number(second % 3600 % 60));
    if (day === 0) {
      if (hour !== 0) {
        if (m !== 0) {
          if (s !== 0) {
            return hour + '小时' + m + '分' + s + '秒';
          } else {
            return hour + '小时' + m + '分';
          }
        } else {
          if (s !== 0) {
            return hour + '小时' + s + '秒';
          } else {
            return hour + '小时';
          }
        }
      } else {
        if (m !== 0) {
          if (s !== 0) {
            return m + '分' + s + '秒';
          } else {
            return m + '分';
          }
        } else {
          if (s !== 0) {
            return s + '秒';
          } else {
            return m + '分';
          }
        }
      }
    } else {
      if (hour !== 0) {
        if (m !== 0) {
          if (s !== 0) {
            return day + '天' + hour + '小时' + m + '分' + s + '秒';
          } else {
            return day + '天' + hour + '小时' + m + '分';
          }
        } else {
          return day + '天' + hour + '小时' + s + '秒';
        }
      } else {
        if (m !== 0) {
          if (s !== 0) {
            return day + '天' + m + '分' + s + '秒';
          } else {
            return day + '天' + m + '分';
          }
        } else {
          if (s !== 0) {
            return day + '天' + s + '秒';
          } else {
            return day + '天';
          }
        }
      }
    }
  }
}
