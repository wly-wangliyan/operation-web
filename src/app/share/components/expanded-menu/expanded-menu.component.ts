import { Component, OnInit } from '@angular/core';
import { PlatformLocation } from '@angular/common';
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
    public authService: AuthService,
    public platformLocation: PlatformLocation) {

    platformLocation.onPopState(() => {
      const path = location.pathname;
      if (path.includes('/notice-center')) {
        this.globalService.menu_index = null;
      } else if (path.includes('operation/')) {
        this.globalService.menu_index = 1;
      } else if (path.includes('insurance')) {
        this.globalService.menu_index = 3;
      } else if (path.includes('maintenance')) {
        this.globalService.menu_index = 4;
      } else if (path.includes('/ticket')) {
        this.globalService.menu_index = 5;
      } else if (path.includes('/home')) {
        this.globalService.menu_index = this.globalService.menu_last_index;
      }
    });
    this.getMenuItems();
  }

  public ngOnInit() {
    this.routeMonitorService.routePathChanged.subscribe(path => {
      this.getMenuItems();
      this.refreshMenu(path);
    });
    timer(0).subscribe(() => {
      this.refreshMenu(location.pathname);
    });
  }

  // 获取菜单
  private getMenuItems() {
    if (this.globalService.menu_index === 1) {
      this.menuItems = this.generateMenus();
    } else if (this.globalService.menu_index === 3) {
      this.menuItems = this.generateMenus_insurance();
    } else if (this.globalService.menu_index === 4) {
      this.menuItems = this.generateMenus_maintenance();
    } else if (this.globalService.menu_index === 5) {
      this.menuItems = this.generateMenus_ticket();
    }
  }

  public onMenuItemClick(menuItem: SideMenuItem, parentTitle: string = '') {
    this.routeLinkList.forEach(item => {
      if (item.title !== parentTitle) {
        item.reset();
      }
    });
    timer(0).subscribe(() => {
      this.router.navigateByUrl(menuItem.path);
      if (menuItem.path === location.pathname) {
        menuItem.isSelect = true;
      } else {
        this.refreshMenu(location.pathname);
      }
    });
  }


  // 运营菜单
  public generateMenus(): Array<SideMenuItem> {
    this.menu_icon = true;
    this.routeLinkList = [];
    const menusItem: Array<SideMenuItem> = [];
    menusItem.push(this.generateParkingMenu());
    menusItem.push(this.generateCommentMenu());
    menusItem.push(this.generateMiniProgramMenu());
    menusItem.push(this.generateOtherOperationConfigMenu());
    return menusItem;
  }

  // 保险菜单
  public generateMenus_insurance(): Array<SideMenuItem> {
    this.menu_icon = false;
    this.routeLinkList = [];
    const menusItem: Array<SideMenuItem> = [];
    menusItem.push(this.generateBrokerageMenu());
    menusItem.push(this.generateInsuranceMenu());
    return menusItem;
  }

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

  // 美行停车
  private generateParkingMenu(): SideMenuItem {
    const systemMenu = new SideMenuItem('美行停车', null);
    systemMenu.icon = '/assets/images/icon_menu_parking.png';
    const subFinanceMenu1 = new SideMenuItem('首页图标', '/main/operation/parking/first-page-icon', systemMenu);
    const subFinanceMenu2 = new SideMenuItem('版本管理', '/main/operation/parking/version-management', systemMenu);
    systemMenu.children.push(subFinanceMenu1);
    systemMenu.children.push(subFinanceMenu2);
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }

  // 评论管理
  private generateCommentMenu(): SideMenuItem {
    const systemMenu = new SideMenuItem('评论管理', null);
    systemMenu.icon = '/assets/images/menu_comment.png';
    const subFinanceMenu1 = new SideMenuItem('评论列表', '/main/operation/comment/', systemMenu);
    systemMenu.children.push(subFinanceMenu1);
    const subFinanceMenu2 = new SideMenuItem('评论配置', '/main/operation/comment/comment-setting', systemMenu);
    systemMenu.children.push(subFinanceMenu2);
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }

  // 小程序
  private generateMiniProgramMenu(): SideMenuItem {
    const systemMenu = new SideMenuItem('小程序', null);
    systemMenu.icon = '/assets/images/menu_mini_program.png';
    const subFinanceMenu1 = new SideMenuItem('展位管理', '/main/operation/mini-program/banner-management', systemMenu);
    systemMenu.children.push(subFinanceMenu1);
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }

  // 其他运营配置
  private generateOtherOperationConfigMenu(): SideMenuItem {
    const systemMenu = new SideMenuItem('其他运营配置', null);
    systemMenu.icon = '/assets/images/menu_other_config.png';
    const subFinanceMenu1 = new SideMenuItem('优惠券跳转页', '/main/operation/other-operation-config/coupon-jump', systemMenu);
    systemMenu.children.push(subFinanceMenu1);
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }

  // 保险公司管理
  private generateInsuranceMenu(): SideMenuItem {
    const insuranceMenu = new SideMenuItem('保险公司管理', '/main/insurance/insurance-company-list');
    insuranceMenu.icon = '/assets/images/menu_insurance.png';
    this.routeLinkList.push(insuranceMenu);
    return insuranceMenu;
  }

  // 经纪公司管理
  private generateBrokerageMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('经纪公司管理', '/main/insurance');
    brokerageMenu.icon = '/assets/images/menu_business.png';
    this.routeLinkList.push(brokerageMenu);
    return brokerageMenu;
  }

  // 订单管理
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

  // 票务 》产品管理
  private generateTicketProductMenu(): SideMenuItem {
    const brokerageMenu = new SideMenuItem('产品管理', '/main/ticket/product-management');
    brokerageMenu.icon = '/assets/images/menu_part.png';
    const subFinanceMenu1 = new SideMenuItem('产品列表', '/main/ticket/product-management', brokerageMenu);
    brokerageMenu.children.push(subFinanceMenu1);
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
        this.routeLinkList.forEach(item => {
          if (item.title !== routeItem.title) {
            item.reset();
          }
        });
        routeItem.isSelect = true;
        const childRouteItem = this.routeLinkList[index].children[childIndex];
        MenuHelper.Select(index, this.menuItems, childRouteItem, childIndex);
      } else {
        routeItem.isSelect = true;
      }
    }
  }
}
