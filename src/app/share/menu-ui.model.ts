export class SideMenuItem {
  public children: Array<SideMenuItem> = [];
  public parent: SideMenuItem;
  public path: string;
  public title: string;
  public icon: string;

  private _isSelect = false;
  public set isSelect(isSelect: boolean) {
    this._isSelect = isSelect;
    if (this.parent) {
      this.parent.isSelect = isSelect;
    }
  }

  public get isSelect(): boolean {
    return this._isSelect;
  }

  constructor(title: string, path: string, parent?: SideMenuItem) {
    this.title = title;
    this.path = path;
    this.parent = parent;
  }

  public reset() {
    this.isSelect = false;
    this.children.forEach(item => {
      item.reset();
    });
  }
}

export class MenuHelper {
  public static Select(menu: Array<SideMenuItem>, menuItem: SideMenuItem) {
    menu.forEach(item => {
      item.reset();
    });
    menuItem.isSelect = true;
  }
}
