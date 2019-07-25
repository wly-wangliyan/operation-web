import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../core/auth.service';
import {RouteMonitorService} from '../../../core/route-monitor.service';
import {Router} from '@angular/router';
import {Subscription, timer} from 'rxjs';
import {MenuHelper, SideMenuItem} from './menu-ui.model';

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

  private routePathSubscription: Subscription;

  constructor(public router: Router,
              public routeMonitorService: RouteMonitorService,
              public authService: AuthService) {
    this.menuItems = this.generateMenus();
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
    const menusItem: Array<SideMenuItem> = [];
    menusItem.push(this.generateSystemMenu());
    menusItem.push(this.generateProjectMenu());
    return menusItem;
  }

  // 系统管理
  private generateSystemMenu(): SideMenuItem {
    const systemMenu = new SideMenuItem('系统管理', null);
    systemMenu.icon = 'team';
    const subFinanceMenu1 = new SideMenuItem('用户管理', '/main/system-management', systemMenu);
    systemMenu.children.push(subFinanceMenu1);
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }

  // 项目信息管理
  private generateProjectMenu(): SideMenuItem {
    const projectMenu = new SideMenuItem('项目管理', null);
    projectMenu.icon = 'team';
    const subFinanceMenu1 = new SideMenuItem('项目列表', '/main/project-management', projectMenu);
    projectMenu.children.push(subFinanceMenu1);
    this.routeLinkList.push(projectMenu);
    return projectMenu;
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
