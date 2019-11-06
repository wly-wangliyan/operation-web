import { Injectable } from '@angular/core';
import { environment } from "../../../../../environments/environment";
import { EntityBase } from "../../../../../utils/z-entity";

export class SearchCouponParams extends EntityBase {
    page_size = 45; // 每页条数 默认20
    page_num = 1; // 页码 默认1
}

@Injectable({
    providedIn: 'root'
})
export class CouponJumpHttpService {

    private domain = environment.OPERATION_SERVE;

    constructor() {
    }
}
