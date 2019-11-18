import { Injectable } from '@angular/core';
import { SideMenuItem } from '../menu-ui.model';

/*票务菜单*/
@Injectable({
  providedIn: 'root'
})
export class MenuTicketService {

  public routeLinkList: Array<SideMenuItem> = [];
  public menu_icon = true;

  constructor() { }

  // 票务菜单
  public generateMenus_ticket(): Array<SideMenuItem> {
    this.menu_icon = false;
    this.routeLinkList = [];
    const menusItem: Array<SideMenuItem> = [];
    menusItem.push(this.generateTicketProductMenu());
    menusItem.push(this.generateTicketOrderMenu());
    menusItem.push(this.generateTicketFinanceMenu());
    return menusItem;
  }

  // 票务 》产品管理
  private generateTicketProductMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('产品管理', '/main/ticket/product-management');
    brokerageMenu.icon = '/assets/images/menu_part.png';
    const subFinanceMenu1 = new SideMenuItem('产品列表', '/main/ticket/product-management', brokerageMenu);
    brokerageMenu.children.push(subFinanceMenu1);
    const subFinanceMenu2 = new SideMenuItem('标签管理', '/main/ticket/product-management/label-list', brokerageMenu);
    brokerageMenu.children.push(subFinanceMenu2);
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }

  // 票务 》订单管理
  private generateTicketOrderMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('订单管理', '/main/ticket/order-management');
    brokerageMenu.icon = '/assets/images/menu_order.png';
    const subFinanceMenu1 = new SideMenuItem('产品订单', '/main/ticket/order-management', brokerageMenu);
    brokerageMenu.children.push(subFinanceMenu1);
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }

  // 票务 》财务管理
  private generateTicketFinanceMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('财务管理', '/main/ticket/finance-management');
    brokerageMenu.icon = '/assets/images/menu_pay.png';
    const subFinanceMenu1 = new SideMenuItem('支付设置', '/main/ticket/finance-management', brokerageMenu);
    brokerageMenu.children.push(subFinanceMenu1);
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }
}

