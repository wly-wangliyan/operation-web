import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonRuleEntity } from '../../integral-rights-http.service';
import { GlobalService } from '../../../../../../core/global.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-limit-config-modal',
  templateUrl: './limit-config-modal.component.html',
  styleUrls: ['./limit-config-modal.component.less']
})
export class LimitConfigModalComponent implements OnInit {
  public limit_type: number;
  public ruleData: CommonRuleEntity = new CommonRuleEntity();
  private isSaving = false;

  @ViewChild('configModal', { static: true }) private configModal: ElementRef;
  constructor(private globalService: GlobalService) { }

  ngOnInit() {
  }

  public open(data: CommonRuleEntity) {
    this.ruleData = new CommonRuleEntity();
    // this.limit_type =
    timer(0).subscribe(() => $(this.configModal.nativeElement).modal());
  }

  public onModelChange(): void {

  }

  public onCheckClick(): void {

    if (this.isSaving) { return; }


  }

}
