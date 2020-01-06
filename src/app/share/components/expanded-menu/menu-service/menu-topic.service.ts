import { Injectable } from '@angular/core';
import { SideMenuItem } from '../menu-ui.model';

@Injectable({
    providedIn: 'root'
})
export class MenuTopicService {

    public routeLinkList: Array<SideMenuItem> = [];
    public menu_icon = true;

    constructor() {
    }

    /* 话题菜单 */
    public generateMenus_topic(): Array<SideMenuItem> {
        this.menu_icon = false;
        this.routeLinkList = [];
        const menusItem: Array<SideMenuItem> = [];
        menusItem.push(this.generateTopicManagementMenu());
        return menusItem;
    }

    // 话题 》话题管理
    private generateTopicManagementMenu() {
        const systemMenu = new SideMenuItem('话题管理', '/topic/topic-list');
        systemMenu.icon = '/assets/images/menu_part.png';
        this.routeLinkList.push(systemMenu);
        return systemMenu;
    }
}
