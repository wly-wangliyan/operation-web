import { Injectable } from '@angular/core';
import { SideMenuItem } from '../menu-ui.model';

@Injectable({
  providedIn: 'root'
})
export class MenuExemptionService {

  public routeLinkList: Array<SideMenuItem> = [];
  public menu_icon = true;

  constructor() { }

  /* 免检换贴菜单 */
  public generateMenus_exemption(): Array<SideMenuItem> {
    this.menu_icon = false;
    this.routeLinkList = [];
    const menusItem: Array<SideMenuItem> = [];
    menusItem.push(this.generateServiceConfigMenu());
    menusItem.push(this.generateOrderMenu());
    return menusItem;
  }

  // 服务配置
  private generateServiceConfigMenu() {
    const systemMenu = new SideMenuItem('服务配置', '/exemption/service-config');
    systemMenu.icon = '/assets/images/menu/menu_other.png';
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }

  // 订单管理
  private generateOrderMenu() {
    const systemMenu = new SideMenuItem('订单管理', '/exemption/order-management');
    systemMenu.icon = '/assets/images/menu/menu_order.png';
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }
}
