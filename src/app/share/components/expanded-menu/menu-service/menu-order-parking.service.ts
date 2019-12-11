import { Injectable } from '@angular/core';
import { SideMenuItem } from '../menu-ui.model';

@Injectable({
  providedIn: 'root'
})
export class MenuOrderParkingService {

  public routeLinkList: Array<SideMenuItem> = [];
  public menu_icon = true;

  constructor() { }

  /* 预约泊车菜单 */
  public generateMenus_order_parking(): Array<SideMenuItem> {
    this.menu_icon = false;
    this.routeLinkList = [];
    const menusItem: Array<SideMenuItem> = [];
    menusItem.push(this.generateServiceConfigMenu());
    menusItem.push(this.generateOrderMenu());
    return menusItem;
  }

  // 产品配置
  private generateServiceConfigMenu() {
    const systemMenu = new SideMenuItem('产品配置', '/order-parking/service-config');
    systemMenu.icon = '/assets/images/menu_part.png';
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }

  // 订单管理
  private generateOrderMenu() {
    const systemMenu = new SideMenuItem('订单管理', '/order-parking/order-management');
    systemMenu.icon = '/assets/images/menu/menu_order.png';
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }
}
