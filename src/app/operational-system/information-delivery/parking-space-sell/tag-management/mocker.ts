/*
 * @description: 模拟测试数据(在使用过程中如果提供了正式数据请删除相关测试代码)
 * @author: zack
 * @Date: 2019-12-18 15:51:07
 * @LastEditTime : 2019-12-24 17:59:56
 */
import { mockDataProvider } from './mocker.data';
import { of } from 'rxjs/internal/observable/of';
import { delay } from 'rxjs/operators';

const MOCK_OPEN_FLAG = false; // mock开启标识 生产环境下需要将此字段设置为false

const MAX_SUB_ARRAY_LENGTH = 15; // 内部数组的最大长度，当前版本不可配置
const MOCK_DICTIONARY_KEY = 'mock_dictionary_key'; // 字典键值
type ClassType = object;

/**
 * 场景值
 */
export enum MockSceneType {
    none = 1,
    telephone,
    carId,
    name,
    image,
}

/**
 * 属性配置，只支持对基础类型进行定制化
 */
interface MockPropertyConfig {
    classType: any; // 类型
    defaults?: Array<any>; // 默认值,通用方法，可以模拟出较真实数据
    nullable?: boolean; // 是否可以为空,当前版本不支持
    rule?: any; // 自定义规则,当前版本不支持
    scene?: MockSceneType; // 场景值,只支持字符串，可以生成相应场景的字符串
}

class Mocker {

    public mockDictionary = {};

    private warningFlag = false; // 警告标示
    /**
     * 数据模拟器是否开启
     * @readonly
     * @type {boolean}
     * @memberof Mocker
     */
    public get isOpen(): boolean {
        if (MOCK_OPEN_FLAG && !this.warningFlag) {
            this.warningFlag = true;
            console.error('*********************注意!!!代码中存在测试数据，请确认当前是否为开发环境*********************');
        }
        return MOCK_OPEN_FLAG;
    }

    /**
     * 处理属性数据
     * @param targetClass 目标类
     */
    public generateTarget(targetClass: any): any {
        console.log(targetClass);
        // 基础类型处理
        if (targetClass.name === 'String') {
            return mockDataProvider.strPro.random();
        } else if (targetClass.name === 'Boolean') {
            return mockDataProvider.boolPro.random();
        } else if (targetClass.name === 'Number') {
            return mockDataProvider.numPro.random();
        }
        const metaDataDictionary = mocker.mockDictionary[targetClass.name + MOCK_DICTIONARY_KEY];
        // const metaDataDictionary = Reflect.getMetadata(MOCK_DICTIONARY_KEY, targetClass);
        if (metaDataDictionary) {
            // 注入模拟装饰器的类型字典才可以使用
            const target = new targetClass();
            const properties = Object.getOwnPropertyNames(metaDataDictionary);
            properties.forEach(propertyKey => {
                const propertyValue = metaDataDictionary[propertyKey];
                if (Object.prototype.toString.call(propertyValue) === '[object Array]') {
                    // 如果为数组类型获取内部类型，当前版本不支持多维数组
                    const arrayValue = propertyValue[0];
                    const length = Math.round(Math.random() * (MAX_SUB_ARRAY_LENGTH - 1)) + 1;
                    const tmpList = [];
                    for (let index = 0; index < length; index++) {
                        tmpList.push(this.generateNotArrayProperty(propertyKey, arrayValue));
                    }
                    target[propertyKey] = tmpList;
                } else {
                    // 自定义类
                    target[propertyKey] = this.generateNotArrayProperty(propertyKey, propertyValue);
                }
            });
            return target;
        }
        return null;
    }

    /**
     * 对非数组属性生成模拟数据
     * @param propertyKey 属性键
     * @param propertyValue 属性值
     */
    private generateNotArrayProperty(propertyKey: string, propertyValue: any): any {
        if (propertyValue.name === 'String') {
            return mockDataProvider.strPro.random();
        } else if (propertyValue.name === 'Number') {
            return mockDataProvider.numPro.random();
        } else if (propertyValue.name === 'Boolean') {
            return mockDataProvider.boolPro.random();
        } else if (propertyValue.name) {
            // 自定义类
            return this.generateTarget(propertyValue);
        } else {
            // 配置类
            const config: MockPropertyConfig = propertyValue;
            // 优先使用默认值
            if (config.defaults) {
                // 存在默认值则直接从其中随机选一个
                const index = Math.round(Math.random() * (config.defaults.length - 1));
                return config.defaults[index];
            }
            // 针对字符串判断一下场景值
            if (config.classType.name === 'String') {
                if (config.scene) {
                    switch (config.scene) {
                        case MockSceneType.name:
                            return mockDataProvider.strPro.randomZH();
                        case MockSceneType.telephone:
                            return mockDataProvider.strPro.randomTelephone();
                        case MockSceneType.carId:
                            return mockDataProvider.strPro.randomCarId();
                        case MockSceneType.image:
                            return mockDataProvider.strPro.randomImage();
                        default:
                            return mockDataProvider.strPro.random();
                    }
                }
            } else if (config.classType.name === 'Number') {
                return mockDataProvider.numPro.random();
            } else if (config.classType.name === 'Boolean') {
                return mockDataProvider.boolPro.random();
            } else {
                console.error('It is not support,check your class type. by zack');
            }
        }
    }
}

export const mocker = new Mocker();

/**
 * 模拟数据 类装饰器，用在类之上来确定所需属性类型, 如Number、String、[String]等，复杂类型子类也需要集成此装饰器
 * @param dict 类型字典
 */
export function mockData(dict: { [key: string]: MockPropertyConfig | ClassType }) {
    return (target: any) => {
        if (!mocker.isOpen) {
            return;
        }
        // 将类型字典注入到类中
        mocker.mockDictionary[target.name + MOCK_DICTIONARY_KEY] = dict;
        // Reflect.defineMetadata(MOCK_DICTIONARY_KEY, dict, target);
    };
}

// 请求数据模拟
/**
 * 模拟数据请求 函数装饰器 只能作用在方法上，并且返回类型为Observable
 * @param targetClass 返回的数据类型
 * @param isArray 返回数据类型是否为数组
 * @param maxLength 当返回为数组时有效，返回值的数据长度最大值(最小值为1）
 */
export function mockRequest(targetClass: any, isArray = false, maxLength = 15) {
    console.log(targetClass);
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (!mocker.isOpen) {
            return;
        }
        descriptor.value = () => {
            if (isArray) {
                maxLength = maxLength > 0 ? maxLength : 1;
                const length = Math.round(Math.random() * (maxLength - 1)) + 1;
                const tmpList = [];
                for (let index = 0; index < length; index++) {
                    tmpList.push(mocker.generateTarget(targetClass));
                }
                return of(tmpList).pipe(delay(500));
            } else {
                return of(mocker.generateTarget(targetClass)).pipe(delay(500));
            }
        };
    };
}
