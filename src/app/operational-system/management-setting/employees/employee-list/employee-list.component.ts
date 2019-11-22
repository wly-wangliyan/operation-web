import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription, forkJoin } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { EmployeeHttpService, UserSearchParams, UserEditParams, PermissionItem } from '../employee-http.service';
import { UserEntity, AuthService } from '../../../../core/auth.service';
import { GlobalService } from '../../../../core/global.service';
import { ValidateHelper } from '../../../../../utils/validate-helper';
import { HttpErrorEntity } from 'src/app/core/http.service';

const PageSize = 15;

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit, OnDestroy {


  public searchParams: UserSearchParams = new UserSearchParams();

  public dataList: Array<UserEntity> = [];

  private requestSubscription: Subscription; // linkUrl分页取数

  private continueRequestSubscription: Subscription; // linkUrl分页取数

  public pageIndex = 1; // 当前页码

  private linkUrl: string; // 分页URL

  public searchText$ = new Subject<any>();

  public noResultText = '数据加载中...';

  public isCreateEmployee: boolean; // 标记 true 新建 false 编辑

  private username: string; // 用户名

  public userParams: UserEditParams = new UserEditParams();

  public user: UserEntity = new UserEntity(); // 用户详情

  public permissionList: Array<PermissionItem> = [];

  public employeeErrMsg = ''; // 错误提示信息

  private is_save = false; // true:保存进行中

  // 获取当前记录总页数
  private get pageCount(): number {
    if (this.dataList.length % PageSize === 0) {
      return this.dataList.length / PageSize;
    }
    return this.dataList.length / PageSize + 1;
  }

  /**
   * 获取是否有权限被选中了(表单校验)
   * @returns boolean
   */
  public get permissionChecked(): boolean {
    for (const permission of this.permissionList) {
      if (permission.isChecked) {
        return true;
      }
    }
    return false;
  }

  constructor(
    private globalService: GlobalService,
    private authService: AuthService,
    private employeeHttpService: EmployeeHttpService) {
  }

  public ngOnInit() {
    this.generateUserList();
  }

  public ngOnDestroy() {
    this.searchText$ && this.searchText$.unsubscribe();
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 初始化列表
  private generateUserList(): void {
    // 定义查询延迟时间
    this.searchText$.pipe(debounceTime(500)).subscribe(() => {
      this.requestUserListData();
    });
    this.searchText$.next();
  }

  /** 请求用户列表 */
  private requestUserListData() {
    this.requestSubscription = this.employeeHttpService.requestUserList(this.searchParams).subscribe(res => {
      this.pageIndex = 1; // 重置页码为第一页
      this.dataList = res.results;
      this.linkUrl = res.linkUrl;
      this.noResultText = '暂无数据';
    }, err => {
      this.pageIndex = 1;
      this.noResultText = '暂无数据';
      this.globalService.httpErrorProcess(err);
    });
  }

  // 查询按钮
  public onSearchBtnClick(): void {
    this.searchText$.next();
    this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
  }

  // 重置密码
  public onResetPasswordBtnClick(dataItem: UserEntity) {
    this.globalService.confirmationBox.open('提示', '是否确定重置密码，此操作不可逆！', () => {
      this.globalService.confirmationBox.close();
      this.employeeHttpService.requestResetPassword(dataItem.username).subscribe(() => {
        this.globalService.promptBox.open('将重置密码为手机号后6位，请牢记！');
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
  }

  // 删除员工
  public onDeleteItemClick(dataItem: UserEntity) {
    this.globalService.confirmationBox.open('提示', '删除后将不可恢复，确认删除吗？', () => {
      this.globalService.confirmationBox.close();
      this.employeeHttpService.requestDeleteUser(dataItem.username).subscribe(() => {
        this.searchText$.next();
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    });
  }

  // 分页
  public onNZPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    if (pageIndex + 1 >= this.pageCount && this.linkUrl) {
      // 当存在linkUrl并且快到最后一页了请求数据
      this.continueRequestSubscription && this.continueRequestSubscription.unsubscribe();
      this.continueRequestSubscription = this.employeeHttpService.continueUserList(this.linkUrl).subscribe(res => {
        this.dataList = this.dataList.concat(res.results);
        this.linkUrl = res.linkUrl;
      }, err => {
        this.globalService.httpErrorProcess(err);
      });
    }
  }


  /** 模态框处理区 */

  /** 添加、编辑 */
  public onShowModal(data?: UserEntity): void {
    this.employeeErrMsg = '';
    this.is_save = false;
    if (data) {
      this.isCreateEmployee = false;
      this.username = data.username;
    } else {
      this.isCreateEmployee = true;
      this.userParams = new UserEditParams();
    }
    this.getPermissionGroups();
  }

  // 获取权限组列表
  private getPermissionGroups(): void {
    this.globalService.permissionGroups.subscribe(groups => {
      this.permissionList = [];
      groups.forEach(group => {
        const permissionItem = new PermissionItem(group);
        if (group.english_name === 'management') {
          if (!this.authService.user || !this.authService.user.is_superuser) {
            permissionItem.isDisabled = true;
          }
        }
        this.permissionList.push(permissionItem);
      });
      if (!this.isCreateEmployee) {
        this.getEmployeeInfo();
      }
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  // 获取用户详情
  private getEmployeeInfo(): void {
    this.employeeHttpService.requestUserInfo(this.username).subscribe(employee => {
      this.userParams = new UserEditParams(employee);
      const permission_groups = employee.permission_groups;
      if (permission_groups) {
        for (const permission of permission_groups) {
          const permissionIndex = this.permissionList.findIndex(item => permission.permission_group_id === item.source.permission_group_id);
          if (permissionIndex !== -1) {
            this.permissionList[permissionIndex].isChecked = true;
          }
        }
      }
    }, err => {
      this.globalService.httpErrorProcess(err);
    });
  }

  public onEditFormSubmit() {
    if (this.is_save) {
      return;
    }
    if (!this.generateAndCheckParamsValid(this.userParams, this.permissionList)) {
      return;
    }
    this.is_save = true;
    if (this.isCreateEmployee) {
      this.requestAddEmployee();
    } else {
      this.requestEditEmployee();
    }
  }

  // 添加用户
  private requestAddEmployee() {
    this.employeeHttpService.requestAddUser(this.userParams).subscribe(() => {
      $('#editEmployeeModal').modal('hide');
      this.globalService.promptBox.open('添加成功，密码为手机号后6位！');
      this.searchText$.next();
    }, err => {
      this.is_save = false;
      this.errorProcess(err);
    });
  }

  // 编辑用户
  private requestEditEmployee() {
    this.employeeHttpService.requestEditUser(this.userParams, this.username).subscribe(() => {
      $('#editEmployeeModal').modal('hide');
      this.globalService.promptBox.open('修改成功！', () => {
        if (this.username === this.authService.user.username) {
          // 如果编辑的是当前登录人的权限,需要刷新权限
          this.authService.refreshAuthorize();
        }
      });
      this.searchText$.next();
    }, err => {
      this.is_save = false;
      this.errorProcess(err);
    });
  }

  /**
   * 检查数据输入是否正确有效
   */
  public generateAndCheckParamsValid(userParams: UserEditParams, permissionList: Array<PermissionItem>): boolean {
    if (!ValidateHelper.Account(userParams.username)) {
      this.globalService.promptBox.open('用户名格式错误，请重新输入！', null, 2000, null, false);
      return false;
    }
    if (!ValidateHelper.Phone(userParams.telephone)) {
      this.globalService.promptBox.open('手机号格式错误，请重新输入！', null, 2000, null, false);
      return false;
    }
    if (!permissionList || permissionList.length === 0) {
      this.globalService.promptBox.open('请选择权限！', null, 2000, null, false);
      return false;
    }

    // 处理权限组
    const permissions = [];
    for (const permission_group of permissionList) {
      if (permission_group.isChecked) {
        permissions.push(permission_group.source.permission_group_id);
      }
    }
    userParams.permission_group_ids = permissions.toString();
    userParams.remark = userParams.remark ? userParams.remark.trim() : '';

    return true;
  }

  // 接口错误信息处理
  private errorProcess(err: any): void {
    if (!this.globalService.httpErrorProcess(err)) {
      if (err.status === 422) {
        const error: HttpErrorEntity = HttpErrorEntity.Create(err.error);

        for (const content of error.errors) {
          if (content.field === 'username' && content.code === 'already_exists') {
            this.globalService.promptBox.open('该用户名已存在，请重新输入', null, 2000, null, false);
            return;
          } else if (content.field === 'permission_group_ids' && content.code === 'invalid') {
            this.globalService.promptBox.open('该用户名已存在，请重新输入', null, 2000, null, false);
            return;
          } else {
            this.globalService.promptBox.open('参数错误或无效，请重试！', null, 2000, null, false);
          }
        }
      }
    }
  }
}
