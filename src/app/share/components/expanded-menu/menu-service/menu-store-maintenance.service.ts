import { Injectable } from '@angular/core';
import { SideMenuItem } from '../menu-ui.model';

/*商城菜单*/
@Injectable({
  providedIn: 'root'
})
export class MenuStoreMaintenanceService {

  public routeLinkList: Array<SideMenuItem> = [];

  public menu_icon = true;

  constructor() {
  }

  // 门店保养菜单
  public generateMenus_store_maintenance(): Array<SideMenuItem> {
    this.menu_icon = false;
    this.routeLinkList = [];
    const menusItem: Array<SideMenuItem> = [];
    // menusItem.push(this.generatePartsManagementMenu());
    menusItem.push(this.generateOrderSettlementMenu());
    menusItem.push(this.generateBusinessManagementMenu());
    // menusItem.push(this.generateOtherMenu());
    return menusItem;
  }

  // 门店保养 》配件管理
  private generatePartsManagementMenu(): SideMenuItem {
    const systemMenu = new SideMenuItem('配件管理', null);
    systemMenu.icon = '/assets/images/menu_part.png';
    const subFinanceMenu1 = new SideMenuItem('配件库', '/store-maintenance/accessory-library', systemMenu);
    const subFinanceMenu2 = new SideMenuItem('配件品牌管理', '/store-maintenance/brand-management', systemMenu);
    const subFinanceMenu3 = new SideMenuItem('保养项目管理', '/store-maintenance/project-management', systemMenu);
    systemMenu.children.push(subFinanceMenu1);
    systemMenu.children.push(subFinanceMenu2);
    systemMenu.children.push(subFinanceMenu3);
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }

  // 门店保养 》订单结算
  private generateOrderSettlementMenu(): SideMenuItem {
    const systemMenu = new SideMenuItem('订单结算', null);
    systemMenu.icon = '/assets/images/menu_order.png';
    const subFinanceMenu1 = new SideMenuItem('订单管理', '/store-maintenance/order-management', systemMenu);
    // const subFinanceMenu2 = new SideMenuItem('结算管理', '/store-maintenance/brand-management', systemMenu);
    // const subFinanceMenu3 = new SideMenuItem('工时费管理', '/store-maintenance/work-fees-management', systemMenu);
    const subFinanceMenu3 = new SideMenuItem('服务费管理', '/store-maintenance/service-fees-management', systemMenu);
    const subFinanceMenu4 = new SideMenuItem('救援订单', '/store-maintenance/rescue-order', systemMenu);
    // systemMenu.children.push(subFinanceMenu1);
    // systemMenu.children.push(subFinanceMenu2);
    systemMenu.children.push(subFinanceMenu3);
    systemMenu.children.push(subFinanceMenu4);
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }

  // 门店保养 》商家管理
  private generateBusinessManagementMenu(): SideMenuItem {
    const systemMenu = new SideMenuItem('商家管理', null);
    systemMenu.icon = '/assets/images/menu_merchant.png';
    const subFinanceMenu1 = new SideMenuItem('汽修店管理', '/store-maintenance/garage-management', systemMenu);
    const subFinanceMenu2 = new SideMenuItem('供应商管理', '/store-maintenance/supplier-management', systemMenu);
    systemMenu.children.push(subFinanceMenu1);
    // systemMenu.children.push(subFinanceMenu2);
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }

  // 门店保养 》其他
  private generateOtherMenu(): SideMenuItem {
    const systemMenu = new SideMenuItem('其他', null);
    systemMenu.icon = '/assets/images/menu_other.png';
    const subFinanceMenu1 = new SideMenuItem('车型管理', '/store-maintenance/vehicle-management', systemMenu);
    systemMenu.children.push(subFinanceMenu1);
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }
}

