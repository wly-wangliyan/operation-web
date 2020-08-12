import { Pipe, PipeTransform } from '@angular/core';

/** 推送人群 */
export const carReviewStatus = {
    1: '待审核',
    2: '已审核',
    3: '被驳回',
};

@Pipe({
    name: 'carReviewStatusPipe'
})
export class CarReviewStatusPipe implements PipeTransform {

    public transform(value: any, args?: any): any {
        if (!value) {
            return '--';
        }
        return carReviewStatus[value];
    }
}
