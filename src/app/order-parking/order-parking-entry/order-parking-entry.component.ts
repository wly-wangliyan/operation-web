import { Component } from '@angular/core';
import { initializer } from '../../initializer';
import { AuthService } from '../../core/auth.service';
import { HttpService } from '../../core/http.service';

@Component({
  selector: 'app-order-parking-entry',
  templateUrl: './order-parking-entry.component.html',
  styleUrls: ['./order-parking-entry.component.css']
})
export class OrderParkingEntryComponent {
  constructor(private authService: AuthService, private httpService: HttpService) {
    authService.authorizeBySecretKey(initializer.user);
    httpService.setStartTimeStamp(initializer.startTimeStamp);
  }
}
