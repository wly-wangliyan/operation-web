import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TransformFontHelper } from '../../../../utils/transform-font';
import { timer } from 'rxjs/index';

export class RegionEntity {
    public province: string;
    public city: string;
    public district: string;
    public region_id: string;

    constructor(source?: any) {
        if (source) {
            this.province = source.province ? TransformFontHelper.transformToSimple(source.province) : '';
            this.city = source.city ? TransformFontHelper.transformToSimple(source.city) : '';
            this.district = source.district ? TransformFontHelper.transformToSimple(source.district) : '';
            this.region_id = source.region_id ? source.region_id : '';
        }
    }
}

@Component({
    selector: 'app-pro-city-dist-select',
    templateUrl: './pro-city-dist-select.component.html',
    styleUrls: ['./pro-city-dist-select.component.css']
})
export class ProCityDistSelectComponent implements OnChanges {

    private _dirty = false;

    private specialRegions = ['710000', '810000', '820000'];

    private municipalitiesRegions = ['110000', '120000', '310000', '500000', '500100', '500200']; // 直辖市adcodde

    private selectRegionIdObj = {
        pro_region_id: '',
        city_region_id: '',
        dist_region_id: '',
    };

    private district: any;

    public hasCity = true;

    public regionLevel = {
        country: 'country',
        province: 'province',
        city: 'city',
        district: 'district'
    };

    public get dirty(): boolean {
        return this._dirty;
    }

    public get selectedRegions(): RegionEntity {
        return this.regionsObj;
    }

    public get selectedAddress(): string {
        let address = '';
        for (const region in this.regionsObj) {
            if (this.regionsObj.hasOwnProperty(region)) {
                address += this.regionsObj[region];
            }
        }
        return address;
    }

    @Input() public selectContainerWidth = '355';

    @Input() public selectWidth = '115';

    @Input() public isEdit = true;

    @Input() public regionsObj: RegionEntity = new RegionEntity();

    @Output() public regionIdChanged = new EventEmitter();

    @ViewChild('pro', {static: false}) public pro: ElementRef;

    @ViewChild('city', {static: false}) public city: ElementRef;

    @ViewChild('dist', {static: false}) public dist: ElementRef;

