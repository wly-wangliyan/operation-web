import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { ShareModule } from '../share/share.module';
import { LoginComponent } from './login.component';
import { LoginHttpService } from './login-http.service';

@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        FormsModule,
        ShareModule
    ],
    declarations: [LoginComponent],
    providers: [LoginHttpService]
})
export class LoginModule {
}
