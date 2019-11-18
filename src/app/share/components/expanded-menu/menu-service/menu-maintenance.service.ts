import { Injectable } from '@angular/core';
import { SideMenuItem } from '../menu-ui.model';

/*保养菜单*/
@Injectable({
  providedIn: 'root'
})
export class MenuMaintenanceService {

  public routeLinkList: Array<SideMenuItem> = [];
  public menu_icon = true;

  constructor() { }

  // 保养菜单
  public generateMenus_maintenance(): Array<SideMenuItem> {
    this.menu_icon = false;
    this.routeLinkList = [];
    const menusItem: Array<SideMenuItem> = [];
    menusItem.push(this.generateOrderManagementMenu());
    menusItem.push(this.generateProductMenu());
    menusItem.push(this.generateMaintenanceManualMenu());
    menusItem.push(this.generateProjectMenu());
    menusItem.push(this.generateBusinessMenu());
    menusItem.push(this.generateVehicleTypeMenu());
    return menusItem;
  }

  // 保养 》订单管理
  private generateOrderManagementMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('订单管理', '/main/maintenance/order-management');
    brokerageMenu.icon = '/assets/images/menu_order.png';
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }

  // 保养 》车型管理
  private generateVehicleTypeMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('车型管理', '/main/maintenance/vehicle-type-management');
    brokerageMenu.icon = '/assets/images/menu_car.png';
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }

  // 保养 》保养手册
  private generateMaintenanceManualMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('保养手册', '/main/maintenance/maintenance-manual');
    brokerageMenu.icon = '/assets/images/menu_manual.png';
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }

  // 保养 》保养项目管理
  private generateProjectMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('保养项目管理', '/main/maintenance/project-management');
    brokerageMenu.icon = '/assets/images/menu_product.png';
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }

  // 保养 》商家管理
  private generateBusinessMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('商家管理', '/main/maintenance/business-management');
    brokerageMenu.icon = '/assets/images/menu_merchant.png';
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }

  // 保养 》产品库
  private generateProductMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('产品库', '/main/maintenance/product-library');
    brokerageMenu.icon = '/assets/images/menu_part.png';
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }
}

