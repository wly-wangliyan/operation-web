import { Component, Input, OnInit } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { VehicleManagementHttpService } from '../../../../../store-maintenance/vehicle-management/vehicle-management-http.service';
import { Observable, of, Subscription, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface Expandable {
    key: string;
    title: string;
    children: Array<any>;
    expanded: boolean;
    prepareState: 'noNeed' | 'need' | 'ready';
}

@Component({
    selector: 'app-select-brand',
    templateUrl: './select-brand.component.html',
    styleUrls: ['./select-brand.component.css']
})
export class SelectBrandComponent implements OnInit {

    constructor(
        private globalService: GlobalService,
        private vehicleService: VehicleManagementHttpService,
    ) {
    }

    @Input() public accessory_id: string;

    public letter_list = ['A', 'B', 'C', 'D',
        'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
    public mapOfBrand: { [key: string]: Array<any> } = {}; // 字母对应品牌
    public defaultExpandedKeys = [];
    public defaultCheckedKeys = [];
    public loading = true;

    private car_series_list: Array<any> = []; // 已勾选的数组
    private isRequestYearData = false;
    private sureCallback: any;
    private closeCallback: any;
    private requestBrandSubscription: Subscription; // 获取品牌数据
    private requestFirmSubscription: Subscription; // 获取厂商数据

    public ngOnInit() {
    }

    // 品牌
    private requestAllCheckedCarBrands() {
        this.requestBrandSubscription = this.vehicleService
            .requestCarBrandsListData().pipe(map((carBrands: any) => {
                    return carBrands.results.map((carBrand: any) =>
                        ({
                            ...carBrand,
                            key: carBrand.car_brand_id,
                            title: carBrand.car_brand_name,
                            children: [],
                            disableCheckbox: true,
                        }));
                }),
                switchMap(carBrandList => this.requestCheckedFactories(carBrandList))).subscribe(carBrandList => {
                this.letter_list.forEach(leter => {
                    this.mapOfBrand[leter] = carBrandList.filter(
                        (brand: any) => brand.car_brand_initial === leter
                    );
                });
                this.loading = false;
                timer(1000).subscribe(() => {
                    const carDetail = this.car_series_list[0];
                    if (carDetail) {
                        const car_param = carDetail.car_param;
                        this.defaultCheckedKeys = [car_param.car_param_id];
                        this.defaultExpandedKeys =
                            [car_param.car_brand_id, car_param.car_factory_id,
                                car_param.car_series_id, car_param.car_series_id + '-' + car_param.car_displacement];
                    }
                });
            }, err => {
                this.loading = false;
                $('#selectMultiBrandFirmModal').modal('hide');
                this.globalService.httpErrorProcess(err);
            });
    }

    // 厂商
    private requestCheckedFactories(carBrandList): Observable<any> {
        return this.vehicleService.requestCarFactoryListData(this.car_series_list[0].car_param.car_brand_id)
            .pipe(switchMap((carFactorys: any) => {
                const carBrand = carBrandList.find(item => item.car_brand_id === this.car_series_list[0].car_param.car_brand_id);
                const carFactoryRes = carFactorys.results.map((carFactory: any) =>
                    ({
                        ...carFactory,
                        key: carFactory.car_factory_id,
                        title: carFactory.car_factory_name,
                        children: [],
                        disableCheckbox: true,
                    }));
                carBrand.children = carFactoryRes;
                return this.requestCheckedSeries(carBrandList);
            }));
    }

    // 车系
    private requestCheckedSeries(carBrandList): Observable<any> {
        return this.vehicleService
            .requestCarSeriesListData(this.car_series_list[0].car_param.car_brand_id, this.car_series_list[0].car_param.car_factory_id)
            .pipe(switchMap((httpRes: any) => {
                const carBrand = carBrandList.find(item => item.car_brand_id === this.car_series_list[0].car_param.car_brand_id);
                const carFactory = carBrand.children.find(item => item.car_factory_id === this.car_series_list[0].car_param.car_factory_id);
                const carSeriesRes = httpRes.results.map((httpRe: any) =>
                    ({
                        ...httpRe,
                        key: httpRe.car_series_id,
                        title: httpRe.car_series_name,
                        children: [],
                        disableCheckbox: true,
                    }));
                carFactory.children = carSeriesRes;
                return this.requestCheckedDisplacement(carBrandList);
            }));
    }

    // 排量
    private requestCheckedDisplacement(carBrandList): Observable<any> {
        const car_param = this.car_series_list[0].car_param;
        return this.vehicleService
            .requestCarParamsListData(car_param.car_series_id).pipe(switchMap((httpRes: any) => {
                const carBrand = carBrandList.find(item => item.car_brand_id === car_param.car_brand_id);
                const carFactory = carBrand.children.find(item => item.car_factory_id === car_param.car_factory_id);
                const carSeries = carFactory.children.find(item => item.car_series_id === car_param.car_series_id);
                const carDisplacement = httpRes.map((httpRe: any) =>
                    ({
                        key: car_param.car_series_id + '-' + httpRe,
                        title: httpRe,
                        children: [],
                        disableCheckbox: true,
                    }));
                carSeries.children = carDisplacement;
                return this.requestCheckedYear(carBrandList);
            }));
    }

    // 排量
    private requestCheckedYear(carBrandList): Observable<any> {
        const car_param = this.car_series_list[0].car_param;
        return this.vehicleService.requestCarYearListData
        (car_param.car_series_id, car_param.car_displacement)
            .pipe(switchMap((httpRes: any) => {
                const carBrand = carBrandList.find(item => item.car_brand_id === car_param.car_brand_id);
                const carFactory = carBrand.children.find(item => item.car_factory_id === car_param.car_factory_id);
                const carSeries = carFactory.children.find(item => item.car_series_id === car_param.car_series_id);
                const carDisplacements = carSeries.children.find(item => item.key === (car_param.car_series_id + '-' + car_param.car_displacement));
                const carYear = httpRes.results.map((httpRe: any) =>
                    ({
                        ...httpRe,
                        isLeaf: true,
                        key: httpRe.car_param_id,
                        title: httpRe.car_year_num,
                        checked: httpRe.car_param_id === car_param.car_param_id,
                    }));
                carDisplacements.children = carYear;
                return of(carBrandList);
            }));
    }

    /**
     * 打开
     */
    public open(data: any, sureFunc: any, closeFunc: any = null): any {
        $('.tree_ul').scrollTop(0);
        this.initModal();
        this.accessory_id = data.accessory_id;
        this.car_series_list = data.car_series_list || [];
        this.requestAllCheckedCarBrands();
        this.sureCallback = sureFunc;
        this.closeCallback = closeFunc;
        timer(0).subscribe(() => {
            $('#selectMultiBrandFirmModal').modal();
        });
    }

    /**
     * 关闭
     */
    public close(): any {
        this.initModal();
        this.requestBrandSubscription &&
        this.requestBrandSubscription.unsubscribe();
        this.requestFirmSubscription && this.requestFirmSubscription.unsubscribe();
        $('#selectMultiBrandFirmModal').modal('hide');
    }

    // 初始化
    private initModal(): void {
        this.loading = true;
        this.accessory_id = '';
        this.car_series_list = [];
        this.defaultCheckedKeys = [];
        this.defaultExpandedKeys = [];
    }

    // 加载下级菜单
    public onNzExpand(event: any): void {
        if (event.eventName === 'expand') {
            const node = event.node;
            if (node && node.getChildren().length === 0 && node.isExpanded) {
                if (node.level === 0) {
                    // 根据品牌获取厂商
                    this.requestFirmListByBrand(node);
                } else if (node.level === 1) {
                    // 根据厂商获取汽车车系
                    this.requestSeriesListByFirm(node);
                } else if (node.level === 2) {
                    // 根据车系获取汽车排量
                    this.requestCarParamsListByFirm(node);
                } else if (node.level === 3) {
                    // 根据排量获取汽车年份
                    this.requestCarYearListByFirm(node);
                }
            }
        }
    }

    // 复选>选中父级默认勾选子级
    public onNzCheck(event: any): void {
        if (event.eventName === 'check') {
            const node = event.node;
            if (node.isChecked) {
                if (node.level === 4) {
                    const parentNode = node.parentNode;
                    if (parentNode && parentNode.getChildren().length) {
                        parentNode.getChildren().forEach(item => item.isChecked = false);
                        node.isChecked = true;
                        this.defaultCheckedKeys = [node.key];
                        // const _parentNode = [parentNode.key];
                        // const firstNode = node.parentNode.parentNode;
                        // firstNode && _parentNode.push(firstNode.key);
                        // this.defaultExpandedKeys = _parentNode;
                    }
                }
            }
        }
    }

    /**
     * 展开时根据品牌填充对应厂商节点
     * @param node 品牌节点(一级)
     */
    private requestFirmListByBrand(node: any): void {
        const car_brand_id = node.origin.car_brand_id;
        this.vehicleService.requestCarFactoryListData(car_brand_id).subscribe(
            res => {
                const carFactoryList = res.results;
                const newVehicleFirmList = carFactoryList.map(carFactory => ({
                    ...carFactory,
                    key: carFactory.car_factory_id,
                    title: carFactory.car_factory_name,
                    disableCheckbox: true,
                }));
                node.addChildren(newVehicleFirmList);
            }, err => {
                $('#selectMultiBrandFirmModal').modal('hide');
                this.globalService.httpErrorProcess(err);
            }
        );
    }

    /**
     * 根据厂商填充对应车系节点
     * @param node 厂商节点(二级)
     */
    private requestSeriesListByFirm(node: any): void {
        this.isRequestYearData = true;
        const car_brand_id = node.parentNode.origin.car_brand_id;
        const car_factory_id = node.origin.car_factory_id;
        this.vehicleService.requestCarSeriesListData(car_brand_id, car_factory_id)
            .subscribe(res => {
                const carSeriesList = res.results;
                const newVehicleSeriesList = carSeriesList.map(series => ({
                    ...series,
                    key: series.car_series_id,
                    title: series.car_series_name,
                    checked: node.isChecked,
                    disableCheckbox: true,
                }));
                node.addChildren(newVehicleSeriesList);
                this.isRequestYearData = false;
            }, err => {
                this.isRequestYearData = false;
                $('#selectMultiBrandFirmModal').modal('hide');
                this.globalService.httpErrorProcess(err);
            });
    }

    /**
     * 根据车系填充对应排量节点
     * @param node 排量节点(三级)
     */
    private requestCarParamsListByFirm(node: any): void {
        this.isRequestYearData = true;
        const car_series_id = node.origin.car_series_id;
        this.vehicleService.requestCarParamsListData(car_series_id)
            .subscribe(res => {
                const carParamList = res;
                const newVehicleParamList = carParamList.map(param => ({
                    key: node.origin.car_series_id + '-' + param,
                    title: param,
                    checked: node.isChecked,
                    disableCheckbox: true,
                }));
                node.addChildren(newVehicleParamList);
                this.isRequestYearData = false;
            }, err => {
                this.isRequestYearData = false;
                $('#selectMultiBrandFirmModal').modal('hide');
                this.globalService.httpErrorProcess(err);
            });
    }

    /**
     * 根据排量填充对应年份节点
     * @param node 年份节点(四级)
     */
    private requestCarYearListByFirm(node: any): void {
        this.isRequestYearData = true;
        const car_series_id = node.parentNode.origin.car_series_id;
        const _car_displacements = node.key.split('-');
        const car_displacement = _car_displacements.length === 2 ? _car_displacements[1] : _car_displacements[0];
        this.vehicleService.requestCarYearListData(car_series_id, car_displacement)
            .subscribe(res => {
                const carDetail = this.car_series_list[0];
                const car_param = carDetail.car_param;
                const carYearList = res.results;
                const newVehicleYearList = carYearList.map(param => ({
                    ...param,
                    isLeaf: true,
                    key: param.car_param_id,
                    title: param.car_year_num,
                    checked: param.car_param_id === car_param.car_param_id,
                }));
                node.addChildren(newVehicleYearList);
                this.isRequestYearData = false;
            }, err => {
                this.isRequestYearData = false;
                $('#selectMultiBrandFirmModal').modal('hide');
                this.globalService.httpErrorProcess(err);
            });
    }

    // 回传选中事件
    public onSelectCarSeries(): void {
    }

    // 获取选中的车系ID
    private getCheckedSeriesId(): Array<any> {
        const seriesList = [];
        for (const item of Object.keys(this.mapOfBrand)) {
            this.mapOfBrand[item].forEach(carBrand => {
                if (carBrand.checked) {
                    // 第一级勾选
                    if (carBrand.children) {
                        // 由于第二级全部勾选导致第一级勾选
                        this.getThirdChecked(carBrand, seriesList);
                    } else {
                        // 第一级全部勾选上
                        seriesList.push(carBrand);
                    }
                } else {
                    // 第一级未勾选
                    this.getThirdChecked(carBrand, seriesList);
                }
            });
        }
        return seriesList;
    }

    // 获取第三级勾选数据
    private getThirdChecked(firstLevel: any, seriesList: any): void {
        if (firstLevel.children) {
            // 第二级有部分勾选
            firstLevel.children.forEach((secondLevel: any) => {
                if (secondLevel.checked) {
                    if (secondLevel.children) {
                        // 第三级全部勾选导致第二级被勾选
                        seriesList.push(secondLevel.children);
                    } else {
                        // 第二级全部勾选
                        seriesList.push(secondLevel);
                    }
                } else if (!secondLevel.checked) {
                    // 第二级未勾选
                    if (secondLevel.children) {
                        // 第三级有部分勾选
                        secondLevel.children.forEach((item: any) => {
                            if (item.checked) {
                                seriesList.push(item);
                            }
                        });
                    }
                }
            });
        } else {
            // 均未勾选
            seriesList = [];
        }
    }

}
