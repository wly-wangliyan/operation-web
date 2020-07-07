import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CrumbComponent } from './components/crumb/crumb.component';
import { Http403TipComponent } from './components/tips/http403-tip/http403-tip.component';
import { Http500TipComponent } from './components/tips/http500-tip/http500-tip.component';
import { ProCityDistSelectComponent } from './components/pro-city-dist-select/pro-city-dist-select.component';
import { ExpandedMenuComponent } from './components/expanded-menu/expanded-menu.component';
import { IgnoreSpaceDirective } from './directives/ignore-space.directive';
import { ZMaxLengthPipe } from './pipes/z-max-length.pipe';
import { DurationFormatHMSPipe, ZFormatDurationPipe } from './pipes/z-format-duration.pipe';
import { ZPlaceholderPipe } from './pipes/z-placeholder.pipe';
import { ZDurationPipe, ZDuration1Pipe, ZDuration2Pipe, ZDuration3Pipe } from './pipes/z-duration.pipe';
import { ZEmptyPipe } from './pipes/z-empty.pipe';
import { ZDebounceClickDirective } from './directives/z-debounce-click.directive';
import { ProgressModalComponent } from './components/progress-modal/progress-modal.component';
import { ZPhotoSelectComponent } from './components/z-photo-select/z-photo-select.component';
import { ZVideoSelectComponent } from './components/z-video-select/z-video-select.component';
import { ZPreviewVideoPhotoComponent } from './components/z-preview-video-photo/z-preview-video-photo.component';
import { ZConfirmationBoxComponent } from './components/tips/z-confirmation-box/z-confirmation-box.component';
import { ZPromptBoxComponent } from './components/tips/z-prompt-box/z-prompt-box.component';
import { PromptBoxComponent } from './components/tips/prompt-box/prompt-box.component';
import { ConfirmationBoxComponent } from './components/tips/confirmation-box/confirmation-box.component';
import { ZMapSelectPointComponent } from './components/z-map-select-point/z-map-select-point.component';
import { ProjectTypePipe, ProjectCategoryPipe, PayStatusPipe } from './pipes/project-type.pipe';
import { ProjectDialogComponent } from './components/project-dialog/project-dialog.component';
import { SelectBrandFirmComponent } from './components/select-brand-firm/select-brand-firm.component';
import { DateClockComponent } from './components/date-clock/date-clock.component';
import { SelectBrandFirmTypeComponent } from './components/select-brand-firm-type/select-brand-firm-type.component';
import { ZCompleteNumberPipe } from './pipes/z-complete-number.pipe';
import { SearchVehicleTypeGroupComponent } from './components/search-vehicle-type-group/search-vehicle-type-group.component';
import {
  TicketFormatPipe,
  ThirdSaleStatusPipe,
  OrderStatusPipe,
  OrderUseStatusPipe,
  CentPriceChangePipe,
  NullDataFilterPipe,
  PayTypePipe,
  DelayTypePipe,
  RefundRulePipe,
  ValidateTimeLimitPipe,
  MaxNumberDealPipe
} from './pipes/ticket-format.pipe';
import {
  StoreCategoryPipe,
  StoreProjectTypePipe,
  StorePayStatus,
  RescueOrderStatusPipe,
  RescueServiceStatusPipe,
  DoorOrderStatusPipe,
  DoorRefundStatusPipe,
  DoorRefundOrderStatusPipe, ServiceTypePipe, UploadStatusPipe
} from './pipes/store-format.pipe';
import { HtmlPipe } from './pipes/html.pipe';
import { TxtCopyComponent } from './directives/txt-copy/txt-copy.component';
import { TxtCopyDirective } from './directives/txt-copy/txt-copy.directive';
import { ZTextCkeditorComponent } from './components/z-text-ckeditor/z-text-ckeditor.component';
import { ZPhotoSelectUploadComponent } from './components/z-photo-select-upload/z-photo-select-upload.component';
import { ExemptionFormatPipe, ExemptionOrderStatusPipe, RejectTypePipe, } from './pipes/exemption-format.pipe';
import {
  DiyRangeTypePipe,
  PushPlanFormatPipe,
  PushRangePipe,
  PushSpeedPipe,
  RangeTypePipe,
  DiyRangeTypeMsgPipe, UserRangePipe
} from './pipes/push-plan-format.pipe';
import { FloatNumberDirective } from './directives/float-number.directive';
import { MaxNumberDirective } from './directives/max-number.directive';
import { BookingOrderStatusPipe } from './pipes/booking-order-type.pipe';
import { PromptLoadingComponent } from './components/prompt-loading/prompt-loading.component';
import { IntNumberDirective } from './directives/int-number.directive';
import { RefundTypePipe, CommonRefundStatusPipe } from './pipes/refund-type.pipe';
import { MinNumberDirective } from './directives/min-number.directive';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzMenuModule,
    NzSpinModule,
    NzAnchorModule,
    NzButtonModule
  ],
  entryComponents: [TxtCopyComponent],
  declarations: [
    CrumbComponent,
    Http403TipComponent,
    Http500TipComponent,
    ProCityDistSelectComponent,
    ExpandedMenuComponent,
    ProgressModalComponent,
    ZPhotoSelectComponent,
    ZVideoSelectComponent,
    ZPreviewVideoPhotoComponent,
    ZConfirmationBoxComponent,
    ZPromptBoxComponent,
    PromptBoxComponent,
    ConfirmationBoxComponent,
    ZMapSelectPointComponent,
    ProjectDialogComponent,
    SelectBrandFirmComponent,
    SelectBrandFirmTypeComponent,
    DateClockComponent,
    SearchVehicleTypeGroupComponent,
    TxtCopyComponent,
    ZTextCkeditorComponent,
    ZPhotoSelectUploadComponent,
    PromptLoadingComponent,

    // 管道
    ZMaxLengthPipe,
    ZMaxLengthPipe,
    ZDurationPipe,
    ZDuration1Pipe,
    ZDuration2Pipe,
    ZFormatDurationPipe,
    ZPlaceholderPipe,
    DurationFormatHMSPipe,
    ZEmptyPipe,
    ProjectTypePipe,
    ProjectCategoryPipe,
    ZCompleteNumberPipe,
    PayStatusPipe,
    TicketFormatPipe,
    ThirdSaleStatusPipe,
    OrderStatusPipe,
    OrderUseStatusPipe,
    CentPriceChangePipe,
    NullDataFilterPipe,
    HtmlPipe,
    PayTypePipe,
    DelayTypePipe,
    RefundRulePipe,
    ValidateTimeLimitPipe,
    MaxNumberDealPipe,
    ProjectTypePipe,
    StoreProjectTypePipe,
    ExemptionFormatPipe,
    ExemptionOrderStatusPipe,
    RejectTypePipe,
    PushRangePipe,
    RangeTypePipe,
    PushSpeedPipe,
    UserRangePipe,
    PushPlanFormatPipe,
    StoreCategoryPipe,
    StorePayStatus,
    BookingOrderStatusPipe,
    DiyRangeTypePipe,
    RescueOrderStatusPipe,
    RescueServiceStatusPipe,
    DiyRangeTypeMsgPipe,
    DoorOrderStatusPipe,
    DoorRefundStatusPipe,
    DoorRefundOrderStatusPipe,
    ZDuration3Pipe,
    RefundTypePipe,
    CommonRefundStatusPipe,
    ServiceTypePipe,
    UploadStatusPipe,

    // 指令
    IgnoreSpaceDirective,
    ZDebounceClickDirective,
    TxtCopyDirective,
    ZTextCkeditorComponent,
    ZPhotoSelectUploadComponent,
    FloatNumberDirective,
    MaxNumberDirective,
    IntNumberDirective,
    MinNumberDirective
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CrumbComponent,
    Http403TipComponent,
    Http500TipComponent,
    ProCityDistSelectComponent,
    ExpandedMenuComponent,
    ProgressModalComponent,
    ZPhotoSelectComponent,
    ZVideoSelectComponent,
    ZPreviewVideoPhotoComponent,
    ZConfirmationBoxComponent,
    ZPromptBoxComponent,
    PromptBoxComponent,
    ConfirmationBoxComponent,
    ZMapSelectPointComponent,
    ProjectDialogComponent,
    SelectBrandFirmComponent,
    SelectBrandFirmTypeComponent,
    DateClockComponent,
    SearchVehicleTypeGroupComponent,
    TxtCopyComponent,
    ZTextCkeditorComponent,
    ZPhotoSelectUploadComponent,
    PromptLoadingComponent,

    // 管道
    ZMaxLengthPipe,
    ZMaxLengthPipe,
    ZDurationPipe,
    ZDuration1Pipe,
    ZDuration2Pipe,
    ZFormatDurationPipe,
    ZPlaceholderPipe,
    DurationFormatHMSPipe,
    ZEmptyPipe,
    ProjectTypePipe,
    ProjectCategoryPipe,
    ZCompleteNumberPipe,
    PayStatusPipe,
    TicketFormatPipe,
    ThirdSaleStatusPipe,
    OrderStatusPipe,
    OrderUseStatusPipe,
    CentPriceChangePipe,
    NullDataFilterPipe,
    HtmlPipe,
    PayTypePipe,
    DelayTypePipe,
    RefundRulePipe,
    ValidateTimeLimitPipe,
    MaxNumberDealPipe,
    StoreProjectTypePipe,
    ExemptionFormatPipe,
    ExemptionOrderStatusPipe,
    RejectTypePipe,
    PushRangePipe,
    RangeTypePipe,
    PushSpeedPipe,
    UserRangePipe,
    PushPlanFormatPipe,
    StoreCategoryPipe,
    StorePayStatus,
    BookingOrderStatusPipe,
    DiyRangeTypePipe,
    RescueOrderStatusPipe,
    RescueServiceStatusPipe,
    DiyRangeTypeMsgPipe,
    DoorOrderStatusPipe,
    DoorRefundStatusPipe,
    DoorRefundOrderStatusPipe,
    ZDuration3Pipe,
    RefundTypePipe,
    CommonRefundStatusPipe,
    ServiceTypePipe,
    UploadStatusPipe,

    // 指令
    IgnoreSpaceDirective,
    ZDebounceClickDirective,
    TxtCopyDirective,
    FloatNumberDirective,
    MaxNumberDirective,
    IntNumberDirective,
    MinNumberDirective
  ],
})
export class ShareModule {
}
