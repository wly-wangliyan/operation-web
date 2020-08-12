export class InformationDeliveryManagementModel {
    public checkOptions: Array<HomeDecorationItem> = [];
    public carColorList: Array<CarColorItem> = [];
    public carTypeList: Array<CarTypeItem> = [];

    /**
     * 初始化数据
     */
    initData() {
        this.checkOptions = [
            new HomeDecorationItem('CPS导航', 1),
            new HomeDecorationItem('倒车影像', 2),
            new HomeDecorationItem('定速巡航', 3),
            new HomeDecorationItem('多媒体控制', 4),
            new HomeDecorationItem('行车显示屏', 5),
            new HomeDecorationItem('前雷达', 6),
            new HomeDecorationItem('全景摄像头', 7),
            new HomeDecorationItem('胎压监测', 8),
            new HomeDecorationItem('氙气大灯', 9),
            new HomeDecorationItem('运动座椅', 10),
            new HomeDecorationItem('车内氛围灯', 11),
            new HomeDecorationItem('车载电视', 12),
            new HomeDecorationItem('铝合金轮圈', 13),
            new HomeDecorationItem('车载冰箱', 14),
        ];
        this.carColorList = [
            new CarColorItem('黑色', '黑'),
            new CarColorItem('白色', '白'),
            new CarColorItem('红色', '红'),
            new CarColorItem('灰色', '灰'),
            new CarColorItem('银色', '银'),
            new CarColorItem('蓝色', '蓝'),
            new CarColorItem('黄色', '黄'),
            new CarColorItem('棕色', '棕'),
            new CarColorItem('绿色', '绿'),
            new CarColorItem('橙色', '橙'),
            new CarColorItem('紫色', '紫'),
            new CarColorItem('香槟', '香槟'),
            new CarColorItem('金色', '金'),
            new CarColorItem('粉红', '粉红'),
            new CarColorItem('其他颜色', '其他'),
        ];

        this.carTypeList = [
            new CarTypeItem('不限', 0),
            new CarTypeItem('轿车', 1),
            new CarTypeItem('越野车/SUV', 2),
            new CarTypeItem('MPV', 3),
            new CarTypeItem('跑车', 4),
            new CarTypeItem('面包车', 5),
            new CarTypeItem('皮卡', 6),
            new CarTypeItem('新能源', 7),
            new CarTypeItem('工程车', 8),
            new CarTypeItem('货车', 9),
            new CarTypeItem('客车', 10),
            new CarTypeItem('三轮机动车', 11),
            new CarTypeItem('老年代步车', 12),
        ];
    }
}

class CarTypeItem {
    public name: string = undefined;
    public value: number = undefined;

    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }
}

class HomeDecorationItem {
    public label: string = undefined;
    public value: number = undefined;
    public checked = false;

    constructor(label: string, value: number) {
        this.label = label;
        this.value = value;
    }
}

class CarColorItem {
    public name = '';
    public value = '';

    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
}
