import { Injectable } from '@angular/core';
import { SideMenuItem } from '../menu-ui.model';

/*商城菜单*/
@Injectable({
  providedIn: 'root'
})
export class MenuMallService {

  public routeLinkList: Array<SideMenuItem> = [];
  public menu_icon = true;

  constructor() { }

  // 商城菜单
  public generateMenus_mall(): Array<SideMenuItem> {
    this.menu_icon = false;
    this.routeLinkList = [];
    const menusItem: Array<SideMenuItem> = [];
    menusItem.push(this.generateGoodsManagementMenu());
    menusItem.push(this.generateGoodsOrderMenu());
    return menusItem;
  }

  // 商城 》产品列表
  private generateGoodsManagementMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('产品列表', '/main/mall/goods-management');
    brokerageMenu.icon = '/assets/images/menu_part.png';
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }

  // 商城 》产品订单
  private generateGoodsOrderMenu(): SideMenuItem {
    const orderMenu = new SideMenuItem('产品订单', '/main/mall/goods-order');
    orderMenu.icon = '/assets/images/menu_order.png';
    this.routeLinkList.push(orderMenu);
    return orderMenu;
  }
}