    constructor() {
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.regionsObj) {
            this.initRegions(changes.regionsObj);
        }
        if (changes.isEdit) {
            this.initRegions(this.regionsObj);
        }
    }

    // 初始化省市区数据
    public initRegions(regionsObj?: any) {
        try {
            if (AMap) {
                // 行政区划查询
                const opts = {
                    subdistrict: 1, // 返回下一级行政区
                    showbiz: false // 最后一级返回街道信息
                };

                AMap.service('AMap.DistrictSearch', () => {
                    // 实例化DistrictSearch，注意：需要使用插件同步下发功能才能这样直接使用
                    this.district = new AMap.DistrictSearch(opts);
                    // this.requestRegionsById('中国', this.regionLevel.country, true);
                    if (!regionsObj) {
                        timer(0).subscribe(() => {
                            console.log('requestCityInfo');
                            this.requestRegionsById('中国', this.regionLevel.country, false);
                            // this.requestCityInfo();
                        });
                    } else {
                        console.log(regionsObj);
                        this.requestRegionsById('中国', this.regionLevel.country, false);
                        this.requestMunicipalitiesRegions(this.regionsObj.region_id);
                    }
                });
            }
        } catch (e) {
        }
    }

    /**
     * 根据IP定位获取当前城市信息
     */
    public requestCityInfo() {
        // 实例化城市查询类
        const citySearch = new AMap.CitySearch();
        // 自动获取用户IP，返回当前城市
        citySearch.getLocalCity((status, result) => {
            if (status === 'complete' && result.info === 'OK') {
                this.regionsObj.province = result.province ? result.province : '';
                this.regionsObj.city = result.city ? result.city : '';
                this.regionsObj.district = '';
                this.regionsObj.region_id = result.adcode ? result.adcode : '';
                this.requestMunicipalitiesRegions(this.regionsObj.region_id);
            }
        });
    }

    public getRegionsData(data: any, _level: string, isRequestNextLevel: boolean) {
        const subList = data.districtList;
        // 清空下一级别的下拉列表
        this.cleanNextLevelData(_level);

        if (subList) {
            const level = subList[0].level;
            const proAdcode = this.requestReplaceAdcode(this.regionsObj.region_id, this.regionLevel.province);
            const cityAdcode = this.requestReplaceAdcode(this.regionsObj.region_id, this.regionLevel.city);
            let dom = '';

            for (const index in subList) {
                if (subList.hasOwnProperty(index)) {
                    const isSelected = (level === this.regionLevel.province) && (subList[index].name === this.regionsObj.province)
                        || (level === this.regionLevel.city) && (subList[index].name === this.regionsObj.city)
                        || ((level === this.regionLevel.district) && (subList[index].name === this.regionsObj.district));
                    if (isSelected) {
                        dom += '<option id="' + subList[index].adcode + '" value="' + subList[index].name + '" selected>'
                            + subList[index].name + '</option>';
                    } else {
                        dom += '<option id="' + subList[index].adcode + '" value="' + subList[index].name + '">' + subList[index].name + '</option>';
                    }
                }
            }

            if (level === this.regionLevel.province) {
                this.pro && $(this.pro.nativeElement).append(dom);
                if (isRequestNextLevel) {
                    this.requestRegionsById(proAdcode, this.regionLevel.city, true);
                }
            } else if (level === this.regionLevel.city) {
                this.city && $(this.city.nativeElement).append(dom);
                if (isRequestNextLevel) {
                    this.requestRegionsById(cityAdcode, this.regionLevel.district, true);
                }
            } else if (level === this.regionLevel.district) {
                this.dist && $(this.dist.nativeElement).append(dom);
            }
        }
    }

    public searchRegion(event: any, level: string) {
        const adcode = $(event.target).find('option:selected').attr('id');
        const name = event.target.value ? event.target.value : '';
        this._dirty = true;
        if (level === this.regionLevel.province) {
            this.selectRegionIdObj.pro_region_id = adcode;
            this.selectRegionIdObj.city_region_id = this.selectRegionIdObj.dist_region_id = '';
            this.regionsObj.province = adcode ? name : '';
            this.regionsObj.city = this.regionsObj.district = '';
            this.isSpecialRegion(adcode);
        }
        if (level === this.regionLevel.city) {
            this.selectRegionIdObj.city_region_id = adcode;
            this.selectRegionIdObj.dist_region_id = '';
            this.regionsObj.city = adcode ? name : '';
            this.regionsObj.district = '';
        }
        if (level === this.regionLevel.district) {
            this.selectRegionIdObj.dist_region_id = adcode;
            this.regionsObj.district = adcode ? name : '';
        }
        this.regionsObj.region_id = this.selectRegionIdObj.dist_region_id ? this.selectRegionIdObj.dist_region_id
            : this.selectRegionIdObj.city_region_id;
        this.regionsObj.region_id = this.regionsObj.region_id ? this.regionsObj.region_id : this.selectRegionIdObj.pro_region_id;
        this.regionIdChanged.emit(this.regionsObj);

        if (!adcode) {
            if (level === this.regionLevel.province) {
                this.requestRegionsById('中国', this.regionLevel.country, false);
            }
            return;
        }
        this.requestRegionsById(this.regionsObj.region_id, level);
    }

    // 判断是否是特殊adcode
    public isSpecialRegion(adcode: string) {
        if (adcode && this.specialRegions.indexOf(adcode) !== -1) {
            this.hasCity = false;
            return;
        }
        this.hasCity = true;
    }

    // 判断是否是直辖市
    public requestMunicipalitiesRegions(adcode: string) {
        const proAdcode = this.requestReplaceAdcode(adcode, this.regionLevel.province);
        const cityAdcode = this.requestReplaceAdcode(adcode, this.regionLevel.city);

        if (proAdcode && this.municipalitiesRegions.indexOf(proAdcode) !== -1) {
            switch (proAdcode) {
                case this.municipalitiesRegions[0]:
                    this.regionsObj.city = '北京城区';
                    return;
                case this.municipalitiesRegions[1]:
                    this.regionsObj.city = '天津城区';
                    return;
                case this.municipalitiesRegions[2]:
                    this.regionsObj.city = '上海城区';
                    return;
                case this.municipalitiesRegions[3]:
                    if (cityAdcode === this.municipalitiesRegions[4]) {
                        this.regionsObj.city = '重庆城区';
                    } else if (cityAdcode === this.municipalitiesRegions[5]) {
                        this.regionsObj.city = '重庆郊县';
                    }
                    return;
            }
        } else {
            this.isSpecialRegion(proAdcode);
        }
    }

    // 按照adcode进行查询可以保证数据返回的唯一性
    private requestRegionsById(adcode: string, level: string, isRequestNextLevel = false) {
        this.district.search(adcode, (status, result) => {
            if (status === 'complete') {
                this.getRegionsData(result.districtList[0], level, isRequestNextLevel);
            }
        });
    }

    // 清空下一级别的下拉列表
    private cleanNextLevelData(level: string) {
        if (level === this.regionLevel.country) {
            this.pro && $(this.pro.nativeElement).html('<option value="">所在省</option>');
            this.city && $(this.city.nativeElement).html('<option value="">所在市</option>');
            this.dist && $(this.dist.nativeElement).html('<option value="">所在区</option>');
        } else if (level === this.regionLevel.province) {
            this.city && $(this.city.nativeElement).html('<option value="">所在市</option>');
            this.dist && $(this.dist.nativeElement).html('<option value="">所在区</option>');
        } else if (level === this.regionLevel.city) {
            this.dist && $(this.dist.nativeElement).html('<option value="">所在区</option>');
        }
    }

    // 截取替换字符串
    private requestReplaceAdcode(adcode: string, searchLevel: string): string {
        if (adcode && searchLevel) {
            if (searchLevel === this.regionLevel.province) {
                return adcode.replace(/(\d{2})\d{4}/, '$10000');
            } else if (searchLevel === this.regionLevel.city) {
                return adcode.replace(/(\d{4})\d{2}/, '$100');
            }
        }
    }
}
