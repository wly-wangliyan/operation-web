import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../core/global.service';
import { GoodsManagementHttpService } from '../goods-management-http.service';

@Component({
    selector: 'app-goods-create',
    templateUrl: './goods-create.component.html',
    styleUrls: ['./goods-create.component.css']
})
export class GoodsCreateComponent implements OnInit {

    constructor(private route: ActivatedRoute,
                private router: Router,
                private globalService: GlobalService,
                private goodsManagementHttpService: GoodsManagementHttpService) {
        this.route.paramMap.subscribe(map => {
        });
    }

    public ngOnInit() {
    }
}
