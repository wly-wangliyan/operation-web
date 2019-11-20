import { Injectable } from '@angular/core';
import { SideMenuItem } from '../menu-ui.model';

/*商城菜单*/
@Injectable({
    providedIn: 'root'
})
export class MenuStoreMaintenanceService {

    public routeLinkList: Array<SideMenuItem> = [];

    public menu_icon = true;

    constructor() {
    }

    // 门店保养菜单
    public generateMenus_store_maintenance(): Array<SideMenuItem> {
        this.menu_icon = false;
        this.routeLinkList = [];
        const menusItem: Array<SideMenuItem> = [];
        menusItem.push(this.generateBrandManagementMenu());
        return menusItem;
    }

    // 门店保养 》品牌管理
    private generateBrandManagementMenu(): SideMenuItem {
        const brokerageMenu = new SideMenuItem('品牌管理', '/store-maintenance/brand-management');
        brokerageMenu.icon = '/assets/images/menu_part.png';
        this.routeLinkList.push(brokerageMenu);
        return brokerageMenu;
    }
}

