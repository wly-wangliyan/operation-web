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
        menusItem.push(this.generateServiceManagementMenu());
        menusItem.push(this.generatePartsManagementMenu());
        menusItem.push(this.generateOrderSettlementMenu());
        menusItem.push(this.generateBusinessManagementMenu());
        menusItem.push(this.generateOtherMenu());
        menusItem.push(this.generateExpenseShopMenu());
        menusItem.push(this.generateRefundMenu());
        // menusItem.push(this.generateUserVehicle());
        return menusItem;
    }

    // 门店保养 》服务管理
    private generateServiceManagementMenu(): SideMenuItem {
        const systemMenu = new SideMenuItem('服务管理', '/service-fees-management');
        systemMenu.icon = '/assets/images/menu_service_management.png';
        this.routeLinkList.push(systemMenu);
        return systemMenu;
    }

    // 门店保养 》配件管理
    private generatePartsManagementMenu(): SideMenuItem {
        const systemMenu = new SideMenuItem('配件管理', null);
        systemMenu.icon = '/assets/images/menu_part.png';
        const subFinanceMenu1 = new SideMenuItem('配件库', '/accessory-library', systemMenu);
        const subFinanceMenu2 = new SideMenuItem('配件品牌管理', '/brand-management', systemMenu);
        const subFinanceMenu3 = new SideMenuItem('保养项目管理', '/project-management', systemMenu);
        systemMenu.children.push(subFinanceMenu1);
        systemMenu.children.push(subFinanceMenu2);
        systemMenu.children.push(subFinanceMenu3);
        this.routeLinkList.push(systemMenu);
        return systemMenu;
    }

    // 门店保养 》订单结算
    private generateOrderSettlementMenu(): SideMenuItem {
        const systemMenu = new SideMenuItem('订单结算', null);
        systemMenu.icon = '/assets/images/menu_order.png';
        const subFinanceMenu1 = new SideMenuItem('订单管理', '/order-management', systemMenu);
        // const subFinanceMenu2 = new SideMenuItem('结算管理', '/store-maintenance/brand-management', systemMenu);
        const subFinanceMenu3 = new SideMenuItem('服务管理', '/service-fees-management', systemMenu);
        const subFinanceMenu4 = new SideMenuItem('救援订单', '/rescue-order', systemMenu);
        const subFinanceMenu5 = new SideMenuItem('保养订单', '/upkeep-order', systemMenu);
        const subFinanceMenu6 = new SideMenuItem('核销管理', '/expense-management', systemMenu);
        const subFinanceMenu7 = new SideMenuItem('洗车订单', '/order-management/wash-car-order/list', systemMenu);
        // systemMenu.children.push(subFinanceMenu1);
        systemMenu.children.push(subFinanceMenu5);
        systemMenu.children.push(subFinanceMenu4);
        systemMenu.children.push(subFinanceMenu7);
        systemMenu.children.push(subFinanceMenu6);
        // systemMenu.children.push(subFinanceMenu3);
        this.routeLinkList.push(systemMenu);
        return systemMenu;
    }

    // 门店保养 》商家管理
    private generateBusinessManagementMenu(): SideMenuItem {
        const systemMenu = new SideMenuItem('商家管理', null);
        systemMenu.icon = '/assets/images/menu_merchant.png';
        const subFinanceMenu1 = new SideMenuItem('汽修店管理', '/garage-management', systemMenu);
        const subFinanceMenu2 = new SideMenuItem('供应商管理', '/supplier-management', systemMenu);
        systemMenu.children.push(subFinanceMenu1);
        systemMenu.children.push(subFinanceMenu2);
        this.routeLinkList.push(systemMenu);
        return systemMenu;
    }

    // 门店保养 》其他
    private generateOtherMenu(): SideMenuItem {
        const systemMenu = new SideMenuItem('其他', null);
        systemMenu.icon = '/assets/images/menu_other.png';
        const subFinanceMenu1 = new SideMenuItem('车型管理', '/vehicle-management', systemMenu);
        systemMenu.children.push(subFinanceMenu1);
        this.routeLinkList.push(systemMenu);
        return systemMenu;
    }

    // 门店保养 》期望洗车门店
    private generateExpenseShopMenu(): SideMenuItem {
        const systemMenu = new SideMenuItem('期望洗车门店', '/expect-wash-car');
        systemMenu.icon = '/assets/images/menu/menu_expect.png';
        this.routeLinkList.push(systemMenu);
        return systemMenu;
    }

    // 门店保养 》洗车退款申请
    private generateRefundMenu(): SideMenuItem {
        const systemMenu = new SideMenuItem('洗车退款申请', null);
        systemMenu.icon = '/assets/images/menu/menu_refund.png';
        const subFinanceMenu1 = new SideMenuItem('洗车退款申请', '/order-management/wash-car-order/refund-list', systemMenu);
        systemMenu.children.push(subFinanceMenu1);
        this.routeLinkList.push(systemMenu);
        return systemMenu;
    }

    // 用户车型管理
    private generateUserVehicle() {
        const systemMenu = new SideMenuItem('用户车型管理', '/user-vehicle');
        systemMenu.icon = '/assets/images/menu/menu_expect.png';
        this.routeLinkList.push(systemMenu);
        return systemMenu;
    }
}

