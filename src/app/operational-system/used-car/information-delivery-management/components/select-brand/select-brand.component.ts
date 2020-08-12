import { Component, EventEmitter, Output } from '@angular/core';
import { GlobalService } from '../../../../../core/global.service';
import { Observable, of, Subscription, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { InformationDeliveryCarParam, InformationDeliveryManagementService } from '../../information-delivery-management.service';

@Component({
    selector: 'app-select-brand',
    templateUrl: './select-brand.component.html',
    styleUrls: ['./select-brand.component.css']
})
export class SelectBrandComponent {

    constructor(
        private globalService: GlobalService,
        private informationDeliveryManagementService: InformationDeliveryManagementService,
    ) {
    }

    public letter_list = ['A', 'B', 'C', 'D',
        'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
    public mapOfBrand: { [key: string]: Array<any> } = {}; // 字母对应品牌
    public defaultExpandedKeys = [];
    public defaultCheckedKeys = [];
    public loading = true;
    @Output() public selectedBrandEvent = new EventEmitter();
    private carParam: InformationDeliveryCarParam = new InformationDeliveryCarParam(); // 已勾选的数组
    private isRequestYearData = false;
    private sureCallback: any;
    private closeCallback: any;
    private requestBrandSubscription: Subscription; // 获取品牌数据
    private requestFirmSubscription: Subscription; // 获取厂商数据

    // 品牌
    private requestAllCheckedCarBrands(isEdit = false) {
        this.requestBrandSubscription = this.informationDeliveryManagementService
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
                switchMap(carBrandList => {
                    return isEdit ? this.requestCheckedFactories(carBrandList) : of(carBrandList);
                })).subscribe(carBrandList => {
                this.letter_list.forEach(leter => {
                    this.mapOfBrand[leter] = carBrandList.filter(
                        (brand: any) => brand.car_brand_initial === leter
                    );
                });
                this.loading = false;
                timer(0).subscribe(() => {
                    const car_param = this.carParam;
                    this.defaultCheckedKeys = [car_param.car_param_id];
                    this.defaultExpandedKeys =
                        [car_param.car_brand.car_brand_id, car_param.car_factory.car_factory_id,
                            car_param.car_series.car_series_id, car_param.car_series.car_series_id + '-' + car_param.car_displacement];
                });
            }, err => {
                this.loading = false;
                $('#selectMultiBrandFirmModal').modal('hide');
                this.globalService.httpErrorProcess(err);
            });
    }

    // 厂商
    private requestCheckedFactories(carBrandList): Observable<any> {
        return this.informationDeliveryManagementService.requestCarFactoryListData(this.carParam.car_brand.car_brand_id)
            .pipe(switchMap((carFactorys: any) => {
                const carBrand = carBrandList.find(item => item.car_brand_id === this.carParam.car_brand.car_brand_id);
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
        return this.informationDeliveryManagementService
            .requestCarSeriesListData(this.carParam.car_brand.car_brand_id, this.carParam.car_factory.car_factory_id)
            .pipe(switchMap((httpRes: any) => {
                const carBrand = carBrandList.find(item => item.car_brand_id === this.carParam.car_brand.car_brand_id);
                const carFactory = carBrand.children.find(item => item.car_factory_id === this.carParam.car_factory.car_factory_id);
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
        return this.informationDeliveryManagementService
            .requestCarParamsListData(this.carParam.car_series.car_series_id).pipe(switchMap((httpRes: any) => {
                const carBrand = carBrandList.find(item => item.car_brand_id === this.carParam.car_brand.car_brand_id);
                const carFactory = carBrand.children.find(item => item.car_factory_id === this.carParam.car_factory.car_factory_id);
                const carSeries = carFactory.children.find(item => item.car_series_id === this.carParam.car_series.car_series_id);
                const carDisplacement = httpRes.map((httpRe: any) =>
                    ({
                        key: this.carParam.car_series.car_series_id + '-' + httpRe,
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
        return this.informationDeliveryManagementService.requestCarYearListData
        (this.carParam.car_series.car_series_id, this.carParam.car_displacement)
            .pipe(switchMap((httpRes: any) => {
                const carBrand = carBrandList.find(item => item.car_brand_id === this.carParam.car_brand.car_brand_id);
                const carFactory = carBrand.children.find(item => item.car_factory_id === this.carParam.car_factory.car_factory_id);
                const carSeries = carFactory.children.find(item => item.car_series_id === this.carParam.car_series.car_series_id);
                const carDisplacements =
                    carSeries.children.find
                    (item => item.key === (this.carParam.car_series.car_series_id + '-' + this.carParam.car_displacement));
                const carYear = httpRes.results.map((httpRe: any) =>
                    ({
                        ...httpRe,
                        isLeaf: true,
                        key: httpRe.car_param_id,
                        title: httpRe.car_year_num,
                        checked: httpRe.car_param_id === this.carParam.car_param_id,
                    }));
                carDisplacements.children = carYear;
                return of(carBrandList);
            }));
    }

    /**
     * 打开
     */
    public open(data: InformationDeliveryCarParam, sureFunc: any, closeFunc: any = null): any {
        $('.tree_ul').scrollTop(0);
        this.initModal();
        this.carParam = data || new InformationDeliveryCarParam();
        this.requestAllCheckedCarBrands(!!data.car_param_id);
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
        this.carParam = new InformationDeliveryCarParam();
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
        this.informationDeliveryManagementService.requestCarFactoryListData(car_brand_id).subscribe(
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
        this.informationDeliveryManagementService.requestCarSeriesListData(car_brand_id, car_factory_id)
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
        this.informationDeliveryManagementService.requestCarParamsListData(car_series_id)
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
        this.informationDeliveryManagementService.requestCarYearListData(car_series_id, car_displacement)
            .subscribe(res => {
                const car_param = this.carParam;
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
        this.selectedBrandEvent.emit(this.defaultCheckedKeys[0]);
        if (this.sureCallback) {
            const temp = this.sureCallback;
            this.closeCallback = null;
            this.sureCallback = null;
            temp();
        }
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
