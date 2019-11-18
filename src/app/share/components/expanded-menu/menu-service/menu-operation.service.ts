import { Injectable } from '@angular/core';
import { SideMenuItem } from '../menu-ui.model';

/*运营菜单*/
@Injectable({
  providedIn: 'root'
})
export class MenuOperationService {

  public routeLinkList: Array<SideMenuItem> = [];
  public menu_icon = true;

  constructor() { }

  // 运营菜单
  public generateMenus_operation(): Array<SideMenuItem> {
    this.menu_icon = true;
    this.routeLinkList = [];
    const menusItem: Array<SideMenuItem> = [];
    menusItem.push(this.generateParkingMenu());
    menusItem.push(this.generateCommentMenu());
    menusItem.push(this.generateMiniProgramMenu());
    menusItem.push(this.generateOtherOperationConfigMenu());
    menusItem.push(this.generateOperationConfigMenu());
    return menusItem;
  }

  // 运营 》美行停车
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

  // 运营 》评论管理
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

  // 运营 》小程序
  private generateMiniProgramMenu(): SideMenuItem {
    const systemMenu = new SideMenuItem('小程序', null);
    systemMenu.icon = '/assets/images/menu_mini_program.png';
    const subFinanceMenu1 = new SideMenuItem('展位管理', '/main/operation/mini-program/banner-management', systemMenu);
    systemMenu.children.push(subFinanceMenu1);
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }

  // 运营 》其他运营配置
  private generateOtherOperationConfigMenu(): SideMenuItem {
    const systemMenu = new SideMenuItem('其他运营配置', null);
    systemMenu.icon = '/assets/images/menu_other_config.png';
    const subFinanceMenu1 = new SideMenuItem('优惠券跳转页', '/main/operation/other-operation-config/coupon-jump', systemMenu);
    systemMenu.children.push(subFinanceMenu1);
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }

  // 运营 》运营配置
  private generateOperationConfigMenu(): SideMenuItem {
    const systemMenu = new SideMenuItem('运营配置', null);
    systemMenu.icon = '/assets/images/menu_config.png';
    const subFinanceMenu1 = new SideMenuItem('活动配置', '/main/operation/operation-config/activity-config', systemMenu);
    systemMenu.children.push(subFinanceMenu1);
    const subFinanceMenu2 = new SideMenuItem('专题活动', '/main/operation/operation-config/thematic-activity', systemMenu);
    systemMenu.children.push(subFinanceMenu2);
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }
}

