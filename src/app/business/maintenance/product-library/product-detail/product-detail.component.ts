import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  public base_title = '查看';

  public title = this.base_title;

  constructor() { }

  ngOnInit() {
  }

}
