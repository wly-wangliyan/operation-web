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
    menusItem.push(this.generateMiniProgramMenu());
    menusItem.push(this.generateOperationConfigMenu());
    menusItem.push(this.generateCommentMenu());
    menusItem.push(this.generateAdvancedFunctionMenu());
    return menusItem;
  }

  // 运营 》美行停车
  private generateParkingMenu(): SideMenuItem {
    const systemMenu = new SideMenuItem('美行停车App', null);
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
    const subFinanceMenu1 = new SideMenuItem('展位', '/main/operation/mini-program/booth-management', systemMenu);
    systemMenu.children.push(subFinanceMenu1);
    const subFinanceMenu2 = new SideMenuItem('通知管理', '/main/operation/mini-program/notice-management', systemMenu);
    systemMenu.children.push(subFinanceMenu2);
    const subFinanceMenu3 = new SideMenuItem('推送', '/main/operation/mini-program/push-management', systemMenu);
    systemMenu.children.push(subFinanceMenu3);
    const subFinanceMenu4 = new SideMenuItem('界面装修', '/main/operation/mini-program/interface-decoration/edit', systemMenu);
    systemMenu.children.push(subFinanceMenu4);
    const subFinanceMenu5 = new SideMenuItem('草稿/发布记录', '/main/operation/mini-program/interface-decoration/record-list', systemMenu);
    systemMenu.children.push(subFinanceMenu5);
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }

  // 运营 》运营配置
  private generateOperationConfigMenu(): SideMenuItem {
    const systemMenu = new SideMenuItem('活动管理', null);
    systemMenu.icon = '/assets/images/menu_config.png';
    const subFinanceMenu1 = new SideMenuItem('专题活动', '/main/operation/operation-config/thematic-activity', systemMenu);
    systemMenu.children.push(subFinanceMenu1);
    const subFinanceMenu2 = new SideMenuItem('优惠券跳转页', '/main/operation/other-operation-config/coupon-jump', systemMenu);
    systemMenu.children.push(subFinanceMenu2);
    const subFinanceMenu3 = new SideMenuItem('幸运抽奖', '/main/operation/operation-config/luck-draw', systemMenu);
    systemMenu.children.push(subFinanceMenu3);
    const subFinanceMenu4 = new SideMenuItem('活动配置', '/main/operation/operation-config/activity-config', systemMenu);
    systemMenu.children.push(subFinanceMenu4);
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }

  // 运营 》微信服务号
  private generateAdvancedFunctionMenu(): SideMenuItem {
    const systemMenu = new SideMenuItem('微信服务号', null);
    systemMenu.icon = '/assets/images/menu/menu_wechat.png';
    const subFinanceMenu1 = new SideMenuItem('功能授权', '/main/operation/wechat/function-authorize', systemMenu);
    systemMenu.children.push(subFinanceMenu1);
    const subFinanceMenu2 = new SideMenuItem('48小时推送', '/main/operation/wechat/push/push-list', systemMenu);
    systemMenu.children.push(subFinanceMenu2);
    const subFinanceMenu3 = new SideMenuItem('推送记录', '/main/operation/wechat/push/push-log', systemMenu);
    systemMenu.children.push(subFinanceMenu3);
    this.routeLinkList.push(systemMenu);
    return systemMenu;
  }
}

