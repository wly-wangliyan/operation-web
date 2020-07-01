import { Component, OnInit } from '@angular/core';
import { CommonRulesComponent } from './common-rules/common-rules.component';
import { CustomRulesComponent } from './custom-rules/custom-rules.component';

@Component({
  selector: 'app-integral-rights',
  templateUrl: './integral-rights.component.html',
  styleUrls: ['./integral-rights.component.css', '../../../../../assets/less/tab-bar-list.less']
})
export class IntegralRightsComponent {

  public currentComponent = 'CommonRulesComponent'; // 流量与填充率公用一个

  public onNavigatedToCommonRulesClick() {
    if (this.currentComponent === 'CommonRulesComponent') {
      return;
    }
    this.currentComponent = 'CommonRulesComponent';
  }

  public onNavigatedToCustomRulesClick() {
    if (this.currentComponent === 'CustomRulesComponent') {
      return;
    }
    this.currentComponent = 'CustomRulesComponent';
  }

  /**
   * 当前激活的路由组件
   * @param component 组件类型
   */
  public onActivate(component: any) {
    if (component instanceof CommonRulesComponent) {
      this.onNavigatedToCommonRulesClick();
    } else if (component instanceof CustomRulesComponent) {
      this.onNavigatedToCustomRulesClick();
    }
  }

}
