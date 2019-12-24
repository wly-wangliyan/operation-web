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
    menusItem.push(this.generateBusinessMenu());
    return menusItem;
  }


  // 商城 》产品列表
  private generateGoodsManagementMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('商品管理', '/main/mall/goods-management');
    brokerageMenu.icon = '/assets/images/menu_part.png';
    const subFinanceMenu1 = new SideMenuItem('产品列表', '/main/mall/goods-management/list', brokerageMenu);
    brokerageMenu.children.push(subFinanceMenu1);
    const subFinanceMenu2 = new SideMenuItem('分类管理', '/main/mall/goods-management/classify-list', brokerageMenu);
    brokerageMenu.children.push(subFinanceMenu2);
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }

  // 商城 》产品订单
  private generateGoodsOrderMenu(): SideMenuItem {
    const orderMenu = new SideMenuItem('订单管理', '/main/mall/goods-order');
    orderMenu.icon = '/assets/images/menu_order.png';
    const subFinanceMenu1 = new SideMenuItem('产品订单', '/main/mall/goods-order', orderMenu);
    orderMenu.children.push(subFinanceMenu1);
    this.routeLinkList.push(orderMenu);
    return orderMenu;
  }

  // 商城 》商家列表
  private generateBusinessMenu(): SideMenuItem {
    const orderMenu = new SideMenuItem('商家管理', '/main/mall/goods-business');
    orderMenu.icon = '/assets/images/menu_merchant.png';
    const subFinanceMenu1 = new SideMenuItem('商家列表', '/main/mall/goods-business', orderMenu);
    orderMenu.children.push(subFinanceMenu1);
    this.routeLinkList.push(orderMenu);
    return orderMenu;
  }
}

