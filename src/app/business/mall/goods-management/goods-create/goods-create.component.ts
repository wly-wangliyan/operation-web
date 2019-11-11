import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import { GoodsManagementHttpService } from '../goods-management-http.service';

@Component({
    selector: 'app-goods-create',
    templateUrl: './goods-create.component.html',
    styleUrls: ['./goods-create.component.css']
})
export class GoodsCreateComponent implements OnInit {

    constructor(private routerInfo: ActivatedRoute,
                private router: Router,
                private globalService: GlobalService,
                private goodsManagementHttpService: GoodsManagementHttpService) {
        this.routerInfo.params.subscribe((params: Params) => {
        });
    }

    public ngOnInit() {
    }
}
