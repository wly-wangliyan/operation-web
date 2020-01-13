import { differenceInCalendarDays } from 'date-fns';

export class DisabledTimeHelper {
  // 开始时间的禁用部分
  public static disabledStartTime(startValue: Date, endValue: any): boolean {
    if (differenceInCalendarDays(startValue, new Date()) > 0) {
      return true;
    } else if (!startValue || !endValue) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(endValue).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }
  // 结束时间的禁用部分
  public static disabledEndTime(endValue: Date, startValue: any): boolean {
    if (differenceInCalendarDays(endValue, new Date()) > 0) {
      return true;
    } else if (!endValue || !startValue) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(startValue).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // (未来)开始时间的禁用部分
  public static disabledFutureStartTime(startValue: Date, endValue: any): boolean {
    if (differenceInCalendarDays(startValue, new Date()) < 0) {
      return true;
    } else if (!startValue || !endValue) {
      return false;
    } else if (new Date(startValue).setHours(0, 0, 0, 0) > new Date(endValue).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  // (未来)结束时间的禁用部分
  public static disabledFutureEndTime(endValue: Date, startValue: any): boolean {
    if (differenceInCalendarDays(endValue, new Date()) < 0) {
      return true;
    } else if (!endValue || !startValue) {
      return false;
    } else if (new Date(endValue).setHours(0, 0, 0, 0) < new Date(startValue).setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }
}
