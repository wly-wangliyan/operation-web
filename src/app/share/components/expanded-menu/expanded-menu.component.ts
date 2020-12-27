import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { MenuHelper, SideMenuItem } from './menu-ui.model';
import { MenuOperationService } from './menu-service/menu-operation.service';
import { MenuInsuranceService } from './menu-service/menu-insurance.service';
import { MenuMaintenanceService } from './menu-service/menu-maintenance.service';
import { MenuMallService } from './menu-service/menu-mall.service';
import { MenuManagementService } from './menu-service/menu-management.service';
import { MenuTicketService } from './menu-service/menu-ticket.service';
import { MenuStoreMaintenanceService } from './menu-service/menu-store-maintenance.service';
import { MenuExemptionService } from './menu-service/menu-exemption.service';
import { MenuOrderParkingService } from './menu-service/menu-order-parking.service';
import { MenuTopicService } from './menu-service/menu-topic.service';
import { MenuUsedCarService } from './menu-service/menu-used-car.service';

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

    constructor(public router: Router,
                public routeMonitorService: RouteMonitorService,
                public authService: AuthService,
                private operationMenuService: MenuOperationService,
                private insuranceMenuService: MenuInsuranceService,
                private maintenanceMenuService: MenuMaintenanceService,
                private mallMenuService: MenuMallService,
                private managementMenuService: MenuManagementService,
                private ticketMenuService: MenuTicketService,
                private storeManagementMenuService: MenuStoreMaintenanceService,
                private exemptionService: MenuExemptionService,
                private orderParkingService: MenuOrderParkingService,
                private topicService: MenuTopicService,
                private usedCarService: MenuUsedCarService) {
        const path = location.pathname;
        this.getMenuItems(path);
    }

    public ngOnInit() {
        this.routeMonitorService.routePathChanged.subscribe(path => {
            if (this.checkPermission(path)) {
                this.getMenuItems(path);
            }
            this.refreshMenu(path);
        });
        timer(0).subscribe(() => {
            this.refreshMenu(location.pathname);
        });
    }

    private checkPermission(path: string): boolean {
        // 根据是否有该模块权限来控制页面跳转
        if (path.includes('/notice-center')) {
            return this.authService.checkPermissions(['ticket']);
        } else if (path.includes('/operation/')) {
            return this.authService.checkPermissions(['operation']);
        } else if (path.includes('/insurance')) {
            return this.authService.checkPermissions(['insurance']);
        } else if (path.includes('/maintenance')) {
            return this.authService.checkPermissions(['upkeep']);
        } else if (path.includes('/ticket')) {
            return this.authService.checkPermissions(['ticket']);
        } else if (path.includes('/mall')) {
            return this.authService.checkPermissions(['mall']);
        } else if (path.includes('/management-setting')) {
            return this.authService.checkPermissions(['management']);
        } else if (path.includes('/store-maintenance')) {
            return this.authService.checkPermissions(['store']);
        } else if (path.includes('/exemption')) {
            return this.authService.checkPermissions(['exemption']);
        } else if (path.includes('/order-parking')) {
            return this.authService.checkPermissions(['order-parking']);
        } else if (path.includes('/topic')) {
            return this.authService.checkPermissions(['topic']);
        } else if (path.includes('/used-car')) {
            return this.authService.checkPermissions(['used-car']);
        }
        return true;
    }

    // 获取菜单
    private getMenuItems(path: string) {
        if (path.includes('/operation/')) {
            this.menuItems = this.operationMenuService.generateMenus_operation();
            this.menu_icon = true;
            this.routeLinkList = this.operationMenuService.routeLinkList;
        } else if (path.includes('/insurance')) {
            this.menuItems = this.insuranceMenuService.generateMenus_insurance();
            this.menu_icon = false;
            this.routeLinkList = this.insuranceMenuService.routeLinkList;
        } else if (path.includes('/maintenance')) {
            this.menuItems = this.maintenanceMenuService.generateMenus_maintenance();
            this.menu_icon = false;
            this.routeLinkList = this.maintenanceMenuService.routeLinkList;
        } else if (path.includes('/ticket')) {
            this.menuItems = this.ticketMenuService.generateMenus_ticket();
            this.menu_icon = false;
            this.routeLinkList = this.ticketMenuService.routeLinkList;
        } else if (path.includes('/mall')) {
            this.menuItems = this.mallMenuService.generateMenus_mall();
            this.menu_icon = false;
            this.routeLinkList = this.mallMenuService.routeLinkList;
        } else if (path.includes('/management-setting/')) {
            this.menuItems = this.managementMenuService.generateMenus_management();
            this.menu_icon = false;
            this.routeLinkList = this.managementMenuService.routeLinkList;
        } else if (path.includes('/store-maintenance')) {
            this.menuItems = this.storeManagementMenuService.generateMenus_store_maintenance();
            this.menu_icon = false;
            this.routeLinkList = this.storeManagementMenuService.routeLinkList;
        } else if (path.includes('/exemption')) {
            this.menuItems = this.exemptionService.generateMenus_exemption();
            this.menu_icon = false;
            this.routeLinkList = this.exemptionService.routeLinkList;
        } else if (path.includes('/order-parking')) {
            this.menuItems = this.orderParkingService.generateMenus_order_parking();
            this.menu_icon = false;
            this.routeLinkList = this.orderParkingService.routeLinkList;
        } else if (path.includes('/topic')) {
            this.menuItems = this.topicService.generateMenus_topic();
            this.menu_icon = false;
            this.routeLinkList = this.topicService.routeLinkList;
        } else if (path.includes('/used-car/')) {
            this.menuItems = this.usedCarService.generateMenus_used_car();
            this.menu_icon = false;
            this.routeLinkList = this.usedCarService.routeLinkList;
        } else {
            this.routeLinkList.forEach(item => {
                item.reset();
            });
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

    public refreshMenu(path: string) {
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
            this.routeLinkList.forEach(item => {
                if (item.title !== routeItem.title) {
                    item.reset();
                }
            });
            if (childIndex !== -1) {
                routeItem.isSelect = true;
                const childRouteItem = this.routeLinkList[index].children[childIndex];
                MenuHelper.Select(index, this.menuItems, childRouteItem, childIndex);
            } else {
                routeItem.isSelect = true;
            }
        }
    }
}
