import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { MenuHelper, SideMenuItem } from './menu-ui.model';
import { GlobalService } from '../../../core/global.service';
import { isTemplateRef } from 'ng-zorro-antd';

/* 左侧菜单栏 */

/* 结构有序，添加新项时需要注意 */
@Component({
  selector: 'app-expanded-menu',
  templateUrl: './expanded-menu.component.html',
  styleUrls: ['./expanded-menu.component.css']
})
export class ExpandedMenuComponent implements OnInit {

  public menuItems: Array<SideMenuItem> = [];
  public routeLinkList: Array<SideMenuItem> = [];
  public menu_icon = true;

  private routePathSubscription: Subscription;

  constructor(
    public router: Router,
    public routeMonitorService: RouteMonitorService,
    private globalService: GlobalService,
    public authService: AuthService) {
    if (this.globalService.menu_index === 1) {
      this.menuItems = this.generateMenus();
    } else if (this.globalService.menu_index === 3) {
      this.menuItems = this.generateMenus_insurance();
    } else if (this.globalService.menu_index === 4) {
      this.menuItems = this.generateMenus_maintenance();
    }
  }

  ngOnInit() {
    this.routePathSubscription = this.routeMonitorService.routePathChanged.subscribe(path => {
      this.refreshMenu(path);
    });
    timer(0).subscribe(() => {
      this.refreshMenu(location.pathname);
    });
  }

  public onMenuItemClick(menuItem: SideMenuItem, parentTitle: string = '') {
    // if (!this.authService.isMuchCertificationSuccess) {
    //   return;
    // }
    this.routeLinkList.forEach(item => {
      if (item.title !== parentTitle) {
        item.reset();
      }
    });
    menuItem.isSelect = true;
    timer(0).subscribe(() => {
      this.router.navigateByUrl(menuItem.path);
    });
  }

  // 运营菜单
  public generateMenus(): Array<SideMenuItem> {
    this.menu_icon = true;
    const menusItem: Array<SideMenuItem> = [];
    menusItem.push(this.generateParkingMenu());
    return menusItem;
  }

  // 保险菜单
  public generateMenus_insurance(): Array<SideMenuItem> {
    this.menu_icon = false;
    const menusItem: Array<SideMenuItem> = [];
    menusItem.push(this.generateBrokerageMenu());
    menusItem.push(this.generateInsuranceMenu());
    return menusItem;
  }

  // 保养菜单
  public generateMenus_maintenance(): Array<SideMenuItem> {
    this.menu_icon = false;
    const menusItem: Array<SideMenuItem> = [];
    menusItem.push(this.generateOrderManagementMenu());
    menusItem.push(this.generateProductMenu());
    menusItem.push(this.generateMaintenanceManualMenu());
    menusItem.push(this.generateProjectMenu());
    menusItem.push(this.generateBusinessMenu());
    menusItem.push(this.generateVehicleTypeMenu());
    return menusItem;
  }

  // 美行停车
  private generateParkingMenu(): SideMenuItem {
    const systemMenu = new SideMenuItem('美行停车', null);
    systemMenu.icon = 'team';
    const subFinanceMenu1 = new SideMenuItem('首页图标', '/main/parking/first-page-icon', systemMenu);
    const subFinanceMenu2 = new SideMenuItem('版本管理', '/main/parking/version-management', systemMenu);
    systemMenu.children.push(subFinanceMenu1);
    systemMenu.children.push(subFinanceMenu2);
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }

  // 保险公司管理
  private generateInsuranceMenu(): SideMenuItem {
    const insuranceMenu = new SideMenuItem('保险公司管理', '/main/insurance/insurance-company-list');
    insuranceMenu.icon = 'team';
    this.routeLinkList.push(insuranceMenu);
    return insuranceMenu;
  }

  // 经纪公司管理
  private generateBrokerageMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('经纪公司管理', '/main/insurance');
    brokerageMenu.icon = 'team';
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }

  // 订单管理
  private generateOrderManagementMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('订单管理', '/main/maintenance/order-management');
    brokerageMenu.icon = 'team';
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }

  // 保养 》车型管理
  private generateVehicleTypeMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('车型管理', '/main/maintenance/vehicle-type-management');
    brokerageMenu.icon = 'team';
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }

  // 保养 》保养手册
  private generateMaintenanceManualMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('保养手册', '/main/maintenance/maintenance-manual');
    brokerageMenu.icon = 'team';
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }

  // 保养 》保养项目管理
  private generateProjectMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('保养项目管理', '/main/maintenance/project-management');
    brokerageMenu.icon = 'team';
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }

  // 保养 》商家管理
  private generateBusinessMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('商家管理', '/main/maintenance/business-management');
    brokerageMenu.icon = 'team';
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }

  // 保养 》产品库
  private generateProductMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('产品库', '/main/maintenance/product-library');
    brokerageMenu.icon = 'team';
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }

  private refreshMenu(path: string) {

    // 尝试父匹配
    let index = this.routeLinkList.findIndex(element => {
      return element.path === path;
    });

    // 尝试局部匹配
    if (index === -1) {
      index = this.routeLinkList.findIndex(element => {
        return path.includes(element.path);
      });
    }

    let childIndex = -1;

    for (let i = 0; i < this.routeLinkList.length; i++) {
      childIndex = this.routeLinkList[i].children.findIndex(element => element.path === path);
      if (childIndex !== -1) {
        index = i;
        break;
      }
    }
    if (childIndex === -1) {
      for (let i = 0; i < this.routeLinkList.length; i++) {
        childIndex = this.routeLinkList[i].children.findIndex(element => path.includes(element.path));
        if (childIndex !== -1) {
          index = i;
          break;
        }
      }
    }

    if (index !== -1) {
      const routeItem = this.routeLinkList[index];
      if (childIndex !== -1) {
        routeItem.isSelect = true;
        const childRouteItem = this.routeLinkList[index].children[childIndex];
        MenuHelper.Select(this.menuItems, childRouteItem);
      }
    }
  }
}
