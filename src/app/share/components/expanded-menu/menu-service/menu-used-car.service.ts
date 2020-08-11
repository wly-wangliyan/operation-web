import { Injectable } from '@angular/core';
import { SideMenuItem } from '../menu-ui.model';

/*商城菜单*/
@Injectable({
    providedIn: 'root'
})
export class MenuUsedCarService {

    public routeLinkList: Array<SideMenuItem> = [];
    public menu_icon = true;

    constructor() {
    }

    // 二手车菜单
    public generateMenus_used_car(): Array<SideMenuItem> {
        this.menu_icon = false;
        this.routeLinkList = [];
        const menusItem: Array<SideMenuItem> = [];
        menusItem.push(this.generateUsedCarMenu());
        return menusItem;
    }


    // 二手车
    private generateUsedCarMenu(): SideMenuItem {
        const systemMenu = new SideMenuItem('二手车', null);
        systemMenu.icon = '/assets/images/menu_used_car.png';
        const subFinanceMenu1 = new SideMenuItem('商户管理', '/main/used-car/merchant-management', systemMenu);
        systemMenu.children.push(subFinanceMenu1);
        // const subFinanceMenu2 = new SideMenuItem('信息发布', '/main/used-car/information-delivery-management', systemMenu);
        // systemMenu.children.push(subFinanceMenu2);
        const subFinanceMenu3 = new SideMenuItem('标签管理', '/main/used-car/tag-management', systemMenu);
        systemMenu.children.push(subFinanceMenu3);
        this.routeLinkList.push(systemMenu);
        return systemMenu;
    }
}

