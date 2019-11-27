import { Component } from '@angular/core';
import { initializer } from '../../initializer';
import { AuthService } from '../../core/auth.service';
import { HttpService } from '../../core/http.service';

@Component({
  selector: 'app-exemption-entry',
  templateUrl: './exemption-entry.component.html',
  styleUrls: ['./exemption-entry.component.css']
})
export class ExemptionEntryComponent {
  constructor(private authService: AuthService, private httpService: HttpService) {
    authService.authorizeBySecretKey(initializer.user);
    httpService.setStartTimeStamp(initializer.startTimeStamp);
  }
}
