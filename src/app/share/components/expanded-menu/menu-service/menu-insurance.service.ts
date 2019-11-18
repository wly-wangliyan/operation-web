import { Injectable } from '@angular/core';
import { SideMenuItem } from '../menu-ui.model';

/*保险菜单*/
@Injectable({
  providedIn: 'root'
})
export class MenuInsuranceService {

  public routeLinkList: Array<SideMenuItem> = [];
  public menu_icon = true;

  constructor() { }

  // 保险菜单
  public generateMenus_insurance(): Array<SideMenuItem> {
    this.menu_icon = false;
    this.routeLinkList = [];
    const menusItem: Array<SideMenuItem> = [];
    menusItem.push(this.generateBrokerageMenu());
    menusItem.push(this.generateInsuranceMenu());
    return menusItem;
  }

  // 保险 》经纪公司管理
  private generateBrokerageMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('经纪公司管理', '/main/insurance/brokerage-company-list');
    brokerageMenu.icon = '/assets/images/menu_business.png';
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }

  // 保险 》保险公司管理
  private generateInsuranceMenu(): SideMenuItem {
    const insuranceMenu = new SideMenuItem('保险公司管理', '/main/insurance/insurance-company-list');
    insuranceMenu.icon = '/assets/images/menu_insurance.png';
    this.routeLinkList.push(insuranceMenu);
    return insuranceMenu;
  }
}

