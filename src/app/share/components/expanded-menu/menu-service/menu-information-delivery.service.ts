import { Injectable } from '@angular/core';
import { SideMenuItem } from '../menu-ui.model';

/*商城菜单*/
@Injectable({
    providedIn: 'root'
})
export class MenuInformationDeliveryService {

    public routeLinkList: Array<SideMenuItem> = [];
    public menu_icon = true;

    constructor() {
    }

    // 二手车菜单
    public generateMenus_information_delivery(): Array<SideMenuItem> {
        this.menu_icon = false;
        this.routeLinkList = [];
        const menusItem: Array<SideMenuItem> = [];
        menusItem.push(this.generateUsedCarMenu());
        menusItem.push(this.generateParkingSpaceSellMenu());
        return menusItem;
    }


    // 二手车
    private generateUsedCarMenu(): SideMenuItem {
        const systemMenu = new SideMenuItem('二手车', null);
        systemMenu.icon = '/assets/images/menu_used_car.png';
        const subFinanceMenu1 = new SideMenuItem('商户管理', '/main/information-delivery/used-car/merchant-management', systemMenu);
        systemMenu.children.push(subFinanceMenu1);
        const subFinanceMenu2 = new SideMenuItem('信息发布', '/main/information-delivery/used-car/information-delivery-management', systemMenu);
        systemMenu.children.push(subFinanceMenu2);
        const subFinanceMenu3 = new SideMenuItem('标签管理', '/main/information-delivery/used-car/tag-management', systemMenu);
        systemMenu.children.push(subFinanceMenu3);
        this.routeLinkList.push(systemMenu);
        return systemMenu;
    }

    // 车位租售
    private generateParkingSpaceSellMenu(): SideMenuItem {
        const systemMenu = new SideMenuItem('车位租售', null);
        systemMenu.icon = '/assets/images/menu_used_car.png';
        const subFinanceMenu1 = new SideMenuItem('信息发布', '/main/information-delivery/parking-space-sell/information-delivery-management', systemMenu);
        systemMenu.children.push(subFinanceMenu1);
        const subFinanceMenu2 = new SideMenuItem('标签管理', '/main/information-delivery/parking-space-sell/tag-management', systemMenu);
        systemMenu.children.push(subFinanceMenu2);
        this.routeLinkList.push(systemMenu);
        return systemMenu;
    }
}

