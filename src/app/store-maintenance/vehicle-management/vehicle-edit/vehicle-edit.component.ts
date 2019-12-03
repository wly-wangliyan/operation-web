import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { BrokerageEntity } from '../../../operational-system/insurance/insurance.service';
import { NzInputDirective } from 'ng-zorro-antd';

@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  styleUrls: ['./vehicle-edit.component.css']
})
export class VehicleEditComponent implements OnInit {

  public paramList: Array<any> = [];
  public pageIndex = 1;
  public noResultText = '数据加载中...';
  public num = 10;
  public editId: string | null;

  @ViewChild(NzInputDirective, { static: false, read: ElementRef }) inputElement: ElementRef;

  @HostListener('window:click', ['$event'])
  handleClick(e: MouseEvent): void {
    if (this.editId && this.inputElement && this.inputElement.nativeElement !== e.target) {
      this.editId = null;
    }
  }

  constructor() { }

  ngOnInit() {
    this.paramList.push({a: 'a', id: 111}, {name: 'b', id: 222});
  }

  public startEdit(id: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.editId = id;
  }
}
