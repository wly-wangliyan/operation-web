import { Component } from '@angular/core';
import { initializer } from '../../initializer';
import { AuthService } from '../../core/auth.service';
import { HttpService } from '../../core/http.service';

@Component({
    selector: 'app-store-maintenance-entry',
    templateUrl: './store-maintenance-entry.component.html',
    styleUrls: ['./store-maintenance-entry.component.css']
})
export class StoreMaintenanceEntryComponent {

    constructor(private authService: AuthService, private httpService: HttpService) {
        authService.authorizeBySecretKey(initializer.user);
        httpService.setStartTimeStamp(initializer.startTimeStamp);
    }
}
