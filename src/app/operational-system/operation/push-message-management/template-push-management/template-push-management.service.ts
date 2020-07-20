import { Injectable } from '@angular/core';
import { HttpService } from '../../../../core/http.service';
import { EntityBase } from '../../../../../utils/z-entity';


export class TemplatePushManagementEntity extends EntityBase {
    public template_title: string = undefined;
    public content: TemplatePushManagementContent = undefined;

    public getPropertyClass(propertyName: string): typeof EntityBase {
        if (propertyName === 'content') {
            return TemplatePushManagementContent;
        }
        return null;
    }
}

class TemplatePushManagementContent extends EntityBase {
    public title1: string = undefined;
    public title2: string = undefined;
    public templateList = [{templateName: '', dateTime: new Date().getTime()}];
}

@Injectable({
    providedIn: 'root'
})
export class TemplatePushManagementService {

    constructor(private httpService: HttpService) {
    }
}
