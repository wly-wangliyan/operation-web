import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {

  public productParams = []; // 产品 新建/编辑参数

  public productErrMsg = ''; // 错误信息

  constructor() { }

  ngOnInit() {
  }

}
