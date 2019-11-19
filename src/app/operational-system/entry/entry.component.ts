import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { HttpService } from '../../core/http.service';
import { initializer } from '../../initializer';

@Component({
    selector: 'app-entry',
    templateUrl: './entry.component.html',
    styleUrls: ['./entry.component.css']
})
export class EntryComponent {

    constructor(private authService: AuthService, private httpService: HttpService) {
        authService.authorizeBySecretKey(initializer.user);
        httpService.setStartTimeStamp(initializer.startTimeStamp);
    }

}
