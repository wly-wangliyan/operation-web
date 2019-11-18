import { Injectable } from '@angular/core';
import { SideMenuItem } from '../menu-ui.model';

/*管理设置菜单*/
@Injectable({
  providedIn: 'root'
})
export class MenuManagementService {

  public routeLinkList: Array<SideMenuItem> = [];
  public menu_icon = true;

  constructor() { }

  // 管理设置
  public generateMenus_management(): Array<SideMenuItem> {
    this.menu_icon = false;
    this.routeLinkList = [];
    const menusItem: Array<SideMenuItem> = [];
    menusItem.push(this.generateEmployeesMenu());
    return menusItem;
  }

  // 管理设置》用户管理
  private generateEmployeesMenu() {
    const systemMenu = new SideMenuItem('用户管理', '/main/management-setting/employees');
    systemMenu.icon = '/assets/images/menu_user.png';
    const subFinanceMenu1 = new SideMenuItem('用户列表', '/main/management-setting/employees', systemMenu);
    systemMenu.children.push(subFinanceMenu1);
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }
}

