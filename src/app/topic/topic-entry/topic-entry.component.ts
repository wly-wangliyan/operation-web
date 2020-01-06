import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { HttpService } from '../../core/http.service';
import { initializer } from '../../initializer';

@Component({
    selector: 'app-topic-entry',
    templateUrl: './topic-entry.component.html',
    styleUrls: ['./topic-entry.component.css']
})
export class TopicEntryComponent {

    constructor(private authService: AuthService, private httpService: HttpService) {
        authService.authorizeBySecretKey(initializer.user);
        httpService.setStartTimeStamp(initializer.startTimeStamp);
    }
}
