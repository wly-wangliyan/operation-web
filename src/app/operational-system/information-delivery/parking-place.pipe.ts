import { Pipe, PipeTransform } from '@angular/core';

const ParkingPlaceType = {
    1: '地上露天车位',
    2: '地下车库',
    3: '地上车库',
};

@Pipe({
    name: 'parkingPlaceType'
})
export class ParkingPlacePipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        return ParkingPlaceType[value];
    }

}


const RentType = {
    1: '元/月',
    2: '元/㎡/元',
    3: '万元',
};

@Pipe({
    name: 'rentType'
})
export class RentTypePipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        return RentType[value] || '面议';
    }

}
