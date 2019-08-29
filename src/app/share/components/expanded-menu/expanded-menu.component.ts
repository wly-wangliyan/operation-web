import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../core/auth.service';
import {RouteMonitorService} from '../../../core/route-monitor.service';
import {Router} from '@angular/router';
import {Subscription, timer} from 'rxjs';
import {MenuHelper, SideMenuItem} from './menu-ui.model';
import { GlobalService } from '../../../core/global.service';

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

  constructor(public router: Router,
              public routeMonitorService: RouteMonitorService,
              private globalService: GlobalService,
              public authService: AuthService) {
    if (this.globalService.menu_index === 1) {
      this.menuItems = this.generateMenus();
    } else if (this.globalService.menu_index === 3) {
      this.menuItems = this.generateMenus_insurance();
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
    timer(0).subscribe(() => {
      this.router.navigateByUrl(menuItem.path);
    });
  }

  public generateMenus(): Array<SideMenuItem> {
    this.menu_icon = true;
    const menusItem: Array<SideMenuItem> = [];
    menusItem.push(this.generateParkingMenu());
    // menusItem.push(this.generateProductMenu());
    // menusItem.push(this.generateOrderMenu());
    // menusItem.push(this.generateBusinessMenu());
    return menusItem;
  }

  public generateMenus_insurance(): Array<SideMenuItem> {
    this.menu_icon = false;
    const menusItem: Array<SideMenuItem> = [];
    menusItem.push(this.generateBrokerageMenu());
    menusItem.push(this.generateInsuranceMenu());
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

  // 产品管理
  private generateProductMenu(): SideMenuItem {
    const productMenu = new SideMenuItem('产品管理', null);
    productMenu.icon = 'team';
    const subFinanceMenu1 = new SideMenuItem('产品列表', '/main/product/product-list', productMenu);
    productMenu.children.push(subFinanceMenu1);
    this.routeLinkList.push(productMenu);
    return productMenu;
  }

  // 订单管理
  private generateOrderMenu(): SideMenuItem {
    const orderMenu = new SideMenuItem('订单管理', null);
    orderMenu.icon = 'team';
    const subFinanceMenu1 = new SideMenuItem('产品订单', '/main/order', orderMenu);
    orderMenu.children.push(subFinanceMenu1);
    this.routeLinkList.push(orderMenu);
    return orderMenu;
  }

  // 商家管理
  private generateBusinessMenu(): SideMenuItem {
    const businessMenu = new SideMenuItem('商家管理', null);
    businessMenu.icon = 'team';
    const subFinanceMenu1 = new SideMenuItem('商家列表', '/main/business', businessMenu);
    businessMenu.children.push(subFinanceMenu1);
    this.routeLinkList.push(businessMenu);
    return businessMenu;
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
      } else {
        MenuHelper.Select(this.menuItems, routeItem);
      }
    }
  }
}
