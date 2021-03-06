import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { ValidateHelper } from '../../utils/validate-helper';
import { LocalStorageProvider } from '../share/localstorage-provider';
import { LoginHttpService, LoginParams } from './login-http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginParams = new LoginParams();

  public errorMsg = '';

  public loginError = false;

  @ViewChild('eyeIcon', { static: false }) eyeIcon: ElementRef;

  @ViewChild('password', { static: false }) password: ElementRef;

  @ViewChild('username', { static: false }) username: ElementRef;

  @ViewChild('routerDiv', { static: false }) public routerDiv: ElementRef;

  constructor(
    private loginHttpService: LoginHttpService,
    private authService: AuthService,
    private renderer2: Renderer2) {
    this.loginParams.username = LocalStorageProvider.Instance.get(LocalStorageProvider.HistoryLoginName);
  }

  public ngOnInit() {
  }

  // 密码明文暗文切换
  public onEyeIconClick() {
    const eyeIcon = this.eyeIcon.nativeElement.className;
    if (eyeIcon === 'eye-icon-show') {
      this.renderer2.setAttribute(this.password.nativeElement, 'type', 'password');
      this.renderer2.setAttribute(this.eyeIcon.nativeElement, 'class', 'eye-icon-hidden');
    } else {
      this.renderer2.setAttribute(this.password.nativeElement, 'type', 'text');
      this.renderer2.setAttribute(this.eyeIcon.nativeElement, 'class', 'eye-icon-show');
    }
  }

  // login
  public onLogin() {
    if (!this.loginParams.username || !this.loginParams.username.trim() || !this.loginParams.password) {
      this.loginError = true;
      this.errorMsg = '用户名称与密码不能为空!';
      return;
    }

    if (!ValidateHelper.NoSpace(this.loginParams.password, 1, 20)) {
      this.loginError = true;
      this.errorMsg = '账号或者密码错误！';
      return;
    }

    this.errorMsg = '';
    this.loginHttpService.requestLogin(this.loginParams).subscribe(data => {
      LocalStorageProvider.Instance.set(LocalStorageProvider.HistoryLoginName, data.username);
      this.authService.authorizeByLogin();
    }, err => {
      this.loginError = true;
      this.errorMsg = '账号或者密码错误！';
    });
  }
}
